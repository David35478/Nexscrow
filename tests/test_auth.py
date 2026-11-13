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
    assert auth.peek_challenge(challenge["nonce"]) is not None
    auth.delete_challenge(challenge["nonce"])
    assert auth.peek_challenge(challenge["nonce"]) is None  # consumed after success


def test_nep413_signature_verification(tmp_path):
    auth = make_auth(tmp_path)
    account = "alice.testnet"
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


def test_nep413_signature_verification_wallet_format(tmp_path):
    """Real wallet conditions: 'ed25519:'-prefixed key, Borsh None-option
    payload (callbackUrl absent), base64 signature from injected wallets."""
    auth = make_auth(tmp_path)
    account = "nexscrow-escrow.testnet"
    signing_key = SigningKey.generate()
    pubkey_b58 = "ed25519:" + b58(bytes(signing_key.verify_key))

    challenge = auth.issue_challenge()
    nonce_b64 = challenge["nonce"]
    raw_nonce = base64.urlsafe_b64decode(nonce_b64 + "=" * (-len(nonce_b64) % 4))

    # exact NEP-413 layout an injected wallet signs with no callbackUrl:
    # borsh(u32 tag) || borsh(message) || nonce || borsh(recipient) || 0x00
    payload = (
        struct.pack("<I", auth_mod.NEP413_TAG)
        + _borsh_str(challenge["message"].encode())
        + raw_nonce
        + _borsh_str(b"nexscrow.vercel.app")
        + b"\x00"
    )
    digest = hashlib.sha256(payload).digest()
    sig_bytes = signing_key.sign(digest).signature
    sig_b64 = base64.b64encode(sig_bytes).decode()

    orig = auth_mod.near_access_key_exists
    auth_mod.near_access_key_exists = lambda a, k, rpc_url=None: a == account
    try:
        user = auth.verify_near_login(
            account_id=account,
            public_key=pubkey_b58,
            signature=sig_b64,
            nonce=nonce_b64,
            recipient="nexscrow.vercel.app",
            callback_url=None,
        )
    finally:
        auth_mod.near_access_key_exists = orig
    assert user["user_id"] == f"near:{account}"


def test_decode_strips_scheme_prefix():
    from src.auth import _decode_key_or_sig, _b58_decode

    key = SigningKey.generate().verify_key
    encoded = b58(bytes(key))
    # scheme prefix must not break decoding
    assert _decode_key_or_sig(f"ed25519:{encoded}") == _b58_decode(encoded)
    # garbage still fails cleanly
    with pytest.raises(AuthError):
        _decode_key_or_sig("!!!not-a-key!!!")


def test_decode_all_base64_variants_exact():
    """Signatures arrive padded/unpadded, standard/urlsafe alphabets.
    Python's b64decode accepts -/_ as +/ , so naive validate=True decoding
    corrupts urlsafe input; the decoder must separate alphabets exactly."""
    import base64 as b64

    from src.auth import _decode_key_or_sig

    sig = bytes(range(64))
    for enc in (
        b64.b64encode(sig).decode(),
        b64.b64encode(sig).decode().rstrip("="),
        b64.urlsafe_b64encode(sig).decode(),
        b64.urlsafe_b64encode(sig).decode().rstrip("="),
    ):
        assert _decode_key_or_sig(enc) == sig, enc[:12]


def test_near_login_rejects_bad_signature(tmp_path):
    auth = make_auth(tmp_path)
    challenge = auth.issue_challenge()
    signing_key = SigningKey.generate()
    with pytest.raises(AuthError, match="verification"):
        auth.verify_near_login(
            account_id="alice.testnet",
            public_key=b58(bytes(signing_key.verify_key)),
            signature=b58(signing_key.sign(b"other message").signature),
            nonce=challenge["nonce"],
            recipient="app.example",
        )


def test_failed_attempt_keeps_challenge_retryable(tmp_path):
    """The reported bug: any failed attempt burned the single-use nonce, so
    every retry said 'already used'. Now the challenge is consumed only on
    success, so a retry with the same nonce verifies."""
    auth = make_auth(tmp_path)
    account = "alice.testnet"
    signing_key = SigningKey.generate()
    pubkey_b58 = "ed25519:" + b58(bytes(signing_key.verify_key))

    challenge = auth.issue_challenge()
    nonce_b64 = challenge["nonce"]

    orig = auth_mod.near_access_key_exists
    auth_mod.near_access_key_exists = lambda a, k, rpc_url=None: a == account
    try:
        # first attempt fails: wrong signature
        with pytest.raises(AuthError, match="verification"):
            auth.verify_near_login(
                account_id=account,
                public_key=pubkey_b58,
                signature=b58(signing_key.sign(b"wrong").signature),
                nonce=nonce_b64,
                recipient="app.example",
            )
        # the challenge is NOT burned: retry with the correct signature works
        message = f"Sign in to nexscrow.\nOne-time nonce: {nonce_b64}"
        raw_nonce = base64.urlsafe_b64decode(nonce_b64 + "=" * (-len(nonce_b64) % 4))
        payload = (
            struct.pack("<I", auth_mod.NEP413_TAG)
            + _borsh_str(message.encode())
            + raw_nonce
            + _borsh_str(b"app.example")
            + b"\x00"
        )
        good_sig = b58(
            signing_key.sign(hashlib.sha256(payload).digest()).signature
        )
        user = auth.verify_near_login(
            account_id=account,
            public_key=pubkey_b58,
            signature=good_sig,
            nonce=nonce_b64,
            recipient="app.example",
        )
        assert user["user_id"] == f"near:{account}"
        # and now it IS consumed
        with pytest.raises(AuthError, match="challenge"):
            auth.verify_near_login(
                account_id=account,
                public_key=pubkey_b58,
                signature=good_sig,
                nonce=nonce_b64,
                recipient="app.example",
            )
    finally:
        auth_mod.near_access_key_exists = orig


