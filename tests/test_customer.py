from concurrent.futures import ThreadPoolExecutor

from fastapi.testclient import TestClient

from main import create_app
from tests.conftest import make_config


def setup(tmp_path):
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'data')
    owner = TestClient(app)
    owner.post('/api/auth/demo', json={'name': 'Owner'})
    other = TestClient(app)
    other.post('/api/auth/demo', json={'name': 'Other'})
    return app, owner, other


def test_private_dashboard_and_owner_only_aggregation(tmp_path):
    app, owner, other = setup(tmp_path)
    anon = TestClient(app)
    assert anon.get('/api/customer/dashboard').status_code == 401
    payload = {'agent_id': 'agent-oracle-1', 'inputs': {'prompt': 'Owner brief'}, 'payment_method': 'escrow', 'idempotency_key': 'owner-request-1'}
    request = owner.post('/api/requests', json=payload).json()
    other.post('/api/requests', json={**payload, 'inputs': {'prompt': 'Other private brief'}})
    owner.post(f"/api/jobs/{request['job_id']}/deposit/approve")
    owner.post(f"/api/requests/{request['request_id']}/advance")
    result = owner.get('/api/customer/dashboard').json()
    assert result['overview']['total_requests'] == 1
    assert result['overview']['successful_executions'] == 1
    assert result['requests'][0]['request_id'] == request['request_id']
    assert result['agents'][0]['usage_count'] == 1
    assert len(result['escrow_payments']) == 1
    assert 'Other private' not in str(result)
    assert 'Owner brief' not in str(result)  # Dashboard summary does not return task content.
    assert result['payments'] == []
    assert result['overview']['active_subscriptions'] == 0
    assert result['overview']['available_credits'] == 0


def test_settings_validate_and_persist_per_user(tmp_path):
    _, owner, other = setup(tmp_path)
    prefs = {'display_name': ' Updated Name ', 'notifications': {'execution_updates': True, 'payment_updates': False, 'product_updates': True}}
    response = owner.put('/api/account/settings', json=prefs)
    assert response.status_code == 200
    assert response.json()['display_name'] == 'Updated Name'
    assert owner.get('/api/account/settings').json()['notifications'] == prefs['notifications']
    assert other.get('/api/account/settings').json()['display_name'] == other.get('/api/auth/session').json()['user']['name']
    assert owner.put('/api/account/settings', json={**prefs, 'user_id': 'other'}).status_code == 422
    assert owner.put('/api/account/settings', json={**prefs, 'display_name': '   '}).status_code == 400
    assert owner.put('/api/account/settings', json={**prefs, 'notifications': {'execution_updates': 'true', 'payment_updates': True, 'product_updates': False}}).status_code == 422


def test_security_revokes_only_other_sessions_and_keeps_current(tmp_path):
    app, owner, other = setup(tmp_path)
    user = owner.get('/api/auth/session').json()['user']
    extra = app.state.auth.create_session(user['provider'], user['user_id'], user['name'])
    unrelated = other.get('/api/auth/session').json()['user']
    result = owner.get('/api/customer/dashboard').json()
    assert result['security']['session_count'] == 2
    assert result['security']['wallet_account'] is None
    assert result['security']['notification_delivery_enabled'] is False
    assert owner.post('/api/account/sessions/revoke-other', json={}).json()['revoked_count'] == 1
    assert app.state.auth.get_user(extra) is None
    assert owner.get('/api/auth/session').json()['user']['user_id'] == user['user_id']
    assert other.get('/api/auth/session').json()['user']['user_id'] == unrelated['user_id']


