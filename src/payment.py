"""Payment layer: NEAR Intents 1Click deposits (real) or simulated escrow (demo)."""

from __future__ import annotations

import os

import httpx

from src.constraints import Constraints
from src.jobs import JobStore
from src.ledger import Ledger
from src.storage import utcnow


class PaymentError(Exception):
    pass


class PaymentLayer:
    def __init__(self, constraints: Constraints):
        self.c = constraints
        self.demo = constraints.demo_mode

    def _simulated(self, job: dict) -> bool:
        """Per-job simulation: demo-session jobs are simulated; real jobs use
        live escrow. Falls back to the global flag for legacy jobs."""
        if "simulated" in job:
            return bool(job["simulated"])
        return bool(job.get("demo", self.demo))

    def _api_key(self) -> str | None:
        return os.environ.get("INTENTS_API_KEY") or None

    def _base_url(self) -> str:
        return str(self.c.intents.get("api_url", "https://1click.chaindefuser.com")).rstrip("/")

    def create_deposit_address(self, job: dict) -> str:
        """Return the address the client pays to lock the reward."""
        if self._simulated(job):
            return f"nexscrow.escrow.job.{job['job_id']}@intents-demo"
        key = self._api_key()
        if not key:
            raise PaymentError(
                "real payments need INTENTS_API_KEY (1Click partner key);"
                " enable demo_mode in config.yaml for the simulated flow"
            )
        payload = {
            "type": "EXACT_INPUT",
            "swapType": "ORIGIN_CHAIN",
            "assetIn": str(self.c.intents.get("settle_asset_id", "usdc.eth")),
            "assetOut": str(self.c.intents.get("settle_asset_id", "nusdc.token.a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")),
            "amountIn": str(int(job["reward_usd"] * 10**6)),
            "recipient": self.c.intents.get("escrow_account", "nexscrow.escrow.near"),
            "deadline": self.c.intents.get("quote_deadline_seconds", 3600),
        }
        try:
            resp = httpx.post(
                self._base_url() + str(self.c.intents.get("quote_path", "/v0/quote")),
                json=payload,
                headers={"X-API-Key": key},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
        except httpx.HTTPError as exc:
            raise PaymentError(f"1Click quote request failed: {exc}") from exc
        address = data.get("depositAddress") or (data.get("quote") or {}).get("depositAddress")
        if not address:
            raise PaymentError("1Click quote returned no depositAddress")
        return address

    def lock_deposit(self, job: dict, jobs: JobStore, ledger: Ledger) -> dict:
        """Mark the reward as locked in escrow."""
        if self._simulated(job):
            updated = jobs.update(job["job_id"], payment_status="locked")
            ledger.append(
                "deposit_locked",
                job_id=job["job_id"],
                details=f"${job['reward_usd']:.2f} locked in escrow (simulated NEAR Intents deposit)",
                amount_usd=job["reward_usd"],
            )
            return updated
        # Real mode: the 1Click quote is polled until the deposit lands.
        key = self._api_key()
        if not key:
            raise PaymentError("cannot confirm a real deposit without INTENTS_API_KEY")
        try:
            resp = httpx.get(
                f"{self._base_url()}/v0/status",
                params={"quoteId": job["deposit_address"]},
                headers={"X-API-Key": key},
                timeout=15,
            )
            resp.raise_for_status()
            status = str(resp.json().get("status", "")).lower()
        except httpx.HTTPError as exc:
            raise PaymentError(f"1Click status check failed: {exc}") from exc
        if status not in ("completed", "executed", "deposit_seen"):
            raise PaymentError(f"deposit not confirmed yet (status: {status or 'unknown'})")
        updated = jobs.update(job["job_id"], payment_status="locked")
        ledger.append("deposit_locked", job_id=job["job_id"], amount_usd=job["reward_usd"])
        return updated

    def release(self, job: dict, jobs: JobStore, ledger: Ledger) -> dict:
        """Pay the agent and collect the protocol fee."""
        if not self._simulated(job):
            # Live-mode payouts require the Intents SDK transfer path, which
            # is not wired yet. Never pretend money moved: refuse instead.
            raise PaymentError(
                "live on-chain payouts are not enabled yet; use demo_mode"
                " or wire the Intents SDK payout path"
            )
        payout, fee = self.c.payout_split(job["reward_usd"])
        mode = "simulated"
        ledger.append(
            "funds_released",
            job_id=job["job_id"],
            details=f"${payout:.2f} paid to agent {job['agent']} ({mode})",
            amount_usd=job["reward_usd"],
        )
        if fee > 0:
            ledger.append(
                "protocol_fee_collected",
                job_id=job["job_id"],
                details=f"protocol fee ${fee:.2f}",
                amount_usd=fee,
            )
        return jobs.update(
            job["job_id"],
            status="completed",
            payment_status="released",
            agent_payout_usd=payout,
            fee_usd=fee,
            completed_at=utcnow(),
        )

    def refund(self, job: dict, jobs: JobStore, ledger: Ledger) -> dict:
        """Return locked funds to the client."""
        if not self._simulated(job):
            # Same as release: never record a transfer that did not happen.
            raise PaymentError(
                "live on-chain refunds are not enabled yet; use demo_mode"
                " or wire the Intents SDK refund path"
            )
        mode = "simulated"
        ledger.append(
            "funds_refunded",
            job_id=job["job_id"],
            details=f"${job['reward_usd']:.2f} returned to client ({mode})",
            amount_usd=job["reward_usd"],
        )
        return jobs.update(job["job_id"], payment_status="refunded")