def test_valid_signature_burns_challenge_even_on_rpc_failure(tmp_path):
    """Replay window guard: once a VALID signature is presented, the nonce
    is consumed even if the access-key RPC check fails - a captured
    callback-URL signature can never be replayed for a second login."""
    auth = make_auth(tmp_path)
    account = "alice.testnet"
    signing_key = SigningKey.generate()
    pubkey_b58 = "ed25519:" + b58(bytes(signing_key.verify_key))

    challenge = auth.issue_challenge()
    nonce_b64 = challenge["nonce"]
    raw_nonce = base64.urlsafe_b64decode(nonce_b64 + "=" * (-len(nonce_b64) % 4))
    message = f"Sign in to nexscrow.\nOne-time nonce: {nonce_b64}"
    payload = (
        struct.pack("<I", auth_mod.NEP413_TAG)
        + _borsh_str(message.encode())
        + raw_nonce
        + _borsh_str(b"app.example")
        + b"\x00"
    )
    good_sig = b58(signing_key.sign(hashlib.sha256(payload).digest()).signature)

    orig = auth_mod.near_access_key_exists
    # first attempt: valid signature, but the RPC ownership check fails
    auth_mod.near_access_key_exists = lambda a, k, rpc_url=None: False
    try:
        with pytest.raises(AuthError, match="not an access key"):
            auth.verify_near_login(
                account_id=account,
                public_key=pubkey_b58,
                signature=good_sig,
                nonce=nonce_b64,
                recipient="app.example",
            )
        # the nonce is burned: replaying the same valid signature fails
        with pytest.raises(AuthError, match="challenge"):
            auth.verify_near_login(
                account_id=account,
                public_key=pubkey_b58,
                signature=good_sig,
                nonce=nonce_b64,
                recipient="app.example",
            )
    finally:
        auth_mod.near_access_key_exists = orig


def test_near_login_rejects_replayed_nonce(tmp_path):
    auth = make_auth(tmp_path)
    challenge = auth.issue_challenge()
    # consume it once (e.g. a previous successful login used it)
    auth.delete_challenge(challenge["nonce"])
    with pytest.raises(AuthError, match="challenge"):
        auth.verify_near_login(
            account_id="alice.testnet",
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


def test_fastauth_token_verification(tmp_path, monkeypatch):
    """NEAR Auth: a correctly signed Auth0 token verifies; a tampered or
    wrong-audience token is rejected."""
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    import time as _time

    import jwt as pyjwt
    from src import auth as auth_mod
    from src.auth import AuthError, AuthService

    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    kid = "test-key-1"
    pub_jwk = {
        "keys": [
            {
                "kty": "RSA",
                "kid": kid,
                "alg": "RS256",
                "use": "sig",
                **{
                    k: v
                    for k, v in pyjwt.algorithms.RSAAlgorithm.to_jwk(
                        key.public_key(), as_dict=True
                    ).items()
                },
            }
        ]
    }

    class FakeJWKClient:
        def __init__(self, url):
            self.url = url

        def get_signing_key_from_jwt(self, token):
            header = pyjwt.get_unverified_header(token)
            assert header["kid"] == kid
            pub = key.public_key()
            return type("K", (), {"key": pub})()

    monkeypatch.setattr(auth_mod, "PyJWKClient", FakeJWKClient)

    def make_token(**over):
        now = _time.time()
        payload = {
            "iss": "https://login.testnet.fast-auth.com/",
            "aud": "auth0.jwt.fast-auth.testnet",
            "sub": "google-oauth2|123456",
            "iat": now,
            "exp": now + 600,
            "email": "user@gmail.com",
        }
        payload.update(over)
        return pyjwt.encode(
            payload,
            key,
            algorithm="RS256",
            headers={"kid": kid},
        )

    auth = AuthService(JsonStore(tmp_path / "fastauth"))

    # valid token -> session identity
    user = auth.verify_fastauth_token(make_token(), network="testnet")
    assert user["provider"] == "near-auth"
    assert user["user_id"] == "near-auth:google-oauth2|123456"
    assert user["name"] == "user@gmail.com"

    # wrong audience rejected
    with pytest.raises(AuthError, match="verification failed"):
        auth.verify_fastauth_token(make_token(aud="wrong"), network="testnet")

    # expired rejected
    with pytest.raises(AuthError, match="verification failed"):
        auth.verify_fastauth_token(
            make_token(exp=_time.time() - 10), network="testnet"
        )

    # wrong issuer rejected
    with pytest.raises(AuthError, match="verification failed"):
        auth.verify_fastauth_token(
            make_token(iss="https://evil.example/"), network="testnet"
        )

    # unknown network rejected before any fetch
    with pytest.raises(AuthError, match="unknown NEAR Auth network"):
        auth.verify_fastauth_token(make_token(), network="mainnet-beta")
