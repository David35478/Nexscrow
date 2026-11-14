from concurrent.futures import ThreadPoolExecutor

import pytest

from src.credits import CreditError, CreditService, empty_state, expire, grant_in_state
from src.storage import JsonStore


@pytest.fixture
def credits(tmp_path):
    return CreditService(JsonStore(tmp_path))


def provision(service, user="u", balance=10, agents=None, expires=None, ref="grant"):
    return service.grant(user, balance, ref, "pro", agents or ["agent"], expires)


def test_grant_and_settlement_are_idempotent(credits):
    entry = provision(credits)
    assert provision(credits) == entry
    credits.reserve("u", "agent", "req", 7)
    assert credits.reserve("u", "agent", "req", 7)["status"] == "reserved"
    assert credits.snapshot("u")["available"] == 3
    settled = credits.settle("req", 4)
    assert credits.settle("req", 4) == settled
    assert credits.snapshot("u")["balance"] == 6
    assert len([e for e in credits.snapshot("u")["entries"] if e["kind"] == "debit"]) == 1
    with pytest.raises(CreditError):
        credits.settle("req", 5)


def test_insufficient_expired_and_agent_access(credits):
    provision(credits, balance=2)
    with pytest.raises(CreditError):
        credits.reserve("u", "agent", "too-many", 3)
    assert not credits.entitlement("u", "other")["allowed"]
    provision(credits, user="old", expires="2000-01-01T00:00:00Z", ref="old-grant")
    assert credits.entitlement("old", "agent")["allowed"] is False
    with pytest.raises(CreditError):
        credits.reserve("old", "agent", "expired", 1)


def test_release_restores_availability_and_is_idempotent(credits):
    provision(credits)
    credits.reserve("u", "agent", "req", 6)
    assert credits.release("req")["status"] == "released"
    assert credits.release("req")["status"] == "released"
    assert credits.snapshot("u")["available"] == 10
    assert not [e for e in credits.snapshot("u")["entries"] if e["kind"] == "debit"]


def test_plan_expiry_preserves_topups_and_reserved_credits(credits):
    provision(credits, balance=5, expires="2000-01-01T00:00:00Z")
    credits.topup("u", 4, "paid-order")
    # Existing expired plan balance is lazily removed before reservation.
    assert credits.snapshot("u")["balance"] == 4
    assert credits.snapshot("u")["topup_credits"] == 4

    provision(credits, user="held", balance=5, expires="2099-01-01T00:00:00Z", ref="held-grant")
    credits.reserve("held", "agent", "held-request", 3)
    state = credits.store.read("credit_accounts", empty_state())
    expire(state, "held", now=__import__("datetime").datetime(2100, 1, 1, tzinfo=__import__("datetime").timezone.utc))
    bucket = state["accounts"]["held"]["buckets"][0]
    assert bucket["remaining"] == 3
    state["reservations"]["held-request"]["status"] = "released"
    assert expire(state, "held", now=__import__("datetime").datetime(2100, 1, 1, tzinfo=__import__("datetime").timezone.utc)) == 3
    assert state["accounts"]["held"]["balance"] == 0
    assert state["entries"][-1]["kind"] == "expiration"


def test_topup_never_expires_and_grants_are_idempotent_in_state():
    state = empty_state()
    first = grant_in_state(state, "u", 7, "topup-ref", "topup")
    assert grant_in_state(state, "u", 7, "topup-ref", "topup") == first
    assert expire(state, "u", now=__import__("datetime").datetime(2100, 1, 1, tzinfo=__import__("datetime").timezone.utc)) == 0
    assert state["accounts"]["u"]["balance"] == 7
    with pytest.raises(CreditError):
        grant_in_state(state, "u", 8, "topup-ref", "topup")


def test_future_plan_grant_and_subscription_are_not_usable_early(credits):
    future = "2099-01-01T00:00:00Z"
    def schedule(data):
        grant_in_state(data, "u", 50, "future-grant", "plan", "2100-01-01T00:00:00Z", starts_at=future)
        data["subscriptions"]["u"] = {"periods": [
            {"plan": "pro", "allowed_agents": ["agent"], "start_at": future,
             "expires_at": "2100-01-01T00:00:00Z"}]}
    credits.store.update("credit_accounts", empty_state(), schedule)
    assert credits.entitlement("u", "agent")["allowed"] is False
    assert credits.snapshot("u")["balance"] == 0
    assert credits.snapshot("u")["scheduled_plan_credits"] == 50
    with pytest.raises(CreditError):
        credits.reserve("u", "agent", "too-early", 1)


def test_parallel_reservations_are_atomic(credits):
    provision(credits, balance=10)
    def reserve(i):
        try:
            credits.reserve("u", "agent", f"r{i}", 2)
            return True
        except CreditError:
            return False
    with ThreadPoolExecutor(max_workers=12) as pool:
        results = list(pool.map(reserve, range(12)))
    assert sum(results) == 5
    assert credits.snapshot("u")["available"] == 0


def test_request_id_and_grant_reference_cannot_cross_accounts(credits):
    provision(credits, user="u", ref="same")
    with pytest.raises(CreditError):
        provision(credits, user="v", ref="same")
    provision(credits, user="v", ref="other")
    credits.reserve("u", "agent", "shared-request", 2)
    with pytest.raises(CreditError):
        credits.reserve("v", "agent", "shared-request", 2)
    assert credits.snapshot("v")["available"] == 10


@pytest.mark.parametrize("amount", [0, -1, True, 1.5])
def test_grant_requires_positive_integer(credits, amount):
    with pytest.raises(CreditError):
        credits.grant("u", amount, "ref", "pro", ["*"])


def test_zero_settlement_and_missing_account(credits):
    assert credits.snapshot("missing")["balance"] == 0
    assert credits.entitlement("missing", "agent") == {
        "allowed": False, "balance": 0, "available": 0, "plan": None, "agent_limit": None, "agents_used": 0
    }
    provision(credits)
    credits.reserve("u", "agent", "zero", 2)
    credits.settle("zero", 0)
    assert credits.snapshot("u")["balance"] == 10


def test_expiration_history_is_persisted_once_on_snapshot(tmp_path):
    from src.credits import grant_in_state, empty_state
    store = JsonStore(tmp_path / 'expiry-audit')
    service = CreditService(store)
    def grant(data):
        grant_in_state(data, 'u', 25, 'expired-plan', 'plan', expires_at='2020-01-01T00:00:00Z')
    store.update('credit_accounts', empty_state(), grant)
    first = service.snapshot('u')
    second = service.snapshot('u')
    assert first['balance'] == second['balance'] == 0
    assert first['entries'] == second['entries']
    assert store.read('credit_accounts', {})['entries'] == first['entries']
