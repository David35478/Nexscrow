"""HTTP API end-to-end: auth gating + full lifecycle with deposit approval."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import create_app
from tests.conftest import make_config


def client(tmp_path) -> TestClient:
    data_dir = tmp_path / "data"
    data_dir.mkdir(exist_ok=True)
    app = create_app(config_path=make_config(tmp_path), data_dir=str(data_dir))
    return TestClient(app)


def login_demo(c: TestClient) -> dict:
    r = c.post("/api/auth/demo")
    assert r.status_code == 200
    return r.json()["user"]


def post_job(c: TestClient, title: str, reward: float, **extra) -> str:
    r = c.post("/api/jobs", json={"title": title, "reward_usd": reward, **extra})
    assert r.status_code == 200, r.text
    return r.json()["job"]["job_id"]


def test_login_required_for_client_actions(tmp_path):
    c = client(tmp_path)
    # anonymous: session empty, client actions blocked
    assert c.get("/api/auth/session").json()["user"] is None
    r = c.post("/api/jobs", json={"title": "Nope", "reward_usd": 1.0})
    assert r.status_code == 401

    # demo login issues a session and unlocks client actions
    user = login_demo(c)
    assert user["provider"] == "demo"
    assert c.get("/api/auth/session").json()["user"]["user_id"] == user["user_id"]

    job_id = post_job(c, "With session", 1.0)
    job = c.get(f"/api/jobs/{job_id}").json()
    assert job["payment_status"] == "pending"
    assert job["client_id"] == user["user_id"]

    # logout revokes the session
    c.post("/api/auth/logout")
    assert c.get("/api/auth/session").json()["user"] is None
    assert c.post("/api/jobs", json={"title": "Again", "reward_usd": 1.0}).status_code == 401


def test_demo_session_creates_simulated_jobs(tmp_path):
    """Demo sessions get simulated funds; live (non-demo) jobs use the real
    deposit flow and refuse fake payouts."""
    c = client(tmp_path)
    login_demo(c)  # provider == "demo"
    demo_job = post_job(c, "Demo job", 2.0)
    job = c.get(f"/api/jobs/{demo_job}").json()
    assert job["simulated"] is True
    assert "@intents-demo" in job["deposit_address"]

    # a live (non-demo) job pays the real escrow account — the client's
    # wallet signs the deposit transfer (see test_payment.py)


def test_live_job_deposit_address_is_escrow_account(tmp_path):
    c = client(tmp_path)
    sys_ = c.app.state.system
    job = sys_.post_job("Live job", "", 3.0, simulated=False)
    assert job["simulated"] is False
    assert job["deposit_address"] == "nexscrow-escrow.testnet"


def test_api_full_lifecycle_with_approval(tmp_path):
    c = client(tmp_path)
    login_demo(c)

    assert c.get("/api/health").json()["status"] == "ok"
    assert c.get("/").status_code == 200
    assert c.get("/dashboard").status_code == 200

    # simulated one-click demo cycle (its own simulated client)
    r = c.post("/api/demo/cycle", json={"reward_usd": 5.0})
    assert r.status_code == 200
    assert r.json()["job"]["status"] == "completed"

    # manual flow: post -> approve -> agent run
    job_id = post_job(c, "Manual report", 3.0, description="d", release_condition="auto")
    assert c.get(f"/api/jobs/{job_id}").json()["payment_status"] == "pending"

    r = c.post(f"/api/jobs/{job_id}/deposit/approve")
    assert r.status_code == 200
    assert r.json()["payment_status"] == "locked"

    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    assert r.status_code == 200
    assert r.json()["job"]["status"] == "completed"

    board = c.get("/api/jobs").json()
    assert board["stats"]["completed_jobs"] == 2
    ledger = c.get("/api/ledger").json()["events"]
    assert any(e["event_type"] == "deposit_approved" for e in ledger)

    assert c.get("/api/jobs/nope").status_code == 404


def test_agent_cannot_run_before_deposit_approved(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    job_id = post_job(c, "Not funded", 1.0)
    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    assert r.status_code == 400
    assert "no locked deposit" in r.json()["error"]


def test_api_constraint_errors(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    # over the cap -> 400 with a clear message
    r = c.post("/api/jobs", json={"title": "Big", "reward_usd": 99.0})
    assert r.status_code == 400
    assert "max_job_reward_usd" in r.json()["error"]

    # disallowed agent -> 400
    job_id = post_job(c, "Ok", 1.0)
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "evil-agent"})
    assert r.status_code == 400
    assert "allowlist" in r.json()["error"]


def test_api_kill_switch(tmp_path, monkeypatch):
    app = create_app(config_path=str(make_config(tmp_path)), data_dir=str(tmp_path / "data"))
    c = TestClient(app)
    login_demo(c)
    job_id = post_job(c, "KS", 1.0)
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    assert c.post('/api/admin/kill-switch', json={'enabled': True}).status_code == 403
    monkeypatch.setenv('NEXSCROW_ADMIN_USER_IDS', 'near:admin.near')
    from src.auth import SESSION_COOKIE
    token = app.state.auth.create_session('near', 'near:admin.near', 'Admin')
    c.cookies.set(SESSION_COOKIE, token)
    assert c.post("/api/admin/kill-switch", json={"enabled": True}).status_code == 200
    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    assert r.status_code == 400
    assert "kill switch" in r.json()["error"]
    assert c.get("/api/config").json()["constraints"]["kill_switch"] is True


def test_config_reports_auth_capabilities(tmp_path):
    c = client(tmp_path)
    auth = c.get("/api/config").json()["auth"]
    assert auth["google_configured"] is False
    assert auth["near_network"] == "testnet"


def test_config_reports_near_auth(tmp_path):
    c = client(tmp_path)
    na = c.get("/api/config").json()["near_auth"]
    # testnet shared client id ships by default
    assert na["network"] == "testnet"
    assert na["client_id"]


def test_fastauth_verify_endpoint(tmp_path, monkeypatch):
    from src import auth as auth_mod

    # stub the token verification: endpoint plumbing is the target here
    monkeypatch.setattr(
        auth_mod.AuthService,
        "verify_fastauth_token",
        lambda self, token, network="testnet": {
            "provider": "near-auth",
            "user_id": "near-auth:google-oauth2|abc",
            "name": "user@gmail.com",
        },
    )
    c = client(tmp_path)
    r = c.post(
        "/api/auth/fastauth/verify",
        json={"token": "x" * 32, "network": "testnet"},
    )
    assert r.status_code == 200
    assert r.json()["user"]["provider"] == "near-auth"
    assert c.get("/api/auth/session").json()["user"]["name"] == "user@gmail.com"


def test_job_detail_page(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    job_id = post_job(c, "Detail page", 2.0)
    r = c.get(f"/job/{job_id}")
    assert r.status_code == 200
    assert job_id in r.text
    # unknown job -> 404
    assert c.get("/job/doesnotexist").status_code == 404


def test_agent_marketplace(tmp_path):
    c = client(tmp_path)
    # catalog merges profiles with live reputation stats
    agents = c.get("/api/agents").json()["agents"]
    assert len(agents) == 3
    oracle = next(a for a in agents if a["agent_id"] == "agent-oracle-1")
    assert oracle["display_name"] == "Oracle"
    assert oracle["specialization"] == "Research"
    assert oracle["verified"] is True
    assert oracle["policy"]["max_txn_usd"] == 25.0
    assert oracle["tagline"] == "Deep-research analyst"
    assert "research" in oracle["description"].lower()
    assert len(oracle["capabilities"]) >= 3
    assert oracle["stats"]["rank"] == 0  # no history yet

    # marketplace page renders
    r = c.get("/agents")
    assert r.status_code == 200

    # reputation feeds the catalog once jobs complete
    login_demo(c)
    job_id = post_job(c, "Marketplace job", 2.0, release_condition="auto")
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    agents = c.get("/api/agents").json()["agents"]
    oracle = next(a for a in agents if a["agent_id"] == "agent-oracle-1")
    assert oracle["stats"]["completed"] == 1
    assert oracle["stats"]["rank"] == 100.0


def test_manual_release_requires_buyer_approval(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    # manual release: proof verifies but funds stay locked until approval
    job_id = post_job(
        c, "Manual release job", 3.0,
        deliverables="Report with sources",
        deadline_hours=48,
        release_condition="manual",
    )
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    done = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"}).json()
    assert done["job"]["status"] == "delivered"
    assert done["job"]["payment_status"] == "locked"
    assert done["job"]["deadline_at"] is not None

    # approving as the owner releases the escrow
    released = c.post(f"/api/jobs/{job_id}/approve-work").json()
    assert released["status"] == "completed"
    assert released["payment_status"] == "released"
    events = c.get("/api/ledger").json()["events"]
    assert any(e["event_type"] == "work_delivered" for e in events)
    assert any(e["event_type"] == "work_approved" for e in events)


def test_auto_release_bypasses_approval(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    job_id = post_job(c, "Auto release job", 3.0, release_condition="auto")
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    done = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"}).json()
    assert done["job"]["status"] == "completed"
    assert done["job"]["payment_status"] == "released"


def test_approve_work_requires_delivered(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    job_id = post_job(c, "Not delivered", 1.0)
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    r = c.post(f"/api/jobs/{job_id}/approve-work")
    assert r.status_code == 400
    assert "only delivered work" in r.json()["error"]


def test_abandoned_delivered_job_refunds_after_window(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    # delivered (awaiting approval) with a deadline that has passed
    job_id = post_job(c, "Abandoned review", 2.0, deadline_hours=48, release_condition="manual")
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    done = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"}).json()
    assert done["job"]["status"] == "delivered"
    # push the deadline (and review window) into the past
    c.app.state.system.jobs.update(job_id, deadline_at="2020-01-01T00:00:00+00:00")
    # hitting the board runs expiry
    board = c.get("/api/jobs").json()
    expired = [j for j in board["expired_jobs"] if j["job_id"] == job_id]
    assert expired, "abandoned delivered job should expire"
    assert expired[0]["payment_status"] == "refunded"


def test_recommendation_and_leaderboard(tmp_path):
    c = client(tmp_path)
    recs = c.get("/api/agents/recommend", params={"title": "research market adoption"}).json()["agents"]
    assert recs[0]["specialization"] == "Research"
    assert recs[0]["match_score"] > 0
    assert "Matches your brief" in recs[0]["why_recommended"]

    login_demo(c)
    job_id = post_job(c, "Data analysis of activity", 2.0, release_condition="auto")
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-quant-3"})
    lb = c.get("/api/leaderboard").json()["agents"]
    assert any(a["agent_id"] == "agent-quant-3" for a in lb)
    quant = next(a for a in c.get("/api/agents").json()["agents"] if a["agent_id"] == "agent-quant-3")
    assert quant["stats"]["avg_reward_usd"] == 2.0
    assert quant["stats"]["avg_completion_minutes"] is not None
