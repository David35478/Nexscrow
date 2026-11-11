"""Job board storage and the Job data model."""

from __future__ import annotations

import uuid
from typing import Any

from src.storage import JsonStore, utcnow


STATUSES = ("open", "accepted", "delivered", "completed", "expired", "cancelled")
PAYMENT_STATUSES = ("pending", "locked", "released", "refunded")


class JobNotFound(Exception):
    pass


class JobStore:
    def __init__(self, store: JsonStore):
        self._store = store
        self._name = "jobs"

    def create(
        self,
        title: str,
        description: str,
        reward_usd: float,
        client: str | None = None,
        client_id: str | None = None,
        demo: bool = True,
        min_rank: float = 0.0,
        dispute_window_minutes: int = 0,
        deliverables: str = "",
        deadline_hours: int | None = None,
        release_condition: str = "manual",
        simulated: bool = True,
    ) -> dict:
        job = {
            "job_id": uuid.uuid4().hex[:10],
            "title": title.strip(),
            "description": (description or "").strip(),
            "reward_usd": float(reward_usd),
            "status": "open",
            "client": client or "anonymous",
            "client_id": client_id,
            "client_account": None,
            "deposit_expected_yocto": None,
            "deposit_paid_yocto": None,
            "deposit_tx_hash": None,
            "payout_tx_hash": None,
            "refund_tx_hash": None,
            "agent": None,
            "deposit_address": None,
            "payment_status": "pending",
            "proof_hash": None,
            "proof_submitted_at": None,
            "deliverable": None,
            "fee_usd": None,
            "agent_payout_usd": None,
            "timeout_at": None,
            "demo": bool(demo),
            "simulated": bool(simulated),
            "min_rank": float(min_rank),
            "dispute_window_minutes": int(dispute_window_minutes),
            "disputed": False,
            "dispute_reason": None,
            "dispute_resolved": False,
            "bids": [],
            "selected_bid": None,
            "deliverables": (deliverables or "").strip(),
            "deadline_hours": deadline_hours,
            "deadline_at": None,
            "release_condition": release_condition if release_condition in ("manual", "auto") else "manual",
            "created_at": utcnow(),
            "completed_at": None,
        }

        def mutate(jobs: dict) -> dict:
            jobs[job["job_id"]] = job
            return job

        return self._store.update(self._name, {}, mutate)

    def get(self, job_id: str) -> dict:
        def mutate(jobs: dict) -> dict:
            if job_id not in jobs:
                raise JobNotFound(job_id)
            return jobs[job_id]

        job: Any = self._store.update(self._name, {}, mutate)
        return job

    def list(self) -> list[dict]:
        jobs: Any = self._store.read(self._name, {})
        return sorted(jobs.values(), key=lambda j: j.get("created_at", ""), reverse=True)

    def update(self, job_id: str, **fields: Any) -> dict:
        if "status" in fields and fields["status"] not in STATUSES:
            raise ValueError(f"invalid status: {fields['status']}")
        if "payment_status" in fields and fields["payment_status"] not in PAYMENT_STATUSES:
            raise ValueError(f"invalid payment_status: {fields['payment_status']}")

        def mutate(jobs: dict) -> dict:
            if job_id not in jobs:
                raise JobNotFound(job_id)
            jobs[job_id].update(fields)
            return jobs[job_id]

        return self._store.update(self._name, {}, mutate)
