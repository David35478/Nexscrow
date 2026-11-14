"""Escrow logic: hold funds, verify proofs, release or refund."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from src.constraints import Constraints
from src.jobs import JobStore
from src.ledger import Ledger
from src.payment import PaymentLayer


class ReleaseBlocked(Exception):
    """Funds could not be released (kill switch or daily payout cap)."""


class Escrow:
    def __init__(self, constraints: Constraints, payment: PaymentLayer, ledger: Ledger):
        self.c = constraints
        self.payment = payment
        self.ledger = ledger

    def require_locked(self, job: dict) -> None:
        if job["payment_status"] not in ("locked", "release_pending"):
            raise ReleaseBlocked(
                f"job {job['job_id']} funds are '{job['payment_status']}',"
                " not locked in escrow"
            )

    def release_to_agent(self, job: dict, jobs: JobStore) -> dict:
        """Release escrowed funds to the agent, minus the protocol fee."""
        self.c.assert_live()
        if job["status"] not in ("accepted", "delivered"):
            raise ReleaseBlocked(f"job {job['job_id']} is '{job['status']}', not releasable")
        self.require_locked(job)
        released_today = self.ledger.released_today()
        if released_today + job["reward_usd"] > self.c.max_daily_payout_usd:
            self.ledger.append(
                "release_blocked",
                job_id=job["job_id"],
                details=(
                    f"daily payout cap hit: ${released_today:.2f} already released,"
                    f" cap ${self.c.max_daily_payout_usd:.2f}"
                ),
            )
            raise ReleaseBlocked("daily payout limit reached; funds stay in escrow")
        return self.payment.release(job, jobs, self.ledger)

    def schedule_release(self, job: dict, jobs: JobStore, window_minutes: int) -> dict:
        """Hold funds for the dispute window; settle_due_releases pays out later."""
        self.c.assert_live()
        if job["status"] not in ("accepted", "delivered"):
            raise ReleaseBlocked(f"job {job['job_id']} is '{job['status']}', not releasable")
        if job["payment_status"] != "locked":
            raise ReleaseBlocked(
                f"job {job['job_id']} funds are '{job['payment_status']}',"
                " not locked in escrow"
            )
        now = datetime.now(timezone.utc)
        due = now + timedelta(minutes=max(window_minutes, 0))
        self.ledger.append(
            "release_scheduled",
            job_id=job["job_id"],
            details=f"payout held for the dispute window until {due.isoformat()}",
            amount_usd=job["reward_usd"],
        )
        return jobs.update(
            job["job_id"],
            status="completed",
            payment_status="release_pending",
            completed_at=now.isoformat(),
            release_due_at=due.isoformat(),
        )

    def refund(self, job: dict, jobs: JobStore, new_status: str = "cancelled") -> dict:
        """Return escrowed funds to the client and close the job."""
        if job["payment_status"] in ("locked", "release_pending"):
            self.payment.refund(job, jobs, self.ledger)
        return jobs.update(job["job_id"], status=new_status)
