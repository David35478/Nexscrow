"""Single source of truth for the NEAR network NexScrow may touch.

Only testnet is registered. Mainnet is deliberately absent: enabling it needs
an audited deployment that adds an entry here, so no configuration value or
environment variable can route a transaction to mainnet.
"""

from __future__ import annotations

import os
import re
from dataclasses import asdict, dataclass
from urllib.parse import urlparse


class NetworkError(Exception):
    """The requested chain operation is not allowed on the active network."""


@dataclass(frozen=True)
class NearNetwork:
    network_id: str
    label: str
    rpc_url: str
    explorer_url: str
    wallet_url: str
    account_suffix: str
    fast_auth_network: str
    test_tokens: bool


TESTNET = NearNetwork(
    network_id="testnet",
    label="NEAR Testnet",
    rpc_url="https://rpc.testnet.near.org",
    explorer_url="https://testnet.nearblocks.io",
    wallet_url="https://testnet.mynearwallet.com",
    account_suffix=".testnet",
    fast_auth_network="testnet",
    test_tokens=True,
)

SUPPORTED = {"testnet": TESTNET}
ALLOWED_RPC_HOSTS = {urlparse(n.rpc_url).hostname for n in SUPPORTED.values()}

# Implicit accounts (64-hex ed25519, 0x-prefixed eth) have no network suffix.
_IMPLICIT = re.compile(r"^(?:[0-9a-f]{64}|0x[0-9a-f]{40})$")
_ACCOUNT = re.compile(r"^(?=.{2,64}$)(?:[a-z\d]+[-_])*[a-z\d]+(?:\.(?:[a-z\d]+[-_])*[a-z\d]+)*$")


def is_production() -> bool:
    return os.environ.get("APP_ENV") == "production"


def requested_network(raw_config: dict | None = None) -> str | None:
    """Network id requested by env, or by config outside production.

    Production never inherits the repository default: chain operations stay
    disabled until NEAR_NETWORK is set explicitly for that deployment.
    """
    explicit = (os.environ.get("NEAR_NETWORK") or "").strip().lower()
    if explicit:
        return explicit
    if is_production():
        return None
    return str(((raw_config or {}).get("near") or {}).get("network") or "testnet").lower()


def status(raw_config: dict | None = None) -> dict:
    requested = requested_network(raw_config)
    if requested is None:
        return {"enabled": False, "network_id": None,
                "reason": "On-chain operations are disabled until NEAR_NETWORK is configured for this deployment."}
    network = SUPPORTED.get(requested)
    if network is None:
        return {"enabled": False, "network_id": None,
                "reason": f"NEAR network '{requested}' is not enabled in this build; only testnet is supported."}
    return {"enabled": True, "reason": None, **asdict(network)}


def active(raw_config: dict | None = None) -> NearNetwork:
    """Active network, or NetworkError when chain operations are disabled."""
    current = status(raw_config)
    if not current["enabled"]:
        raise NetworkError(current["reason"])
    return SUPPORTED[current["network_id"]]


def rpc_url(raw_config: dict | None = None) -> str:
    network = active(raw_config)
    override = (os.environ.get("NEAR_RPC_URL") or "").strip()
    url = (override or network.rpc_url).rstrip("/")
    assert_rpc_allowed(url)
    return url


def assert_rpc_allowed(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_RPC_HOSTS:
        raise NetworkError(f"RPC endpoint {parsed.hostname or url!r} is not an allowed testnet endpoint")


def validate_account(account_id: str | None, role: str, network: NearNetwork) -> str:
    """Reject accounts that belong to another network (e.g. `*.near`)."""
    account = (account_id or "").strip().lower()
    if not account:
        raise NetworkError(f"{role} NEAR account is not configured")
    if _IMPLICIT.match(account):
        return account
    if not _ACCOUNT.match(account) or not account.endswith(network.account_suffix):
        raise NetworkError(
            f"{role} account '{account}' is not a {network.label} account"
            f" (expected a name ending in '{network.account_suffix}')"
        )
    return account


def explorer_tx_url(tx_hash: str | None, raw_config: dict | None = None) -> str | None:
    if not tx_hash:
        return None
    current = status(raw_config)
    return f"{current['explorer_url']}/txns/{tx_hash}" if current["enabled"] else None
