"""Agent API client: config fallback, live-policy plumbing, escrow account."""

from __future__ import annotations

from src.agent_api import AgentApiClient
from tests.conftest import BASE_CONFIG


def test_client_unconfigured_falls_back():
    import os
    os.environ.pop("NEAR_INTENTS_AGENT_API_KEY", None)
    client = AgentApiClient(api_key=None)
    assert client.configured is False
    summary = client.policy_summary("agent-oracle-1", {"max_txn_usd": 25.0})
    assert summary == {"max_txn_usd": 25.0, "source": "config"}


def test_client_configured_uses_key():
    client = AgentApiClient(api_key="test-key", base_url="https://example.invalid")
    assert client.configured is True
    # unreachable host -> get_policy returns None -> config fallback
    summary = client.policy_summary("agent-oracle-1", {"max_txn_usd": 10.0})
    assert summary["source"] == "config"
    assert summary["max_txn_usd"] == 10.0


def test_escrow_account_wired(make_system):
    sys_ = make_system()
    assert sys_.constraints.escrow["account"] == "yurrri.near"
    view = sys_.public_view()
    assert view["escrow_account"] == "yurrri.near"
    # catalog policy carries its source
    oracle = next(a for a in sys_.agent_catalog() if a["agent_id"] == "agent-oracle-1")
    assert oracle["policy"]["source"] == "config"
    assert oracle["policy"]["max_txn_usd"] == 25.0


def test_quote_recipient_uses_escrow_account(make_system):
    sys_ = make_system()
    assert sys_.constraints.escrow["account"] == "yurrri.near"


def test_live_mode_refuses_release_without_real_payout(tmp_path, monkeypatch):
    from src.payment import PaymentError
    import yaml

    # The dev environment may have a real ESCROW_PRIVATE_KEY exported (.env);
    # this test asserts the refuses-without-key path, so clear it.
    monkeypatch.delenv("ESCROW_PRIVATE_KEY", raising=False)

    cfg = {
        **{k: v for k, v in BASE_CONFIG.items() if k != "demo_mode"},
        "demo_mode": False,
    }
    path = tmp_path / "config.yaml"
    path.write_text(yaml.safe_dump(cfg))
    from src.system import NexscrowSystem

    sys_ = NexscrowSystem(str(path), str(tmp_path / "data"))
    job = sys_.jobs.create(
        "Live release", "", 2.0, release_condition="auto", simulated=False
    )
    # skip the wallet-signed deposit path (needs an on-chain tx);
    # mark the deposit locked directly so we test the release guard itself
    sys_.jobs.update(job["job_id"], payment_status="locked")
    sys_.accept_job(job["job_id"], "agent-oracle-1")
    sys_.run_work(job["job_id"])
    import pytest

    with pytest.raises(PaymentError, match="ESCROW_PRIVATE_KEY"):
        sys_.submit_proof(job["job_id"])
    # funds stay locked; the ledger never claims a transfer
    stuck = sys_.jobs.get(job["job_id"])
    assert stuck["payment_status"] == "locked"
    assert not any(
        e["event_type"] == "funds_released" for e in sys_.ledger.events()
    )
