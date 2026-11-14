from fastapi.testclient import TestClient

from main import create_app
from src import admin_auth
from tests.conftest import make_config

ADMIN = ('owner@example.com', 'correct horse battery')


def build(tmp_path, monkeypatch):
    monkeypatch.setenv('NEXSCROW_ADMIN_EMAIL', ADMIN[0])
    monkeypatch.setenv('NEXSCROW_ADMIN_PASSWORD_HASH', admin_auth.hash_password(ADMIN[1]))
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'data')
    return app


def client(app, demo=True):
    c = TestClient(app, follow_redirects=False)
    if demo:
        assert c.post('/api/auth/demo').status_code == 200
    return c


def setup(tmp_path, monkeypatch):
    app = build(tmp_path, monkeypatch)
    buyer, seller = client(app), client(app)
    deal = buyer.post('/api/deals', json={'title': 'Logo', 'description': 'd', 'amount_usd': 50}).json()
    token = deal['invite_path'].split('token=')[1]
    return app, buyer, seller, deal, token


def test_happy_path_requires_both_confirmations(tmp_path, monkeypatch):
    app, buyer, seller, deal, token = setup(tmp_path, monkeypatch)
    did = deal['id']
    assert 'token_hash' not in deal
    assert seller.post(f'/api/deals/{did}/join', json={'token': token}).status_code == 200
    assert buyer.post(f'/api/deals/{did}/fund').json()['status'] == 'funded'
    assert buyer.post(f'/api/deals/{did}/confirm').json()['status'] == 'funded'
    assert buyer.post(f'/api/deals/{did}/confirm').json()['status'] == 'funded'
    done = seller.post(f'/api/deals/{did}/confirm').json()
    assert done['status'] == 'released'
    assert [e['event'] for e in done['events']].count('released') == 1
    # double release prevented
    assert seller.post(f'/api/deals/{did}/confirm').status_code == 400
    assert [d['id'] for d in seller.get('/api/deals').json()['deals']] == [did]


def test_outsider_and_wrong_token(tmp_path, monkeypatch):
    app, buyer, seller, deal, token = setup(tmp_path, monkeypatch)
    did = deal['id']
    outsider = client(app)
    assert outsider.get(f'/api/deals/{did}').status_code == 404
    assert outsider.post(f'/api/deals/{did}/confirm').status_code == 404
    assert outsider.post(f'/api/deals/{did}/join', json={'token': 'nope'}).status_code == 404
    assert outsider.get(f'/deals/{did}').status_code == 404
    assert outsider.get(f'/deals/{did}?token={token}').status_code == 200
    assert buyer.post(f'/api/deals/{did}/join', json={'token': token}).status_code == 400
    assert seller.post(f'/api/deals/{did}/join', json={'token': token}).status_code == 200
    assert outsider.post(f'/api/deals/{did}/join', json={'token': token}).status_code == 400


def test_no_confirm_before_funding_and_cancel(tmp_path, monkeypatch):
    app, buyer, seller, deal, token = setup(tmp_path, monkeypatch)
    did = deal['id']
    seller.post(f'/api/deals/{did}/join', json={'token': token})
    assert seller.post(f'/api/deals/{did}/confirm').status_code == 400
    assert seller.post(f'/api/deals/{did}/fund').status_code == 403
    assert seller.post(f'/api/deals/{did}/cancel').json()['status'] == 'cancelled'
    assert buyer.post(f'/api/deals/{did}/fund').status_code == 400


def test_cancel_blocked_after_funding(tmp_path, monkeypatch):
    app, buyer, seller, deal, token = setup(tmp_path, monkeypatch)
    buyer.post(f"/api/deals/{deal['id']}/fund")
    assert buyer.post(f"/api/deals/{deal['id']}/cancel").status_code == 400


def test_dispute_and_admin_refund(tmp_path, monkeypatch):
    app, buyer, seller, deal, token = setup(tmp_path, monkeypatch)
    did = deal['id']
    seller.post(f'/api/deals/{did}/join', json={'token': token})
    buyer.post(f'/api/deals/{did}/fund')
    assert seller.post(f'/api/deals/{did}/dispute', json={'reason': 'x'}).json()['status'] == 'disputed'
    assert buyer.post(f'/api/admin/deals/{did}/resolve', json={'outcome': 'refund'}).status_code == 403
    admin = client(app, demo=False)
    assert admin.post('/api/auth/admin/login', json={'email': ADMIN[0], 'password': ADMIN[1]}).status_code == 200
    assert admin.post(f'/api/admin/deals/{did}/resolve', json={'outcome': 'bogus'}).status_code == 400
    assert admin.post(f'/api/admin/deals/{did}/resolve', json={'outcome': 'refund'}).json()['status'] == 'refunded'
    assert admin.post(f'/api/admin/deals/{did}/resolve', json={'outcome': 'release'}).status_code == 400


def test_validation_and_auth(tmp_path, monkeypatch):
    app = build(tmp_path, monkeypatch)
    anon = client(app, demo=False)
    assert anon.post('/api/deals', json={'title': 't', 'amount_usd': 5}).status_code == 401
    buyer = client(app)
    for amount in (0.5, 10001, 'x', None):
        assert buyer.post('/api/deals', json={'title': 't', 'amount_usd': amount}).status_code == 400
    assert buyer.post('/api/deals', json={'title': '', 'amount_usd': 5}).status_code == 400


def test_invite_link_survives_sign_in(tmp_path):
    from fastapi.testclient import TestClient
    from main import create_app
    from tests.conftest import make_config
    c = TestClient(create_app(config_path=make_config(tmp_path), data_dir=str(tmp_path / 'data')))
    r = c.get('/deals/deal-x?token=abc', follow_redirects=False)
    assert r.status_code == 303 and r.headers['location'] == '/login'
    c.post('/api/auth/demo')
    r = c.get('/app', follow_redirects=False)
    assert r.status_code == 303 and r.headers['location'] == '/deals/deal-x?token=abc'
    assert c.get('/app', follow_redirects=False).status_code == 200
