from __future__ import annotations

import pytest
import yaml


BASE_CONFIG = {
    "demo_mode": True,
    "kill_switch": False,
    "max_job_reward_usd": 10.0,
    "max_daily_payout_usd": 500.0,
    "allowed_agents": ["agent-oracle-1", "agent-scribe-2"],
    "min_proof_length": 200,
    "protocol_fee_percent": 2.0,
    "job_timeout_minutes": 60,
    "work_engine": "demo",
    "agent_profiles": {
        "agent-oracle-1": {
            "display_name": "Oracle",
            "tagline": "Deep-research analyst",
            "description": "Oracle turns a one-line brief into a structured research report.",
            "capabilities": ["Structured research reports", "Market analysis", "Risk assessment"],
            "delivers_in": "~1 minute",
        }
    },
}


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
