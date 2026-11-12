from concurrent.futures import ThreadPoolExecutor
from threading import Event

from fastapi.testclient import TestClient
import pytest

from main import create_app
from src.payment import PaymentError
from tests.conftest import make_config


def test_security_headers_csrf_body_limit_and_rate_limit(tmp_path):
    app = create_app(make_config(tmp_path), data_dir=tmp_path/'data')
    c = TestClient(app)
    assert c.post('/api/auth/demo', headers={'Origin':'https://evil.example'}).status_code == 403
    assert c.post('/api/auth/demo', headers={'Sec-Fetch-Site':'cross-site'}).status_code == 403
    assert c.post('/api/auth/demo', content='x'*262145).status_code == 413
    response = c.get('/api/health')
    assert response.headers['X-Content-Type-Options'] == 'nosniff'
    assert response.headers['Cache-Control'] == 'no-store'
    assert response.headers['X-Request-ID']
    responses = [c.post('/api/auth/near/init') for _ in range(31)]
    assert responses[-1].status_code == 429


def test_production_cookie_and_canonical_origin(tmp_path, monkeypatch):
    monkeypatch.setenv('APP_ENV','production')
    monkeypatch.setenv('APP_ORIGIN','https://nexscrow.example')
    c = TestClient(create_app(make_config(tmp_path), data_dir=tmp_path/'data'), base_url='https://nexscrow.example')
    response = c.post('/api/auth/demo', headers={'Origin':'https://nexscrow.example'})
    assert 'secure' in response.headers['set-cookie'].lower()
    assert response.headers['Strict-Transport-Security']


def test_live_execution_requires_job_owner(tmp_path):
    app = create_app(make_config(tmp_path), data_dir=tmp_path/'data')
    job = app.state.system.post_job('live','brief',3,client_id='near:owner.near',simulated=False)
    c = TestClient(app)
    for suffix, body in [('accept',{'agent_id':'agent-oracle-1'}),('work',{}),('proof',{}),('agent-run',{'agent_id':'agent-oracle-1'})]:
        assert c.post(f"/api/jobs/{job['job_id']}/{suffix}",json=body).status_code == 401


def test_concurrent_release_and_refund_claim_one_transfer(make_system, monkeypatch):
    system = make_system()
    job = system.post_job('Live','brief',3,client_id='near:buyer.near',simulated=False)
    system.jobs.update(job['job_id'],status='delivered',agent='agent-oracle-1',payment_status='locked',deposit_paid_yocto=str(10**24),client_account='buyer.near')
    job = system.jobs.get(job['job_id'])
    system.constraints.agent_profiles['agent-oracle-1']['payout_account']='agent.near'
    monkeypatch.setenv('ESCROW_PRIVATE_KEY','test-signing-key-never-sent')
    entered, finish = Event(), Event()
    calls=[]
    def send(*args):
        calls.append(1); entered.set(); assert finish.wait(3); return 'confirmed-hash'
    monkeypatch.setattr(system.payment,'_send',send)
    with ThreadPoolExecutor(max_workers=2) as pool:
        first=pool.submit(system.payment.release,job,system.jobs,system.ledger)
        assert entered.wait(3)
        with pytest.raises(PaymentError,match='reserved'):
            system.payment.refund(job,system.jobs,system.ledger)
        finish.set()
        assert first.result()['payment_status']=='released'
    assert len(calls)==1


def test_ambiguous_transfer_is_never_automatically_repeated(make_system, monkeypatch):
    system=make_system()
    job=system.post_job('Live','brief',3,client_id='near:buyer.near',simulated=False)
    system.jobs.update(job['job_id'],payment_status='locked',client_account='buyer.near',deposit_paid_yocto=str(10**24))
    job=system.jobs.get(job['job_id'])
    monkeypatch.setenv('ESCROW_PRIVATE_KEY','test-key')
    def fail(*args): raise PaymentError('Unknown broadcast outcome')
    monkeypatch.setattr(system.payment,'_send',fail)
    with pytest.raises(PaymentError): system.payment.refund(job,system.jobs,system.ledger)
    with pytest.raises(PaymentError,match='reserved'): system.payment.refund(job,system.jobs,system.ledger)


def test_oauth_state_required_and_near_nonce_claim_atomic(tmp_path):
    app=create_app(make_config(tmp_path), data_dir=tmp_path/'data')
    c=TestClient(app)
    assert c.get('/api/auth/google/callback?code=attacker&state=forged').status_code==400
    auth=app.state.auth
    nonce=auth.issue_challenge()['nonce']
    def consume(_):
        from src.auth import AuthError
        try: auth.delete_challenge(nonce); return True
        except AuthError: return False
    with ThreadPoolExecutor(max_workers=4) as pool:
        assert sum(pool.map(consume,range(4)))==1


def test_dns_private_provider_destination_rejected(monkeypatch):
    from src.providers.base import ProviderAdapter, ProviderError
    monkeypatch.setattr('src.providers.base.socket.getaddrinfo',lambda *a,**k:[(2,1,6,'',('127.0.0.1',443))])
    adapter=ProviderAdapter()
    try:
        with pytest.raises(ProviderError,match='private'):
            adapter.request('POST','https://provider.example/execute',json={})
    finally: adapter.client.close()


def test_provider_terminal_outcome_cannot_be_overwritten(tmp_path):
    from src.providers.execution import ProviderExecutions
    from tests.test_providers import registry
    reg, adapter = registry(tmp_path)
    service=ProviderExecutions(reg)
    agent_id=reg.agents()[0]['internal_agent_id']
    record=service.run(agent_id,{'prompt':'success'},'request-key')
    assert record['status']=='succeeded'
    stale=service._update('request-key',{'status':'failed','result':None})
    assert stale['status']=='succeeded' and stale['result']=='success'


def test_same_job_cannot_claim_two_deposits_concurrently(make_system):
    from src.jobs import DepositReplayError
    system=make_system()
    job=system.post_job('Live','brief',3,simulated=False)
    def claim(index):
        try:
            system.jobs.claim_deposit(job['job_id'],f'tx-{index}',payment_status='locked',deposit_tx_hash=f'tx-{index}')
            return True
        except DepositReplayError: return False
    with ThreadPoolExecutor(max_workers=4) as pool:
        assert sum(pool.map(claim,range(4)))==1


def test_chunked_body_size_limit(tmp_path):
    app=create_app(make_config(tmp_path),data_dir=tmp_path/'data')
    c=TestClient(app)
    def chunks():
        yield b'x'*200000
        yield b'x'*100000
    assert c.post('/api/auth/demo',content=chunks()).status_code==413


def test_random_session_cookie_cannot_bypass_auth_rate_limit(tmp_path):
    app=create_app(make_config(tmp_path),data_dir=tmp_path/'data')
    c=TestClient(app)
    for i in range(30):
        c.cookies.set('nexscrow_session',f'forged-{i}')
        assert c.post('/api/auth/near/init').status_code==200
    c.cookies.set('nexscrow_session','another-forged-cookie')
    assert c.post('/api/auth/near/init').status_code==429
