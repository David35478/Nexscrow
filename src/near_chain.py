"""Direct NEAR chain operations for the live escrow path (docs.near.org).

- Deposit verification: the client signs a Transfer to the escrow account in
  their wallet; we confirm the transaction on-chain via the `tx` RPC method.
- Payouts/refunds: the escrow account signs a Transfer with its access key
  (ESCROW_PRIVATE_KEY) and broadcasts via `send_tx`.

Serialization follows the NEAR protocol Borsh schema:
  Transaction       = signer_id | public_key | nonce | receiver_id
                      | block_hash | actions
  PublicKey         = u8 curve (ed25519 = 0) | 32-byte key
  Action::Transfer  = u8 variant index 3 | deposit u128 LE
  SignedTransaction = Transaction | signature (ed25519 enum + 64 bytes)
"""

from __future__ import annotations

import base64
import hashlib
import struct
import time
from typing import Any

import httpx


class NearChainError(Exception):
    pass


_B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"


def b58decode(value: str) -> bytes:
    num = 0
    for ch in value.strip():
        idx = _B58.find(ch)
        if idx < 0:
            raise NearChainError("invalid base58 string")
        num = num * 58 + idx
    raw = num.to_bytes((num.bit_length() + 7) // 8 or 1, "big")
    return b"\x00" * (len(value.strip()) - len(value.strip().lstrip("1"))) + raw


def b58encode(data: bytes) -> str:
    num = int.from_bytes(data, "big")
    out = ""
    while num:
        num, rem = divmod(num, 58)
        out = _B58[rem] + out
    return "1" * (len(data) - len(data.lstrip(b"\x00"))) + (out or "")


def _borsh_str(s: str) -> bytes:
    b = s.encode("utf-8")
    return struct.pack("<I", len(b)) + b


def rpc(method: str, params: Any, rpc_url: str) -> Any:
    try:
        resp = httpx.post(
            rpc_url,
            json={"jsonrpc": "2.0", "id": "nexscrow", "method": method, "params": params},
            timeout=20,
        )
        resp.raise_for_status()
        data = resp.json()
    except httpx.HTTPError as exc:
        raise NearChainError(f"NEAR RPC {method} failed: {exc}") from exc
    if "error" in data:
        err = data["error"]
        raise NearChainError(
            err.get("data") or err.get("message") or str(err)
            if isinstance(err, dict)
            else str(err)
        )
    return data.get("result")


# ------------------------------------------------------------- NEAR/USD price

_price_cache: dict[str, Any] = {"usd": None, "fetched_at": 0.0}


def near_usd_price(price_url: str, ttl_seconds: int = 60) -> float:
    """NEAR/USD spot price (CoinGecko simple/price). Cached for ttl seconds."""
    now = time.time()
    if _price_cache["usd"] and now - _price_cache["fetched_at"] < ttl_seconds:
        return float(_price_cache["usd"])
    try:
        resp = httpx.get(
            price_url,
            params={"ids": "near", "vs_currencies": "usd"},
            timeout=10,
        )
        resp.raise_for_status()
        price = float(resp.json()["near"]["usd"])
    except (httpx.HTTPError, KeyError, TypeError, ValueError) as exc:
        raise NearChainError(f"NEAR/USD price unavailable: {exc}") from exc
    _price_cache.update(usd=price, fetched_at=now)
    return price


def usd_to_yocto(amount_usd: float, near_price_usd: float) -> int:
    """USD amount -> yoctoNEAR (rounded up so the deposit always covers it)."""
    import math

    return math.ceil(amount_usd / near_price_usd * 10**24)


# -------------------------------------------------------- deposit verification

def _transfer_total_yocto(actions: list[dict]) -> int:
    total = 0
    for action in actions:
        transfer = action.get("Transfer") if isinstance(action, dict) else None
        if transfer:
            total += int(transfer.get("deposit", 0))
    return total


def tx_status_success(status: Any) -> bool:
    if not isinstance(status, dict):
        return False
    return "SuccessValue" in status or "SuccessReceiptId" in status


def verify_deposit_tx(
    rpc_url: str,
    tx_hash: str,
    receiver_id: str,
    min_yocto: int,
    expected_signer: str | None = None,
) -> dict:
    """Verify a wallet-signed deposit tx on-chain.

    Confirms the transaction is final and successful, pays receiver_id,
    transfers at least min_yocto, and — when expected_signer is set — was
    signed by that account. Uses EXPERIMENTAL_tx_status so no sender id is
    needed for the lookup (browser wallets return only the hash).
    """
    try:
        result = rpc(
            "EXPERIMENTAL_tx_status",
            {"tx_hash": tx_hash, "wait_until": "FINAL"},
            rpc_url,
        )
    except NearChainError:
        if not expected_signer:
            raise
        result = rpc(
            "tx",
            {
                "tx_hash": tx_hash,
                "sender_account_id": expected_signer,
                "wait_until": "FINAL",
            },
            rpc_url,
        )
    tx = result.get("transaction") or {}
    signer = tx.get("signer_id")
    if not signer:
        raise NearChainError("transaction has no signer")
    if expected_signer and signer != expected_signer:
        raise NearChainError(
            f"tx signer {signer} does not match client {expected_signer}"
        )
    if tx.get("receiver_id") != receiver_id:
        raise NearChainError(
            f"tx receiver {tx.get('receiver_id')} is not the escrow account {receiver_id}"
        )
    if not tx_status_success(result.get("status")):
        raise NearChainError("deposit transaction failed on-chain")
    paid = _transfer_total_yocto(tx.get("actions") or [])
    if paid < min_yocto:
        raise NearChainError(
            f"deposit too small: {paid / 10**24:.4f} NEAR <"
            f" required {min_yocto / 10**24:.4f} NEAR"
        )
    return {"paid_yocto": paid, "signer_id": signer, "outcome": result}


# ------------------------------------------------------------ escrow payouts

def serialize_transfer_tx(
    signer_id: str,
    public_key: bytes,
    nonce: int,
    receiver_id: str,
    block_hash: bytes,
    deposit_yocto: int,
) -> bytes:
    actions = struct.pack("<I", 1) + b"\x03" + int(deposit_yocto).to_bytes(16, "little")
    return (
        _borsh_str(signer_id)
        + b"\x00"  # PublicKey::ed25519
        + public_key
        + struct.pack("<Q", nonce)
        + _borsh_str(receiver_id)
        + block_hash
        + actions
    )


def parse_private_key(private_key: str) -> tuple[bytes, bytes]:
    """'ed25519:<base58>' (or bare base58) -> (seed, public_key bytes)."""
    from nacl.signing import SigningKey

    raw = private_key.strip()
    if ":" in raw:
        scheme, _, rest = raw.partition(":")
        if scheme != "ed25519":
            raise NearChainError(f"unsupported key scheme '{scheme}' (need ed25519)")
        raw = rest
    seed = b58decode(raw)
    if len(seed) != 32:
        raise NearChainError("ed25519 private key must be 32 bytes")
    return seed, bytes(SigningKey(seed).verify_key)


def transfer_near(
    rpc_url: str,
    signer_id: str,
    private_key: str,
    receiver_id: str,
    amount_yocto: int,
) -> dict:
    """Sign and broadcast a NEAR Transfer from the escrow account.

    Returns {"tx_hash": ..., "status": ...}. Raises NearChainError on
    RPC errors or an on-chain failure.
    """
    from nacl.signing import SigningKey

    seed, pubkey = parse_private_key(private_key)
    public_key_str = f"ed25519:{b58encode(pubkey)}"
    access_key = rpc(
        "query",
        {
            "request_type": "view_access_key",
            "finality": "final",
            "account_id": signer_id,
            "public_key": public_key_str,
        },
        rpc_url,
    )
    if not access_key or "nonce" not in access_key:
        raise NearChainError(
            f"{public_key_str} is not an access key of {signer_id}"
        )
    block = rpc("block", {"finality": "final"}, rpc_url)
    block_hash = b58decode(block["header"]["hash"])
    tx_bytes = serialize_transfer_tx(
        signer_id,
        pubkey,
        int(access_key["nonce"]) + 1,
        receiver_id,
        block_hash,
        amount_yocto,
    )
    signature = SigningKey(seed).sign(hashlib.sha256(tx_bytes).digest()).signature
    signed_tx = tx_bytes + b"\x00" + signature  # Signature::ed25519
    result = rpc(
        "send_tx",
        {
            "signed_tx_base64": base64.b64encode(signed_tx).decode(),
            "wait_until": "EXECUTED_OPTIMISTIC",
        },
        rpc_url,
    )
    status = result.get("status") or {}
    if "Failure" in status:
        raise NearChainError(f"payout transaction failed on-chain: {status['Failure']}")
    return {
        "tx_hash": (result.get("transaction_outcome") or {}).get("id"),
        "status": status,
    }
