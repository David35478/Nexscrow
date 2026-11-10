"""Auth: sessions, demo login, NEP-413 NEAR wallet verification, Google flags."""

from __future__ import annotations

import base64
import hashlib
import struct
import time

import pytest
from nacl.signing import SigningKey

from src import auth as auth_mod
from src.auth import AuthError, AuthService, _borsh_str
from src.storage import JsonStore


def b58(data: bytes) -> str:
    num = int.from_bytes(data, "big")
    out = ""
    alpha = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    while num:
        num, rem = divmod(num, 58)
        out = alpha[rem] + out
    # preserve leading zero bytes as '1'
    pad = len(data) - len(data.lstrip(b"\x00"))
    return "1" * pad + (out or "")


def make_auth(tmp_path) -> AuthService:
    return AuthService(JsonStore(tmp_path / "authdata"))


def test_session_lifecycle(tmp_path):
    auth = make_auth(tmp_path)
    token = auth.create_session("demo", "demo:abc", "Demo User abc")
    assert auth.get_user(token)["user_id"] == "demo:abc"
    auth.logout(token)
    assert auth.get_user(token) is None
    assert auth.get_user(None) is None


def test_expired_session_rejected(tmp_path):
    auth = make_auth(tmp_path)
    token = auth.create_session("demo", "demo:abc", "Demo")
    # force the stored expiry into the past
    def age(sessions):
        sessions[token]["expires_at"] = time.time() - 1
    auth._store.update("sessions", {}, age)
    assert auth.get_user(token) is None


def test_challenge_is_single_use(tmp_path):
    auth = make_auth(tmp_path)
    challenge = auth.issue_challenge()
    assert auth.consume_challenge(challenge["nonce"]) is not None
    assert auth.consume_challenge(challenge["nonce"]) is None  # already used


def test_nep413_signature_verification(tmp_path):
    auth = make_auth(tmp_path)
    account = "alice.near"
    signing_key = SigningKey.generate()
    verify_key = signing_key.verify_key
    pubkey_b58 = b58(bytes(verify_key))

    challenge = auth.issue_challenge()
    nonce_b64 = challenge["nonce"]
    raw_nonce = base64.urlsafe_b64decode(nonce_b64 + "=" * (-len(nonce_b64) % 4))

    # build the exact NEP-413 payload a compliant wallet signs
    callback_url = "https://app.example/near-callback"
    payload = (
        struct.pack("<I", auth_mod.NEP413_TAG)
        + _borsh_str(challenge["message"].encode())
        + raw_nonce
        + _borsh_str(b"app.example")
        + b"\x01"
        + _borsh_str(callback_url.encode())
    )
    digest = hashlib.sha256(payload).digest()
    signature = b58(signing_key.sign(digest).signature)

    # stub the RPC ownership check for the unit test
    orig = auth_mod.near_access_key_exists
    auth_mod.near_access_key_exists = lambda a, k, rpc_url=None: a == account
    try:
        user = auth.verify_near_login(
            account_id=account,
            public_key=pubkey_b58,
            signature=signature,
            nonce=nonce_b64,
            recipient="app.example",
            callback_url=callback_url,
        )
    finally:
        auth_mod.near_access_key_exists = orig
    assert user["user_id"] == f"near:{account}"
    assert user["name"] == account


def test_near_login_rejects_bad_signature(tmp_path):
    auth = make_auth(tmp_path)
    challenge = auth.issue_challenge()
    signing_key = SigningKey.generate()
    with pytest.raises(AuthError, match="verification"):
        auth.verify_near_login(
            account_id="alice.near",
            public_key=b58(bytes(signing_key.verify_key)),
            signature=b58(signing_key.sign(b"other message").signature),
            nonce=challenge["nonce"],
            recipient="app.example",
        )


def test_near_login_rejects_replayed_nonce(tmp_path):
    auth = make_auth(tmp_path)
    challenge = auth.issue_challenge()
    # consume it once
    auth.consume_challenge(challenge["nonce"])
    with pytest.raises(AuthError, match="challenge"):
        auth.verify_near_login(
            account_id="alice.near",
            public_key="ed25519:whatever",
            signature="deadbeef",
            nonce=challenge["nonce"],
            recipient="app.example",
        )


def test_google_config_flag(tmp_path, monkeypatch):
    monkeypatch.delenv("GOOGLE_CLIENT_ID", raising=False)
    monkeypatch.delenv("GOOGLE_CLIENT_SECRET", raising=False)
    auth = make_auth(tmp_path)
    assert auth.google_configured() is False
    with pytest.raises(AuthError, match="not configured"):
        auth.google_auth_url("https://x/cb", "state")
