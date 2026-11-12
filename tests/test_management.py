import copy
from fastapi.testclient import TestClient

from main import create_app
from src.auth import SESSION_COOKIE
from tests.conftest import make_config


AGENT = {'name': 'Reviewed Oracle', 'description': 'Approved research work', 'category': 'Research', 'task_price_usd': 3.5, 'credit_cost': 7, 'payment_methods': ['escrow', 'credits'], 'enabled': True}
SUBMISSION = {key: value for key, value in AGENT.items() if key != 'enabled'} | {'execution_url': 'https://developer.example.org/execute', 'input_schema': {'type': 'object', 'properties': {'prompt': {'type': 'string'}}, 'required': ['prompt'], 'additionalProperties': False}, 'output_schema': {'type': 'string'}}


def setup(tmp_path, monkeypatch):
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'data')
    monkeypatch.setenv('NEXSCROW_ADMIN_USER_IDS', 'near:admin.near')
    def session(provider, identity):
        c = TestClient(app)
        c.cookies.set(SESSION_COOKIE, app.state.auth.create_session(provider, identity, identity))
        return c
    return app, session('near', 'near:admin.near'), session('near', 'near:developer.near'), session('demo', 'demo:user'), TestClient(app)


def test_all_admin_routes_require_server_admin_identity(tmp_path, monkeypatch):
    app, admin, developer, demo, anon = setup(tmp_path, monkeypatch)
    assert anon.get('/api/admin/overview').status_code == 401
    for client in [developer, demo]:
        assert client.get('/api/admin/overview').status_code == 403
        assert client.get('/admin').status_code == 403
        assert client.put('/api/admin/agents/agent-oracle-1', json=AGENT).status_code == 403
        assert client.post('/api/admin/providers/sync', json={}).status_code == 403
        assert client.post('/api/admin/kill-switch', json={'enabled': True}).status_code == 403
    monkeypatch.setenv('NEXSCROW_ADMIN_USER_IDS', 'demo:user')
    assert demo.get('/api/admin/overview').status_code == 403


def test_agent_overrides_enforce_server_pricing_and_disable_legacy_execution(tmp_path, monkeypatch):
    app, admin, _, demo, _ = setup(tmp_path, monkeypatch)
    response = admin.put('/api/admin/agents/agent-oracle-1', json=AGENT)
    assert response.status_code == 200
    options = demo.get('/api/requests/options/agent-oracle-1').json()
    assert options['task_price_usd'] == 3.5
    assert options['credit_cost'] == 7
    assert options['agent']['display_name'] == 'Reviewed Oracle'
    request = demo.post('/api/requests', json={'agent_id': 'agent-oracle-1', 'inputs': {'prompt': 'test'}, 'payment_method': 'escrow', 'idempotency_key': 'test-request'}).json()
    demo.post(f"/api/jobs/{request['job_id']}/deposit/approve")
    assert admin.put('/api/admin/agents/agent-oracle-1', json={**AGENT, 'enabled': False}).status_code == 200
    assert not any(a['agent_id'] == 'agent-oracle-1' for a in app.state.system.agent_catalog())
    assert demo.post(f"/api/jobs/{request['job_id']}/agent-run", json={'agent_id': 'agent-oracle-1'}).status_code == 400
    assert any(a['agent_id'] == 'agent-oracle-1' for a in admin.get('/api/admin/overview').json()['agents'])
    assert admin.put('/api/admin/agents/agent-oracle-1', json={**AGENT, 'task_price_usd': 999}).status_code == 400
    assert admin.put('/api/admin/agents/agent-oracle-1', json={**AGENT, 'payment_methods': ['fake']}).status_code == 400


def test_developer_ownership_approval_revision_and_no_publication(tmp_path, monkeypatch):
    app, admin, developer, demo, _ = setup(tmp_path, monkeypatch)
    assert developer.post('/api/developer/agents', json=SUBMISSION).status_code == 400
    assert developer.post('/api/developer/register', json={'display_name': 'Developer', 'contact_email': 'owner@example.org'}).status_code == 200
    created = developer.post('/api/developer/agents', json=SUBMISSION).json()
    identity = created['submission_id']
    assert created['status'] == 'pending'
    assert created['payouts_enabled'] is False
    assert demo.get('/api/developer/overview').json()['agents'] == []
    assert demo.put('/api/developer/agents/' + identity, json=SUBMISSION).status_code == 404
    assert demo.post('/api/developer/agents/' + identity + '/test', json={'inputs': {'prompt': 'x'}}).status_code == 404
    assert developer.post('/api/developer/agents/' + identity + '/test', json={'inputs': {'prompt': 123}}).status_code == 400
    validated = developer.post('/api/developer/agents/' + identity + '/test', json={'inputs': {'prompt': 'x'}}).json()
    assert validated['executed'] is False
    reviewed = admin.post('/api/admin/developers/agents/' + identity + '/review', json={'decision': 'approved', 'note': 'Reviewed listing metadata only'}).json()
    assert reviewed['publication_status'] == 'blocked_pending_commercial_and_provider_verification'
    assert not any(a['display_name'] == SUBMISSION['name'] for a in app.state.system.agent_catalog())
    revised = developer.put('/api/developer/agents/' + identity, json={**SUBMISSION, 'name': 'Changed'}).json()
    assert revised['status'] == 'pending' and revised['revision'] == 2
    assert revised['commercial_authorization_status'] == 'unverified'
    assert app.state.system.store.read('jobs', {}) == {}
    assert app.state.system.store.read('credit_accounts', {}) == {}


