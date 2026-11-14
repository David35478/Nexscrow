"""Email + password login for the admin portal. Credentials come from env only."""
from __future__ import annotations

import base64
import getpass
import hashlib
import hmac
import os
import secrets

from src.auth import AuthError

N, R, P, KEYLEN, MIN_LENGTH = 2**14, 8, 1, 32, 12
GENERIC = 'Invalid email or password'


def _b64(raw: bytes) -> str:
    return base64.b64encode(raw).decode()


def _scrypt(password: str, salt: bytes, n: int = N, r: int = R, p: int = P) -> bytes:
    return hashlib.scrypt(password.encode(), salt=salt, n=n, r=r, p=p, dklen=KEYLEN, maxmem=128 * 1024 * 1024)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    return f'scrypt${N}${R}${P}${_b64(salt)}${_b64(_scrypt(password, salt))}'


def verify_password(password: str, encoded: str) -> bool:
    try:
        scheme, n, r, p, salt, digest = (encoded or '').split('$')
        if scheme != 'scrypt':
            return False
        expected = base64.b64decode(digest, validate=True)
        actual = _scrypt(password, base64.b64decode(salt, validate=True), int(n), int(r), int(p))
        return hmac.compare_digest(actual, expected)
    except Exception:
        return False


def _email() -> str:
    return os.environ.get('NEXSCROW_ADMIN_EMAIL', '').strip().lower()


def _hash() -> str:
    return os.environ.get('NEXSCROW_ADMIN_PASSWORD_HASH', '').strip()


def configured() -> bool:
    return bool(_email() and _hash())


def admin_user_id() -> str:
    return f'admin:{_email()}' if configured() else ''


_DUMMY = hash_password(secrets.token_hex(8))


def authenticate(email: str, password: str) -> dict:
    if not configured():
        raise AuthError('Admin email login is not configured')
    # Always run scrypt so a wrong email costs the same as a wrong password.
    password_ok = verify_password(password, _hash() or _DUMMY)
    email_ok = hmac.compare_digest((email or '').strip().lower().encode(), _email().encode())
    if not (password_ok and email_ok):
        raise AuthError(GENERIC)
    return {'provider': 'admin', 'user_id': admin_user_id(), 'name': 'Admin'}


def main() -> None:
    password = getpass.getpass('Admin password: ')
    if len(password) < MIN_LENGTH:
        raise SystemExit(f'Password must be at least {MIN_LENGTH} characters')
    if password != getpass.getpass('Repeat password: '):
        raise SystemExit('Passwords do not match')
    print(hash_password(password))


if __name__ == '__main__':
    main()
