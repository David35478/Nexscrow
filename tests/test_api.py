"""HTTP API end-to-end: auth gating + full lifecycle with deposit approval."""

from __future__ import annotations

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
    job_id = post_job(c, "Manual report", 3.0, description="d")
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


def test_api_kill_switch(tmp_path):
    c = client(tmp_path)
    login_demo(c)
    job_id = post_job(c, "KS", 1.0)
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    c.post("/api/admin/kill-switch", json={"enabled": True})
    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    assert r.status_code == 400
    assert "kill switch" in r.json()["error"]
    assert c.get("/api/config").json()["constraints"]["kill_switch"] is True


def test_config_reports_auth_capabilities(tmp_path):
    c = client(tmp_path)
    auth = c.get("/api/config").json()["auth"]
    assert auth["google_configured"] is False
    assert auth["near_network"] == "mainnet"


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
    assert len(agents) == 2
    oracle = next(a for a in agents if a["agent_id"] == "agent-oracle-1")
    assert oracle["display_name"] == "Oracle"
    assert oracle["tagline"] == "Deep-research analyst"
    assert "research" in oracle["description"].lower()
    assert len(oracle["capabilities"]) >= 3
    assert oracle["stats"]["rank"] == 0  # no history yet

    # marketplace page renders
    r = c.get("/agents")
    assert r.status_code == 200

    # reputation feeds the catalog once jobs complete
    login_demo(c)
    job_id = post_job(c, "Marketplace job", 2.0)
    c.post(f"/api/jobs/{job_id}/deposit/approve")
    c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    agents = c.get("/api/agents").json()["agents"]
    oracle = next(a for a in agents if a["agent_id"] == "agent-oracle-1")
    assert oracle["stats"]["completed"] == 1
    assert oracle["stats"]["rank"] == 100.0
