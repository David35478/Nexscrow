"""Live escrow path: store selection, deposit prepare/confirm, tx signing."""

from __future__ import annotations

import hashlib
import struct

import pytest

from src import near_chain
from src.near_chain import NearChainError
from src.payment import PaymentError


def b58encode(data: bytes) -> str:
    return near_chain.b58encode(data)


def fake_tx_result(signer="alice.near", receiver="yurrri.near", deposit="5000000000000000000000000"):
    return {
        "status": {"SuccessValue": ""},
        "transaction": {
            "signer_id": signer,
            "receiver_id": receiver,
            "actions": [{"Transfer": {"deposit": deposit}}],
        },
        "transaction_outcome": {"id": "txhash123"},
    }


# ----------------------------------------------------------- store selection

def test_system_uses_create_store_json(tmp_path, make_system):
    from src.storage import JsonStore

    sys_ = make_system()
    assert isinstance(sys_.store, JsonStore)


def test_system_uses_postgres_when_dsn_set(tmp_path, monkeypatch):
    """DATABASE_URL must route storage to PostgresStore — the fix for the
    'sessions wiped on Vercel cold start' bug (the store existed but was
    never wired in)."""
    import src.storage as storage
    from src.system import NexscrowSystem
    from src.storage import PostgresStore

    monkeypatch.setenv("DATABASE_URL", "postgres://u:p@host/db")
    monkeypatch.setattr(PostgresStore, "_ensure_schema", lambda self: None)
    from tests.conftest import make_config

    path = make_config(tmp_path)
    sys_ = NexscrowSystem(path)  # no explicit data_dir -> create_store picks Postgres
    assert isinstance(sys_.store, PostgresStore)
    # explicit data_dir still forces the JSON store (tests/dev)
    sys2 = NexscrowSystem(path, str(tmp_path / "d"))
    assert isinstance(sys2.store, storage.JsonStore)


# ------------------------------------------------------------- deposit quote

def test_prepare_deposit_quotes_near(make_system, monkeypatch):
    sys_ = make_system()
    job = sys_.post_job("Live job", "", 3.0, simulated=False)
    monkeypatch.setattr(near_chain, "near_usd_price", lambda *a, **k: 5.0)
    prep = sys_.prepare_deposit(job["job_id"])
    assert prep["receiver_id"] == "yurrri.near"
    # $3 at $5/NEAR -> 0.6 NEAR
    assert prep["amount_near"] == pytest.approx(0.6)
    assert int(prep["amount_yocto"]) == int(0.6 * 10**24)
    # expected amount persisted for the confirm check
    assert sys_.jobs.get(job["job_id"])["deposit_expected_yocto"] == prep["amount_yocto"]


def test_confirm_deposit_verifies_on_chain(make_system, monkeypatch):
    sys_ = make_system()
    job = sys_.post_job("Live job", "", 3.0, client_id="near:alice.near", simulated=False)
    monkeypatch.setattr(near_chain, "near_usd_price", lambda *a, **k: 5.0)
    prep = sys_.prepare_deposit(job["job_id"])
    calls = {}

    def fake_rpc(method, params, rpc_url):
        calls["method"] = method
        return fake_tx_result(deposit=prep["amount_yocto"])

    monkeypatch.setattr(near_chain, "rpc", fake_rpc)
    updated = sys_.confirm_deposit(job["job_id"], "txhash123", "alice.near")
    assert updated["payment_status"] == "locked"
    assert updated["deposit_tx_hash"] == "txhash123"
    assert updated["client_account"] == "alice.near"
    assert calls["method"] == "EXPERIMENTAL_tx_status"
    assert any(e["event_type"] == "deposit_locked" for e in sys_.ledger.events())


def test_confirm_deposit_rejects_wrong_receiver(make_system, monkeypatch):
    sys_ = make_system()
    job = sys_.post_job("Live job", "", 3.0, simulated=False)
    monkeypatch.setattr(near_chain, "near_usd_price", lambda *a, **k: 5.0)
    sys_.prepare_deposit(job["job_id"])
    monkeypatch.setattr(
        near_chain, "rpc",
        lambda m, p, u: fake_tx_result(receiver="attacker.near"),
    )
    with pytest.raises(NearChainError, match="escrow"):
        sys_.confirm_deposit(job["job_id"], "txhash999", "")
    assert sys_.jobs.get(job["job_id"])["payment_status"] == "pending"


def test_confirm_deposit_rejects_underpayment(make_system, monkeypatch):
    sys_ = make_system()
    job = sys_.post_job("Live job", "", 3.0, simulated=False)
    monkeypatch.setattr(near_chain, "near_usd_price", lambda *a, **k: 5.0)
    sys_.prepare_deposit(job["job_id"])
    monkeypatch.setattr(
        near_chain, "rpc",
        lambda m, p, u: fake_tx_result(deposit="1000000000000000000000"),  # dust
    )
    with pytest.raises(NearChainError, match="too small"):
        sys_.confirm_deposit(job["job_id"], "txhash555", "")


def test_confirm_deposit_rejects_replay(make_system, monkeypatch):
    sys_ = make_system()
    j1 = sys_.post_job("Live A", "", 3.0, simulated=False)
    j2 = sys_.post_job("Live B", "", 3.0, simulated=False)
    monkeypatch.setattr(near_chain, "near_usd_price", lambda *a, **k: 5.0)
    sys_.prepare_deposit(j1["job_id"])
    sys_.prepare_deposit(j2["job_id"])
    monkeypatch.setattr(
        near_chain, "rpc", lambda m, p, u: fake_tx_result(deposit="600000000000000000000000")
    )
    sys_.confirm_deposit(j1["job_id"], "sametx", "alice.near")
    with pytest.raises(PaymentError, match="already funded"):
        sys_.confirm_deposit(j2["job_id"], "sametx", "alice.near")


