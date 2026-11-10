"""Agent reputation: success rate + rank, derived from completed jobs."""

from __future__ import annotations

from src.jobs import JobStore


def agent_stats(jobs: JobStore, agent_id: str) -> dict:
    """Verified activity metrics for one agent, plus a 0-100 rank."""
    completed = failed = disputed = 0
    completion_minutes: list[float] = []
    rewards: list[float] = []
    on_time = 0
    on_time_total = 0
    from datetime import datetime, timezone
    from src.storage import utcnow

    def _dt(v):
        try:
            d = datetime.fromisoformat(v)
            return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
        except (TypeError, ValueError):
            return None

    for job in jobs.list():
        if job.get("agent") != agent_id:
            continue
        if job.get("disputed") and job.get("dispute_resolved"):
            disputed += 1
        elif job["status"] == "completed":
            completed += 1
            rewards.append(job["reward_usd"])
            started, done = _dt(job.get("created_at")), _dt(job.get("completed_at"))
            if started and done:
                completion_minutes.append((done - started).total_seconds() / 60)
            if job.get("deadline_at"):
                limit = _dt(job["deadline_at"])
                on_time_total += 1
                if done and limit and done <= limit:
                    on_time += 1
        elif job["status"] == "expired":
            failed += 1
    total = completed + failed + disputed
    success_rate = (completed / total) if total else 0.0
    avg_minutes = round(sum(completion_minutes) / len(completion_minutes)) if completion_minutes else None
    avg_reward = round(sum(rewards) / len(rewards), 2) if rewards else None
    on_time_rate = round(100 * on_time / on_time_total, 1) if on_time_total else 100.0
    rank = round(100 * success_rate * (1 - 0.25 * (disputed / total if total else 0)), 1)
    return {
        "agent_id": agent_id,
        "completed": completed,
        "failed": failed,
        "disputed": disputed,
        "success_rate": round(success_rate * 100, 1),
        "on_time_rate": on_time_rate,
        "avg_completion_minutes": avg_minutes,
        "avg_reward_usd": avg_reward,
        "rank": rank,
    }


def all_agent_stats(jobs: JobStore, allowed_agents: list[str]) -> dict:
    return {a: agent_stats(jobs, a) for a in allowed_agents}
