from fastapi.testclient import TestClient

from main import create_app
from src import admin_auth
from src.auth import SESSION_COOKIE
from tests.conftest import make_config

EMAIL, PASSWORD = 'Owner@Example.com', 'correct horse battery'


def build(tmp_path, monkeypatch, configured=True):
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'data')
    if configured:
        monkeypatch.setenv('NEXSCROW_ADMIN_EMAIL', EMAIL)
        monkeypatch.setenv('NEXSCROW_ADMIN_PASSWORD_HASH', admin_auth.hash_password(PASSWORD))
    return app, TestClient(app, follow_redirects=False)


def login(client, email=EMAIL, password=PASSWORD):
    return client.post('/api/auth/admin/login', json={'email': email, 'password': password})


def test_hash_roundtrip_and_malformed():
    encoded = admin_auth.hash_password('a long enough pass')
    assert encoded.startswith('scrypt$16384$8$1$')
    assert admin_auth.verify_password('a long enough pass', encoded)
    assert not admin_auth.verify_password('wrong', encoded)
    for bad in ('', 'x', 'scrypt$1$2', 'bcrypt$1$1$1$a$b', 'scrypt$x$8$1$!!$!!'):
        assert not admin_auth.verify_password('a long enough pass', bad)


def test_login_grants_admin_access(tmp_path, monkeypatch):
    app, client = build(tmp_path, monkeypatch)
    response = login(client, email=' owner@example.com ')
    assert response.status_code == 200
    assert 'httponly' in response.headers['set-cookie'].lower()
    assert client.get('/admin').status_code == 200
    assert client.get('/api/admin/overview').status_code == 200
    assert client.get('/admin/login').status_code == 303


def test_failures_are_generic(tmp_path, monkeypatch):
    app, client = build(tmp_path, monkeypatch)
    bad_password = login(client, password='nope nope nope nope')
    bad_email = login(client, email='other@example.com')
    assert bad_password.status_code == bad_email.status_code == 400
    assert bad_password.json() == bad_email.json() == {'error': 'Invalid email or password'}


def test_unconfigured_rejected(tmp_path, monkeypatch):
    monkeypatch.delenv('NEXSCROW_ADMIN_EMAIL', raising=False)
    monkeypatch.delenv('NEXSCROW_ADMIN_PASSWORD_HASH', raising=False)
    monkeypatch.delenv('NEXSCROW_ADMIN_PASSWORD', raising=False)
    app, client = build(tmp_path, monkeypatch, configured=False)
    response = login(client)
    assert response.status_code == 400
    assert 'not configured' in response.json()['error']


def test_pages_and_other_sessions(tmp_path, monkeypatch):
    app, client = build(tmp_path, monkeypatch)
    redirect = client.get('/admin')
    assert redirect.status_code == 303 and redirect.headers['location'] == '/admin/login'
    assert client.get('/admin/login').status_code == 200
    demo = TestClient(app)
    demo.cookies.set(SESSION_COOKIE, app.state.auth.create_session('demo', 'demo:user', 'Demo'))
    assert demo.get('/api/admin/overview').status_code == 403
    forged = TestClient(app)
    forged.cookies.set(SESSION_COOKIE, app.state.auth.create_session('admin', 'admin:evil@example.com', 'Admin'))
    assert forged.get('/api/admin/overview').status_code == 403


def test_plain_password_setting(tmp_path, monkeypatch):
    from fastapi.testclient import TestClient
    from main import create_app
    from tests.conftest import make_config
    monkeypatch.delenv('NEXSCROW_ADMIN_PASSWORD_HASH', raising=False)
    monkeypatch.setenv('NEXSCROW_ADMIN_EMAIL', 'Owner@Example.com')
    monkeypatch.setenv('NEXSCROW_ADMIN_PASSWORD', 'plain-setting-pass')
    c = TestClient(create_app(config_path=make_config(tmp_path), data_dir=str(tmp_path / 'data')))
    bad = c.post('/api/auth/admin/login', json={'email': 'owner@example.com', 'password': 'nope'})
    assert bad.status_code == 400 and bad.json()['error'] == 'Invalid email or password'
    ok = c.post('/api/auth/admin/login', json={'email': 'owner@example.com', 'password': 'plain-setting-pass'})
    assert ok.status_code == 200
    assert c.get('/api/admin/overview').status_code == 200
    # The hash wins when both are set.
    monkeypatch.setenv('NEXSCROW_ADMIN_PASSWORD_HASH', admin_auth.hash_password('hash-wins-pass'))
    assert c.post('/api/auth/admin/login', json={'email': 'owner@example.com', 'password': 'plain-setting-pass'}).status_code == 400
