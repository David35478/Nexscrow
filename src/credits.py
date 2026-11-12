"""Atomic subscription-credit ledger with independently expiring credit buckets."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
import uuid


class CreditError(ValueError):
    """Invalid or unavailable credit operation."""


_COLLECTION = "credit_accounts"


def empty_state() -> dict:
    return {"accounts": {}, "reservations": {}, "entries": [], "subscriptions": {}}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _date(value: str | None) -> datetime | None:
    if value is None:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (AttributeError, ValueError) as exc:
        raise CreditError("expires_at must be an ISO datetime") from exc
    if parsed.tzinfo is None:
        raise CreditError("expires_at must include a timezone")
    return parsed.astimezone(timezone.utc)


def _positive(value: int, name: str, *, zero: bool = False) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value < (0 if zero else 1):
        raise CreditError(f"{name} must be {'a non-negative' if zero else 'a positive'} integer")
    return value


def normalize(data: dict, user_id: str) -> dict:
    """Ensure the ledger structure and migrate any legacy balance without losing it."""
    data.setdefault("accounts", {})
    data.setdefault("reservations", {})
    data.setdefault("entries", [])
    data.setdefault("subscriptions", {})
    account = data["accounts"].setdefault(user_id, {"balance": 0})
    account.setdefault("balance", 0)
    buckets = account.setdefault("buckets", [])
    bucket_total = sum(int(b.get("remaining", 0)) for b in buckets)
    if account["balance"] > bucket_total:
        # Historical credits have no trustworthy expiry or source classification.
        buckets.append({"id": f"legacy:{user_id}", "kind": "topup", "remaining": account["balance"] - bucket_total,
                        "expires_at": None, "reference": "legacy-migration"})
    account["balance"] = sum(int(b.get("remaining", 0)) for b in buckets)
    return data


def _held(data: dict, bucket_id: str) -> int:
    return sum(a.get("amount", 0) for r in data["reservations"].values()
               if r.get("status") == "reserved" for a in r.get("allocations", [])
               if a.get("bucket_id") == bucket_id)


def expire(data: dict, user_id: str, now: datetime | None = None) -> int:
    """Expire unreserved plan credits; reserved credits remain held until resolved."""
    normalize(data, user_id)
    now = now or _now()
    if now.tzinfo is None:
        raise CreditError("now must include a timezone")
    account = data["accounts"][user_id]
    expired = 0
    for bucket in account["buckets"]:
        expiry = _date(bucket.get("expires_at"))
        if bucket.get("kind") != "plan" or expiry is None or expiry > now or bucket.get("remaining", 0) <= 0:
            continue
        held = _held(data, bucket["id"])
        amount = max(0, bucket["remaining"] - held)
        if amount:
            bucket["remaining"] -= amount
            expired += amount
            data["entries"].append({"id": str(uuid.uuid4()), "user_id": user_id,
                "reference": f"expire:{bucket['id']}", "amount": -amount, "kind": "expiration",
                "bucket_kind": "plan", "created_at": now.isoformat()})
    account["balance"] = sum(b["remaining"] for b in account["buckets"])
    return expired


def grant_in_state(data: dict, user_id: str, amount: int, reference: str,
                   kind: str = "plan", expires_at: str | None = None,
                   starts_at: str | None = None) -> dict:
    amount = _positive(amount, "amount")
    if not user_id or not reference or kind not in ("plan", "topup"):
        raise CreditError("user_id, reference, and a valid credit kind are required")
    expiry = _date(expires_at)
    start = _date(starts_at)
    if expiry and start and expiry <= start:
        raise CreditError("expires_at must be after starts_at")
    if kind == "topup" and expires_at is not None:
        raise CreditError("purchased top-up credits cannot have an expiry")
    normalize(data, user_id)
    for entry in data["entries"]:
        if entry.get("reference") == reference:
            if entry.get("user_id") != user_id or entry.get("kind") != "grant" or entry.get("amount") != amount or entry.get("bucket_kind", "plan") != kind or entry.get("starts_at") != (start.isoformat() if start else None):
                raise CreditError("grant reference already used")
            return entry.copy()
    account = data["accounts"][user_id]
    bucket_id = str(uuid.uuid4())
    account["buckets"].append({"id": bucket_id, "kind": kind, "remaining": amount,
                               "starts_at": start.isoformat() if start else None,
                               "expires_at": expiry.isoformat() if expiry else None, "reference": reference})
    account["balance"] += amount
    entry = {"id": str(uuid.uuid4()), "user_id": user_id, "reference": reference,
             "amount": amount, "kind": "grant", "bucket_kind": kind,
             "bucket_id": bucket_id, "starts_at": start.isoformat() if start else None,
             "created_at": _now().isoformat()}
    data["entries"].append(entry)
    return entry.copy()


class CreditService:
    def __init__(self, store: Any):
        self.store = store

    def _update(self, mutate):
        return self.store.update(_COLLECTION, empty_state(), mutate)

    def _view(self, data: dict, user_id: str) -> dict:
        normalize(data, user_id)
        expire(data, user_id)
        account = data["accounts"][user_id]
        reserved = sum(r["amount"] for r in data["reservations"].values()
                       if r["user_id"] == user_id and r["status"] == "reserved")
        now = _now()
        future = sum(b["remaining"] for b in account["buckets"]
                     if b["kind"] == "plan" and _date(b.get("starts_at")) and _date(b["starts_at"]) > now)
        plan = sum(b["remaining"] for b in account["buckets"] if b["kind"] == "plan") - future
        topup = sum(b["remaining"] for b in account["buckets"] if b["kind"] != "plan")
        balance = account["balance"] - future
        return {"balance": balance, "available": balance - reserved,
                "plan_credits": plan, "topup_credits": topup, "scheduled_plan_credits": future}

    def grant(self, user_id: str, amount: int, reference: str, plan: str,
              allowed_agents: list[str], expires_at: str | None = None) -> dict:
        if not user_id or not reference or not plan or not isinstance(allowed_agents, list):
            raise CreditError("user_id, reference, plan, and allowed_agents are required")
        def mutate(data):
            entry = grant_in_state(data, user_id, amount, reference, "plan", expires_at)
            data["subscriptions"][user_id] = {"plan": plan, "allowed_agents": list(allowed_agents),
                                               "expires_at": expires_at}
            return entry
        return self._update(mutate)

    def topup(self, user_id: str, amount: int, reference: str) -> dict:
        return self._update(lambda data: grant_in_state(data, user_id, amount, reference, "topup"))

    def entitlement(self, user_id: str, agent_id: str) -> dict:
        view = self.snapshot(user_id)
        sub = view['subscription']
        valid = bool(sub)
        if valid and sub.get("expires_at"):
            valid = _date(sub["expires_at"]) > _now()
        allowed = bool(valid and not view['frozen'] and ("*" in sub["allowed_agents"] or agent_id in sub["allowed_agents"]))
        return {"allowed": allowed, "balance": view["balance"], "available": view["available"],
                "plan": sub.get("plan") if sub else None}

    @staticmethod
    def _active_subscription(subscription: dict | None, now: datetime | None = None) -> dict | None:
        if not subscription:
            return None
        periods = subscription.get("periods")
        if periods is None:
            return subscription
        now = now or _now()
        active = []
        for period in periods:
            start, end = _date(period.get("start_at")), _date(period.get("expires_at"))
            if (start is None or start <= now) and (end is None or end > now):
                active.append(period)
        floor = datetime.min.replace(tzinfo=timezone.utc)
        return max(active, key=lambda p: _date(p.get("start_at")) or floor) if active else None

    def reserve(self, user_id: str, agent_id: str, request_id: str, amount: int) -> dict:
        amount = _positive(amount, "amount")
        if not user_id or not agent_id or not request_id:
            raise CreditError("user_id, agent_id, and request_id are required")
        def mutate(data):
            normalize(data, user_id)
            expire(data, user_id)
            old = data["reservations"].get(request_id)
            if old:
                if (old["user_id"], old["agent_id"], old["amount"]) != (user_id, agent_id, amount):
                    raise CreditError("request_id already used")
                return old.copy()
            if data['accounts'][user_id].get('frozen'):
                raise CreditError('Credit account requires payment reconciliation')
            sub = self._active_subscription(data["subscriptions"].get(user_id))
            if not sub or (sub.get("expires_at") and _date(sub["expires_at"]) <= _now()) or not ("*" in sub["allowed_agents"] or agent_id in sub["allowed_agents"]):
                raise CreditError("subscription does not permit this agent")
            view = self._view(data, user_id)
            if view["available"] < amount:
                raise CreditError("insufficient credits")
            buckets = data["accounts"][user_id]["buckets"]
            remaining, allocations = amount, []
            candidates = sorted(buckets, key=lambda b: (b["kind"] != "plan", _date(b.get("expires_at")) or datetime.max.replace(tzinfo=timezone.utc)))
            for bucket in candidates:
                start = _date(bucket.get("starts_at"))
                if start and start > _now():
                    continue
                free = bucket["remaining"] - _held(data, bucket["id"])
                take = min(remaining, max(0, free))
                if take:
                    allocations.append({"bucket_id": bucket["id"], "amount": take})
                    remaining -= take
                if not remaining:
                    break
            if remaining:
                raise CreditError("insufficient credits")
            reservation = {"request_id": request_id, "user_id": user_id, "agent_id": agent_id,
                           "amount": amount, "status": "reserved", "actual_amount": None, "allocations": allocations}
            data["reservations"][request_id] = reservation
            return reservation.copy()
        return self._update(mutate)

    def settle(self, request_id: str, actual_amount: int) -> dict:
        actual_amount = _positive(actual_amount, "actual_amount", zero=True)
        def mutate(data):
            r = data["reservations"].get(request_id)
            if not r:
                raise CreditError("unknown request_id")
            if r["status"] == "settled":
                if r["actual_amount"] != actual_amount:
                    raise CreditError("settlement amount differs from prior settlement")
                return r.copy()
            if r["status"] != "reserved":
                raise CreditError("reservation was released")
            if actual_amount > r["amount"]:
                raise CreditError("actual usage exceeds reservation")
            normalize(data, r["user_id"])
            buckets = {b["id"]: b for b in data["accounts"][r["user_id"]]["buckets"]}
            left = actual_amount
            for allocation in r.get("allocations", []):
                spent = min(left, allocation["amount"])
                buckets[allocation["bucket_id"]]["remaining"] -= spent
                left -= spent
            if left:
                raise CreditError("reservation allocations are inconsistent")
            account = data["accounts"][r["user_id"]]
            account["balance"] -= actual_amount
            r["status"], r["actual_amount"] = "settled", actual_amount
            data["entries"].append({"id": str(uuid.uuid4()), "user_id": r["user_id"],
                "reference": request_id, "amount": -actual_amount, "kind": "debit",
                "created_at": _now().isoformat()})
            expire(data, r["user_id"])
            return r.copy()
        return self._update(mutate)

    def release(self, request_id: str) -> dict:
        def mutate(data):
            r = data["reservations"].get(request_id)
            if not r:
                raise CreditError("unknown request_id")
            if r["status"] == "released":
                return r.copy()
            if r["status"] != "reserved":
                raise CreditError("settled reservation cannot be released")
            r["status"] = "released"
            expire(data, r["user_id"])
            return r.copy()
        return self._update(mutate)

    def snapshot(self, user_id: str) -> dict:
        def mutate(data):
            view = self._view(data, user_id)
            stored_sub = data.get('subscriptions', {}).get(user_id)
            return {**view, 'frozen': bool(data['accounts'][user_id].get('frozen')), 'freeze_reason': data['accounts'][user_id].get('freeze_reason'),
                    'subscription': self._active_subscription(stored_sub),
                    'scheduled_subscriptions': [p.copy() for p in (stored_sub or {}).get('periods', []) if p.get('start_at') and _date(p['start_at']) > _now()],
                    'reservations': [r.copy() for r in data.get('reservations', {}).values() if r['user_id'] == user_id],
                    'entries': [e.copy() for e in data.get('entries', []) if e['user_id'] == user_id]}
        return self._update(mutate)