def test_provider_secrets_never_returned_and_urls_fail_closed(tmp_path, monkeypatch):
    app, admin, developer, _, _ = setup(tmp_path, monkeypatch)
    monkeypatch.setenv('WIRO_API_KEY', 'sensitive-test-value')
    app.state.system.constraints.raw['providers'] = {'wiro': {'kind': 'wiro', 'enabled': False, 'api_key_env': 'WIRO_API_KEY', 'agents': []}}
    result = admin.get('/api/admin/overview')
    assert 'sensitive-test-value' not in result.text
    assert result.json()['providers'][0]['credentials']['key_configured'] is True
    assert admin.put('/api/admin/providers/wiro', json={'enabled': True, 'timeout_seconds': 20, 'api_key': 'secret'}).status_code == 422
    assert admin.put('/api/admin/providers/wiro', json={'enabled': True, 'timeout_seconds': 20}).json()['restart_required']
    developer.post('/api/developer/register', json={'display_name': 'Developer', 'contact_email': 'owner@example.org'})
    for url in ['http://example.org/api', 'https://127.0.0.1/api', 'https://user:secret@example.org/api']:
        assert developer.post('/api/developer/agents', json={**SUBMISSION, 'execution_url': url}).status_code == 400


def test_billing_configuration_persists_validates_and_preserves_inflight_records(tmp_path, monkeypatch):
    app, admin, _, _, _ = setup(tmp_path, monkeypatch)
    config = {'plans': [{'id': 'free', 'name': 'Free', 'price_usd': '0.00', 'credits': 20, 'period_days': 30, 'allowed_agents': ['*'], 'rollover': False}], 'topup_packages': [{'id': 'test', 'price_usd': '5.00', 'credits': 50}]}
    assert admin.put('/api/admin/billing/config', json=config).status_code == 200
    assert app.state.billing_service.plans()[0]['credits'] == 20
    assert app.state.billing_service.packages()[0]['credits'] == 50
    invalid = copy.deepcopy(config)
    invalid['plans'][0]['credits'] = -1
    assert admin.put('/api/admin/billing/config', json=invalid).status_code == 400
    assert app.state.billing_service.plans()[0]['credits'] == 20
    assert 'billing.configure' in str(app.state.system.store.read('marketplace_management', {})['audit'])


def test_volumes_revenue_costs_and_payment_investigation_are_distinct(tmp_path, monkeypatch):
    app, admin, _, _, _ = setup(tmp_path, monkeypatch)
    system = app.state.system
    job = system.post_job('Real job', 'brief', 5, client_id='near:customer', simulated=False)
    system.jobs.update(job['job_id'], payment_status='released', status='completed', fee_usd=0.1)
    system.post_job('Demo', 'brief', 5, simulated=True)
    def finance(data):
        data['orders']['sub'] = {'payment_id': 'sub', 'user_id': 'near:customer', 'purpose': 'subscription', 'status': 'paid', 'price_usd': '9.00', 'created_at': '2026-11-12T00:00:00Z'}
        data['orders']['topup'] = {'payment_id': 'topup', 'user_id': 'near:customer', 'purpose': 'topup', 'status': 'paid', 'price_usd': '5.00', 'created_at': '2026-11-12T00:00:00Z'}
    app.state.billing_service._update(finance)
    system.store.write('provider_executions', {'one': {'provider_id': 'wiro', 'status': 'succeeded', 'usage': {'totalcost': '0.25'}}, 'two': {'provider_id': 'unknown', 'usage': None}})
    data = admin.get('/api/admin/overview').json()
    assert float(data['metrics']['escrow_volume_usd']) == 5
    assert float(data['metrics']['subscription_volume_usd']) == 9
    assert float(data['metrics']['credit_purchases_usd']) == 5
    assert float(data['metrics']['platform_revenue_usd']) == 0.1
    assert data['metrics']['provider_cost_unknown_count'] == 1
    assert admin.post('/api/admin/payments/sub/review', json={'note': 'Investigating customer claim'}).status_code == 200
    assert system.store.read('credit_accounts', {})['orders']['sub']['status'] == 'paid'
    assert len(system.jobs.list()) == 2


def test_portal_pages_render_with_correct_authorization(tmp_path, monkeypatch):
    _, admin, developer, _, anon = setup(tmp_path, monkeypatch)
    assert admin.get('/admin').status_code == 200
    assert 'data-mode="admin"' in admin.get('/admin').text
    assert developer.get('/developer').status_code == 200
    assert 'data-mode="developer"' in developer.get('/developer').text
    assert anon.get('/developer').status_code == 401


def test_agent_method_restrictions_and_persistent_settings_reads(tmp_path, monkeypatch):
    app, admin, _, demo, _ = setup(tmp_path, monkeypatch)
    fields = {**AGENT, 'payment_methods': ['credits']}
    assert admin.put('/api/admin/agents/agent-oracle-1', json=fields).status_code == 200
    response = demo.post('/api/requests', json={'agent_id': 'agent-oracle-1', 'inputs': {'prompt': 'test'}, 'payment_method': 'escrow', 'idempotency_key': 'method-test'})
    assert response.status_code == 400
    assert 'payment method' in response.json()['error']
    # Cross-collection configuration reads must not deadlock JSON billing mutations.
    fields = {'plans': [{'id': 'free', 'price_usd': '0', 'credits': 20, 'period_days': 30, 'allowed_agents': ['*']}], 'topup_packages': []}
    assert admin.put('/api/admin/billing/config', json=fields).status_code == 200
    assert app.state.billing_service.plans()[0]['id'] == 'free'
