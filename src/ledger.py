"""Append-only public ledger of every escrow event."""

from __future__ import annotations

import uuid
from typing import Any

from src.storage import JsonStore, utcnow


class Ledger:
    def __init__(self, store: JsonStore):
        self._store = store
        self._name = "ledger"

    def append(
        self,
        event_type: str,
        job_id: str | None = None,
        details: str | None = None,
        amount_usd: float | None = None,
    ) -> dict:
        entry = {
            "event_id": uuid.uuid4().hex[:10],
            "ts": utcnow(),
            "event_type": event_type,
            "job_id": job_id,
            "details": details,
            "amount_usd": amount_usd,
        }
        self._store.update(self._name, [], lambda events: events.append(entry))
        return entry

    def events(self, limit: int | None = None) -> list[dict]:
        events: list[Any] = list(self._store.read(self._name, []))
        events.sort(key=lambda e: e.get("ts", ""))
        if limit is not None:
            events = events[-limit:]
        return events

    def released_today(self) -> float:
        """Total USD released from escrow today (UTC), for the daily payout cap."""
        today = utcnow()[:10]
        return round(
            sum(
                e.get("amount_usd") or 0.0
                for e in self.events()
                if e.get("event_type") == "funds_released"
                and str(e.get("ts", "")).startswith(today)
            ),
            2,
        )
