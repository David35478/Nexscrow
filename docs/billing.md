# Dual payments: deployment and accounting guide

## Independent money systems

The existing `payment.py`, `near_chain.py`, and `escrow.py` payment paths are not
replaced. Pay-per-call requests still create NEAR-funded jobs, verify the deposit,
execute work, and use the existing approval/dispute/release rules. These jobs do
not issue credits. Billing orders never create, fund, refund, or release jobs.

Subscriptions/top-ups use the separate `BillingService` and official 1Click API.
They have distinct IDs, events, destination treasury configuration and settlement
references. The existing PostgreSQL `nexscrow_kv` storage remains in use. Financial
billing state lives in the `credit_accounts` JSONB document: accounts/buckets,
ledger entries, reservations, subscriptions/periods, payment orders, stored plans,
and consumed settlement hashes. One `store.update` transaction applies settlement,
subscription activation and credit grant together. Request/provider usage remains
in the separate existing request/execution collections. No cross-system balance
conversion is offered.

## Official 1Click contract

Reviewed sources:
- [Official quickstart](https://docs.agentsonintents.com/integration/distribution-channels/1click-api/quickstart/making-a-request)
- [Official OpenAPI](https://1click.chaindefuser.com/docs/v0/openapi.yaml)
- [Authentication](https://docs.agentsonintents.com/integration/distribution-channels/1click-api/authentication)

The server uses `GET /v0/tokens`, `POST /v0/quote`, and
`GET /v0/status?depositAddress=...&depositMemo=...` on
`https://1click.chaindefuser.com`. No unsupported network/token list is hardcoded.
A quote must prove route availability for the chosen origin asset. The configured
destination asset must also appear in the live token list.

Checkout uses `EXACT_OUTPUT`, `ORIGIN_CHAIN` deposit/refund and `DESTINATION_CHAIN`
recipient. USD offers are converted with Decimal arithmetic into destination base
units, rounded up, using the live destination token USD price and decimals. Stale
or missing price metadata rejects checkout. The USD valuation and full signed
quote are snapshotted; the treasury/asset is never supplied by the browser.
A dry quote previews cost; creating an order obtains a new non-dry quote and
unique deposit address/memo. The user sends the displayed exact origin amount
using their own wallet; Nexscrow does not sign an Intents transfer or autocharge.
Route cost estimates use the quote's USD input/output difference and are explicitly
not a guaranteed fee breakdown; actual refund/withdrawal fee fields are retained.

A server-fetched `SUCCESS` is checked against the immutable quote: correlation,
request asset/address/type/amount fields, signature equality to the saved response,
deposit address/memo, exact output amount, sufficient actual input/deposit amounts,
no refund indication, and destination transaction evidence. Every destination
transaction hash is consumed uniquely, scoped by destination asset. A hash cannot
fund a second order. This uses 1Click's authoritative settlement report over TLS;
it is **not** cryptographic quote-signature verification or an independent RPC
verifier for every supported chain. Deployment approval must accept this trust
model or add chain-specific verification before enabling checkout.

Pending/processing do not grant credits. Incomplete deposits remain underpaid.
Failure/refund never grant. Unexpected output, quote mismatch, conflicting hashes,
or late success go to review. Only a success timestamped before quote expiry can
automatically settle; it may be polled later. Unsettled orders past expiry become
expired. Funds that settle after expiry require explicit operator reconciliation;
they are not automatically credited or silently discarded. Original provider
responses and state events remain auditable. Rechecking a paid order that later
reports a refund/inconsistency freezes new credit reservations and records
`review_after_settlement`; no purchased balance is silently removed.

## Plans and credits

`config.yaml` defines plan IDs, USD prices, included credits, period days,
allowed agents, and rollover. Initial paid plans are Starter $9/500, Pro $29/2000,
Business $79/7000, with 30-day periods. Top-up packages are independently configurable.
Initial first-party agents cost 10 credits per successful execution, configurable
on each agent profile; the browser cannot set this price.

The free plan grants 20 credits once per live authenticated account for 30 days.
It has no automatic monthly grants and cannot be re-enrolled to farm credits.
Demo sessions cannot enroll or purchase. Wallet identity is not proof of a unique
human; production anti-abuse/rate-limit policy should account for sybil accounts.

- Paid subscription activates only in the same transaction as verified settlement.
- Same-plan renewal requires a new payment. It extends the period from the final
  prepaid expiry; its credits are unavailable until that future period starts.
- An upgrade starts a new full-price period immediately (no implicit proration).
  Previously granted credits retain their disclosed original expiry.
- Prepaid future periods block upgrades until an operator can reconcile the
  prepaid value; they are never silently truncated or lost.
- Downgrades can be scheduled at current expiry. A paid downgrade still requires
  a new purchase **after** expiry; scheduling never charges or grants access.
  A scheduled free downgrade applies at expiry with an idempotent grant.
- Plan credits expire at their period end unless rollover is explicitly enabled.
- Purchased top-ups never expire. Expired subscriptions cannot use subscription
  agent features until renewed, but top-up balances remain visible and retained.
- Reservations allocate bucket balances atomically, plan buckets first. Expiry
  removes only unreserved expired plan credits; held allocations survive for
  settlement. Failure releases them and then applies applicable plan expiry.
- Every grant, debit, and expiry creates a ledger entry. Zero/negative grants,
  overcapture, conflicting idempotency references and concurrent overspend fail.

Legacy unclassified credit balances migrate into a non-expiring legacy top-up
bucket, rather than assuming they may be expired. No balances are seeded.

## Configuration and activation gate

Checkout remains **disabled by default**, including in the managed preview.
No mainnet transfer, billable swap, or deployment was performed by this phase.
Before enabling:

1. Run `.venv/bin/python -m pytest -q`; verify the settlement, accounting, request,
   and original escrow regression suites. Rehearse PostgreSQL multi-worker behavior.
2. Set `DATABASE_URL` or `POSTGRES_URL`. Live subscription accounting requires
   PostgreSQL; the JSON backend is for isolated development/testing.
3. Set `BILLING_TREASURY_ADDRESS` and `BILLING_SETTLEMENT_ASSET` as backend secrets/
   deployment variables. Use a reviewed billing treasury, not the escrow fallback.
   Confirm destination network/address and token identifier against live discovery.
4. Optionally set `ONECLICK_API_KEY` to the partner JWT. It is only sent by the
   server. Unauthenticated quotes can have a different fee schedule.
5. Review prices, credit rates, allowed agents, terms, rollover, and settlement
   trust model. Token prices may fluctuate or stablecoins may depeg; quote snapshots
   protect accounting identity, not treasury market risk.
6. Perform an authorized small-value end-to-end rehearsal, verify actual treasury
   receipt and provider reporting, then explicitly set `billing.enabled: true`.
   1Click has no assumed testnet; do not mistake mocked tests for live proof.
7. Schedule the durable reconciliation command every minute on the deployment's
   worker/cron infrastructure (it never creates quotes or sends funds):

```sh
.venv/bin/python -m src.billing_reconcile --config config.yaml --limit 100
```

Browser polling is a convenience, not the sole settlement mechanism. Reconciliation
also checks paid records for post-settlement discrepancies. Adjust limits/schedule
for volume and upstream rate limits. Unknown quote submissions, expired/reviewed
payments, frozen accounts, and provider/dashboard discrepancies require an audited
operator procedure. There is deliberately no unauthenticated repair or free-credit
endpoint. Do not blindly unfreeze an account or resubmit an ambiguous purchase.

## Endpoints

Public: `/api/subscription/plans`, `/api/credits/packages`,
`/api/billing/payment-assets`.

Authenticated: `/api/subscription/me`, `/api/subscription/free`,
`/api/subscription/change`, `/api/subscription/quote`,
`/api/subscription/checkout`, `/api/credits/me`, `/api/credits/history`,
`/api/credits/topup/quote`, `/api/credits/topup/create`,
`/api/credits/topup/{payment_id}/status`, `/api/billing/history`.
The status route accepts owned subscription orders as well as top-ups.

Quote/create bodies take only server-known plan/package ID, supported origin asset,
refund address, and (for create) idempotency key. Extra properties, including client
prices, credits and treasury fields, are rejected. Payment reads enforce ownership.
The UI supports quote review, deposit/memo instructions, status, current/future
subscription dates, balances and auditable history. Crypto renewals are manual;
there is no recurring authorization or credit card integration.

For opt-in real-database tests, set `TEST_DATABASE_URL` to a local/test PostgreSQL
instance and run the same suite. Each PostgreSQL test creates and drops its own
random schema; it does not truncate application collections. The Phase 5 sandbox
rehearsal passed against PostgreSQL 16 with concurrent first grants, reservations,
duplicate settlement polling, and rollback after an injected transaction failure.
