"""Proof of work: SHA-256 content hashing and rule-based verification."""

from __future__ import annotations

import hashlib

from src.constraints import Constraints
from src.storage import utcnow


def content_hash(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def build_proof(job_id: str, content: str) -> dict:
    return {
        "job_id": job_id,
        "content": content,
        "content_hash": content_hash(content),
        "submitted_at": utcnow(),
    }


def verify_proof(proof: dict, constraints: Constraints) -> tuple[bool, list[str]]:
    """Check hash integrity and minimum deliverable length."""
    issues: list[str] = []
    content = proof.get("content") or ""
    if not content:
        issues.append("proof has no content")
    if len(content.strip()) < constraints.min_proof_length:
        issues.append(
            f"deliverable too short: {len(content.strip())} chars,"
            f" minimum is {constraints.min_proof_length}"
        )
    expected = proof.get("content_hash") or ""
    if not expected or content_hash(content) != expected:
        issues.append("content hash mismatch: proof does not match its sha256")
    return len(issues) == 0, issues
