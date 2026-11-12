from datetime import datetime, timedelta, timezone
from concurrent.futures import ThreadPoolExecutor

import pytest
from fastapi.testclient import TestClient

from main import create_app
from src.requests import RequestService, RequestError
from src.providers.base import ProviderError
from src.providers.execution import ProviderPending
from tests.conftest import make_config


USER = {'user_id': 'demo:owner', 'name': 'Owner', 'provider': 'demo'}


def setup(tmp_path):
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'data')
    return app.state.system, app.state.requests_service


def task(service, key='request-key-1'):
    return service.create(USER, 'agent-oracle-1', {'prompt': 'Research NEAR adoption'}, 'escrow', key)


def test_escrow_funding_result_and_manual_release(tmp_path):
    system, service = setup(tmp_path)
    request = task(service)
    assert request['status'] == 'awaiting_funding'
    assert request['pricing']['task_price_usd'] == 10
    assert service.advance(USER, request['request_id'])['status'] == 'awaiting_funding'
    system.approve_deposit(request['job_id'], USER['user_id'])
    result = service.advance(USER, request['request_id'])
    assert result['status'] == 'delivered'
    assert len(result['result']) > 200
    assert result['usage']['credits_charged'] == 0
    assert system.jobs.get(request['job_id'])['payment_status'] == 'locked'
    system.agent.generate = lambda *args: pytest.fail('must not rerun delivered work')
    assert service.advance(USER, request['request_id'])['result'] == result['result']


def test_creation_idempotency_and_ownership(tmp_path):
    system, service = setup(tmp_path)
    with ThreadPoolExecutor(max_workers=4) as pool:
        requests = list(pool.map(lambda _: task(service), range(4)))
    assert len({r['request_id'] for r in requests}) == 1
    assert len(system.jobs.list()) == 1
    with pytest.raises(RequestError, match='different inputs'):
        service.create(USER, 'agent-oracle-1', {'prompt': 'different'}, 'escrow', 'request-key-1')
    with pytest.raises(KeyError):
        service.get({'user_id': 'other'}, requests[0]['request_id'])
    assert service.history({'user_id': 'other'}) == []


def test_api_validation_prices_and_history(tmp_path):
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'data')
    client = TestClient(app)
    assert client.get('/api/requests').status_code == 401
    client.post('/api/auth/demo', json={'name': 'Owner'})
    options = client.get('/api/requests/options/agent-oracle-1').json()
    assert options['credit_cost'] is None
    payload = {'agent_id': 'agent-oracle-1', 'inputs': {'prompt': 'test'}, 'payment_method': 'escrow', 'idempotency_key': 'browser-key-1'}
    assert client.post('/api/requests', json={**payload, 'price': 0.01}).status_code == 422
    assert client.post('/api/requests', json={**payload, 'inputs': {'prompt': 12}}).status_code == 400
    response = client.post('/api/requests', json=payload)
    assert response.status_code == 200
    request = response.json()
    assert client.get('/api/requests').json()['requests'][0]['request_id'] == request['request_id']
    other = TestClient(app)
    other.post('/api/auth/demo', json={'name': 'Other'})
    assert other.get('/api/requests/' + request['request_id']).status_code == 404
    assert other.post('/api/requests/' + request['request_id'] + '/advance').status_code == 404


def credit_fixture(tmp_path, monkeypatch):
    system, service = setup(tmp_path)
    user = {'user_id': 'near:owner.near', 'name': 'Owner', 'provider': 'near'}
    system.constraints.agent_profiles['agent-oracle-1']['credit_cost'] = 5
    service.credits.grant(user['user_id'], 20, 'test-grant', 'pro', ['agent-oracle-1'], (datetime.now(timezone.utc) + timedelta(days=1)).isoformat())
    # Integration tests exercise the state machine on the test store, not paid live traffic.
    monkeypatch.setattr('src.requests.PostgresStore', type(system.store))
    monkeypatch.setenv('NEAR_AI_API_KEY', 'test-only')
    system.agent.generate = lambda *args, **kwargs: 'Confirmed result'
    return system, service, user


def test_credit_success_separate_from_escrow(tmp_path, monkeypatch):
    system, service, user = credit_fixture(tmp_path, monkeypatch)
    request = service.create(user, 'agent-oracle-1', {'prompt': 'hello'}, 'credits', 'credits-key-1')
    assert request['job_id'] is None
    assert system.jobs.list() == []
    assert service.credits.snapshot(user['user_id'])['available'] == 15
    result = service.advance(user, request['request_id'])
    assert result['status'] == 'completed'
    assert result['usage']['credits_charged'] == 5
    assert service.credits.snapshot(user['user_id'])['balance'] == 15
    service.advance(user, request['request_id'])
    assert service.credits.snapshot(user['user_id'])['balance'] == 15


