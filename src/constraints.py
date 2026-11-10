"""Load config.yaml and enforce all human-imposed safety constraints."""

from __future__ import annotations

from pathlib import Path

import yaml


class ConstraintError(Exception):
    """A safety rule rejected the action."""


class Constraints:
    def __init__(self, config_path: str | Path = "config.yaml"):
        path = Path(config_path)
        raw = {}
        if path.exists():
            raw = yaml.safe_load(path.read_text()) or {}
        self._raw = raw
        self.demo_mode = bool(raw.get("demo_mode", True))
        self.kill_switch = bool(raw.get("kill_switch", False))
        self.max_job_reward_usd = float(raw.get("max_job_reward_usd", 25.0))
        self.max_daily_payout_usd = float(raw.get("max_daily_payout_usd", 500.0))
        self.allowed_agents = [str(a) for a in raw.get("allowed_agents", [])]
        self.min_proof_length = int(raw.get("min_proof_length", 200))
        self.protocol_fee_percent = float(raw.get("protocol_fee_percent", 2.0))
        self.job_timeout_minutes = int(raw.get("job_timeout_minutes", 60))
        self.default_dispute_window_minutes = int(
            raw.get("default_dispute_window_minutes", 30)
        )
        self.intents = dict(raw.get("intents", {}))
        self.work_engine = str(raw.get("work_engine", "demo")).lower()
        self.near_ai = dict(raw.get("near_ai", {}))
        self.auth = dict(raw.get("auth", {}))
        self.agent_profiles = {
            str(k): dict(v)
            for k, v in (raw.get("agent_profiles", {}) or {}).items()
        }

    def public_view(self) -> dict:
        """Read-only view for the API and dashboard."""
        return {
            "demo_mode": self.demo_mode,
            "kill_switch": self.kill_switch,
            "max_job_reward_usd": self.max_job_reward_usd,
            "max_daily_payout_usd": self.max_daily_payout_usd,
            "allowed_agents": self.allowed_agents,
            "min_proof_length": self.min_proof_length,
            "protocol_fee_percent": self.protocol_fee_percent,
            "job_timeout_minutes": self.job_timeout_minutes,
            "default_dispute_window_minutes": self.default_dispute_window_minutes,
            "work_engine": self.work_engine,
        }

    def check_reward(self, reward_usd: float) -> None:
        if reward_usd is None or reward_usd <= 0:
            raise ConstraintError("reward_usd must be a positive number")
        if reward_usd > self.max_job_reward_usd:
            raise ConstraintError(
                f"reward ${reward_usd:.2f} exceeds max_job_reward_usd"
                f" (${self.max_job_reward_usd:.2f})"
            )

    def check_agent(self, agent_id: str) -> None:
        if not self.allowed_agents:
            raise ConstraintError("agent allowlist is empty; no agent may act")
        if agent_id not in self.allowed_agents:
            raise ConstraintError(f"agent '{agent_id}' is not in the allowlist")

    def assert_live(self) -> None:
        if self.kill_switch:
            raise ConstraintError("kill switch is engaged: agent activity is frozen")

    def payout_split(self, reward_usd: float) -> tuple[float, float]:
        """Return (agent_payout_usd, protocol_fee_usd)."""
        fee = round(reward_usd * self.protocol_fee_percent / 100.0, 2)
        return round(reward_usd - fee, 2), fee
