"""End-to-end lifecycle: post -> lock -> accept -> work -> proof -> release."""

from __future__ import annotations

import hashlib


def test_full_demo_cycle_releases_on_proof(make_system):
    sys_ = make_system()
    result = sys_.run_demo_cycle(reward_usd=5.0)
    job = result["job"]

    assert job["status"] == "completed"
    assert job["payment_status"] == "released"
    assert job["agent"] == "agent-oracle-1"
    # 2% protocol fee on a $5 reward
    assert job["fee_usd"] == 0.10
    assert job["agent_payout_usd"] == 4.90
    assert job["completed_at"] is not None
    assert len(job["deliverable"]) >= 200
    assert job["proof_hash"] == hashlib.sha256(job["deliverable"].encode()).hexdigest()


def test_ledger_records_every_step(make_system):
    sys_ = make_system()
    sys_.run_demo_cycle()
    types = [e["event_type"] for e in sys_.ledger.events()]
    for expected in (
        "job_posted",
        "deposit_approved",
        "deposit_locked",
        "job_accepted",
        "agent_working",
        "proof_submitted",
        "funds_released",
        "protocol_fee_collected",
    ):
        assert expected in types
    # released amount recorded for the daily cap
    assert sys_.ledger.released_today() == 5.0


def test_step_by_step_flow(make_system):
    sys_ = make_system()
    job = sys_.post_job("Test report", "brief", 4.0, release_condition="auto")
    assert job["status"] == "open"
    assert job["payment_status"] == "pending"  # waiting for client approval
    assert job["deposit_address"].endswith("@intents-demo")

    job = sys_.approve_deposit(job["job_id"])
    assert job["payment_status"] == "locked"

    job = sys_.accept_job(job["job_id"], "agent-scribe-2")
    assert job["status"] == "accepted"
    assert job["timeout_at"] is not None

    job = sys_.run_work(job["job_id"])
    assert job["deliverable"] and len(job["deliverable"]) >= 200
    assert job["status"] == "accepted"  # not completed until proof verifies

    job = sys_.submit_proof(job["job_id"])
    assert job["status"] == "completed"
    assert job["payment_status"] == "release_pending"


def test_jobs_persist_to_disk(make_system, tmp_path):
    sys_ = make_system()
    sys_.run_demo_cycle()
    assert (tmp_path / "data" / "jobs.json").exists()
    assert (tmp_path / "data" / "ledger.json").exists()

    from src.system import NexscrowSystem

    sys2 = NexscrowSystem(sys_.config_path, str(tmp_path / "data"))
    assert len(sys2.jobs.list()) == 1
    assert sys2.jobs.list()[0]["status"] == "completed"
