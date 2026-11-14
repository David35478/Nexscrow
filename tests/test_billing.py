import copy
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient

from main import create_app
from src.billing import BillingService, BillingError
from src.storage import JsonStore
from tests.conftest import make_config


USER = {'user_id': 'near:buyer.near', 'name': 'Buyer', 'provider': 'near'}
CONFIG = {'enabled': True, 'plans': [
    {'id': 'free', 'name': 'Free', 'price_usd': '0.00', 'credits': 20, 'period_days': 30, 'allowed_agents': ['*'], 'rollover': False},
    {'id': 'starter', 'name': 'Starter', 'price_usd': '9.00', 'credits': 500, 'period_days': 30, 'allowed_agents': ['*'], 'rollover': False},
    {'id': 'pro', 'name': 'Pro', 'price_usd': '29.00', 'credits': 2000, 'period_days': 30, 'allowed_agents': ['*'], 'rollover': False}],
    'topup_packages': [{'id': 'small', 'price_usd': '5.00', 'credits': 250}]}


class FakeOneClick:
    def __init__(self):
        self.responses = {}
        self.calls = []
        self.next_id = 0

    def tokens(self):
        now = datetime.now(timezone.utc).isoformat()
        return [{'assetId': 'input', 'decimals': 18, 'blockchain': 'eth', 'symbol': 'USDC', 'price': 1, 'priceUpdatedAt': now}, {'assetId': 'settlement', 'decimals': 6, 'blockchain': 'near', 'symbol': 'USD', 'price': 1, 'priceUpdatedAt': now}]

    def quote(self, payload):
        self.calls.append(copy.deepcopy(payload))
        self.next_id += 1
        amount = payload['amount']
        quote = {'amountIn': '1000000000000000000', 'minAmountIn': '1000000000000000000', 'amountInFormatted': '1', 'amountInUsd': '5.00', 'amountOut': amount, 'minAmountOut': amount, 'amountOutFormatted': str(int(amount) / 10**6), 'amountOutUsd': '5.00', 'timeEstimate': 60}
        if not payload['dry']:
            quote.update(depositAddress='deposit-' + str(self.next_id), deadline=payload['deadline'])
        response = {'correlationId': 'correlation-' + str(self.next_id), 'timestamp': datetime.now(timezone.utc).isoformat(), 'signature': 'signature-' + str(self.next_id), 'quoteRequest': copy.deepcopy(payload), 'quote': quote}
        if not payload['dry']:
            self.responses[quote['depositAddress']] = {'status': 'PENDING_DEPOSIT', 'correlationId': response['correlationId'], 'updatedAt': datetime.now(timezone.utc).isoformat(), 'quoteResponse': copy.deepcopy(response)}
        return response

    def status(self, address, memo=None):
        return copy.deepcopy(self.responses[address])

    def success(self, order, destination_hash=None):
        self.responses[order['deposit_address']].update(status='SUCCESS', swapDetails={'amountOut': order['expected_amount'], 'amountIn': '1000000000000000000', 'depositedAmount': '1000000000000000000', 'refundedAmount': '0', 'destinationChainTxHashes': [{'hash': destination_hash or 'tx-' + order['payment_id'], 'explorerUrl': 'https://explorer.example/tx'}], 'originChainTxHashes': [{'hash': 'origin-' + order['payment_id'], 'explorerUrl': 'https://explorer.example/origin'}]})


@pytest.fixture
def bare(tmp_path, monkeypatch):
    store = JsonStore(tmp_path / 'billing')
    monkeypatch.setattr('src.billing.PostgresStore', JsonStore)
    monkeypatch.setenv('BILLING_TREASURY_ADDRESS', 'treasury.near')
    monkeypatch.setenv('BILLING_SETTLEMENT_ASSET', 'settlement')
    return BillingService(store, copy.deepcopy(CONFIG), FakeOneClick())


@pytest.fixture
def service(bare):
    return seeded(bare)


def seeded(service, user=USER):
    # Top-ups need an active plan; seed one without granting calls.
    offer = service._offer('subscription', 'starter')
    service._update(lambda data: service._activate(data, user['user_id'], offer, 'seed', datetime.now(timezone.utc), allocate_credits=False))
    return service


def create(service, key='purchase-1', purpose='topup', offer='small'):
    return service.create(USER, purpose, offer, 'input', 'refund-on-origin', key)


def test_quote_dynamic_assets_server_price_and_disabled_gate(service):
    dry = service.quote(USER, 'topup', 'small', 'input', 'refund')
    assert dry['quote_response']['quoteRequest']['dry'] is True
    assert dry['payload']['swapType'] == 'EXACT_OUTPUT'
    assert dry['payload']['amount'] == '5000000'
    assert dry['payload']['recipient'] == 'treasury.near'
    with pytest.raises(BillingError, match='supported'):
        service.quote(USER, 'topup', 'small', 'invented-token', 'refund')
    service.config['enabled'] = False
    with pytest.raises(BillingError, match='disabled'):
        create(service)


