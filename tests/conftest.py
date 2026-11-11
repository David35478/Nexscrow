from __future__ import annotations

import pytest
import yaml


BASE_CONFIG = {
    "demo_mode": True,
    "kill_switch": False,
    "max_job_reward_usd": 10.0,
    "max_daily_payout_usd": 500.0,
    "allowed_agents": ["agent-oracle-1", "agent-scribe-2", "agent-quant-3"],
    "min_proof_length": 200,
    "protocol_fee_percent": 2.0,
    "job_timeout_minutes": 60,
    "work_engine": "demo",
    "intents": {"escrow_account": "yurrri.near"},
    "near_auth": {"network": "testnet", "client_id": "np8paqIpMWmNbzT4xAvOOapZBjsOpptl"},
    "agent_profiles": {
        "agent-oracle-1": {
            "display_name": "Oracle",
            "tagline": "Deep-research analyst",
            "specialization": "Research",
            "skills": ["market research", "competitor analysis", "report writing"],
            "description": "Oracle turns a one-line brief into a structured research report.",
            "capabilities": ["Structured research reports", "Market analysis", "Risk assessment"],
            "delivers_in": "~1 minute",
            "verified": True,
            "policy": {"max_txn_usd": 25.0, "payout_destinations": ["escrow only"]},
        },
        "agent-scribe-2": {
            "display_name": "Scribe",
            "tagline": "Precision technical writer",
            "specialization": "Writing",
            "skills": ["technical writing", "explainers", "documentation"],
            "description": "Scribe writes tight, well-sourced documents.",
            "capabilities": ["Technical summaries", "Editorial structuring"],
            "delivers_in": "~1 minute",
        },
        "agent-quant-3": {
            "display_name": "Quant",
            "tagline": "Data & metrics analyst",
            "specialization": "Data analysis",
            "skills": ["data analysis", "metrics", "statistics"],
            "description": "Quant digs into numbers and benchmarks.",
            "capabilities": ["Data and metrics analysis"],
            "delivers_in": "~1 minute",
        }
    },
}

__all__ = ["BASE_CONFIG", "make_config", "make_system"]


def make_config(tmp_path, **overrides) -> str:
    cfg = {**BASE_CONFIG, **overrides}
    path = tmp_path / "config.yaml"
    path.write_text(yaml.safe_dump(cfg))
    return str(path)


@pytest.fixture
def make_system(tmp_path):
    """Factory fixture: make_system(**config_overrides) -> NexscrowSystem."""

    from src.system import NexscrowSystem

    def _make(**overrides):
        data_dir = tmp_path / "data"
        data_dir.mkdir(exist_ok=True)
        config_path = make_config(tmp_path, **overrides)
        system = NexscrowSystem(config_path, data_dir=str(data_dir))
        system.config_path = config_path
        return system

    return _make