def test_legacy_jobs_not_double_counted_and_wallet_is_verified_identity(tmp_path):
    app, owner, _ = setup(tmp_path)
    user = owner.get('/api/auth/session').json()['user']
    job = app.state.system.post_job('Legacy job', 'Private legacy description', 5, client_id=user['user_id'], simulated=True)
    result = owner.get('/api/customer/dashboard').json()
    assert result['overview']['total_requests'] == 1
    assert result['legacy_requests'] == 1
    assert result['escrow_payments'][0]['job_id'] == job['job_id']
    assert 'Private legacy description' not in str(result)
    assert result['requests'][0]['legacy_job'] is True
    assert result['requests'][0]['result_href'] == '/job/' + job['job_id']
    token = app.state.auth.create_session('near', 'near:buyer.near', 'Buyer')
    client = TestClient(app)
    from src.auth import SESSION_COOKIE
    client.cookies.set(SESSION_COOKIE, token)
    assert client.get('/api/customer/dashboard').json()['security']['wallet_account'] == 'buyer.near'


def test_subscriptions_payments_and_topups_are_user_scoped(tmp_path):
    app, owner, other = setup(tmp_path)
    user = owner.get('/api/auth/session').json()['user']
    credits = app.state.billing_service.credits
    credits.grant(user['user_id'], 100, 'test-grant', 'pro', ['*'])
    credits.topup(user['user_id'], 50, 'test-topup')
    record = owner.get('/api/customer/dashboard').json()
    assert record['overview']['active_subscriptions'] == 1
    assert record['credits']['topup_credits'] == 50
    assert record['credits']['plan_credits'] == 100
    assert len(record['agents']) == sum('credits' in a['supported_payment_methods'] for a in app.state.system.agent_catalog())
    assert all(a['usage_count'] == 0 and a['relationship'] == 'plan_access' for a in record['agents'])
    assert other.get('/api/customer/dashboard').json()['credits']['balance'] == 0
    assert record['escrow_payments'] == []


def test_page_and_empty_states_have_no_other_user_data(tmp_path):
    _, owner, _ = setup(tmp_path)
    assert owner.get('/account').status_code == 200
    assert owner.get('/dashboard').status_code == 200  # Public board remains available.
    data = owner.get('/api/customer/dashboard').json()
    assert data['requests'] == data['agents'] == data['escrow_payments'] == data['payments'] == []
    assert all(v == 0 for v in data['overview'].values())
    assert 'session_token' not in str(data)


def test_billing_payment_records_and_transaction_hashes_remain_separate(tmp_path):
    app, owner, other = setup(tmp_path)
    user = owner.get('/api/auth/session').json()['user']
    job = app.state.system.post_job('Escrow task', 'brief', 5, client_id=user['user_id'], simulated=True)
    app.state.system.jobs.update(job['job_id'], deposit_tx_hash='escrow-deposit-hash')
    def order(data):
        data['orders']['owned-payment'] = {'payment_id': 'owned-payment', 'user_id': user['user_id'], 'purpose': 'topup', 'plan_id': None, 'price_usd': '5.00', 'credits': 250, 'status': 'paid', 'created_at': '2026-11-12T00:00:00Z'}
        data['orders']['other-payment'] = {'payment_id': 'other-payment', 'user_id': 'not-owner', 'purpose': 'subscription', 'plan_id': 'pro', 'price_usd': '29.00', 'credits': 2000, 'status': 'paid', 'created_at': '2026-11-12T00:00:00Z'}
    app.state.billing_service._update(order)
    data = owner.get('/api/customer/dashboard').json()
    assert len(data['escrow_payments']) == len(data['payments']) == 1
    assert data['escrow_payments'][0]['deposit_tx_hash'] == 'escrow-deposit-hash'
    assert data['payments'][0]['payment_id'] == 'owned-payment'
    assert all('other-payment' not in str(v) for v in data.values())
    assert len(data['recent_payments']) == 2


def test_expired_subscription_not_counted_as_active(tmp_path):
    app, owner, _ = setup(tmp_path)
    user = owner.get('/api/auth/session').json()['user']
    app.state.billing_service.credits.grant(user['user_id'], 20, 'expired-plan', 'starter', ['*'], '2020-01-01T00:00:00Z')
    data = owner.get('/api/customer/dashboard').json()
    assert data['overview']['active_subscriptions'] == 0
    assert data['subscription'] is None
    assert data['agents'] == []
