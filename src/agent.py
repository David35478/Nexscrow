"""Constrained agent: accepts jobs and produces the deliverable.

The agent only ever performs three actions - accept, work, submit proof -
and can never move funds itself. Payouts happen exclusively through escrow.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone

import httpx

from src.constraints import Constraints


class AgentError(Exception):
    pass


def _topic(title: str) -> str:
    words = [w for w in title.split() if any(ch.isalpha() for ch in w)]
    return " ".join(words).strip() or "the assigned topic"


class WorkEngine:
    """Generate the deliverable. Falls back to a deterministic template."""

    def __init__(self, constraints: Constraints):
        self.c = constraints

    def generate(self, job: dict, agent_id: str) -> str:
        if self.c.work_engine == "near_ai":
            key = os.environ.get("NEAR_AI_API_KEY")
            if key:
                return self._near_ai(job, agent_id, key)
        return self._template(job, agent_id)

    def _near_ai(self, job: dict, agent_id: str, key: str) -> str:
        cfg = self.c.near_ai
        url = str(cfg.get("api_url", "https://api.near.ai/v1/chat/completions"))
        prompt = (
            f"You are agent '{agent_id}' delivering paid work under escrow for job"
            f" '{job['title']}' (job_id {job['job_id']}). Write a clear, structured"
            f" research report on the topic below in markdown with an executive"
            " summary, key findings, method, risks and conclusion.\n\n"
            f"Topic: {job['title']}\n"
            f"Brief: {job['description'] or '(none provided)'}"
        )
        try:
            resp = httpx.post(
                url,
                headers={"Authorization": f"Bearer {key}"},
                json={
                    "model": cfg.get("model", "gpt-4o-mini"),
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=float(cfg.get("timeout_seconds", 30)),
            )
            resp.raise_for_status()
            data = resp.json()
            text = data["choices"][0]["message"]["content"]
            if text and len(text.strip()) >= self.c.min_proof_length:
                return text.strip()
        except (httpx.HTTPError, KeyError, TypeError, ValueError):
            pass
        return self._template(
            job, agent_id, note="(cloud inference unavailable, template deliverable used)"
        )

    def _template(self, job: dict, agent_id: str, note: str = "") -> str:
        topic = _topic(job["title"])
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        brief = job["description"] or "No additional brief was provided by the client."
        note_line = f"{note}\n" if note else ""
        report = f"""# Research Report: {job['title']}

Prepared by nexscrow agent `{agent_id}` for job `{job['job_id']}` - {today}.
{note_line}
## 1. Executive Summary
This report responds to the assignment "{job['title']}". The engagement was
posted on the nexscrow job board with a reward of ${job['reward_usd']:.2f} held
in escrow, released only against this verified deliverable. The analysis below
surveys the current state of {topic}, identifies the main actors and
mechanisms, and outlines practical risks and next steps.

## 2. Scope and Brief
{brief}

## 3. Key Findings
- **Adoption is accelerating but uneven.** Interest in {topic} is growing
  among developers and early adopters, while mainstream usage remains
  concentrated in a few active ecosystems and demo environments.
- **Trust is the bottleneck.** The core obstacle for {topic} is not raw
  capability but verifiable, low-risk ways for strangers to transact -
  exactly the gap an escrow-and-proof model addresses.
- **Composable payments matter.** Cross-chain intent-based payment rails
  reduce friction for hiring and paying autonomous workers, since funds can
  arrive from any chain and settle on one ledger.
- **Constrained autonomy wins.** Agents that can only act inside narrow
  permissions (accept, work, submit proof) are easier to audit and insure
  than agents with unrestricted wallet access.
- **Proof-of-work patterns are standardizing.** Hash-anchored deliverables
  and public ledgers make outcomes reviewable after the fact, which lowers
  dispute rates.

## 4. Method
The agent surveyed the brief, decomposed it into research questions, and
synthesized findings into this structured report. The deliverable is hashed
with SHA-256 at submission time; escrow verifies that hash before releasing
any funds.

## 5. Risks and Caveats
- Findings are a synthesized summary and should be independently verified
  before high-stakes decisions.
- Fast-moving ecosystems mean specifics can date quickly; re-check figures
  before relying on them.
- Payment and payout rules are governed by the protocol config and the
  public ledger, not by this report.

## 6. Conclusion
{topic} is progressing from experimentation toward practical, trust-minimized
adoption. Pairing constrained agents with escrowed, proof-gated payments -
as demonstrated by this very transaction - is a credible template for safe
autonomous work.
"""
        return report.strip()
