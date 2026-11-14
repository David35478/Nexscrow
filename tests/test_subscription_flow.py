import copy

import pytest

from src.billing import BillingError, BillingService
from src.storage import JsonStore
from tests.test_billing import CONFIG, USER, FakeOneClick

PLANS = {'starter': (1000, 5), 'pro': (5000, 15)}


@pytest.fixture
def service(tmp_path, monkeypatch):
    monkeypatch.setattr('src.billing.PostgresStore', JsonStore)
    monkeypatch.setenv('BILLING_TREASURY_ADDRESS', 'treasury.near')
    monkeypatch.setenv('BILLING_SETTLEMENT_ASSET', 'settlement')
    config = copy.deepcopy(CONFIG)
    for plan in config['plans']:
        if plan['id'] in PLANS:
            plan['credits'], plan['agent_limit'] = PLANS[plan['id']]
    client = FakeOneClick()
    tokens = client.tokens()
    tokens[0]['symbol'] = 'USDT'
    client.tokens = lambda: tokens
    return BillingService(JsonStore(tmp_path), config, client)


def test_topup_rejected_without_active_plan(service):
    with pytest.raises(BillingError, match='active plan'):
        service.quote(USER, 'topup', 'small', 'input', 'refund')
    with pytest.raises(BillingError, match='active plan'):
        service.create(USER, 'topup', 'small', 'input', 'refund', 'topup-no-plan')


def test_usdt_checkout_activates_plan_automatically_then_topup_works(service):
    order = service.create(USER, 'subscription', 'starter', 'input', 'refund', 'starter-usdt')
    assert service.status(USER, order['payment_id'])['status'] == 'pending'
    assert service.credits.snapshot(USER['user_id'])['balance'] == 0
    service.client.success(order)
    assert service.status(USER, order['payment_id'])['status'] == 'paid'
    snapshot = service.subscription(USER)
    assert snapshot['subscription']['plan'] == 'starter'
    assert snapshot['balance'] == 1000
    assert service.credits.entitlement(USER['user_id'], 'agent-any')['agent_limit'] == 5
    topup = service.create(USER, 'topup', 'small', 'input', 'refund', 'topup-after-plan')
    service.client.success(topup)
    assert service.status(USER, topup['payment_id'])['status'] == 'paid'
    assert service.credits.snapshot(USER['user_id'])['balance'] == 1250
