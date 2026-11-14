"""Person-to-person escrow ("deals"): pay -> held -> both confirm -> released."""
from __future__ import annotations

import hashlib
import hmac
import secrets
import uuid

from src.storage import utcnow

MIN_USD, MAX_USD = 1.0, 10_000.0


class DealError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def _hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _event(deal: dict, name: str) -> None:
    deal["events"].append({"event": name, "at": utcnow()})


class DealService:
    def __init__(self, store):
        self._store = store

    # Live NEAR funding/release is not wired for deals yet.
    @staticmethod
    def _require_simulated(user: dict) -> None:
        if user.get("provider") != "demo":
            raise DealError("Live person-to-person escrow is coming soon")

    @staticmethod
    def _public(deal: dict, user_id: str | None) -> dict:
        out = {k: v for k, v in deal.items() if k != "token_hash"}
        out["role"] = "buyer" if user_id == deal["buyer_id"] else "seller" if user_id == deal["seller_id"] else None
        return out

    def _mutate(self, deal_id: str, user: dict | None, fn, *, party_only=True) -> dict:
        def mutate(deals: dict):
            deal = deals.get(deal_id)
            uid = user["user_id"] if user else None
            if not deal or (party_only and uid not in (deal["buyer_id"], deal["seller_id"])):
                raise DealError("deal not found", 404)
            fn(deal, uid)
            deal["updated_at"] = utcnow()
            return self._public(deal, uid)

        return self._store.update("deals", {}, mutate)

    def create(self, user: dict, title: str, description: str, amount_usd: float, seller_account: str | None = None) -> dict:
        self._require_simulated(user)
        title, description = (title or "").strip(), (description or "").strip()
        if not title or len(title) > 120 or len(description) > 2000:
            raise DealError("title is required (max 120 chars); description max 2000 chars")
        if not isinstance(amount_usd, (int, float)) or isinstance(amount_usd, bool) or not MIN_USD <= amount_usd <= MAX_USD:
            raise DealError(f"amount must be between {MIN_USD:g} and {MAX_USD:,.0f} USD")
        token = secrets.token_urlsafe(24)
        deal = {
            "id": uuid.uuid4().hex[:16], "title": title, "description": description,
            "amount_usd": round(float(amount_usd), 2), "seller_account": (seller_account or "").strip() or None,
            "buyer_id": user["user_id"], "buyer_name": user.get("name"), "seller_id": None, "seller_name": None,
            "status": "draft", "buyer_confirmed": False, "seller_confirmed": False, "simulated": True,
            "token_hash": _hash(token), "events": [], "created_at": utcnow(), "updated_at": utcnow(),
        }
        _event(deal, "created")

        def mutate(deals: dict):
            deals[deal["id"]] = deal

        self._store.update("deals", {}, mutate)
        return {**self._public(deal, user["user_id"]), "invite_path": f"/deals/{deal['id']}?token={token}"}

    def list_for(self, user: dict) -> list[dict]:
        uid = user["user_id"]
        deals = [d for d in self._store.read("deals", {}).values() if uid in (d["buyer_id"], d["seller_id"])]
        deals.sort(key=lambda d: d["created_at"], reverse=True)
        return [self._public(d, uid) for d in deals]

    def get(self, user: dict, deal_id: str) -> dict:
        deal = self._store.read("deals", {}).get(deal_id)
        if not deal or user["user_id"] not in (deal["buyer_id"], deal["seller_id"]):
            raise DealError("deal not found", 404)
        return self._public(deal, user["user_id"])

    def peek(self, user: dict, deal_id: str, token: str | None) -> bool:
        """Whether this user may view the deal page (party, or holder of a valid invite)."""
        deal = self._store.read("deals", {}).get(deal_id)
        if not deal:
            return False
        if user["user_id"] in (deal["buyer_id"], deal["seller_id"]):
            return True
        return bool(token) and deal["seller_id"] is None and hmac.compare_digest(_hash(token), deal["token_hash"])

    def join(self, user: dict, deal_id: str, token: str) -> dict:
        self._require_simulated(user)
        uid = user["user_id"]

        def mutate(deals: dict):
            deal = deals.get(deal_id)
            if not deal or not token or not hmac.compare_digest(_hash(token), deal["token_hash"]):
                raise DealError("deal not found", 404)
            if uid == deal["buyer_id"]:
                raise DealError("the buyer cannot be the seller")
            if deal["seller_id"] == uid:
                return self._public(deal, uid)
            if deal["seller_id"] or deal["status"] not in ("draft", "funded"):
                raise DealError("this deal cannot be joined")
            deal["seller_id"], deal["seller_name"] = uid, user.get("name")
            _event(deal, "seller_joined")
            deal["updated_at"] = utcnow()
            return self._public(deal, uid)

        return self._store.update("deals", {}, mutate)

    def fund(self, user: dict, deal_id: str) -> dict:
        self._require_simulated(user)

        def fn(deal, uid):
            if uid != deal["buyer_id"]:
                raise DealError("only the buyer can pay", 403)
            if deal["status"] != "draft":
                raise DealError(f"deal is {deal['status']}; it cannot be funded")
            deal["status"] = "funded"
            _event(deal, "funded")

        return self._mutate(deal_id, user, fn)

    def confirm(self, user: dict, deal_id: str) -> dict:
        def fn(deal, uid):
            if deal["status"] != "funded":
                raise DealError(f"deal is {deal['status']}; funds must be held to confirm")
            if not deal["seller_id"]:
                raise DealError("the seller has not joined yet")
            side = "buyer" if uid == deal["buyer_id"] else "seller"
            if deal[f"{side}_confirmed"]:
                return
            deal[f"{side}_confirmed"] = True
            _event(deal, f"{side}_confirmed")
            if deal["buyer_confirmed"] and deal["seller_confirmed"]:
                deal["status"] = "released"  # single guarded transition under the store update
                _event(deal, "released")

        return self._mutate(deal_id, user, fn)

    def cancel(self, user: dict, deal_id: str) -> dict:
        def fn(deal, uid):
            if deal["status"] != "draft":
                raise DealError("only unfunded deals can be cancelled; open a dispute instead")
            deal["status"] = "cancelled"
            _event(deal, "cancelled")

        return self._mutate(deal_id, user, fn)

    def dispute(self, user: dict, deal_id: str, reason: str = "") -> dict:
        def fn(deal, uid):
            if deal["status"] != "funded":
                raise DealError("only funded deals can be disputed")
            deal["status"] = "disputed"
            deal["dispute_reason"] = (reason or "").strip()[:1000]
            deal["disputed_by"] = uid
            _event(deal, "disputed")

        return self._mutate(deal_id, user, fn)

    def resolve(self, deal_id: str, outcome: str) -> dict:
        if outcome not in ("refund", "release"):
            raise DealError("outcome must be 'refund' or 'release'")

        def fn(deal, uid):
            if deal["status"] != "disputed":
                raise DealError("deal is not disputed")
            if outcome == "release" and not deal["seller_id"]:
                raise DealError("the seller has not joined")
            deal["status"] = "refunded" if outcome == "refund" else "released"
            _event(deal, deal["status"])

        return self._mutate(deal_id, None, fn, party_only=False)
