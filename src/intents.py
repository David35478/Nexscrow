"""Server-side client and settlement checks for the NEAR Intents 1Click API.

SUCCESS is the provider's assertion that the swap settled. We additionally
bind it to the persisted signed quote and require destination transaction proof;
this is not an independent blockchain RPC verifier.
"""
from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from typing import Any
import os

import httpx


BASE_URL = "https://1click.chaindefuser.com"


class IntentsError(Exception):
    """Safe-to-display error without leaking upstream response contents."""


class OneClickClient:
    def __init__(self, api_key: str | None = None, client: Any = None):
        self._client = client or httpx.Client(base_url=BASE_URL, timeout=20.0)
        self._owns_client = client is None
        self._headers = {"Authorization": f"Bearer {api_key}"} if api_key else {}

    def close(self) -> None:
        if self._owns_client:
            self._client.close()

    def _request(self, method: str, path: str, **kwargs: Any) -> dict[str, Any]:
        try:
            response = self._client.request(method, path, headers=self._headers, **kwargs)
            response.raise_for_status()
            data = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise IntentsError("NEAR Intents request failed") from exc
        if not isinstance(data, dict):
            raise IntentsError("Invalid NEAR Intents response")
        return data

    def tokens(self) -> list[dict[str, Any]]:
        try:
            response = self._client.request("GET", "/v0/tokens", headers=self._headers)
            response.raise_for_status()
            data = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise IntentsError("NEAR Intents request failed") from exc
        if isinstance(data, dict):
            data = data.get("tokens")
        if not isinstance(data, list) or any(not isinstance(token, dict) for token in data):
            raise IntentsError("Invalid supported-token response")
        if any(any(not isinstance(token.get(key), str) or not token[key] for key in ('assetId', 'symbol', 'blockchain')) for token in data):
            raise IntentsError('Supported-token metadata is incomplete')
        if len({token['assetId'] for token in data}) != len(data):
            raise IntentsError('Supported-token identities are ambiguous')
        return data

    def quote(self, payload: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(payload, dict):
            raise IntentsError("Invalid quote request")
        result = self._request("POST", "/v0/quote", json=payload)
        if not isinstance(result.get("quoteRequest"), dict) or not isinstance(result.get("quote"), dict):
            raise IntentsError("Invalid quote response")
        return result

    def status(self, deposit_address: str, deposit_memo: str | None = None) -> dict[str, Any]:
        if not isinstance(deposit_address, str) or not deposit_address:
            raise IntentsError("Invalid deposit address")
        params = {"depositAddress": deposit_address}
        if deposit_memo is not None:
            params["depositMemo"] = deposit_memo
        return self._request("GET", "/v0/status", params=params)


TESTNET_UNSUPPORTED = (
    "NEAR Intents 1Click has no testnet deployment, so subscription and top-up"
    " settlement is unavailable on NEAR Testnet"
)


class TestnetUnavailableClient:
    """Testnet adapter: refuses every call rather than reaching mainnet 1Click."""

    def close(self) -> None:
        pass

    def tokens(self) -> list[dict[str, Any]]:
        raise IntentsError(TESTNET_UNSUPPORTED)

    def quote(self, payload: dict[str, Any]) -> dict[str, Any]:
        raise IntentsError(TESTNET_UNSUPPORTED)

    def status(self, deposit_address: str, deposit_memo: str | None = None) -> dict[str, Any]:
        raise IntentsError(TESTNET_UNSUPPORTED)


class MockOneClickClient(TestnetUnavailableClient):
    """Development-only stand-in that mirrors 1Click response shapes.

    Orders never reach SUCCESS, so the mock can never grant credits.
    """

    MOCK = True

    def tokens(self) -> list[dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        return [
            {"assetId": "nep141:mock-usdc.testnet", "symbol": "mUSDC", "blockchain": "near",
             "decimals": 6, "price": "1", "priceUpdatedAt": now, "mock": True},
            {"assetId": "nep141:mock-wnear.testnet", "symbol": "mwNEAR", "blockchain": "near",
             "decimals": 24, "price": "3", "priceUpdatedAt": now, "mock": True},
        ]

    def quote(self, payload: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(payload, dict) or not payload.get("amount"):
            raise IntentsError("Invalid quote request")
        quote = {"amountIn": payload["amount"], "minAmountIn": payload["amount"],
                 "amountOut": payload["amount"], "amountInUsd": "0", "amountOutUsd": "0",
                 "deadline": payload.get("deadline")}
        if not payload.get("dry"):
            quote["depositAddress"] = "mock-1click-deposit.testnet"
        return {"quoteRequest": dict(payload), "quote": quote,
                "correlationId": "mock-correlation", "signature": "mock-signature", "mock": True}

    def status(self, deposit_address: str, deposit_memo: str | None = None) -> dict[str, Any]:
        return {"status": "PENDING_DEPOSIT", "mock": True}


def one_click_client(api_key: str | None = None):
    """1Click adapter for the active build.

    Only NEAR Testnet is enabled, and 1Click is mainnet-only, so the real
    client is never constructed here. NEXSCROW_INTENTS_MOCK=1 enables the
    development mock outside production.
    """
    if os.environ.get("NEXSCROW_INTENTS_MOCK") == "1" and os.environ.get("APP_ENV") != "production":
        return MockOneClickClient()
    return TestnetUnavailableClient()


def _same(a: Any, b: Any) -> bool:
    return isinstance(a, str) and isinstance(b, str) and a == b


def _decimal(value: Any) -> Decimal:
    try:
        result = Decimal(str(value))
        if not result.is_finite() or result < 0:
            raise InvalidOperation
        return result
    except (InvalidOperation, ValueError, TypeError) as exc:
        raise IntentsError("Invalid settlement amount") from exc


def verify_settlement(order: dict[str, Any], status_response: dict[str, Any]) -> dict[str, Any]:
    """Validate a provider SUCCESS response against the immutable stored quote."""
    try:
        quote_response = order["quote_response"]
        original_request = quote_response["quoteRequest"]
        original_quote = quote_response["quote"]
        current = status_response["quoteResponse"]
        request = current["quoteRequest"]
        quote = current["quote"]
    except (KeyError, TypeError) as exc:
        raise IntentsError("Incomplete payment verification data") from exc
    if not isinstance(status_response, dict) or status_response.get("status") != "SUCCESS":
        raise IntentsError("Payment has not successfully settled")
    if not _same(status_response.get("correlationId"), quote_response.get("correlationId")):
        raise IntentsError("Settlement correlation does not match payment order")
    for key in ("correlationId", "signature", "timestamp"):
        if not _same(quote_response.get(key), current.get(key)):
            raise IntentsError("Settlement quote does not match payment order")
    for key in ("originAsset", "destinationAsset", "amount", "swapType", "depositType",
                "recipient", "recipientType", "refundTo", "refundType"):
        if original_request.get(key) != request.get(key):
            raise IntentsError("Settlement quote does not match payment order")
    if (original_request.get("recipient") != order.get("treasury") or
            original_request.get("destinationAsset") != order.get("destination_asset") or
            original_request.get("destinationAsset") != request.get("destinationAsset") or
            original_request.get("swapType") != "EXACT_OUTPUT" or
            original_request.get("depositType") != "ORIGIN_CHAIN" or
            original_request.get("recipientType") != "DESTINATION_CHAIN"):
        raise IntentsError("Payment destination or quote type is invalid")
    if not _same(original_quote.get("depositAddress"), order.get("deposit_address")):
        raise IntentsError("Payment deposit address does not match order")
    if original_quote.get("depositMemo") != order.get("deposit_memo"):
        raise IntentsError("Payment deposit memo does not match order")
    if not _same(quote.get("depositAddress"), order.get("deposit_address")) or quote.get("depositMemo") != order.get("deposit_memo"):
        raise IntentsError("Settlement deposit does not match payment order")
    expected = str(order.get("expected_amount", ""))
    if not expected or _decimal(original_quote.get("amountOut")) != _decimal(expected):
        raise IntentsError("Quoted settlement amount does not match order")
    details = status_response.get("swapDetails")
    if not isinstance(details, dict) or _decimal(details.get("amountOut")) != _decimal(expected):
        raise IntentsError("Unexpected settlement amount")
    if _decimal(details.get("amountIn")) < _decimal(original_quote.get("minAmountIn")):
        raise IntentsError("Payment was underfunded")
    if _decimal(details.get("depositedAmount")) < _decimal(original_quote.get("minAmountIn")):
        raise IntentsError("Payment was underfunded")
    if _decimal(details.get("refundedAmount", "0")) != 0 or details.get("refundReason"):
        raise IntentsError("Payment was refunded or partially refunded")
    hashes = details.get("destinationChainTxHashes")
    if not isinstance(hashes, list) or not hashes or any(
        not isinstance(item, dict) or not item.get("hash") or not item.get("explorerUrl") for item in hashes
    ):
        raise IntentsError("Settlement transaction evidence is missing")
    if not isinstance(status_response.get("updatedAt"), str):
        raise IntentsError("Settlement timestamp is missing")
    try:
        verified_at = datetime.fromisoformat(status_response["updatedAt"].replace("Z", "+00:00"))
        if verified_at.tzinfo is None:
            raise ValueError
        verified_at = verified_at.astimezone(timezone.utc).isoformat()
    except ValueError as exc:
        raise IntentsError("Invalid settlement timestamp") from exc
    return {
        "settlement_id": order["destination_asset"] + ":" + ",".join(sorted(item["hash"] for item in hashes)),
        "transaction_hashes": [item["hash"] for item in hashes],
        "origin_transaction_hashes": [item["hash"] for item in details.get("originChainTxHashes", []) if isinstance(item, dict) and item.get("hash")],
        "settled_amount": str(details["amountOut"]),
        "asset_id": order["destination_asset"],
        "recipient": order["treasury"],
        "verified_at": verified_at,
    }