def test_success_grants_once_atomically_no_escrow_records(service):
    order = create(service)
    assert service.credits.snapshot(USER['user_id'])['balance'] == 0
    service.client.success(order)
    with ThreadPoolExecutor(max_workers=5) as pool:
        records = list(pool.map(lambda _: service.status(USER, order['payment_id']), range(5)))
    assert {r['status'] for r in records} == {'paid'}
    snapshot = service.credits.snapshot(USER['user_id'])
    assert snapshot['balance'] == 250
    assert snapshot['topup_credits'] == 250
    assert create(service)['payment_id'] == order['payment_id']
    assert service.store.read('jobs', {}) == {}
    assert service.store.read('ledger', []) == []
    stored = service.get(USER, order['payment_id'])
    assert stored['settlement']['transaction_hashes']
    assert stored['events'][-1]['status'] == 'paid'


@pytest.mark.parametrize('upstream,local', [('PENDING_DEPOSIT','pending'), ('KNOWN_DEPOSIT_TX','deposit_detected'), ('PROCESSING','processing'), ('INCOMPLETE_DEPOSIT','underpaid'), ('FAILED','failed'), ('REFUNDED','refunded')])
def test_non_success_never_grants(service, upstream, local):
    order = create(service)
    service.client.responses[order['deposit_address']]['status'] = upstream
    assert service.status(USER, order['payment_id'])['status'] == local
    assert service.credits.snapshot(USER['user_id'])['balance'] == 0


def test_expiry_underpayment_and_unexpected_amount_are_quarantined(service):
    order = create(service)
    service.client.success(order)
    service.client.responses[order['deposit_address']]['swapDetails']['amountOut'] = '1'
    assert service.status(USER, order['payment_id'])['status'] == 'review'
    second = create(service, 'purchase-2')
    service.client.success(second)
    service.client.responses[second['deposit_address']]['swapDetails']['amountOut'] = '99999999'
    assert service.status(USER, second['payment_id'])['status'] == 'review'
    third = create(service, 'purchase-3')
    def expire(data):
        data['orders'][third['payment_id']]['quote_expires_at'] = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
    service._update(expire)
    service.client.success(third)
    assert service.status(USER, third['payment_id'])['status'] == 'review'
    assert service.credits.snapshot(USER['user_id'])['balance'] == 0


def test_expired_pending_order_and_offline_on_time_settlement(service, monkeypatch):
    order = create(service)
    def expire(data):
        data['orders'][order['payment_id']]['quote_expires_at'] = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
    service._update(expire)
    assert service.status(USER, order['payment_id'])['status'] == 'expired'
    assert service.credits.snapshot(USER['user_id'])['balance'] == 0
    on_time = create(service, 'paid-offline')
    service.client.success(on_time)
    class FutureClock(datetime):
        @classmethod
        def now(cls, tz=None):
            return datetime.now(tz) + timedelta(minutes=20)
    monkeypatch.setattr('src.billing.datetime', FutureClock)
    assert service.status(USER, on_time['payment_id'])['status'] == 'paid'


def test_settlement_hash_cannot_fund_multiple_orders(service):
    one = create(service)
    service.client.success(one, 'same-treasury-tx')
    assert service.status(USER, one['payment_id'])['status'] == 'paid'
    two = create(service, 'purchase-2')
    service.client.success(two, 'same-treasury-tx')
    assert service.status(USER, two['payment_id'])['status'] == 'review'
    assert service.credits.snapshot(USER['user_id'])['balance'] == 250


def test_owner_and_idempotency_conflict(service):
    one = create(service)
    with pytest.raises(KeyError):
        service.status({'user_id': 'other'}, one['payment_id'])
    assert service.history({'user_id': 'other'}) == []
    with pytest.raises(BillingError, match='another purchase'):
        service.create(USER, 'subscription', 'starter', 'input', 'refund-on-origin', 'purchase-1')


def test_subscription_activation_manual_renewal_upgrade_and_downgrade(bare):
    service = bare
    order = create(service, 'starter-1', 'subscription', 'starter')
    assert not service.credits.entitlement(USER['user_id'], 'agent-any')['allowed']
    service.client.success(order)
    service.status(USER, order['payment_id'])
    assert service.credits.entitlement(USER['user_id'], 'agent-any')['allowed']
    assert service.credits.snapshot(USER['user_id'])['plan_credits'] == 500
    old_end = service.store.read('credit_accounts', {})['subscriptions'][USER['user_id']]['periods'][0]['expires_at']
    renewal = create(service, 'starter-2', 'subscription', 'starter')
    service.client.success(renewal)
    service.status(USER, renewal['payment_id'])
    periods = service.store.read('credit_accounts', {})['subscriptions'][USER['user_id']]['periods']
    assert periods[-1]['start_at'] == old_end
    assert service.credits.snapshot(USER['user_id'])['available'] == 500
    with pytest.raises(BillingError, match='Prepaid future'):
        create(service, 'blocked-upgrade', 'subscription', 'pro')
    upgrade_user = {**USER, 'user_id': 'near:upgrade.near'}
    initial = service.create(upgrade_user, 'subscription', 'starter', 'input', 'refund', 'initial-starter')
    service.client.success(initial)
    service.status(upgrade_user, initial['payment_id'])
    upgrade = service.create(upgrade_user, 'subscription', 'pro', 'input', 'refund', 'pro-upgrade')
    service.client.success(upgrade)
    assert service.status(upgrade_user, upgrade['payment_id'])['status'] == 'paid'
    assert service.credits.entitlement(upgrade_user['user_id'], 'agent-any')['plan'] == 'pro'
    with pytest.raises(BillingError, match='Downgrades'):
        service.create(upgrade_user, 'subscription', 'starter', 'input', 'refund', 'downgrade')
    service.schedule_change(upgrade_user, 'starter')
    assert service.store.read('credit_accounts', {})['subscriptions'][upgrade_user['user_id']]['scheduled_change']['requires_payment']


