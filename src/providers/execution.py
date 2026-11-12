"""Persist upstream IDs before polling; never resubmit an ambiguous execution."""
import json
from uuid import uuid4

from .base import ProviderError
from ..storage import PostgresStore, utcnow


class ProviderPending(ProviderError):
    pass


class ProviderExecutions:
    def __init__(self, registry, require_postgres=False):
        self.registry = registry
        self.store = registry.store
        self.require_postgres = require_postgres

    def run(self, agent_id, inputs, request_key):
        if self.require_postgres and not isinstance(self.store, PostgresStore):
            raise ProviderError("Live provider execution requires PostgreSQL for durable reservations")
        agent = self.registry.get(agent_id)
        adapter = self.registry.adapters[agent["provider_id"]]
        adapter.validate_inputs(agent, inputs)
        attempt_id = uuid4().hex
        fingerprint = json.dumps({"agent": agent_id, "inputs": inputs}, sort_keys=True)

        def reserve(records):
            existing = records.get(request_key)
            if existing:
                if existing["fingerprint"] != fingerprint:
                    raise ProviderError("Execution key already used for different inputs")
                return dict(existing)
            record = {"execution_id": attempt_id, "agent_id": agent_id, "provider_id": agent["provider_id"], "provider_agent_id": agent["provider_agent_id"], "provider_execution_id": None, "status": "submitting", "fingerprint": fingerprint, "created_at": utcnow()}
            records[request_key] = record
            return dict(record)

        record = self.store.update("provider_executions", {}, reserve)
        if record["execution_id"] == attempt_id:
            try:
                outcome = adapter.execute(agent, inputs)
            except ProviderError:
                self._update(request_key, {"status": "unknown"})
                raise
            record = self._update(request_key, outcome)
        elif record["status"] in {"submitting", "unknown"}:
            raise ProviderError("Execution outcome is unknown; reconcile before retrying")
        elif record["status"] in {"pending", "running", "queued"}:
            if "status" not in adapter.capabilities:
                raise ProviderPending("Provider execution is pending")
            outcome = adapter.status(record["provider_execution_id"])
            record = self._update(request_key, outcome)
        if record["status"] in {"failed", "cancelled"}:
            raise ProviderError("Provider execution did not succeed")
        if record["status"] != "succeeded":
            raise ProviderPending("Provider execution is pending; check again without creating a new task")
        return record

    def _update(self, key, fields):
        allowed = {k: v for k, v in fields.items() if k in {"provider_execution_id", "status", "result", "usage"}}
        def update(records):
            if records[key]["status"] not in {"succeeded", "failed", "cancelled"}:
                records[key].update(allowed, updated_at=utcnow())
            return dict(records[key])
        return self.store.update("provider_executions", {}, update)
