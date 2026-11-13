"""Testnet-only network policy: no configuration may reach mainnet."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import create_app
from src import intents, near_chain, network
from src.auth import AuthError, AuthService
from src.billing import BillingService
from src.payment import PaymentError
from src.storage import JsonStore
from tests.conftest import make_config


@pytest.fixture(autouse=True)
def clean_env(monkeypatch):
    for key in ("APP_ENV", "NEAR_NETWORK", "NEAR_RPC_URL", "NEXSCROW_ESCROW_ACCOUNT", "NEXSCROW_INTENTS_MOCK"):
        monkeypatch.delenv(key, raising=False)


def test_development_defaults_to_testnet():
    current = network.status({})
    assert current["enabled"] and current["network_id"] == "testnet"
    assert current["rpc_url"] == "https://rpc.testnet.near.org"
    assert current["explorer_url"] == "https://testnet.nearblocks.io"


@pytest.mark.parametrize("requested", ["mainnet", "MAINNET", "betanet"])
def test_mainnet_and_unknown_networks_are_disabled(monkeypatch, requested):
    monkeypatch.setenv("NEAR_NETWORK", requested)
    assert network.status({})["enabled"] is False
    with pytest.raises(network.NetworkError, match="only testnet"):
        network.active({})


def test_mainnet_in_config_is_disabled():
    assert network.status({"near": {"network": "mainnet"}})["enabled"] is False


def test_production_requires_explicit_network(monkeypatch):
    monkeypatch.setenv("APP_ENV", "production")
    assert network.status({"near": {"network": "testnet"}})["enabled"] is False
    monkeypatch.setenv("NEAR_NETWORK", "testnet")
    assert network.status({})["network_id"] == "testnet"


@pytest.mark.parametrize("url", [
    "https://rpc.mainnet.near.org",
    "https://free.rpc.fastnear.com",
    "http://rpc.testnet.near.org",
])
def test_non_testnet_rpc_is_refused_before_any_request(monkeypatch, url):
    def boom(*args, **kwargs):
        raise AssertionError("network request attempted")
    monkeypatch.setattr(near_chain.httpx, "post", boom)
    with pytest.raises(network.NetworkError):
        near_chain.rpc("block", {"finality": "final"}, url)


def test_rpc_override_cannot_point_at_mainnet(monkeypatch):
    monkeypatch.setenv("NEAR_RPC_URL", "https://rpc.mainnet.near.org")
    with pytest.raises(network.NetworkError):
        network.rpc_url({})


@pytest.mark.parametrize("account", ["alice.testnet", "a" * 64, "0x" + "b" * 40])
def test_testnet_accounts_accepted(account):
    assert network.validate_account(account, "Test", network.TESTNET) == account


@pytest.mark.parametrize("account", ["alice.near", "intents.near", "near", "", "bad account.testnet"])
def test_other_network_accounts_rejected(account):
    with pytest.raises(network.NetworkError):
        network.validate_account(account, "Test", network.TESTNET)


def test_mainnet_escrow_account_blocks_live_deposits(make_system, monkeypatch):
    sys_ = make_system()
    monkeypatch.setenv("NEXSCROW_ESCROW_ACCOUNT", "yurrri.near")
    with pytest.raises(PaymentError, match="not a NEAR Testnet account"):
        sys_.post_job("Live", "", 1.0, simulated=False)


def test_prepare_deposit_reports_testnet(make_system, monkeypatch):
    sys_ = make_system()
    monkeypatch.setattr(sys_.payment, "_price", lambda: 2.0)
    job = sys_.post_job("Live", "", 1.0, simulated=False)
    prepared = sys_.payment.prepare_deposit(job, sys_.jobs)
    assert prepared["network_id"] == "testnet"
    assert prepared["rpc_url"] == "https://rpc.testnet.near.org"
    assert prepared["receiver_id"].endswith(".testnet")


def test_payout_to_mainnet_account_is_refused(make_system, monkeypatch):
    sys_ = make_system()
    job = sys_.post_job("Live", "", 3.0, simulated=False)
    sys_.jobs.update(job["job_id"], status="delivered", agent="agent-oracle-1",
                     payment_status="locked", deposit_paid_yocto=str(10**24))
    sys_.constraints.agent_profiles["agent-oracle-1"]["payout_account"] = "agent.near"
    monkeypatch.setenv("ESCROW_PRIVATE_KEY", "never-used")
    monkeypatch.setattr(near_chain, "transfer_near", lambda *a, **k: pytest.fail("transfer attempted"))
    with pytest.raises(PaymentError, match="not a NEAR Testnet account"):
        sys_.payment.release(sys_.jobs.get(job["job_id"]), sys_.jobs, sys_.ledger)


def test_wallet_login_rejects_mainnet_accounts(tmp_path):
    auth = AuthService(JsonStore(tmp_path))
    with pytest.raises(AuthError, match="Testnet"):
        auth.verify_near_login("alice.near", "ed25519:key", "sig", "nonce", "localhost")


def test_fastauth_mainnet_is_not_registered(tmp_path):
    with pytest.raises(AuthError, match="unknown NEAR Auth network"):
        AuthService(JsonStore(tmp_path)).verify_fastauth_token("token", network="mainnet")


def test_config_exposes_testnet_and_disables_production(tmp_path, monkeypatch):
    client = TestClient(create_app(config_path=make_config(tmp_path), data_dir=str(tmp_path / "data")))
    body = client.get("/api/config").json()
    assert body["network"]["network_id"] == "testnet" and body["network"]["test_tokens"] is True
    assert body["auth"]["near_network"] == "testnet"
    monkeypatch.setenv("APP_ENV", "production")
    assert client.get("/api/config").json()["network"]["enabled"] is False


def test_intents_default_adapter_never_reaches_1click(tmp_path):
    client = intents.one_click_client("key")
    assert isinstance(client, intents.TestnetUnavailableClient)
    with pytest.raises(intents.IntentsError, match="no testnet deployment"):
        client.tokens()
    assert not isinstance(BillingService(JsonStore(tmp_path)).client, intents.OneClickClient)


def test_intents_mock_is_dev_only_and_never_settles(monkeypatch):
    monkeypatch.setenv("NEXSCROW_INTENTS_MOCK", "1")
    mock = intents.one_click_client()
    assert isinstance(mock, intents.MockOneClickClient)
    assert mock.status("mock-1click-deposit.testnet")["status"] != "SUCCESS"
    monkeypatch.setenv("APP_ENV", "production")
    assert not isinstance(intents.one_click_client(), intents.MockOneClickClient)
