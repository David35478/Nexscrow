"""Work engine: NEAR AI path with graceful template fallback."""

from __future__ import annotations

import os

from src.env import load_env


def test_load_env_reads_dotenv(tmp_path, monkeypatch):
    env_file = tmp_path / ".env"
    env_file.write_text('NEAR_AI_API_KEY="test-key-123"\n# comment\nNO_EQUALS_HERE\n')
    monkeypatch.delenv("NEAR_AI_API_KEY", raising=False)
    load_env(env_file)
    assert os.environ["NEAR_AI_API_KEY"] == "test-key-123"


def test_near_ai_failure_falls_back_to_template(make_system, monkeypatch):
    monkeypatch.setenv("NEAR_AI_API_KEY", "dummy-key")
    sys_ = make_system(
        work_engine="near_ai",
        near_ai={
            "api_url": "http://127.0.0.1:1/v1/chat/completions",
            "model": "test",
            "timeout_seconds": 2,
        },
    )
    job = sys_.post_job("Fallback check", "", 1.0, release_condition="auto")
    sys_.approve_deposit(job["job_id"])
    sys_.accept_job(job["job_id"], "agent-oracle-1")
    job = sys_.run_work(job["job_id"])
    assert "Research Report" in job["deliverable"]
    assert len(job["deliverable"]) >= 200


def test_near_ai_without_key_uses_template(make_system, monkeypatch):
    monkeypatch.delenv("NEAR_AI_API_KEY", raising=False)
    sys_ = make_system(work_engine="near_ai")
    job = sys_.post_job("No key", "", 1.0, release_condition="auto")
    sys_.approve_deposit(job["job_id"])
    sys_.accept_job(job["job_id"], "agent-oracle-1")
    job = sys_.run_work(job["job_id"])
    assert "Research Report" in job["deliverable"]
