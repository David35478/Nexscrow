"""Held payouts: approve schedules, disputes refund pre-payout, settle pays once."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from src.constraints import ConstraintError
from tests.test_api import client


def delivered(sys_, reward=3.0):
    job = sys_.post_job("Held job", "private brief", reward, release_condition="manual")
    sys_.approve_deposit(job["job_id"])
    sys_.accept_job(job["job_id"], "agent-oracle-1")
    sys_.run_work(job["job_id"])
    job = sys_.submit_proof(job["job_id"])
    assert job["status"] == "delivered"
    return job


def spy(sys_, monkeypatch):
    calls = {"release": 0, "refund": 0}
    real_release, real_refund = sys_.payment.release, sys_.payment.refund

    def release(*a, **k):
        calls["release"] += 1
        return real_release(*a, **k)

    def refund(*a, **k):
        calls["refund"] += 1
        return real_refund(*a, **k)

    monkeypatch.setattr(sys_.payment, "release", release)
    monkeypatch.setattr(sys_.payment, "refund", refund)
    return calls


def expire_hold(sys_, job_id):
    past = (datetime.now(timezone.utc) - timedelta(minutes=1)).isoformat()
    sys_.jobs.update(job_id, release_due_at=past)


def test_approve_holds_funds(make_system, monkeypatch):
    sys_ = make_system()
    calls = spy(sys_, monkeypatch)
    job = sys_.approve_work(delivered(sys_)["job_id"])
    assert job["status"] == "completed"
    assert job["payment_status"] == "release_pending"
    assert job["release_due_at"]
    assert calls["release"] == 0
    assert "release_scheduled" in [e["event_type"] for e in sys_.ledger.events()]
    assert sys_.settle_due_releases()["settled"] == 0  # window still open


def test_dispute_then_refund_never_pays_agent(make_system, monkeypatch):
    sys_ = make_system()
    calls = spy(sys_, monkeypatch)
    job = sys_.approve_work(delivered(sys_)["job_id"])
    sys_.dispute(job["job_id"], "bad work", client_id=job.get("client_id"))
    expire_hold(sys_, job["job_id"])
    assert sys_.settle_due_releases()["settled"] == 0  # disputed jobs are skipped
    job = sys_.resolve(job["job_id"], "refund")
    assert job["payment_status"] == "refunded"
    assert calls == {"release": 0, "refund": 1}


def test_dispute_resolved_in_favour_of_agent_pays_immediately(make_system):
    sys_ = make_system()
    job = sys_.approve_work(delivered(sys_)["job_id"])
    sys_.dispute(job["job_id"], "meh", client_id=job.get("client_id"))
    assert sys_.resolve(job["job_id"], "release")["payment_status"] == "released"


def test_settle_pays_once_and_blocks_late_dispute(make_system, monkeypatch):
    sys_ = make_system()
    calls = spy(sys_, monkeypatch)
    job = sys_.approve_work(delivered(sys_)["job_id"])
    expire_hold(sys_, job["job_id"])
    assert sys_.settle_due_releases()["settled"] == 1
    assert sys_.settle_due_releases()["settled"] == 0
    assert calls["release"] == 1
    assert sys_.jobs.get(job["job_id"])["payment_status"] == "released"
    with pytest.raises(ConstraintError):
        sys_.dispute(job["job_id"], "too late", client_id=job.get("client_id"))


def test_anonymous_job_list_hides_private_fields(tmp_path):
    c = client(tmp_path)
    c.post("/api/auth/demo")
    c.post("/api/jobs", json={"title": "Secret", "reward_usd": 2.0, "description": "private brief"})
    assert c.get("/api/jobs").json()["jobs"][0]["description"] == "private brief"
    jobs = client(tmp_path).get("/api/jobs").json()["jobs"]
    assert jobs and all(
        "client_id" not in j and "description" not in j and "deliverable" not in j for j in jobs
    )
