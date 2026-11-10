"""NexscrowSystem: wires all components together and runs the job lifecycle."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from src.agent import WorkEngine
from src.constraints import ConstraintError, Constraints
from src.disputes import open_dispute, resolve_dispute
from src.escrow import Escrow
from src.jobs import JobStore
from src.ledger import Ledger
from src.payment import PaymentLayer
from src.reputation import agent_stats, all_agent_stats
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
        client_id: str | None = None,
        dispute_window_minutes: int | None = None,
        min_rank: float = 0.0,
        deliverables: str = "",
        deadline_hours: int | None = None,
        release_condition: str = "manual",
    ) -> dict:
        if not title or not title.strip():
            raise ConstraintError("title is required")
        self.constraints.check_reward(reward_usd)
        window = (
            self.constraints.default_dispute_window_minutes
            if dispute_window_minutes is None
            else int(dispute_window_minutes)
        )
        job = self.jobs.create(
            title,
            description,
            reward_usd,
            client,
            client_id=client_id,
            demo=self.constraints.demo_mode,
            dispute_window_minutes=window,
            min_rank=min_rank,
            deliverables=deliverables,
            deadline_hours=deadline_hours,
            release_condition=release_condition,
        )
        job["deposit_address"] = self.payment.create_deposit_address(job)
        self.jobs.update(job["job_id"], deposit_address=job["deposit_address"])
        self.ledger.append(
            "job_posted",
            job_id=job["job_id"],
            details=f"'{job['title']}' posted with ${job['reward_usd']:.2f} reward",
        )
        return job

    def approve_deposit(self, job_id: str, client_id: str | None = None) -> dict:
        """Client approves the payment: simulated lock (demo) or 1Click check (live)."""
        job = self.jobs.get(job_id)
        if job.get("client_id") and client_id and job["client_id"] != client_id:
            raise ConstraintError("only the client who posted this job can approve the deposit")
        if job["payment_status"] != "pending":
            return job
        self.ledger.append(
            "deposit_approved",
            job_id=job_id,
            details=f"client approved the ${job['reward_usd']:.2f} deposit",
        )
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
        if not self.acceptable_by_rank(job, agent_id):
            raise ConstraintError(
                f"agent '{agent_id}' rank {agent_stats(self.jobs, agent_id)['rank']}"
                f" is below this job's required rank {job['min_rank']}"
            )
        if job.get("bids") and not job.get("selected_bid"):
            raise ConstraintError(
                "this job takes bids; the client must award it first"
            )
        selected = job.get("selected_bid")
        if selected and selected["agent_id"] != agent_id:
            raise ConstraintError(
                f"the client awarded this job to {selected['agent_id']}"
            )
        minutes = self.constraints.job_timeout_minutes
        timeout_at = (
            utcnow()
            if minutes <= 0
            else (datetime.now(timezone.utc) + timedelta(minutes=minutes)).isoformat()
        )
        job = self.jobs.update(job_id, status="accepted", agent=agent_id, timeout_at=timeout_at)
        if job.get("deadline_hours"):
            due = datetime.now(timezone.utc) + timedelta(hours=float(job["deadline_hours"]))
            job = self.jobs.update(job_id, deadline_at=due.isoformat())
        self.ledger.append(
            "job_accepted",
            job_id=job_id,
            details=f"agent {agent_id} accepted '{job['title']}'",
        )
        return job

    def acceptable_by_rank(self, job: dict, agent_id: str) -> bool:
        return agent_stats(self.jobs, agent_id)["rank"] >= float(job.get("min_rank") or 0.0)

    # ----------------------------------------------------------- bidding

    def place_bid(self, job_id: str, agent_id: str, amount_usd: float) -> dict:
        """An allowlisted agent bids to deliver the job for less or equal reward."""
        self.constraints.assert_live()
        self.constraints.check_agent(agent_id)
        job = self.jobs.get(job_id)
        if job["status"] != "open":
            raise ConstraintError(f"job {job_id} is '{job['status']}', not open")
        if not self.acceptable_by_rank(job, agent_id):
            raise ConstraintError(
                f"agent '{agent_id}' rank is below this job's required rank {job['min_rank']}"
            )
        if amount_usd is None or amount_usd <= 0 or amount_usd > job["reward_usd"]:
            raise ConstraintError(
                f"bid must be > 0 and at most the posted reward (${job['reward_usd']:.2f})"
            )
        bid = {"agent_id": agent_id, "amount_usd": round(float(amount_usd), 2)}

        def mutate(jobs: dict) -> dict:
            bids = jobs[job_id].setdefault("bids", [])
            bids[:] = [b for b in bids if b["agent_id"] != agent_id] + [bid]
            return jobs[job_id]

        self.ledger.append(
            "bid_placed",
            job_id=job_id,
            details=f"agent {agent_id} bid ${bid['amount_usd']:.2f}",
        )
        return self.store.update("jobs", {}, mutate)

    def award_job(self, job_id: str, bid_agent_id: str, client_id: str | None = None) -> dict:
        """The client awards the job to one bidder; funds stay locked."""
        job = self.jobs.get(job_id)
        if job.get("client_id") and client_id and job["client_id"] != client_id:
            raise ConstraintError("only the client who posted this job can award it")
        if job["status"] != "open":
            raise ConstraintError(f"job {job_id} is '{job['status']}', not open")
        bids = job.get("bids") or []
        if not bids:
            raise ConstraintError("this job has no bids to award")
        bid = next((b for b in bids if b["agent_id"] == bid_agent_id), None)
        if not bid:
            raise ConstraintError(f"agent '{bid_agent_id}' has not bid on this job")
        self.ledger.append(
            "bid_awarded",
            job_id=job_id,
            details=f"client awarded the job to {bid_agent_id} at ${bid['amount_usd']:.2f}",
        )
        return self.jobs.update(job_id, selected_bid=bid)

    # ---------------------------------------------------------- disputes

    def dispute(self, job_id: str, reason: str, client_id: str | None = None) -> dict:
        job = self.jobs.get(job_id)
        if job.get("client_id") and client_id and job["client_id"] != client_id:
            raise ConstraintError("only the client who posted this job can dispute it")
        return open_dispute(job, reason, self.jobs, self.ledger)

    def resolve(self, job_id: str, outcome: str) -> dict:
        job = self.jobs.get(job_id)
        updated = resolve_dispute(job, outcome, self.jobs, self.ledger)
        if outcome == "refund":
            self.payment.refund(job, self.jobs, self.ledger)
            ledger_note = "dispute resolved: funds returned to the client"
        else:
            ledger_note = "dispute resolved: payout to the agent stands"
        self.ledger.append("dispute_resolved", job_id=job_id, details=ledger_note)
        return self.jobs.get(job_id)

    def reputation(self, agent_id: str | None = None) -> dict:
        if agent_id:
            return agent_stats(self.jobs, agent_id)
        return all_agent_stats(self.jobs, self.constraints.allowed_agents)

    def agent_catalog(self) -> list[dict]:
        """Marketplace view: profile + live reputation for every allowlisted agent."""
        catalog = []
        for agent_id in self.constraints.allowed_agents:
            profile = self.constraints.agent_profiles.get(agent_id, {})
            stats = agent_stats(self.jobs, agent_id)
            catalog.append(
                {
                    "agent_id": agent_id,
                    "display_name": profile.get("display_name", agent_id),
                    "tagline": profile.get("tagline", ""),
                    "description": (profile.get("description") or "").strip(),
                    "capabilities": profile.get("capabilities", []),
                    "delivers_in": profile.get("delivers_in", ""),
                    "specialization": profile.get("specialization", "General"),
                    "skills": [str(s) for s in profile.get("skills", [])],
                    "verified": bool(profile.get("verified", False)),
                    "policy": dict(profile.get("policy", {})),
                    "stats": stats,
                }
            )
        return catalog

    def recommend_agents(self, title: str, description: str = "") -> list[dict]:
        """Rank agents by keyword overlap between the brief and their skills."""
        import re

        words = set(w.lower() for w in re.findall(r"[a-z]{3,}", f"{title} {description}"))
        scored = []
        for agent in self.agent_catalog():
            corpus = " ".join(
                [agent["specialization"], agent["tagline"], *agent["skills"], *agent["capabilities"]]
            ).lower()
            hits = sorted(w for w in words if w in corpus)
            score = min(98, len(hits) * 18 + (10 if agent["verified"] else 0))
            scored.append(
                {
                    **agent,
                    "match_score": score,
                    "why_recommended": (
                        f"Matches your brief: {', '.join(hits[:4])}"
                        if hits
                        else "General-purpose; no direct skill overlap"
                    ),
                }
            )
        scored.sort(key=lambda a: (-a["match_score"], -a["stats"]["rank"]))
        return scored

    def leaderboard(self) -> list[dict]:
        """Agents ranked by verified platform history."""
        rows = [a for a in self.agent_catalog() if a["stats"]["completed"] > 0]
        rows.sort(key=lambda a: (-a["stats"]["rank"], -a["stats"]["completed"]))
        return rows

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
        if job.get("release_condition") == "manual":
            # Buyer-approval escrow: the proof verifies, but funds stay locked
            # until the client approves the delivered work.
            job = self.jobs.update(
                job_id,
                proof_hash=proof["content_hash"],
                proof_submitted_at=proof["submitted_at"],
                status="delivered",
            )
            self.ledger.append(
                "work_delivered",
                job_id=job_id,
                details=(
                    "proof verified; awaiting the client's approval before"
                    f" ${job['reward_usd']:.2f} is released"
                ),
            )
            return job
        job = self.jobs.update(
            job_id,
            proof_hash=proof["content_hash"],
            proof_submitted_at=proof["submitted_at"],
        )
        return self.escrow.release_to_agent(job, self.jobs)

    def approve_work(self, job_id: str, client_id: str | None = None) -> dict:
        """Buyer approves delivered work; escrow releases the funds."""
        self.constraints.assert_live()
        job = self.jobs.get(job_id)
        if job.get("client_id") and client_id and job["client_id"] != client_id:
            raise ConstraintError("only the client who posted this job can approve the work")
        if job["status"] != "delivered":
            raise ConstraintError(
                f"job {job_id} is '{job['status']}'; only delivered work can be approved"
            )
        self.ledger.append(
            "work_approved",
            job_id=job_id,
            details="client approved the deliverable",
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
        if job["status"] == "delivered":
            trace.append(
                {
                    "step": "proof_verified_awaiting_approval",
                    "detail": (
                        f"hash {job['proof_hash'][:16]}... verified -"
                        f" ${job['reward_usd']:.2f} stays in escrow until the"
                        " client approves the work"
                    ),
                }
            )
            return {"job": job, "trace": trace}
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
        """Full simulated cycle: post -> lock -> accept -> work -> proof ->
        (buyer approval) -> release."""
        if not self.constraints.demo_mode:
            raise ConstraintError("run_demo_cycle only works in demo_mode")
        if not self.constraints.allowed_agents:
            raise ConstraintError("no allowed agents configured")
        trace: list[dict] = []
        job = self.post_job(title, description, reward_usd, client)
        self.approve_deposit(job["job_id"], client_id="demo-client")
        job = self.jobs.get(job["job_id"])
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
        if result["job"]["status"] == "delivered":
            job = self.approve_work(result["job"]["job_id"], client_id="demo-client")
            trace.append(
                {
                    "step": "client_approved_work",
                    "detail": (
                        "client approved the deliverable -"
                        f" ${job['agent_payout_usd']:.2f} released to agent"
                        f" (${job['fee_usd']:.2f} protocol fee)"
                    ),
                }
            )
            return {"job": job, "trace": trace}
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

    def cancel_job_as(self, job_id: str, client_id: str | None = None) -> dict:
        """Cancel with an ownership check for the authenticated client."""
        job = self.jobs.get(job_id)
        if job.get("client_id") and client_id and job["client_id"] != client_id:
            raise ConstraintError("only the client who posted this job can cancel it")
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
            "delivered_jobs": [j for j in jobs if j["status"] == "delivered"],
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
