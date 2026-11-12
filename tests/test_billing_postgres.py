"""Opt-in real transaction proof; every test uses a fresh isolated schema."""
import copy
import os
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4

import pytest
import psycopg
from psycopg import sql
from psycopg.conninfo import make_conninfo

from src.billing import BillingService
from src.credits import CreditService, CreditError
from src.storage import PostgresStore
from tests.test_billing import CONFIG, FakeOneClick, USER


@pytest.fixture
def postgres_store():
    dsn = os.environ.get('TEST_DATABASE_URL')
    if not dsn:
        pytest.skip('Set TEST_DATABASE_URL to run isolated PostgreSQL integration tests')
    schema = 'nexscrow_test_' + uuid4().hex
    with psycopg.connect(dsn, autocommit=True) as conn:
        conn.execute(sql.SQL('CREATE SCHEMA {}').format(sql.Identifier(schema)))
    try:
        yield PostgresStore(make_conninfo(dsn, options=f'-c search_path={schema}'))
    finally:
        with psycopg.connect(dsn, autocommit=True) as conn:
            conn.execute(sql.SQL('DROP SCHEMA {} CASCADE').format(sql.Identifier(schema)))


def test_postgres_concurrent_first_grants_and_reservations(postgres_store):
    credits = CreditService(postgres_store)
    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(lambda _: credits.grant('buyer', 100, 'same-payment', 'pro', ['*']), range(8)))
    assert credits.snapshot('buyer')['balance'] == 100
    def reserve(index):
        try:
            credits.reserve('buyer', 'agent', 'request-' + str(index), 30)
            return True
        except CreditError:
            return False
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(reserve, range(8)))
    assert sum(results) == 3
    assert credits.snapshot('buyer')['available'] == 10


def test_postgres_settlement_and_grant_commit_once(postgres_store, monkeypatch):
    monkeypatch.setenv('BILLING_TREASURY_ADDRESS', 'treasury.near')
    monkeypatch.setenv('BILLING_SETTLEMENT_ASSET', 'settlement')
    service = BillingService(postgres_store, copy.deepcopy(CONFIG), FakeOneClick())
    order = service.create(USER, 'topup', 'small', 'input', 'refund-on-origin', 'postgres-order')
    service.client.success(order)
    with ThreadPoolExecutor(max_workers=8) as pool:
        outcomes = list(pool.map(lambda _: service.status(USER, order['payment_id']), range(8)))
    assert {o['status'] for o in outcomes} == {'paid'}
    assert service.credits.snapshot(USER['user_id'])['topup_credits'] == 250
    assert len(postgres_store.read('credit_accounts', {})['settlements']) == 1
    assert postgres_store.read('jobs', {}) == {}


def test_postgres_failed_mutation_rolls_back(postgres_store):
    from src.credits import grant_in_state, empty_state
    def broken(data):
        grant_in_state(data, 'buyer', 50, 'rollback', 'topup')
        raise RuntimeError('simulate failure before transaction commit')
    with pytest.raises(RuntimeError):
        postgres_store.update('credit_accounts', empty_state(), broken)
    assert CreditService(postgres_store).snapshot('buyer')['balance'] == 0
    assert not postgres_store.read('credit_accounts', {})['entries']
