"""Agent reputation: success rate + rank, derived from completed jobs."""

from __future__ import annotations

from src.jobs import JobStore


def agent_stats(jobs: JobStore, agent_id: str) -> dict:
    """Completed / failed / disputed jobs and a 0-100 rank for one agent."""
    completed = failed = disputed = 0
    for job in jobs.list():
        if job.get("agent") != agent_id:
            continue
        if job.get("disputed") and job.get("dispute_resolved"):
            disputed += 1
        elif job["status"] == "completed":
            completed += 1
        elif job["status"] == "expired":
            failed += 1
    total = completed + failed + disputed
    success_rate = (completed / total) if total else 0.0
    rank = round(100 * success_rate * (1 - 0.25 * (disputed / total if total else 0)), 1)
    return {
        "agent_id": agent_id,
        "completed": completed,
        "failed": failed,
        "disputed": disputed,
        "success_rate": round(success_rate * 100, 1),
        "rank": rank,
    }


def all_agent_stats(jobs: JobStore, allowed_agents: list[str]) -> dict:
    return {a: agent_stats(jobs, a) for a in allowed_agents}