def test_credit_failure_release_and_ambiguous_retention(tmp_path, monkeypatch):
    system, service, user = credit_fixture(tmp_path, monkeypatch)
    first = service.create(user, 'agent-oracle-1', {'prompt': 'hello'}, 'credits', 'credits-key-1')
    def failure(*args, **kwargs):
        raise ProviderError('Verified failure')
    system.agent.generate = failure
    assert service.advance(user, first['request_id'])['status'] == 'failed'
    assert service.credits.snapshot(user['user_id'])['available'] == 20
    second = service.create(user, 'agent-oracle-1', {'prompt': 'hello'}, 'credits', 'credits-key-2')
    def interrupted(*args, **kwargs):
        raise RuntimeError('private provider internals')
    system.agent.generate = interrupted
    result = service.advance(user, second['request_id'])
    assert result['status'] == 'unknown'
    assert 'private' not in result['error']
    assert service.credits.snapshot(user['user_id'])['available'] == 15


def test_settlement_recovery_does_not_rerun(tmp_path, monkeypatch):
    system, service, user = credit_fixture(tmp_path, monkeypatch)
    request = service.create(user, 'agent-oracle-1', {'prompt': 'hello'}, 'credits', 'credits-key-1')
    original = service.credits.settle
    from src.credits import CreditError
    def unavailable(*args):
        raise CreditError('temporarily unavailable')
    service.credits.settle = unavailable
    assert service.advance(user, request['request_id'])['status'] == 'settling'
    system.agent.generate = lambda *args: pytest.fail('must not execute again')
    service.credits.settle = original
    assert service.advance(user, request['request_id'])['status'] == 'completed'
    assert service.credits.snapshot(user['user_id'])['balance'] == 15


def test_execution_lease_and_deadline_prevent_unsafe_retry(tmp_path):
    system, service = setup(tmp_path)
    request = task(service)
    system.approve_deposit(request['job_id'], USER['user_id'])
    service.update(request['request_id'], status='running', lease={'token': 'interrupted', 'until': (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()})
    assert service.advance(USER, request['request_id'])['status'] == 'unknown'
    system.agent.generate = lambda *args: pytest.fail('must not retry ambiguous execution')
    assert service.advance(USER, request['request_id'])['status'] == 'unknown'


def test_credit_result_never_uses_template_fallback(tmp_path, monkeypatch):
    from src.agent import WorkEngine
    from src.providers.base import ProviderError
    system, _ = setup(tmp_path)
    system.constraints.work_engine = 'near_ai'
    monkeypatch.delenv('NEAR_AI_API_KEY', raising=False)
    with pytest.raises(ProviderError, match='not configured'):
        WorkEngine(system.constraints).generate({'job_id': 'x', 'title': 'x', 'description': 'x', 'reward_usd': 1}, 'agent-oracle-1', allow_fallback=False)


def test_workspace_and_history_pages_render(tmp_path):
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'data')
    client = TestClient(app)
    for path in ['/workspace?agent=agent-oracle-1', '/requests']:
        response = client.get(path)
        assert response.status_code == 200
        assert 'request-workspace' in response.text
        assert 'request-history' in response.text or 'Request history' in response.text


def test_concurrent_advance_does_not_execute_twice(tmp_path):
    from threading import Event
    system, service = setup(tmp_path)
    request = task(service)
    system.approve_deposit(request['job_id'], USER['user_id'])
    started, finish = Event(), Event()
    original = system.agent.generate
    calls = []
    def slow(*args, **kwargs):
        calls.append(1)
        started.set()
        assert finish.wait(3)
        return original(*args, **kwargs)
    system.agent.generate = slow
    with ThreadPoolExecutor(max_workers=2) as pool:
        first = pool.submit(service.advance, USER, request['request_id'])
        assert started.wait(3)
        second = pool.submit(service.advance, USER, request['request_id']).result()
        assert second['status'] == 'running'
        finish.set()
        assert first.result()['status'] == 'delivered'
    assert len(calls) == 1


def test_request_approval_is_claimed_once(tmp_path):
    system, service = setup(tmp_path)
    request = task(service)
    system.approve_deposit(request['job_id'], USER['user_id'])
    service.advance(USER, request['request_id'])
    calls = []
    original = system.approve_work
    def approve(*args):
        calls.append(1)
        return original(*args)
    system.approve_work = approve
    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(lambda _: service.approve(USER, request['request_id']), range(3)))
    assert len(calls) == 1
    assert service.get(USER, request['request_id'])['status'] == 'completed'
