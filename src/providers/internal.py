"""Adapter around the existing Nexscrow work engine, not a replacement."""
from .base import ProviderAdapter


class InternalAdapter(ProviderAdapter):
    provider_id = "nexscrow"
    capabilities = frozenset({"execute", "results"})

    def __init__(self, engine):
        self.engine = engine

    def execute(self, agent, inputs):
        result = self.engine.generate(inputs['job'], agent['provider_agent_id'], allow_fallback=False) if inputs.get('require_live_result') else self.engine.generate(inputs['job'], agent['provider_agent_id'])
        return {"provider_execution_id": inputs["job_id"], "status": "succeeded", "result": result, "usage": None}


def normalize_internal(agent):
    return {**agent, "internal_agent_id": agent["agent_id"], "provider_id": "nexscrow", "provider_agent_id": agent["agent_id"],
            "name": agent["display_name"], "category": agent["specialization"],
            "input_schema": {"type": "object", "properties": {"prompt": {"type": "string", "minLength": 1, "maxLength": 20000}}, "required": ["prompt"], "additionalProperties": False},
            "output_schema": {"type": "string"}, "pricing": {"max_task_usd": agent.get("policy", {}).get("max_txn_usd")},
            "supported_payment_methods": ["escrow"], "provider_execution_cost": None,
            "listing_status": "active", "commercial_authorization_status": "first_party"}
