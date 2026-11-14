import copy

import pytest

from src.billing import BillingError, BillingService
from src.credits import CreditError, CreditService
from src.storage import JsonStore
from tests.test_billing import CONFIG, USER, FakeOneClick


@pytest.fixture
def credits(tmp_path):
    return CreditService(JsonStore(tmp_path))


def grant(service, limit, balance=100):
    service.grant("u", balance, "g", "starter", ["*"], None, limit)


def test_agent_limit_blocks_extra_agent_but_allows_reuse(credits):
    grant(credits, 5)
    for i in range(5):
        credits.reserve("u", f"a{i}", f"r{i}", 1)
    with pytest.raises(CreditError, match="5 different agents"):
        credits.reserve("u", "a5", "r5", 1)
    credits.reserve("u", "a0", "r-again", 1)


def test_null_limit_is_unlimited(credits):
    grant(credits, None)
    for i in range(20):
        credits.reserve("u", f"a{i}", f"r{i}", 1)
    assert credits.entitlement("u", "new")["agent_limit"] is None


def test_entitlement_reports_limit(credits):
    grant(credits, 1)
    credits.reserve("u", "a0", "r0", 1)
    ent = credits.entitlement("u", "a1")
    assert (ent["agent_limit"], ent["agents_used"], ent["allowed"]) == (1, 1, False)
    assert credits.entitlement("u", "a0")["allowed"] is True


@pytest.mark.parametrize("bad", [0, -1, "5", True, 1.5])
def test_plan_validation_rejects_bad_agent_limit(tmp_path, bad):
    config = copy.deepcopy(CONFIG)
    config["plans"][0]["agent_limit"] = bad
    with pytest.raises(BillingError):
        BillingService(JsonStore(tmp_path), config, FakeOneClick()).plans()


def test_origin_asset_must_be_usdc_or_usdt(tmp_path, monkeypatch):
    monkeypatch.setattr("src.billing.PostgresStore", JsonStore)
    monkeypatch.setenv("BILLING_TREASURY_ADDRESS", "treasury.near")
    monkeypatch.setenv("BILLING_SETTLEMENT_ASSET", "settlement")
    client = FakeOneClick()
    service = BillingService(JsonStore(tmp_path), copy.deepcopy(CONFIG), client)
    tokens = client.tokens()
    tokens[0]["symbol"] = "ETH"
    client.tokens = lambda: tokens
    assert [t["symbol"] for t in service.assets()] == []
    with pytest.raises(BillingError, match="USDC or USDT"):
        service.create(USER, "topup", "small", "input", "refund", "purchase-1")
