"""Persistent registry and fail-closed marketplace eligibility."""
import hashlib
import os
import math
from jsonschema import SchemaError

from .base import ProviderError, check_schema
from .custom import CustomAdapter

class AgentRegistry:
    def __init__(self, store, configuration=None, adapters=None):
        self.store = store
        self.configuration = configuration or {}
        self.adapters = adapters if adapters is not None else self._adapters()

    def _adapters(self):
        adapters = {}
        for provider_id, config in self.configuration.items():
            if not config.get("enabled"):
                continue
            key = os.environ.get(config.get("api_key_env", ""))
            if config.get("kind") == "wiro" and key:
                from .wiro import WiroAdapter
                adapters[provider_id] = WiroAdapter(key, os.environ.get(config.get("api_secret_env", "")), timeout=config.get("timeout_seconds", 20))
            elif config.get("kind") == "custom" and (key or config.get("authentication") == "none"):
                adapters[provider_id] = CustomAdapter(provider_id, config.get("agents", []), key, timeout=config.get("timeout_seconds", 20))
        return adapters

    def sync(self):
        records = {}
        failures = []
        for provider_id, config in self.configuration.items():
            adapter = self.adapters.get(provider_id)
            if adapter is None:
                if config.get("enabled"):
                    failures.append({"provider_id": provider_id, "error": "Provider is unsupported or credentials are unavailable"})
                continue
            # Operators pin models: discovery never automatically publishes new models.
            for registration in config.get("agents", []):
                upstream_id = registration["provider_agent_id"]
                internal_id = "external-" + hashlib.sha256(f"{provider_id}:{upstream_id}".encode()).hexdigest()[:20]
                try:
                    metadata = adapter.get_agent(upstream_id)
                    if metadata.get("provider_agent_id") != upstream_id:
                        raise ProviderError("Provider returned a different agent identity")
                    schema = metadata.get("input_schema", {})
                    check_schema(schema)
                    output_schema = metadata.get("output_schema", {})
                    check_schema(output_schema)
                    authorized = registration.get("commercial_authorization_status") == "approved" and bool(registration.get("commercial_authorization_reference"))
                    executable = metadata.get("execution_supported", True) and schema.get("type") == "object" and "execute" in adapter.capabilities
                    pricing = registration.get("pricing", {})
                    cap = pricing.get("max_task_usd")
                    priced = isinstance(cap, (int, float)) and not isinstance(cap, bool) and math.isfinite(cap) and cap > 0
                    listed = authorized and executable and priced and bool(registration.get("payout_account")) and registration.get("listing_status") == "active"
                    records[internal_id] = {
                        "internal_agent_id": internal_id, "provider_id": provider_id, "provider_agent_id": upstream_id,
                        "name": metadata.get("name", upstream_id), "description": metadata.get("description", ""),
                        "category": metadata.get("category", "Productivity"), "capabilities": metadata.get("capabilities", []),
                        "input_schema": schema, "output_schema": output_schema, "pricing": pricing,
                        "supported_payment_methods": (["escrow", "credits"] if isinstance(pricing.get('credit_cost'), int) and not isinstance(pricing.get('credit_cost'), bool) and pricing['credit_cost'] > 0 else ["escrow"]) if listed else [],
                        "provider_execution_cost": metadata.get("provider_execution_cost"),
                        "listing_status": "active" if listed else "disabled",
                        "commercial_authorization_status": "approved" if authorized else "unverified",
                        "commercial_authorization_reference": registration.get("commercial_authorization_reference"),
                    }
                except (ProviderError, ValueError, KeyError, TypeError, SchemaError):
                    failures.append({"provider_id": provider_id, "provider_agent_id": upstream_id, "error": "Provider metadata unavailable or invalid"})
        self.store.write("provider_registry", records)
        return {"synced": len(records), "listed": sum(r["listing_status"] == "active" for r in records.values()), "failures": failures}

    def agents(self, listed_only=True):
        if not self.adapters:
            return []
        records = self.store.read("provider_registry", {})
        return [r for r in records.values() if not listed_only or self.eligible(r)]

    def eligible(self, record):
        config = self.configuration.get(record["provider_id"], {})
        current = next((r for r in config.get("agents", []) if r.get("provider_agent_id") == record["provider_agent_id"]), {})
        return (record["listing_status"] == "active" and record["commercial_authorization_status"] == "approved"
                and record["provider_id"] in self.adapters and config.get("enabled")
                and current.get("listing_status") == "active" and current.get("commercial_authorization_status") == "approved"
                and current.get("commercial_authorization_reference") == record.get("commercial_authorization_reference")
                and bool(current.get("payout_account")) and current.get("pricing") == record.get("pricing"))

    def get(self, internal_agent_id):
        record = self.store.read("provider_registry", {}).get(internal_agent_id)
        if not record or not self.eligible(record):
            raise ProviderError("Agent is not available for execution")
        return record

    def catalog(self):
        catalog = []
        for registration in self.agents():
            public = {key: value for key, value in registration.items() if key != "commercial_authorization_reference"}
            catalog.append({
                **public,
                "agent_id": registration["internal_agent_id"],
                "display_name": registration["name"],
                "provider": registration["provider_id"],
                "specialization": registration["category"],
                "tagline": "External provider",
                "skills": registration["capabilities"],
                "verified": False,
                "delivers_in": "Varies by task",
                "policy": {"max_txn_usd": registration["pricing"]["max_task_usd"], "payout_destinations": ["escrow only"]},
                "stats": {"completed": 0, "success_rate": 0, "rank": 0, "avg_completion_minutes": None, "avg_reward_usd": None},
            })
        return catalog
