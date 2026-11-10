"""HTTP API end-to-end over the whole lifecycle."""

from __future__ import annotations

from fastapi.testclient import TestClient

from main import create_app
from tests.conftest import make_config


def client(tmp_path) -> TestClient:
    data_dir = tmp_path / "data"
    data_dir.mkdir(exist_ok=True)
    app = create_app(config_path=make_config(tmp_path), data_dir=str(data_dir))
    return TestClient(app)


def test_api_full_lifecycle(tmp_path):
    c = client(tmp_path)

    assert c.get("/api/health").json()["status"] == "ok"
    assert c.get("/").status_code == 200
    assert c.get("/dashboard").status_code == 200

    # demo cycle endpoint
    r = c.post("/api/demo/cycle", json={"reward_usd": 5.0})
    assert r.status_code == 200
    job = r.json()["job"]
    assert job["status"] == "completed"
    assert job["agent_payout_usd"] == 4.9

    # manual job
    r = c.post(
        "/api/jobs",
        json={"title": "Manual report", "description": "d", "reward_usd": 3.0},
    )
    assert r.status_code == 200
    job_id = r.json()["job"]["job_id"]
    assert c.get(f"/api/jobs/{job_id}").json()["payment_status"] == "locked"

    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    assert r.status_code == 200
    assert r.json()["job"]["status"] == "completed"

    # board + ledger reflect everything
    board = c.get("/api/jobs").json()
    assert board["stats"]["completed_jobs"] == 2
    ledger = c.get("/api/ledger").json()["events"]
    assert any(e["event_type"] == "funds_released" for e in ledger)

    # unknown job -> 404
    assert c.get("/api/jobs/nope").status_code == 404


def test_api_constraint_errors(tmp_path):
    c = client(tmp_path)
    # over the cap -> 400 with a clear message
    r = c.post("/api/jobs", json={"title": "Big", "reward_usd": 99.0})
    assert r.status_code == 400
    assert "max_job_reward_usd" in r.json()["error"]

    # disallowed agent -> 400
    r = c.post("/api/jobs", json={"title": "Ok", "reward_usd": 1.0})
    job_id = r.json()["job"]["job_id"]
    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "evil-agent"})
    assert r.status_code == 400
    assert "allowlist" in r.json()["error"]


def test_api_kill_switch(tmp_path):
    c = client(tmp_path)
    job_id = c.post("/api/jobs", json={"title": "KS", "reward_usd": 1.0}).json()["job"]["job_id"]
    c.post("/api/admin/kill-switch", json={"enabled": True})
    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    assert r.status_code == 400
    assert "kill switch" in r.json()["error"]
    assert c.get("/api/config").json()["constraints"]["kill_switch"] is True
