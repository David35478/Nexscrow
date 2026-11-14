from fastapi.testclient import TestClient

from main import create_app
from tests.conftest import make_config


def make_client(tmp_path, name="d"):
    d = tmp_path / name
    d.mkdir()
    return TestClient(create_app(config_path=make_config(tmp_path), data_dir=str(d)))


def completed_job(c):
    c.post("/api/auth/demo")
    job_id = c.post(
        "/api/jobs",
        json={"title": "Proof job", "reward_usd": 3.0, "description": "d", "release_condition": "auto"},
    ).json()["job"]["job_id"]
    assert c.post(f"/api/jobs/{job_id}/deposit/approve").status_code == 200
    r = c.post(f"/api/jobs/{job_id}/agent-run", json={"agent_id": "agent-oracle-1"})
    assert r.status_code == 200
    return job_id


def test_anonymous_proof_page_and_api(tmp_path):
    owner = make_client(tmp_path)
    job_id = completed_job(owner)
    full = owner.get(f"/api/jobs/{job_id}").json()
    assert full["client_id"] and full["deliverable"] and full["proof_hash"]

    owner.cookies.clear()
    anon = owner
    page = anon.get(f"/job/{job_id}", follow_redirects=False)
    assert page.status_code == 200
    assert full["proof_hash"] in page.text
    assert anon.get("/agents/agent-oracle-1", follow_redirects=False).status_code in (303, 307)

    pub = anon.get(f"/api/jobs/{job_id}")
    body = pub.json()
    assert body["proof_hash"] == full["proof_hash"]
    for key in ("client_id", "deliverable", "client", "description", "provider_inputs"):
        assert key not in body


def test_dispute_within_window(tmp_path):
    c = make_client(tmp_path)
    job_id = completed_job(c)
    r = c.post(f"/api/jobs/{job_id}/dispute", json={"reason": "missed the brief"})
    assert r.status_code == 200
    assert c.get(f"/api/jobs/{job_id}").json()["disputed"] is True


def test_reputation_on_cards(tmp_path):
    c = make_client(tmp_path)
    c.post("/api/auth/demo")
    assert "New agent" in c.get("/app").text
    completed_job(c)
    html = c.get("/app").text
    assert "jobs done" in html and "success" in html
