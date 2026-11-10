"""Authentication: server-side sessions, Google OAuth, NEAR wallet signatures.

Three login providers:
- Google OAuth 2.0 code flow (needs GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)
- NEAR wallet: NEP-413 signed challenge, verified against the account's
  access key via NEAR RPC
- Demo mode: a simulated per-session identity, no wallet or Google needed
"""

from __future__ import annotations

import base64
import hashlib
import os
import secrets
import struct
import time
from typing import Any
from urllib.parse import urlencode

import httpx

from src.storage import JsonStore, utcnow


SESSION_TTL_SECONDS = 24 * 3600
CHALLENGE_TTL_SECONDS = 10 * 60
NEAR_RPC_URL = "https://rpc.mainnet.near.org"
NEP413_TAG = 2**31 + 413
SESSION_COOKIE = "nexscrow_session"
_B58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"


class AuthError(Exception):
    pass


def _b58_decode(value: str) -> bytes:
    num = 0
    for ch in value:
        idx = _B58_ALPHABET.find(ch)
        if idx < 0:
            raise AuthError("invalid base58 string")
        num = num * 58 + idx
    raw = num.to_bytes((num.bit_length() + 7) // 8 or 1, "big")
    pad = len(value) - len(value.lstrip("1"))
    return b"\x00" * pad + raw


def _decode_key_or_sig(value: str) -> bytes:
    """Wallets return base58 (web flow) or base64 (some injected wallets)."""
    try:
        return _b58_decode(value)
    except (AuthError, ValueError):
        pass
    try:
        padded = value + "=" * (-len(value) % 4)
        return base64.urlsafe_b64decode(padded)
    except Exception as exc:  # noqa: BLE001
        raise AuthError("unrecognized signature/public key encoding") from exc


def _borsh_str(data: bytes) -> bytes:
    return struct.pack("<I", len(data)) + data


def nep413_payloads(
    message: str, nonce: bytes, recipient: str, callback_url: str | None
) -> list[bytes]:
    """Byte layouts a wallet may have signed for one NEP-413 request.

    NEP-413: sign SHA256(borsh(u32 tag) || payload). Wallets differ slightly
    in how the optional callbackUrl is encoded, and older MyNearWallet signed
    the raw message; verification tries each variant.
    """
    m = message.encode("utf-8")
    r = recipient.encode("utf-8")
    tag = struct.pack("<I", NEP413_TAG)
    base = _borsh_str(m) + nonce + _borsh_str(r)
    candidates = [tag + base]
    if callback_url:
        cb = callback_url.encode("utf-8")
        candidates.insert(0, tag + base + b"\x01" + _borsh_str(cb))
        candidates.insert(1, tag + base + _borsh_str(cb))
    candidates.append(m)
    candidates.append(hashlib.sha256(m).digest())
    return candidates


def verify_near_signature(
    message: str,
    nonce: bytes,
    recipient: str,
    callback_url: str | None,
    public_key_b58: str,
    signature_b58: str,
) -> bool:
    """Ed25519-verify the wallet signature over the NEP-413 payload."""
    from nacl.exceptions import BadSignatureError
    from nacl.signing import VerifyKey

    try:
        pubkey = _decode_key_or_sig(public_key_b58)
        signature = _decode_key_or_sig(signature_b58)
        verify_key = VerifyKey(pubkey)
    except (AuthError, ValueError, TypeError):
        return False
    for payload in nep413_payloads(message, nonce, recipient, callback_url):
        try:
            verify_key.verify(hashlib.sha256(payload).digest(), signature)
            return True
        except BadSignatureError:
            continue
    return False


def near_access_key_exists(
    account_id: str, public_key_b58: str, rpc_url: str = NEAR_RPC_URL
) -> bool:
    """Confirm the signing key really is an access key of the account."""
    try:
        resp = httpx.post(
            rpc_url,
            json={
                "jsonrpc": "2.0",
                "id": "nexscrow",
                "method": "query",
                "params": {
                    "request_type": "view_access_key",
                    "finality": "final",
                    "account_id": account_id,
                    "public_key": public_key_b58,
                },
            },
            timeout=10,
        )
        resp.raise_for_status()
        return "result" in resp.json()
    except httpx.HTTPError:
        return False


class AuthService:
    def __init__(self, store: JsonStore):
        self._store = store
        self.google_client_id = os.environ.get("GOOGLE_CLIENT_ID") or None
        self.google_client_secret = os.environ.get("GOOGLE_CLIENT_SECRET") or None

    # ------------------------------------------------------------ sessions

    def google_configured(self) -> bool:
        return bool(self.google_client_id and self.google_client_secret)

    def create_session(self, provider: str, user_id: str, name: str) -> str:
        token = secrets.token_urlsafe(32)
        now = time.time()

        def mutate(sessions: dict) -> None:
            for k in [k for k, v in sessions.items() if v.get("expires_at", 0) <= now]:
                del sessions[k]
            sessions[token] = {
                "provider": provider,
                "user_id": user_id,
                "name": name,
                "created_at": utcnow(),
                "expires_at": now + SESSION_TTL_SECONDS,
            }

        self._store.update("sessions", {}, mutate)
        return token

    def get_user(self, token: str | None) -> dict | None:
        if not token:
            return None
        sessions: dict = self._store.read("sessions", {})
        session = sessions.get(token)
        if not session or session.get("expires_at", 0) <= time.time():
            return None
        return {
            "provider": session["provider"],
            "user_id": session["user_id"],
            "name": session["name"],
        }

    def logout(self, token: str | None) -> None:
        if not token:
            return

        def mutate(sessions: dict) -> None:
            sessions.pop(token, None)

        self._store.update("sessions", {}, mutate)

    # --------------------------------------------------------------- demo

    def demo_login(self) -> dict:
        suffix = secrets.token_hex(4)
        return {
            "provider": "demo",
            "user_id": f"demo:{suffix}",
            "name": f"Demo User {suffix}",
        }

    # --------------------------------------------------------------- NEAR

    def issue_challenge(self) -> dict:
        """One-time NEP-413 challenge; the nonce doubles as the message body."""
        nonce = secrets.token_bytes(32)
        nonce_b64 = base64.urlsafe_b64encode(nonce).decode().rstrip("=")
        message = f"Sign in to nexscrow.\nOne-time nonce: {nonce_b64}"
        now = time.time()

        def mutate(challenges: dict) -> None:
            for k in [k for k, v in challenges.items() if v.get("expires_at", 0) <= now]:
                del challenges[k]
            challenges[nonce_b64] = {"expires_at": now + CHALLENGE_TTL_SECONDS}

        self._store.update("challenges", {}, mutate)
        return {"message": message, "nonce": nonce_b64}

    def consume_challenge(self, nonce_b64: str) -> bytes | None:
        """Pop the challenge; return raw nonce bytes if it was fresh."""

        def mutate(challenges: dict) -> Any:
            return challenges.pop(nonce_b64, None)

        entry = self._store.update("challenges", {}, mutate)
        if not entry or entry.get("expires_at", 0) <= time.time():
            return None
        try:
            padded = nonce_b64 + "=" * (-len(nonce_b64) % 4)
            return base64.urlsafe_b64decode(padded)
        except Exception:  # noqa: BLE001
            return None

    def verify_near_login(
        self,
        account_id: str,
        public_key: str,
        signature: str,
        nonce: str,
        recipient: str,
        callback_url: str | None = None,
    ) -> dict:
        if not account_id or not public_key or not signature:
            raise AuthError("account_id, public_key and signature are required")
        raw_nonce = self.consume_challenge(nonce)
        if raw_nonce is None:
            raise AuthError("challenge expired or already used; retry the login")
        message = f"Sign in to nexscrow.\nOne-time nonce: {nonce}"
        if not verify_near_signature(
            message, raw_nonce, recipient, callback_url, public_key, signature
        ):
            raise AuthError("wallet signature failed verification")
        if not near_access_key_exists(account_id, public_key):
            raise AuthError(f"public key is not an access key of account '{account_id}'")
        return {
            "provider": "near",
            "user_id": f"near:{account_id}",
            "name": account_id,
        }

    # ------------------------------------------------------------- Google

    def google_auth_url(self, redirect_uri: str, state: str) -> str:
        if not self.google_configured():
            raise AuthError(
                "Google login is not configured; set GOOGLE_CLIENT_ID and"
                " GOOGLE_CLIENT_SECRET"
            )
        params = {
            "client_id": self.google_client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "prompt": "select_account",
        }
        return "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)

    def verify_google_code(self, code: str, redirect_uri: str) -> dict:
        if not self.google_configured():
            raise AuthError("Google login is not configured")
        try:
            resp = httpx.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": self.google_client_id,
                    "client_secret": self.google_client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
                timeout=15,
            )
            resp.raise_for_status()
            id_token = resp.json().get("id_token")
        except httpx.HTTPError as exc:
            raise AuthError(f"Google token exchange failed: {exc}") from exc
        if not id_token:
            raise AuthError("Google response contained no id_token")
        try:
            info = httpx.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": id_token},
                timeout=15,
            )
            info.raise_for_status()
            claims = info.json()
        except httpx.HTTPError as exc:
            raise AuthError(f"Google token verification failed: {exc}") from exc
        if claims.get("aud") != self.google_client_id:
            raise AuthError("Google id_token audience mismatch")
        if claims.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
            raise AuthError("Google id_token issuer mismatch")
        if int(claims.get("exp", 0)) < time.time():
            raise AuthError("Google id_token expired")
        return {
            "provider": "google",
            "user_id": f"google:{claims['sub']}",
            "name": claims.get("email") or claims.get("name") or "Google user",
        }
