"""NexscrowSystem: wires all components together and runs the job lifecycle."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from src.agent import WorkEngine
from src.constraints import ConstraintError, Constraints
from src.escrow import Escrow
from src.jobs import JobStore
from src.ledger import Ledger
from src.payment import PaymentLayer
from src.storage import JsonStore, utcnow


def _dt(value: str) -> datetime:
    return datetime.fromisoformat(value)


class NexscrowSystem:
    def __init__(self, config_path: str = "config.yaml", data_dir: str | None = None):
        self.constraints = Constraints(config_path)
        self.store = JsonStore(data_dir)
        self.ledger = Ledger(self.store)
        self.jobs = JobStore(self.store)
        self.payment = PaymentLayer(self.constraints)
        self.agent = WorkEngine(self.constraints)
        self.escrow = Escrow(self.constraints, self.payment, self.ledger)

    # ------------------------------------------------------------- jobs

    def post_job(
        self,
        title: str,
        description: str,
        reward_usd: float,
        client: str | None = None,
    ) -> dict:
        if not title or not title.strip():
            raise ConstraintError("title is required")
        self.constraints.check_reward(reward_usd)
        job = self.jobs.create(title, description, reward_usd, client, demo=self.constraints.demo_mode)
        job["deposit_address"] = self.payment.create_deposit_address(job)
        self.jobs.update(job["job_id"], deposit_address=job["deposit_address"])
        self.ledger.append(
            "job_posted",
            job_id=job["job_id"],
            details=f"'{job['title']}' posted with ${job['reward_usd']:.2f} reward",
        )
        if self.constraints.demo_mode:
            job = self.payment.lock_deposit(job, self.jobs, self.ledger)
        return job

    def confirm_deposit(self, job_id: str) -> dict:
        job = self.jobs.get(job_id)
        if job["payment_status"] == "locked":
            return job
        return self.payment.lock_deposit(job, self.jobs, self.ledger)

    def accept_job(self, job_id: str, agent_id: str) -> dict:
        self.constraints.assert_live()
        self.constraints.check_agent(agent_id)
        job = self.jobs.get(job_id)
        if job["status"] != "open":
            raise ConstraintError(f"job {job_id} is '{job['status']}', not open")
        if job["payment_status"] != "locked":
            raise ConstraintError(
                f"job {job_id} has no locked deposit; clients cannot hire before paying"
            )
        minutes = self.constraints.job_timeout_minutes
        timeout_at = (
            utcnow()
            if minutes <= 0
            else (datetime.now(timezone.utc) + timedelta(minutes=minutes)).isoformat()
        )
        job = self.jobs.update(job_id, status="accepted", agent=agent_id, timeout_at=timeout_at)
        self.ledger.append(
            "job_accepted",
            job_id=job_id,
            details=f"agent {agent_id} accepted '{job['title']}'",
        )
        return job

    def run_work(self, job_id: str) -> dict:
        self.constraints.assert_live()
        job = self.jobs.get(job_id)
        if job["status"] != "accepted" or not job["agent"]:
            raise ConstraintError(f"job {job_id} must be accepted by an agent first")
        self.ledger.append(
            "agent_working",
            job_id=job_id,
            details=f"agent {job['agent']} is producing the deliverable",
        )
        deliverable = self.agent.generate(job, job["agent"])
        return self.jobs.update(job_id, deliverable=deliverable)

    def submit_proof(self, job_id: str, content: str | None = None) -> dict:
        from src.proof import build_proof, verify_proof

        self.constraints.assert_live()
        job = self.jobs.get(job_id)
        if job["status"] != "accepted":
            raise ConstraintError(f"job {job_id} is '{job['status']}', not accepted")
        if not job.get("deliverable"):
            raise ConstraintError(f"job {job_id} has no deliverable; run the work first")
        text = content if content is not None else job["deliverable"]
        proof = build_proof(job_id, text)
        ok, issues = verify_proof(proof, self.constraints)
        self.ledger.append(
            "proof_submitted",
            job_id=job_id,
            details=(
                f"proof {proof['content_hash'][:16]}... submitted by {job['agent']}"
                + ("" if ok else f" - REJECTED: {'; '.join(issues)}")
            ),
        )
        if not ok:
            raise ConstraintError("proof rejected: " + "; ".join(issues))
        job = self.jobs.update(
            job_id,
            proof_hash=proof["content_hash"],
            proof_submitted_at=proof["submitted_at"],
        )
        return self.escrow.release_to_agent(job, self.jobs)

    def agent_run(self, job_id: str, agent_id: str) -> dict:
        """Agent-side flow: accept -> work -> proof -> release. Returns a trace."""
        trace: list[dict] = []
        job = self.jobs.get(job_id)
        if job["status"] == "open":
            job = self.accept_job(job_id, agent_id)
            trace.append({"step": "accepted", "detail": f"agent {agent_id} accepted the job"})
        elif job["status"] != "accepted" or job["agent"] != agent_id:
            raise ConstraintError(f"job {job_id} cannot be run by agent {agent_id}")
        job = self.run_work(job_id)
        trace.append(
            {"step": "deliverable_ready", "detail": f"{len(job['deliverable'])} chars produced"}
        )
        job = self.submit_proof(job_id)
        trace.append(
            {
                "step": "proof_verified_funds_released",
                "detail": (
                    f"hash {job['proof_hash'][:16]}... verified -"
                    f" ${job['agent_payout_usd']:.2f} released to agent"
                    f" (${job['fee_usd']:.2f} protocol fee)"
                ),
            }
        )
        return {"job": job, "trace": trace}

    def run_demo_cycle(
        self,
        title: str = "Research report on NEAR Intents adoption",
        description: str = "A short research report on how NEAR Intents are being adopted.",
        reward_usd: float = 5.0,
        client: str = "demo-client",
    ) -> dict:
        """Full simulated cycle: post -> lock -> accept -> work -> proof -> release."""
        if not self.constraints.demo_mode:
            raise ConstraintError("run_demo_cycle only works in demo_mode")
        if not self.constraints.allowed_agents:
            raise ConstraintError("no allowed agents configured")
        trace: list[dict] = []
        job = self.post_job(title, description, reward_usd, client)
        trace.append(
            {
                "step": "job_posted_and_locked",
                "detail": (
                    f"job {job['job_id']} posted - ${job['reward_usd']:.2f}"
                    f" locked to {job['deposit_address']}"
                ),
            }
        )
        result = self.agent_run(job["job_id"], self.constraints.allowed_agents[0])
        trace.extend(result["trace"])
        return {"job": result["job"], "trace": trace}

    # -------------------------------------------------------- maintenance

    def expire_jobs(self) -> list[dict]:
        """Expire accepted jobs whose timeout passed; refund locked funds."""
        expired: list[dict] = []
        now = datetime.now(timezone.utc)
        for job in self.jobs.list():
            if job["status"] != "accepted" or not job.get("timeout_at"):
                continue
            try:
                due = _dt(job["timeout_at"])
            except ValueError:
                continue
            if due.tzinfo is None:
                due = due.replace(tzinfo=timezone.utc)
            if now >= due:
                if job["payment_status"] == "locked":
                    self.payment.refund(job, self.jobs, self.ledger)
                self.jobs.update(job["job_id"], status="expired")
                self.ledger.append(
                    "job_expired",
                    job_id=job["job_id"],
                    details=(
                        f"job timed out after {self.constraints.job_timeout_minutes}"
                        " minutes; funds refunded to client"
                    ),
                )
                expired.append(self.jobs.get(job["job_id"]))
        return expired

    def cancel_job(self, job_id: str) -> dict:
        job = self.jobs.get(job_id)
        if job["status"] not in ("open", "accepted"):
            raise ConstraintError(f"job {job_id} is '{job['status']}' and cannot be cancelled")
        return self.escrow.refund(job, self.jobs, new_status="cancelled")

    def toggle_kill_switch(self, enabled: bool) -> dict:
        self.constraints.kill_switch = bool(enabled)
        self.ledger.append(
            "kill_switch_engaged" if enabled else "kill_switch_released",
            details="manual admin action",
        )
        return self.constraints.public_view()

    # -------------------------------------------------------------- views

    def board(self) -> dict:
        self.expire_jobs()
        jobs = self.jobs.list()
        completed = [j for j in jobs if j["status"] == "completed"]
        released = round(sum(j["reward_usd"] for j in completed), 2)
        fees = round(sum(j.get("fee_usd") or 0.0 for j in completed), 2)
        return {
            "jobs": jobs,
            "open_jobs": [j for j in jobs if j["status"] == "open"],
            "active_jobs": [j for j in jobs if j["status"] == "accepted"],
            "completed_jobs": completed,
            "expired_jobs": [j for j in jobs if j["status"] in ("expired", "cancelled")],
            "stats": {
                "total_jobs": len(jobs),
                "completed_jobs": len(completed),
                "total_released_usd": released,
                "total_fees_usd": fees,
                "released_today_usd": self.ledger.released_today(),
            },
        }

    def public_view(self) -> dict:
        return {
            "constraints": self.constraints.public_view(),
            "stats": self.board()["stats"],
        }
