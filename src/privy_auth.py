"""Verify Privy access tokens before issuing local server-side sessions."""
from functools import lru_cache
import os

import jwt

from src.auth import AuthError


def app_id() -> str:
    return (os.getenv('PRIVY_APP_ID') or os.getenv('NEXT_PUBLIC_PRIVY_APP_ID') or '').strip()


@lru_cache(maxsize=8)
def _jwks(application_id: str):
    return jwt.PyJWKClient(
        f'https://auth.privy.io/api/v1/apps/{application_id}/jwks.json',
        cache_keys=True, timeout=10,
    )


def verify_access_token(token: str) -> str:
    application_id = app_id()
    if not application_id:
        raise AuthError('Privy login is not configured')
    try:
        key = _jwks(application_id).get_signing_key_from_jwt(token).key
        claims = jwt.decode(
            token, key, algorithms=['ES256'], audience=application_id,
            issuer='privy.io', options={'require': ['sub', 'iss', 'aud', 'exp', 'iat']},
        )
        subject = claims['sub']
        if not isinstance(subject, str) or not subject.startswith('did:privy:'):
            raise ValueError('Invalid subject')
        return subject
    except Exception as exc:
        raise AuthError('Invalid or expired Privy access token') from exc
