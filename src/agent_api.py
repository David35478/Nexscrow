"""NEAR Intents Agent API client (experimental mainnet beta).

Reads live agent policies when NEAR_INTENTS_AGENT_API_KEY is configured;
otherwise callers fall back to the config.yaml agent_profiles policies.
The key only lets us read agent state and create agents — policy changes
need the owner's wallet signature and payouts need a grant token, so the
key alone can never move funds.
"""

from __future__ import annotations

import os

import httpx


class AgentApiClient:
    def __init__(self, base_url: str | None = None, api_key: str | None = None):
        self.base_url = (base_url or "https://api.agentsonintents.com").rstrip("/")
        self.api_key = api_key or os.environ.get("NEAR_INTENTS_AGENT_API_KEY") or None

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def _headers(self) -> dict:
        if not self.api_key:
            raise RuntimeError("NEAR_INTENTS_AGENT_API_KEY is not configured")
        return {"X-API-Key": self.api_key, "Content-Type": "application/json"}

    def _get(self, path: str, timeout: float = 10.0):
        resp = httpx.get(f"{self.base_url}{path}", headers=self._headers(), timeout=timeout)
        resp.raise_for_status()
        return resp.json()

    def list_tokens(self) -> dict:
        resp = httpx.get(f"{self.base_url}/v1/tokens", timeout=10)
        resp.raise_for_status()
        return resp.json()

    def get_agent(self, agent_id: str) -> dict | None:
        try:
            return self._get(f"/v1/agents/{agent_id}")
        except httpx.HTTPError:
            return None

    def get_policy(self, agent_id: str) -> dict | None:
        """Live policy: actions, limits, destinations, budget, freeze state."""
        try:
            data = self._get(f"/v1/agents/{agent_id}/policy")
            return {
                "revision": data.get("revision"),
                "status": data.get("status"),
                "provider_policy_synced": data.get("provider_policy_synced"),
                "policy": data.get("policy"),
                "source": "agent-api",
            }
        except httpx.HTTPError:
            return None

    def policy_summary(self, agent_id: str, fallback: dict) -> dict:
        """Live policy when available, else the config-declared policy."""
        if not self.configured:
            return {**fallback, "source": "config"}
        live = self.get_policy(agent_id)
        if not live or not live.get("policy"):
            return {**fallback, "source": "config"}
        p = live["policy"]
        return {
            "source": "agent-api",
            "revision": live.get("revision"),
            "status": live.get("status"),
            "frozen": p.get("frozen"),
            "actions": p.get("actions"),
            "budget": p.get("budget"),
            "limits": p.get("limits"),
            "destinations": p.get("destinations"),
            "timelock_ms": p.get("timelock_ms"),
            "max_actions_per_hour": p.get("max_actions_per_hour"),
        }
