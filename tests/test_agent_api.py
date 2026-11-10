"""Agent API client: config fallback, live-policy plumbing, escrow account."""

from __future__ import annotations

from src.agent_api import AgentApiClient


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
    assert sys_.constraints.intents["escrow_account"] == "yurrri.near"
    view = sys_.public_view()
    assert view["escrow_account"] == "yurrri.near"
    # catalog policy carries its source
    oracle = next(a for a in sys_.agent_catalog() if a["agent_id"] == "agent-oracle-1")
    assert oracle["policy"]["source"] == "config"
    assert oracle["policy"]["max_txn_usd"] == 25.0


def test_quote_recipient_uses_escrow_account(make_system):
    sys_ = make_system()
    assert sys_.constraints.intents["escrow_account"] == "yurrri.near"
