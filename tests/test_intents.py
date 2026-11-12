from copy import deepcopy

import httpx
import pytest

from src.intents import IntentsError, OneClickClient, verify_settlement


def fixture_data():
    request = {
        "originAsset": "nep141:arb-usdc.omft.near", "destinationAsset": "nep141:near-usdc.omft.near",
        "amount": "1000000", "swapType": "EXACT_OUTPUT", "depositType": "ORIGIN_CHAIN",
        "recipient": "treasury.near", "recipientType": "DESTINATION_CHAIN",
        "refundTo": "refund.near", "refundType": "DESTINATION_CHAIN",
    }
    quote = {"depositAddress": "0xdeposit", "depositMemo": None, "amountOut": "1000", "minAmountIn": "990"}
    signed = {"correlationId": "corr", "signature": "sig", "timestamp": "2025-01-01T00:00:00Z",
              "quoteRequest": request, "quote": quote}
    order = {"quote_response": signed, "expected_amount": "1000", "destination_asset": request["destinationAsset"],
             "treasury": "treasury.near", "deposit_address": "0xdeposit", "deposit_memo": None,
             "quote_expires_at": "2025-01-01T00:10:00Z"}
    details = {"amountIn": "995", "depositedAmount": "1000", "amountOut": "1000", "refundedAmount": "0",
               "originChainTxHashes": [{"hash": "origin-hash", "explorerUrl": "https://explorer.test/o"}],
               "destinationChainTxHashes": [{"hash": "dest-hash", "explorerUrl": "https://explorer.test/d"}]}
    status = {"status": "SUCCESS", "correlationId": "corr", "updatedAt": "2025-01-01T00:05:00Z", "quoteResponse": deepcopy(signed), "swapDetails": details}
    return order, status


def test_verified_success_returns_auditable_settlement():
    order, status = fixture_data()
    result = verify_settlement(order, status)
    assert result["settlement_id"].endswith(":dest-hash")
    assert result["transaction_hashes"] == ["dest-hash"]
    assert result["origin_transaction_hashes"] == ["origin-hash"]
    assert result["settled_amount"] == "1000"


@pytest.mark.parametrize("state", ["PENDING_DEPOSIT", "PROCESSING", "FAILED", "REFUNDED", "INCOMPLETE_DEPOSIT"])
def test_non_success_is_never_verified(state):
    order, status = fixture_data()
    status["status"] = state
    with pytest.raises(IntentsError):
        verify_settlement(order, status)


@pytest.mark.parametrize("change", ["underpaid", "wrong_asset", "wrong_recipient", "changed_quote", "missing_hash", "refunded", "wrong_deposit", "bad_output", "wrong_correlation"])
def test_inconsistent_or_partial_settlement_is_rejected(change):
    order, status = fixture_data()
    if change == "underpaid":
        status["swapDetails"]["amountIn"] = "989"
    elif change == "wrong_asset":
        status["quoteResponse"]["quoteRequest"]["destinationAsset"] = "evil"
    elif change == "wrong_recipient":
        status["quoteResponse"]["quoteRequest"]["recipient"] = "evil.near"
    elif change == "changed_quote":
        status["quoteResponse"]["signature"] = "other"
    elif change == "missing_hash":
        status["swapDetails"]["destinationChainTxHashes"] = []
    elif change == "refunded":
        status["swapDetails"]["refundedAmount"] = "1"
    elif change == "wrong_deposit":
        status["quoteResponse"]["quote"]["depositAddress"] = "other"
    elif change == "bad_output":
        status["swapDetails"]["amountOut"] = "999"
    elif change == "wrong_correlation":
        status["correlationId"] = "another-order"
    with pytest.raises(IntentsError):
        verify_settlement(order, status)


class FakeResponse:
    def __init__(self, data):
        self.data = data

    def raise_for_status(self):
        pass

    def json(self):
        return self.data


class FakeClient:
    def __init__(self, responses):
        self.responses = responses
        self.calls = []

    def request(self, method, path, **kwargs):
        self.calls.append((method, path, kwargs))
        return FakeResponse(self.responses.pop(0))


def test_client_tokens_quote_and_status_use_official_routes_and_auth():
    quote_response = {"quoteRequest": {}, "quote": {}}
    token = {"assetId": "token", "blockchain": "near", "symbol": "TEST", "decimals": 6}
    fake = FakeClient([[token], quote_response, {"status": "PROCESSING"}])
    client = OneClickClient("secret", fake)
    assert client.tokens() == [token]
    assert client.quote({"amount": "1"}) == quote_response
    assert client.status("deposit", "memo")["status"] == "PROCESSING"
    assert [c[:2] for c in fake.calls] == [("GET", "/v0/tokens"), ("POST", "/v0/quote"), ("GET", "/v0/status")]
    assert all(c[2]["headers"] == {"Authorization": "Bearer secret"} for c in fake.calls)
    assert fake.calls[1][2]["json"] == {"amount": "1"}
    assert fake.calls[2][2]["params"] == {"depositAddress": "deposit", "depositMemo": "memo"}


def test_token_response_shape_and_errors_are_sanitized():
    with pytest.raises(IntentsError):
        OneClickClient(client=FakeClient([{"unexpected": []}])).tokens()


def test_quote_errors_do_not_retry_post_or_leak_response():
    class BadResponse:
        def raise_for_status(self):
            raise httpx.HTTPStatusError("private response", request=None, response=None)

    class BadClient:
        calls = 0
        def request(self, *args, **kwargs):
            self.calls += 1
            return BadResponse()

    bad = BadClient()
    with pytest.raises(IntentsError, match="NEAR Intents request failed"):
        OneClickClient(client=bad).quote({"amount": "1"})
    assert bad.calls == 1
