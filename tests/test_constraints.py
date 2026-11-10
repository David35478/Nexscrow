"""Every human constraint in config.yaml is enforced."""

from __future__ import annotations

import pytest

from src.constraints import ConstraintError
from src.escrow import ReleaseBlocked
from src.proof import build_proof, verify_proof


def test_reward_cap_rejects_big_jobs(make_system):
    sys_ = make_system(max_job_reward_usd=10.0)
    with pytest.raises(ConstraintError, match="max_job_reward_usd"):
        sys_.post_job("Too big", "", 50.0)
    # at the cap it passes
    assert sys_.post_job("At cap", "", 10.0)["status"] == "open"


def test_agent_allowlist(make_system):
    sys_ = make_system()
    job = sys_.post_job("Job", "", 1.0, release_condition="auto")
    sys_.approve_deposit(job["job_id"])
    with pytest.raises(ConstraintError, match="allowlist"):
        sys_.accept_job(job["job_id"], "agent-rogue-9")
    assert sys_.accept_job(job["job_id"], "agent-oracle-1")["agent"] == "agent-oracle-1"


def test_kill_switch_freezes_agents(make_system):
    sys_ = make_system()
    job = sys_.post_job("Job", "", 1.0, release_condition="auto")
    sys_.approve_deposit(job["job_id"])
    sys_.toggle_kill_switch(True)
    with pytest.raises(ConstraintError, match="kill switch"):
        sys_.accept_job(job["job_id"], "agent-oracle-1")
    with pytest.raises(ConstraintError, match="kill switch"):
        sys_.agent_run(job["job_id"], "agent-oracle-1")
    # funds never left escrow
    assert sys_.jobs.get(job["job_id"])["payment_status"] == "locked"
    sys_.toggle_kill_switch(False)
    assert sys_.agent_run(job["job_id"], "agent-oracle-1")["job"]["status"] == "completed"


def test_daily_payout_cap(make_system):
    sys_ = make_system(max_daily_payout_usd=6.0)
    first = sys_.run_demo_cycle(reward_usd=5.0)
    assert first["job"]["payment_status"] == "released"

    # second job: accept + work + proof, then the release must be blocked
    with pytest.raises(ReleaseBlocked, match="daily payout"):
        sys_.run_demo_cycle(reward_usd=5.0)

    # escrow kept the money
    stuck = [j for j in sys_.jobs.list() if j["status"] == "delivered"][0]
    assert stuck["payment_status"] == "locked"
    assert "release_blocked" in [e["event_type"] for e in sys_.ledger.events()]


def test_short_proof_is_rejected(make_system):
    sys_ = make_system(min_proof_length=200)
    job = sys_.post_job("Job", "", 1.0, release_condition="auto")
    sys_.approve_deposit(job["job_id"])
    sys_.accept_job(job["job_id"], "agent-oracle-1")
    sys_.run_work(job["job_id"])
    with pytest.raises(ConstraintError, match="too short"):
        sys_.submit_proof(job["job_id"], content="done, trust me")
    # job stays accepted, funds stay locked
    stuck = sys_.jobs.get(job["job_id"])
    assert stuck["status"] == "accepted"
    assert stuck["payment_status"] == "locked"


def test_hash_mismatch_detected(make_system):
    sys_ = make_system()
    proof = build_proof("j1", "x" * 500)
    proof["content_hash"] = "0" * 64
    ok, issues = verify_proof(proof, sys_.constraints)
    assert not ok
    assert any("hash mismatch" in i for i in issues)


def test_job_timeout_expires_and_refunds(make_system):
    sys_ = make_system(job_timeout_minutes=0)
    job = sys_.post_job("Slow job", "", 2.0, release_condition="auto")
    sys_.approve_deposit(job["job_id"])
    sys_.accept_job(job["job_id"], "agent-oracle-1")
    expired = sys_.expire_jobs()
    assert len(expired) == 1
    after = sys_.jobs.get(job["job_id"])
    assert after["status"] == "expired"
    assert after["payment_status"] == "refunded"
    assert "funds_refunded" in [e["event_type"] for e in sys_.ledger.events()]


def test_cancel_refunds_locked_job(make_system):
    sys_ = make_system()
    job = sys_.post_job("Cancel me", "", 3.0, release_condition="auto")
    sys_.approve_deposit(job["job_id"])
    cancelled = sys_.cancel_job(job["job_id"])
    assert cancelled["status"] == "cancelled"
    assert cancelled["payment_status"] == "refunded"


def test_approve_requires_owner(make_system):
    sys_ = make_system()
    job = sys_.post_job("Mine", "", 1.0, client_id="near:alice.near")
    with pytest.raises(ConstraintError, match="only the client"):
        sys_.approve_deposit(job["job_id"], client_id="near:mallory.near")
    job = sys_.approve_deposit(job["job_id"], client_id="near:alice.near")
    assert job["payment_status"] == "locked"


def test_cancel_requires_owner(make_system):
    sys_ = make_system()
    job = sys_.post_job("Mine", "", 1.0, client_id="near:alice.near")
    sys_.approve_deposit(job["job_id"], client_id="near:alice.near")
    with pytest.raises(ConstraintError, match="only the client"):
        sys_.cancel_job_as(job["job_id"], client_id="near:mallory.near")