def test_api_never_accepts_frontend_prices_and_stays_off_by_default(tmp_path):
    app = create_app(make_config(tmp_path), data_dir=tmp_path / 'api')
    client = TestClient(app)
    assert client.get('/api/billing/history').status_code == 401
    client.post('/api/auth/demo', json={'name': 'Buyer'})
    response = client.post('/api/credits/topup/create', json={'package_id': 'small', 'origin_asset': 'input', 'refund_address': 'refund', 'idempotency_key': 'test-key-1', 'credits': 999999})
    assert response.status_code == 422
    assert client.get('/api/subscription/plans').json()['enabled'] is False
    assert client.post('/api/subscription/checkout', json={'plan_id': 'starter', 'origin_asset': 'input', 'refund_address': 'refund', 'idempotency_key': 'test-key-1'}).status_code == 400


def test_free_enrollment_is_single_grant_and_expiry_keeps_topups(bare):
    service = bare
    result = service.free(USER)
    assert result['balance'] == 20
    assert service.free(USER)['balance'] == 20
    service.credits.topup(USER['user_id'], 50, 'manual-topup')
    def expire(data):
        sub = data['subscriptions'][USER['user_id']]
        for period in sub['periods']:
            period['expires_at'] = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
        for bucket in data['accounts'][USER['user_id']]['buckets']:
            if bucket['kind'] == 'plan':
                bucket['expires_at'] = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    service._update(expire)
    assert service.free(USER)['plan_credits'] == 0
    assert service.credits.snapshot(USER['user_id'])['topup_credits'] == 50
    assert not service.credits.entitlement(USER['user_id'], 'agent')['allowed']


def test_concurrent_order_creation_uses_one_deposit(service):
    with ThreadPoolExecutor(max_workers=4) as pool:
        orders = list(pool.map(lambda _: create(service), range(4)))
    assert len({o['payment_id'] for o in orders}) == 1
    assert len([c for c in service.client.calls if not c['dry']]) == 1


def test_stale_prices_and_quote_identity_block_payment_creation(service):
    original = service.client.tokens
    def stale():
        tokens = original()
        tokens[-1]['priceUpdatedAt'] = '2020-01-01T00:00:00Z'
        return tokens
    service.client.tokens = stale
    with pytest.raises(BillingError, match='stale'):
        create(service)
    assert service.credits.snapshot(USER['user_id'])['balance'] == 0


def test_subscription_rollover_policy_is_explicit(service):
    service.config['plans'][1]['rollover'] = True
    order = create(service, purpose='subscription', offer='starter')
    service.client.success(order)
    assert service.status(USER, order['payment_id'])['status'] == 'paid'
    data = service.store.read('credit_accounts', {})
    bucket = data['accounts'][USER['user_id']]['buckets'][0]
    assert bucket['expires_at'] is None


def test_refund_reported_after_success_freezes_for_review_without_silent_removal(bare):
    service = bare
    order = create(service, purpose='subscription', offer='starter')
    service.client.success(order)
    assert service.status(USER, order['payment_id'])['status'] == 'paid'
    service.client.responses[order['deposit_address']]['status'] = 'REFUNDED'
    assert service.status(USER, order['payment_id'])['status'] == 'review_after_settlement'
    assert service.credits.snapshot(USER['user_id'])['balance'] == 500
    assert not service.credits.entitlement(USER['user_id'], 'agent-any')['allowed']
    from src.credits import CreditError
    with pytest.raises(CreditError, match='reconciliation'):
        service.credits.reserve(USER['user_id'], 'agent', 'new-request', 1)


def test_free_downgrade_does_not_repeat_a_used_free_grant(bare):
    service = bare
    service.free(USER)
    upgrade = create(service, 'upgrade-after-free', 'subscription', 'starter')
    service.client.success(upgrade)
    service.status(USER, upgrade['payment_id'])
    service.schedule_change(USER, 'free')
    def expire(data):
        sub = data['subscriptions'][USER['user_id']]
        boundary = (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
        for period in sub['periods']:
            period['expires_at'] = boundary
        sub['scheduled_change']['effective_at'] = boundary
    service._update(expire)
    before = service.credits.snapshot(USER['user_id'])['balance']
    service.subscription(USER)
    assert service.credits.entitlement(USER['user_id'], 'agent')['plan'] == 'free'
    assert service.credits.snapshot(USER['user_id'])['balance'] == before
