import time
from types import SimpleNamespace

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi.testclient import TestClient

from main import create_app
from src import privy_auth
from src.auth import AuthError
from tests.conftest import make_config


@pytest.fixture
def privy(monkeypatch):
    monkeypatch.setenv('PRIVY_APP_ID', 'test-app')
    key = ec.generate_private_key(ec.SECP256R1())
    monkeypatch.setattr(privy_auth, '_jwks', lambda app: SimpleNamespace(
        get_signing_key_from_jwt=lambda token: SimpleNamespace(key=key.public_key())))

    def token(**overrides):
        claims = dict(sub='did:privy:example', aud='test-app', iss='privy.io',
                      iat=int(time.time()), exp=int(time.time()) + 300)
        claims.update(overrides)
        return jwt.encode(claims, key, algorithm='ES256')
    return token


def test_verified_privy_session_and_admin_allowlist(tmp_path, monkeypatch, privy):
    monkeypatch.setenv('NEXSCROW_ADMIN_USER_IDS', 'privy:did:privy:example')
    c = TestClient(create_app(config_path=make_config(tmp_path), data_dir=str(tmp_path / 'data')))
    assert c.get('/api/auth/privy/config').json() == {'app_id': 'test-app'}
    r = c.post('/api/auth/privy/verify', json={'access_token': privy()})
    assert r.status_code == 200
    assert r.json()['user']['user_id'] == 'privy:did:privy:example'
    assert r.json()['user']['provider'] == 'privy'
    assert 'HttpOnly' in r.headers['set-cookie']
    assert c.get('/api/auth/session').json()['user'] == r.json()['user']
    assert c.get('/app').status_code == 200
    assert c.get('/api/admin/overview').status_code == 200
    assert c.get('/login', follow_redirects=False).status_code == 303
    c.post('/api/auth/logout')
    assert c.get('/api/auth/session').json()['user'] is None


@pytest.mark.parametrize('overrides', [
    {'aud': 'another-app'}, {'iss': 'attacker'}, {'exp': 1},
    {'sub': 'near:admin.near'}, {'sub': None},
])
def test_rejects_untrusted_claims(privy, overrides):
    with pytest.raises(AuthError):
        privy_auth.verify_access_token(privy(**overrides))


def test_rejects_invalid_signature(privy):
    claims = jwt.decode(privy(), options={'verify_signature': False})
    forged = jwt.encode(claims, ec.generate_private_key(ec.SECP256R1()), algorithm='ES256')
    with pytest.raises(AuthError):
        privy_auth.verify_access_token(forged)


def test_unconfigured_and_alias(monkeypatch):
    monkeypatch.delenv('PRIVY_APP_ID', raising=False)
    monkeypatch.delenv('NEXT_PUBLIC_PRIVY_APP_ID', raising=False)
    assert privy_auth.app_id() == ''
    with pytest.raises(AuthError, match='not configured'):
        privy_auth.verify_access_token('invalid')
    monkeypatch.setenv('NEXT_PUBLIC_PRIVY_APP_ID', 'alias-app')
    assert privy_auth.app_id() == 'alias-app'


def test_unified_login_portal_and_demo(tmp_path, monkeypatch):
    monkeypatch.delenv('PRIVY_APP_ID', raising=False)
    monkeypatch.delenv('NEXT_PUBLIC_PRIVY_APP_ID', raising=False)
    c = TestClient(create_app(config_path=make_config(tmp_path), data_dir=str(tmp_path / 'data')))
    assert 'DAPPS PORTAL' in c.get('/login').text
    assert 'Connect NEAR wallet' in c.get('/login?method=near').text
    assert c.get('/login?method=near').text == c.get('/login').text
    assert c.post('/api/auth/privy/verify', json={'access_token': 'invalid'}).status_code == 400
    assert c.get('/api/auth/session').json()['user'] is None
    assert c.post('/api/auth/demo').json()['user']['provider'] == 'demo'
    assert c.get('/api/admin/overview').status_code == 403
