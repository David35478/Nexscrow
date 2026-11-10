"""Reputation ranks, agent bidding, and the dispute window."""

from __future__ import annotations

import pytest

from src.constraints import ConstraintError


def complete_job(sys_, title, reward=2.0, agent="agent-oracle-1"):
    job = sys_.post_job(title, "", reward)
    sys_.approve_deposit(job["job_id"])
    sys_.accept_job(job["job_id"], agent)
    sys_.run_work(job["job_id"])
    return sys_.submit_proof(job["job_id"])


def test_reputation_starts_neutral_and_grows(make_system):
    sys_ = make_system()
    assert sys_.reputation("agent-oracle-1")["completed"] == 0
    stats = sys_.reputation()
    assert set(stats) == {"agent-oracle-1", "agent-scribe-2"}
    assert all(s["rank"] == 0 for s in stats.values())

    complete_job(sys_, "One")
    stats = sys_.reputation("agent-oracle-1")
    assert stats["completed"] == 1
    assert stats["rank"] == 100.0


def test_rank_gate_blocks_low_rank_agents(make_system):
    sys_ = make_system()
    # completed history: oracle wins 1, scribe fails 1 (expired)
    complete_job(sys_, "Good", agent="agent-oracle-1")
    bad = sys_.post_job("Bad", "", 2.0)
    sys_.approve_deposit(bad["job_id"])
    sys_.accept_job(bad["job_id"], "agent-scribe-2")
    sys_.jobs.update(bad["job_id"], timeout_at="2000-01-01T00:00:00+00:00")
    sys_.expire_jobs()

    exclusive = sys_.post_job("Exclusive", "", 3.0, min_rank=90)
    sys_.approve_deposit(exclusive["job_id"])
    with pytest.raises(ConstraintError, match="below this job's required rank"):
        sys_.accept_job(exclusive["job_id"], "agent-scribe-2")
    assert sys_.accept_job(exclusive["job_id"], "agent-oracle-1")["status"] == "accepted"


def test_bidding_flow(make_system):
    sys_ = make_system()
    job = sys_.post_job("Biddable", "", 5.0)
    sys_.approve_deposit(job["job_id"])

    sys_.place_bid(job["job_id"], "agent-oracle-1", 4.5)
    job = sys_.place_bid(job["job_id"], "agent-scribe-2", 4.0)
    assert len(job["bids"]) == 2

    # re-bidding replaces the agent's own bid
    job = sys_.place_bid(job["job_id"], "agent-oracle-1", 3.5)
    assert len(job["bids"]) == 2
    assert next(b for b in job["bids"] if b["agent_id"] == "agent-oracle-1")["amount_usd"] == 3.5

    # a bid above the reward is rejected
    with pytest.raises(ConstraintError, match="at most the posted reward"):
        sys_.place_bid(job["job_id"], "agent-oracle-1", 6.0)

    # award to scribe, then only scribe can run it
    job = sys_.award_job(job["job_id"], "agent-scribe-2", client_id=None)
    assert job["selected_bid"]["agent_id"] == "agent-scribe-2"
    result = sys_.agent_run(job["job_id"], "agent-scribe-2")
    assert result["job"]["status"] == "completed"


def test_bid_required_before_accept_on_bid_jobs(make_system):
    sys_ = make_system()
    job = sys_.post_job("Bid first", "", 5.0)
    sys_.approve_deposit(job["job_id"])
    sys_.place_bid(job["job_id"], "agent-oracle-1", 4.0)
    with pytest.raises(ConstraintError, match="client must award"):
        sys_.accept_job(job["job_id"], "agent-oracle-1")


def test_award_ownership(make_system):
    sys_ = make_system()
    job = sys_.post_job("Mine", "", 5.0, client_id="near:alice.near")
    sys_.place_bid(job["job_id"], "agent-oracle-1", 4.0)
    with pytest.raises(ConstraintError, match="only the client"):
        sys_.award_job(job["job_id"], "agent-oracle-1", client_id="near:mallory.near")
    sys_.award_job(job["job_id"], "agent-oracle-1", client_id="near:alice.near")


def test_dispute_window(make_system):
    sys_ = make_system()
    job = complete_job(sys_, "Disputable", reward=4.0, agent="agent-scribe-2")
    job = sys_.dispute(job["job_id"], "deliverable missed the brief", client_id=job["client_id"])
    assert job["disputed"] is True
    assert "dispute_opened" in [e["event_type"] for e in sys_.ledger.events()]

    # double dispute rejected
    with pytest.raises(ConstraintError, match="already disputed"):
        sys_.dispute(job["job_id"], "again", client_id=job["client_id"])

    job = sys_.resolve(job["job_id"], "refund")
    assert job["dispute_resolved"] is True
    assert job["dispute_outcome"] == "refund"

    # a resolved dispute dents the agent's rank
    assert sys_.reputation("agent-scribe-2")["disputed"] == 1


def test_dispute_window_closes(make_system):
    sys_ = make_system()
    job = complete_job(sys_, "Too late", agent="agent-scribe-2")
    sys_.jobs.update(job["job_id"], completed_at="2020-01-01T00:00:00+00:00")
    with pytest.raises(ConstraintError, match="window closed"):
        sys_.dispute(job["job_id"], "ancient complaint", client_id=job["client_id"])


def test_only_completed_jobs_disputable(make_system):
    sys_ = make_system()
    job = sys_.post_job("Not done", "", 2.0)
    with pytest.raises(ConstraintError, match="only completed jobs"):
        sys_.dispute(job["job_id"], "no work", client_id=job["client_id"])
