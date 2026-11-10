"""Dispute window: clients can flag a completed job within a time window."""

from __future__ import annotations

from datetime import datetime, timezone

from src.constraints import ConstraintError
from src.jobs import JobStore
from src.ledger import Ledger


def _parse(ts: str) -> datetime:
    dt = datetime.fromisoformat(ts)
    return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt


def open_dispute(
    job: dict, reason: str, jobs: JobStore, ledger: Ledger
) -> dict:
    if job["status"] != "completed":
        raise ConstraintError(
            f"job {job['job_id']} is '{job['status']}'; only completed jobs can be disputed"
        )
    window = int(job.get("dispute_window_minutes") or 0)
    if window <= 0:
        raise ConstraintError("this job has no dispute window")
    if job.get("disputed"):
        raise ConstraintError("this job is already disputed")
    completed_at = job.get("completed_at")
    if not completed_at:
        raise ConstraintError("job has no completion time recorded")
    age = (datetime.now(timezone.utc) - _parse(completed_at)).total_seconds() / 60
    if age > window:
        raise ConstraintError(
            f"dispute window closed ({age:.0f} min elapsed, window is {window} min)"
        )
    ledger.append(
        "dispute_opened",
        job_id=job["job_id"],
        details=f"client opened a dispute: {reason}",
    )
    return jobs.update(job["job_id"], disputed=True, dispute_reason=reason)


def resolve_dispute(
    job: dict, outcome: str, jobs: JobStore, ledger: Ledger
) -> dict:
    """Resolve a dispute: 'refund' returns funds, 'uphold' pays the agent."""
    if not job.get("disputed"):
        raise ConstraintError("this job has no open dispute")
    if job.get("dispute_resolved"):
        raise ConstraintError("this dispute is already resolved")
    if outcome not in ("refund", "uphold"):
        raise ConstraintError("outcome must be 'refund' or 'uphold'")
    return jobs.update(job["job_id"], dispute_resolved=True, dispute_outcome=outcome)
