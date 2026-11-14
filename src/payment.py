"""Payment layer: real NEAR escrow transfers, or simulated escrow for demos.

Live path (docs.near.org):
- Deposit: the client signs a NEAR Transfer to the escrow account in their
  own wallet; `confirm_deposit` verifies the transaction on-chain via RPC.
- Release/refund: the escrow account signs a Transfer with its access key
  (ESCROW_PRIVATE_KEY env) and broadcasts it. Without the key the platform
  refuses rather than pretending money moved.
"""

from __future__ import annotations

import os

from src.constraints import Constraints
from src.jobs import DepositReplayError, JobStore
from src.ledger import Ledger
from src import near_chain, network
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

    def _network(self) -> network.NearNetwork:
        try:
            return network.active(self.c.raw)
        except network.NetworkError as exc:
            raise PaymentError(str(exc)) from exc

    def _account(self, account_id: str | None, role: str) -> str:
        try:
            return network.validate_account(account_id, role, self._network())
        except network.NetworkError as exc:
            raise PaymentError(f"{exc}; funds stay in escrow") from exc

    def escrow_account(self) -> str:
        account = (
            os.environ.get("NEXSCROW_ESCROW_ACCOUNT")
            or self.c.escrow.get("account")
            or self.c.intents.get("escrow_account")
        )
        if not account:
            raise PaymentError("escrow account is not configured (set NEXSCROW_ESCROW_ACCOUNT)")
        return self._account(str(account), "Escrow")

    def _rpc_url(self) -> str:
        try:
            return network.rpc_url(self.c.raw)
        except network.NetworkError as exc:
            raise PaymentError(str(exc)) from exc

    def payout_account(self, agent_id: str | None) -> str | None:
        profile = self.c.agent_profiles.get(agent_id or "", {})
        return profile.get("payout_account") or os.environ.get("NEXSCROW_AGENT_PAYOUT_ACCOUNT") or None

    def _escrow_key(self) -> str | None:
        return os.environ.get("ESCROW_PRIVATE_KEY") or None

    def _price(self) -> float:
        return near_chain.near_usd_price(
            str(
                self.c.escrow.get(
                    "price_url", "https://api.coingecko.com/api/v3/simple/price"
                )
            ),
            int(self.c.escrow.get("price_ttl_seconds", 60)),
        )

    def create_deposit_address(self, job: dict) -> str:
        """Where the client pays to lock the reward.

        Simulated jobs get a labeled placeholder. Live jobs pay the real
        escrow account directly — the wallet signs the transfer itself.
        """
        if self._simulated(job):
            return f"nexscrow.escrow.job.{job['job_id']}@intents-demo"
        return self.escrow_account()

    def prepare_deposit(self, job: dict, jobs: JobStore) -> dict:
        """Compute the exact NEAR amount the client's wallet should sign."""
        if self._simulated(job):
            raise PaymentError("simulated jobs use deposit/approve, not a wallet deposit")
        if job["payment_status"] != "pending":
            raise PaymentError(f"job {job['job_id']} deposit is already '{job['payment_status']}'")
        price = self._price()
        # Reuse the stored quote: a client may have already signed at it, so
        # re-pricing after NEAR moves would strand a valid transfer.
        stored = job.get("deposit_expected_yocto")
        amount_yocto = int(stored) if stored else near_chain.usd_to_yocto(job["reward_usd"], price)
        if not stored:
            jobs.update(job["job_id"], deposit_expected_yocto=str(amount_yocto))
        current = self._network()
        return {
            "network_id": current.network_id,
            "receiver_id": self.escrow_account(),
            "amount_yocto": str(amount_yocto),
            "amount_near": amount_yocto / 10**24,
            "price_usd": price,
            "rpc_url": self._rpc_url(),
        }

    def confirm_deposit(
        self,
        job: dict,
        jobs: JobStore,
        ledger: Ledger,
        tx_hash: str,
        signer_id: str,
    ) -> dict:
        """Verify the wallet-signed deposit on-chain and lock the escrow."""
        if self._simulated(job):
            raise PaymentError("simulated jobs use deposit/approve, not a wallet deposit")
        if job["payment_status"] != "pending":
            raise PaymentError(f"job {job['job_id']} deposit is already '{job['payment_status']}'")
        if not tx_hash:
            raise PaymentError("tx_hash is required")
        expected = job.get("deposit_expected_yocto")
        if expected is None:
            prepared = self.prepare_deposit(job, jobs)
            expected = prepared["amount_yocto"]
        signer = signer_id or job.get("client_account") or None
        if signer:
            signer = self._account(signer, "Deposit signer")
        result = near_chain.verify_deposit_tx(
            self._rpc_url(),
            tx_hash,
            self.escrow_account(),
            int(expected),
            expected_signer=signer,
        )
        # Atomic claim: the replay check and the lock write happen inside one
        # store update, so two concurrent confirms can't both pass.
        try:
            updated = jobs.claim_deposit(
                job["job_id"],
                tx_hash,
                payment_status="locked",
                deposit_tx_hash=tx_hash,
                deposit_paid_yocto=str(result["paid_yocto"]),
                client_account=result["signer_id"],
            )
        except DepositReplayError as exc:
            raise PaymentError(str(exc)) from exc
        ledger.append(
            "deposit_locked",
            job_id=job["job_id"],
            details=(
                f"{result['paid_yocto'] / 10**24:.4f} NEAR locked in escrow"
                f" (tx {tx_hash})"
            ),
            amount_usd=job["reward_usd"],
        )
        return updated

    def lock_deposit(self, job: dict, jobs: JobStore, ledger: Ledger) -> dict:
        """Mark the reward as locked in escrow (simulated jobs only).

        Live jobs must go through prepare_deposit + confirm_deposit — the
        client signs a real NEAR transfer in their wallet.
        """
        if self._simulated(job):
            updated = jobs.update(job["job_id"], payment_status="locked")
            ledger.append(
                "deposit_locked",
                job_id=job["job_id"],
                details=f"${job['reward_usd']:.2f} locked in escrow (simulated deposit)",
                amount_usd=job["reward_usd"],
            )
            return updated
        raise PaymentError(
            "live deposits are wallet-signed NEAR transfers; call"
            " deposit/prepare then deposit/confirm with the tx hash"
        )

    def _payout_amount_yocto(self, job: dict, share_usd: float) -> int:
        """USD share -> yoctoNEAR, pro-rated against the actual deposit."""
        paid = job.get("deposit_paid_yocto")
        if paid:
            return int(int(paid) * share_usd / job["reward_usd"])
        return near_chain.usd_to_yocto(share_usd, self._price())

    def _send(self, job: dict, receiver: str, amount_yocto: int) -> str:
        key = self._escrow_key()
        if not key:
            raise PaymentError(
                "live on-chain payouts need ESCROW_PRIVATE_KEY (an ed25519"
                " access key for the escrow account); funds stay locked"
                " in escrow until it is configured"
            )
        receiver = self._account(receiver, "Payout receiver")
        result = near_chain.transfer_near(
            self._rpc_url(),
            self.escrow_account(),
            key,
            receiver,
            amount_yocto,
        )
        return str(result["tx_hash"])

    def preflight_release(self, job: dict) -> None:
        """Fail before scheduling a hold the payout could never fulfil."""
        if self._simulated(job):
            return
        destination = self.payout_account(job["agent"])
        if not destination:
            raise PaymentError(
                f"agent '{job['agent']}' has no payout account; funds stay locked in escrow"
            )
        self._account(destination, "Agent payout")
        if not self._escrow_key():
            raise PaymentError('ESCROW_PRIVATE_KEY is unavailable; funds stay locked')

    def release(self, job: dict, jobs: JobStore, ledger: Ledger) -> dict:
        """Pay the agent and collect the protocol fee."""
        payout, fee = self.c.payout_split(job["reward_usd"])
        if job["payment_status"] == "released" or job.get("payout_tx_hash"):
            raise PaymentError(f"job {job['job_id']} is already released")
        payout_tx = None
        if self._simulated(job):
            mode = "simulated"
        else:
            mode = "live"
            destination = self.payout_account(job["agent"])
            if not destination:
                raise PaymentError(
                    f"agent '{job['agent']}' has no payout account (agent_profiles"
                    " payout_account or NEXSCROW_AGENT_PAYOUT_ACCOUNT); funds stay locked in escrow"
                )
            destination = self._account(destination, "Agent payout")
            if not self._escrow_key():
                raise PaymentError('ESCROW_PRIVATE_KEY is unavailable; funds stay locked')
            amount = self._payout_amount_yocto(job, payout)
            job = self._claim_transfer(job, jobs, 'release')
            payout_tx = self._send(job, destination, amount)
            jobs.update(job['job_id'], payout_tx_hash=payout_tx)
        ledger.append(
            "funds_released",
            job_id=job["job_id"],
            details=(
                f"${payout:.2f} paid to agent {job['agent']} ({mode})"
                + (f" tx {payout_tx}" if payout_tx else "")
            ),
            amount_usd=job["reward_usd"],
        )
        if fee > 0:
            ledger.append(
                "protocol_fee_collected",
                job_id=job["job_id"],
                details=f"protocol fee ${fee:.2f} (held in escrow account)",
                amount_usd=fee,
            )
        return jobs.update(
            job["job_id"],
            status="completed",
            payment_status="released",
            agent_payout_usd=payout,
            fee_usd=fee,
            payout_tx_hash=payout_tx,
            completed_at=utcnow(),
        )

    def refund(self, job: dict, jobs: JobStore, ledger: Ledger) -> dict:
        """Return locked funds to the client.

        Live funds may only be refunded while locked or release_pending: once released, the
        payout tx is already on-chain and refunding would spend the pooled
        escrow a second time.
        """
        if job["payment_status"] == "refunded":
            raise PaymentError(f"job {job['job_id']} is already refunded")
        if job["payment_status"] not in ("locked", "release_pending") and not self._simulated(job):
            raise PaymentError(
                f"job {job['job_id']} funds are '{job['payment_status']}',"
                " not locked in escrow"
            )
        refund_tx = None
        if self._simulated(job):
            mode = "simulated"
        else:
            mode = "live"
            client_account = job.get("client_account") or (
                (job.get("client_id") or "").removeprefix("near:") or None
            )
            if not client_account:
                raise PaymentError(
                    "cannot refund: the client's NEAR account is unknown;"
                    " the client must confirm the deposit with their wallet"
                )
            if not self._escrow_key():
                raise PaymentError('ESCROW_PRIVATE_KEY is unavailable; funds stay locked')
            amount = int(job.get('deposit_paid_yocto') or 0) or self._payout_amount_yocto(job, job['reward_usd'])
            job = self._claim_transfer(job, jobs, 'refund')
            refund_tx = self._send(
                job, client_account, amount,
            )
            jobs.update(job['job_id'], refund_tx_hash=refund_tx)
        ledger.append(
            "funds_refunded",
            job_id=job["job_id"],
            details=(
                f"${job['reward_usd']:.2f} returned to client ({mode})"
                + (f" tx {refund_tx}" if refund_tx else "")
            ),
            amount_usd=job["reward_usd"],
        )
        return jobs.update(
            job["job_id"], payment_status="refunded", refund_tx_hash=refund_tx
        )

    def _claim_transfer(self, job, jobs, operation):
        from src.storage import PostgresStore
        if os.environ.get('APP_ENV') == 'production' and not isinstance(jobs._store, PostgresStore):
            raise PaymentError('Production escrow transfers require durable PostgreSQL storage')
        def claim(records):
            current = records[job['job_id']]
            if current.get('transfer_intent') or current['payment_status'] not in ('locked', 'release_pending'):
                raise PaymentError('Escrow transfer already reserved or finalized; reconcile before retrying')
            if operation == 'release':
                today = utcnow()[:10]
                reserved = sum(r['reward_usd'] for r in records.values() if r.get('transfer_intent', {}).get('operation') == 'release' and r['transfer_intent']['created_at'][:10] == today)
                legacy = sum(r['reward_usd'] for r in records.values() if not r.get('transfer_intent') and r.get('payment_status') == 'released' and str(r.get('completed_at', ''))[:10] == today)
                if reserved + legacy + current['reward_usd'] > self.c.max_daily_payout_usd:
                    raise PaymentError('Daily payout cap exhausted; funds stay locked')
            current['transfer_intent'] = {'operation': operation, 'status': 'reserved', 'created_at': utcnow()}
            return dict(current)
        return jobs._store.update('jobs', {}, claim)