def test_confirm_deposit_rejects_simulated_jobs(make_system):
    sys_ = make_system()
    job = sys_.post_job("Demo job", "", 2.0)  # simulated
    with pytest.raises(PaymentError, match="deposit/approve"):
        sys_.confirm_deposit(job["job_id"], "tx", "alice.near")


def test_lock_deposit_refuses_live_jobs(make_system):
    sys_ = make_system()
    job = sys_.post_job("Live job", "", 3.0, simulated=False)
    with pytest.raises(PaymentError, match="wallet-signed"):
        sys_.payment.lock_deposit(job, sys_.jobs, sys_.ledger)


# ------------------------------------------------------------ tx signing

def test_serialize_transfer_tx_layout():
    pubkey = bytes(range(32))
    block_hash = bytes(range(32, 64))
    tx = near_chain.serialize_transfer_tx(
        "alice.near", pubkey, 7, "yurrri.near", block_hash, 12345
    )
    off = 0

    def take(n):
        nonlocal off
        chunk = tx[off : off + n]
        off += n
        return chunk

    def take_str():
        nonlocal off
        ln = struct.unpack("<I", tx[off : off + 4])[0]
        off += 4
        return take(ln).decode()

    assert take_str() == "alice.near"
    assert take(1) == b"\x00"  # ed25519 key type
    assert take(32) == pubkey
    assert struct.unpack("<Q", take(8))[0] == 7
    assert take_str() == "yurrri.near"
    assert take(32) == block_hash
    assert struct.unpack("<I", take(4))[0] == 1  # one action
    assert take(1) == b"\x03"  # Transfer variant
    assert int.from_bytes(take(16), "little") == 12345
    assert off == len(tx)


def test_parse_private_key_roundtrip():
    from nacl.signing import SigningKey

    seed = bytes(range(1, 33))
    key = f"ed25519:{b58encode(seed)}"
    parsed_seed, pubkey = near_chain.parse_private_key(key)
    assert parsed_seed == seed
    assert pubkey == bytes(SigningKey(seed).verify_key)


def test_transfer_near_broadcasts_signed_tx(make_system, monkeypatch):
    """The escrow payout builds, signs and broadcasts a real NEAR Transfer."""
    from nacl.signing import SigningKey

    seed = bytes(range(1, 33))
    pubkey = bytes(SigningKey(seed).verify_key)
    private_key = f"ed25519:{b58encode(seed)}"
    seen = {}

    def fake_rpc(method, params, rpc_url):
        seen[method] = params
        if method == "query":
            return {"nonce": 41}
        if method == "block":
            return {"header": {"hash": b58encode(bytes(range(64, 96)))}}
        if method == "send_tx":
            signed = params["signed_tx_base64"]
            import base64

            raw = base64.b64decode(signed)
            tx_body, sig = raw[:-65], raw[-64:]
            # signature must verify over sha256(tx_body)
            SigningKey(seed).verify_key.verify(hashlib.sha256(tx_body).digest(), sig)
            return {"status": {"SuccessValue": ""}, "transaction_outcome": {"id": "payout-tx"}}
        raise AssertionError(method)

    monkeypatch.setattr(near_chain, "rpc", fake_rpc)
    result = near_chain.transfer_near(
        "https://rpc", "yurrri.near", private_key, "agent-op.near", 10**24
    )
    assert result["tx_hash"] == "payout-tx"
    assert seen["send_tx"]["wait_until"] == "EXECUTED_OPTIMISTIC"


def test_release_without_escrow_key_refuses(make_system, monkeypatch):
    sys_ = make_system()
    job = sys_.post_job("Live", "", 3.0, release_condition="auto", simulated=False)
    sys_.jobs.update(job["job_id"], payment_status="locked", agent="agent-oracle-1")
    monkeypatch.delenv("ESCROW_PRIVATE_KEY", raising=False)
    with pytest.raises(PaymentError, match="ESCROW_PRIVATE_KEY"):
        sys_.payment.release(sys_.jobs.get(job["job_id"]), sys_.jobs, sys_.ledger)


def test_release_with_key_sends_to_payout_account(make_system, monkeypatch):
    sys_ = make_system()
    job = sys_.post_job("Live", "", 3.0, release_condition="auto", simulated=False)
    sys_.jobs.update(
        job["job_id"],
        payment_status="locked",
        agent="agent-oracle-1",
        deposit_paid_yocto=str(int(0.6 * 10**24)),
    )
    seed = bytes(range(1, 33))
    monkeypatch.setenv("ESCROW_PRIVATE_KEY", f"ed25519:{b58encode(seed)}")
    sent = {}

    def fake_transfer(rpc_url, signer, key, receiver, amount):
        sent.update(receiver=receiver, amount=amount)
        return {"tx_hash": "payout-tx", "status": {"SuccessValue": ""}}

    monkeypatch.setattr(near_chain, "transfer_near", fake_transfer)
    updated = sys_.payment.release(sys_.jobs.get(job["job_id"]), sys_.jobs, sys_.ledger)
    assert sent["receiver"] == "agent-op.near"  # from conftest profile
    # payout share: reward - 2% fee = $2.94 of the 0.6 NEAR deposit
    assert sent["amount"] == int(int(0.6 * 10**24) * 2.94 / 3.0)
    assert updated["payout_tx_hash"] == "payout-tx"
    assert updated["payment_status"] == "released"
