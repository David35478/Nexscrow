# Nexscrow Phase 8 — security, reliability and deployment report

## Release verdict

**Not approved for unrestricted mainnet production.** Application workflows and
mocked financial verification are implemented and regression-tested, including
local PostgreSQL concurrency. Live checkout remains disabled. Passing tests do
not establish wallet-provider compatibility, actual chain receipts, commercial
permission, upstream availability, independent financial audit, or operational
readiness. Use a reviewed staging deployment and explicit release gates below.
No live swap, escrow transfer, provider purchase or production deployment was
performed for this audit.

## 1. Implemented system and status

| Surface | Implemented/tested | External or simulated boundary |
|---|---|---|
| Authentication | NEP-413 signatures, one-time challenge, sessions, Google/NEAR Auth token verification; OAuth state and secure production cookies | Actual wallet extensions, Google credentials and Auth0 audience/network need deployment verification |
| Existing escrow | Job creation, deposit quotes and verification, fees, manual/auto completion, cancellation, disputes, refund/payout rules | Chain/RPC/signing tested with mocks, not real money; post-release disputes cannot claw back an already-paid agent |
| Marketplace | Discovery, filters, details, catalog, recommendations, reputation | Only configured first-party listings active by default; provider listing requires permission and executable schema |
| Providers | Internal, Wiro async Run/Task, custom synchronous JSON contract, dev mocks | External keys and commercial redistribution approval absent; NEAR Agent Market disabled due unsupported buyer workflow |
| Requests | Owned workspace/history/results, schema validation, idempotency, execution leases, bounded polling, usage logs | Browser/request-driven, not a durable background execution worker; no file upload because current adapters do not support it |
| Subscription billing | Dynamic token/network discovery, exact-output quote, instructions/status, immutable settlement checks, unique hashes, reconciliation command | Disabled by default; relies on authoritative 1Click TLS report, not independent chain RPC or cryptographic quote-signature verification |
| Credit accounting | Atomic bucket grants/reserve/settle/release, expiry, top-up persistence, plan periods, scheduled/manual renewal | No recurring crypto charge; free allocation is one-time; billing/provider configuration required |
| Customer portal | Private aggregates, legacy history, separate billing, profile/preferences, session revocation | Notification delivery and wallet linking unavailable |
| Admin/developer | Explicit admin allowlist, audited overrides, financial records/reviews, developer submissions/schema-only test | Approval does not publish external APIs; no developer payouts, revenue sharing or arbitrary live API testing |

## 2. Audit changes and evidence

- Added `src/security.py`: same-origin unsafe-method protection; cross-site Fetch
  Metadata rejection; 256-KiB body cap including chunked bodies; persistent
  fixed-window API-write limits; random request IDs; safe HTTP completion/error
  logs; no-store, nosniff, framing/referrer headers and production HSTS.
- Production session cookies are Secure, HttpOnly and SameSite=Lax. Google login
  binds callback state to an expiring HttpOnly browser cookie. NEAR challenge
  consumption is atomic, rejecting concurrent reuse.
- Live job accept/work/proof/run require the posting client's live session.
  Live proof uses only the stored agent result; live bid placement requires admin
  until a real agent-auth surface is implemented. Demo compatibility is retained.
- Deposit claims now reject a second claim on the same job as well as a hash
  already used by another job.
- Live payouts/refunds atomically claim a per-job `transfer_intent` before a send.
  A competing release/refund cannot send; ambiguous claims cannot be retried
  automatically. Confirmed tx hashes persist before secondary ledger updates.
  Daily release-cap reservations serialize across jobs.
- Provider status updates return the persisted terminal record, not a stale poll's
  local outcome. A stale failed response cannot overwrite persisted success.
- Custom API requests reject DNS resolutions to private addresses in addition to
  URL/schema checks. Redirects remain disabled. DNS rebinding is still addressed
  by required deployment egress policy, not claimed solved by one DNS check.
- Added `src/execution_monitor.py` for read-only reporting of overdue/ambiguous
  requests and locked escrow-transfer reservations. No unsafe automatic resubmit.
- Added `scripts/production_check.py` for read-only, secret-value-free configuration
  checks. It fails in the current unconfigured development environment as intended.
- Added `tests/test_security.py`; expanded provider tests with explicit public-DNS
  fixtures. Existing tests remain intact except fixtures needed for the stricter
  security behavior. No coverage was weakened to pass.

Independent static reviews were considered. The concrete duplicate-transfer race
was fixed with concurrency tests. A concern that subscription activation happened
outside payment commit was checked against the source: order status, settlement
hashes, entitlement and grants all mutate the **same** billing document in one
PostgreSQL transaction. Credit snapshots persist expiry entries atomically.
Historical public job IDs are server-generated UUID fragments; theoretical unsafe
attribute construction is not evidence of an injectable user ID, but output/input
validation and renderer review remain ongoing defense-in-depth concerns.

## 3. Repository files and API inventory

Primary application: `main.py`, `config.yaml`, `.env.example`, `requirements.txt`,
`vercel.json`, `.hoplite/settings.json`, `demo_mode.py` and README.

Core modules: agent/agent_api/auth/constraints/disputes/env/escrow/jobs/ledger/
near_chain/payment/proof/reputation/storage/system; new services: billing,
billing_reconcile, credits, customer, execution_monitor, intents, management,
marketplace, requests, security. Provider modules: base/custom/execution/internal/
mock/registry/sync/wiro. Templates: original index/agents/dashboard/job_detail/
near_callback plus agent_detail/billing/customer_dashboard/management/
marketplace_components/marketplace_home/workspace. Static JS/CSS uses the existing
Jinja/vanilla-JS stack, with billing/customer_dashboard/management/marketplace/
workspace additions. Tests cover each surface; docs contain provider, request,
billing, customer and management runbooks.

For a complete **current** endpoint inventory use `/api/docs` or
`/openapi.json`—not an independently maintained partial API list. Major groups:

- `/api/auth/*`: session, demo, logout, Google, NEAR challenge/verify, FastAuth.
- `/api/jobs/*`: existing escrow lifecycle, bidding, disputes, proof and funding.
- `/api/agents*`, reputation, leaderboard, ledger/config/health: discovery/public
  board surfaces. Existing public job/ledger visibility remains intentional.
- `/api/requests*`: owner-only options/create/history/results/advance/retry/approve.
- `/api/subscription/*`, `/api/credits/*`, `/api/billing/*`: independent purchases,
  entitlements, bucket history and payment state.
- `/api/customer/dashboard`, `/api/account/*`: customer aggregates/preferences/
  sessions.
- `/api/admin/*`: guarded operations, agents/providers/offers, reviews and kill
  switch. `/api/developer/*`: owned onboarding/submission/schema validation.

## 4. Database and migration instructions

No relational ORM migration framework was introduced. Existing storage is one
PostgreSQL table, created idempotently on connection:

```sql
CREATE TABLE IF NOT EXISTS nexscrow_kv (
  name TEXT PRIMARY KEY,
  data JSONB NOT NULL
);
```

Collection updates acquire a transaction-scoped advisory lock (including first
insertion), then a row lock and one transaction. New collections are created on
first write: credit_accounts (atomic financial document), provider_registry,
provider_executions, task_requests, customer_settings, marketplace_management,
user_directory, rate_limits; existing jobs, ledger, sessions and challenges stay.
Credit normalization migrates legacy unclassified balances to a non-expiring
legacy top-up bucket. It never assumes old purchased balances may expire.

Upgrade steps: back up; deploy to isolated staging; use the production PostgreSQL
role only for its own database/table; start once to ensure schema; run tests with
`TEST_DATABASE_URL` pointed to a **test** database; run application read paths and
verify bucket/account totals against pre-upgrade exports. JSON-to-Postgres data
migration is not automatic: export each reviewed local collection, validate it,
and import via a controlled `PostgresStore.write` migration with a reconciliation
record. Do not point a new production deployment at ephemeral `/tmp` JSON.
Do not replay escrow or billing API calls to migrate state.

New `transfer_intent` records intentionally require operator recovery after an
ambiguous broadcast. Never remove one because a timeout occurred. Establish
on-chain status and the exact recipient/amount/tx before any repair. Collection-
wide JSONB locking limits throughput; measure production load before promising
large-scale capacity. Live tests do not replace accounting/reconciliation review.

## 5. Environment and production configuration

All names are documented without values in `.env.example`. Do not commit `.env`,
keys, DSNs, tokens, provider responses containing private inputs, or backups.

| Names | Purpose |
|---|---|
| `APP_ENV=production`, `APP_ORIGIN` | Secure cookies/HSTS and canonical HTTPS OAuth/CSRF origin |
| `DATABASE_URL` or `POSTGRES_URL` | Durable PostgreSQL; use TLS and least privilege |
| `NEXSCROW_DATA_DIR` | Local development only; not production durability |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth, exact callback registered |
| `NEAR_AUTH_NETWORK`, `NEAR_AUTH_CLIENT_ID` | Approved Auth0/NEAR Auth settings |
| `NEAR_AI_API_KEY` | First-party live inference |
| `ESCROW_PRIVATE_KEY` | Reviewed escrow signer, only secret manager/backend |
| `NEAR_INTENTS_AGENT_API_KEY` | Existing read-only agent policy API, not 1Click payment JWT |
| `WIRO_API_KEY`, `WIRO_API_SECRET`, `CUSTOM_AGENT_API_KEY` | Server-side provider adapters |
| `ONECLICK_API_KEY` | Optional partner 1Click JWT/authenticated fees |
| `BILLING_TREASURY_ADDRESS`, `BILLING_SETTLEMENT_ASSET` | Separate reviewed subscription/top-up destination and asset |
| `NEXSCROW_ADMIN_USER_IDS` | Explicit verified non-demo identities, no default admin |
| `TEST_DATABASE_URL` | Isolated opt-in test DB; never use production for tests |

Review `config.yaml`: network/RPC, escrow account, auth network/audience alignment,
payout accounts, allowlist, limits, timeout, fee, proof threshold, plan periods,
rollover, credit rates, token quote staleness, pinned provider models and commercial
review references. Keep billing/providers disabled until approval. Management
provider overrides require worker restart; billing/agent overrides persist and
are read dynamically. Disable demo access at an edge policy if the production
product must not expose public simulated workflows.

## 6. Deployment and verification

1. Provision PostgreSQL and a TLS-terminated trusted reverse proxy. Restrict allowed
   hosts at the edge, strip spoofed forwarding headers, set exact APP_ORIGIN, and
   do not trust arbitrary `X-Forwarded-For` for throttling.
2. Install through the repo venv:
   `python3 -m venv .venv` then `.venv/bin/python -m pip install -r requirements.txt`.
   Dependencies currently use lower bounds rather than a fully pinned lockfile;
   create/review reproducible build constraints before a production release.
3. Run `.venv/bin/python scripts/production_check.py`, then the full pytest suite.
   `TEST_DATABASE_URL` enables isolated-schema PostgreSQL tests; the test role must
   be permitted to create/drop schemas in that test database only.
4. Start the ASGI service with the existing stack, e.g.
   `.venv/bin/uvicorn main:app --host 0.0.0.0 --port 3000 --no-access-log`.
   Use a process manager/container restart policy and centralized redacted logs.
   Avoid access logs containing OAuth codes/query strings; application request
   logs contain generated IDs, method/path/status/duration, not bodies/secrets.
5. Vercel's current `maxDuration: 60` is bounded. There is no promise that long
   provider tasks continue inside a serverless request. Prefer async providers
   with persisted upstream IDs/status polling; use durable infrastructure for
   reconciliation. Do not run payment side effects in fire-and-forget threads.
6. Schedule `.venv/bin/python -m src.billing_reconcile --limit 100` every minute
   on an external worker/cron. Schedule `.venv/bin/python -m src.execution_monitor`
   and alert on output. Review pending age, unknown outcomes, settlement reviews,
   frozen accounts, transfer reservations, ledger/balance consistency, RPC/provider
   errors and daily caps. Logs are diagnostics, not financial source of truth.
7. Test real auth redirect/wallet signing on the deployed origin, then authorized
   minimal-value escrow funding/release/refund and 1Click settlement/treasury
   receipt. No unsupported testnet is assumed. Verify every model license and
   provider spend limit before charging customers. Only then enable selected
   live features and monitor a staged rollout.

## 7. Backup/recovery and incident response

Use managed PostgreSQL encrypted backups plus WAL/PITR where supported. Define
and approve RPO/RTO and retention; test restore before launch. Use a dedicated
backup role and password/connection configuration stored in a restricted service
file/secret manager (not CLI arguments or source). With libpq service credentials
configured, an example is `PGSERVICE=nexscrow_backup pg_dump -Fc -f backup.dump`.
Encrypt artifacts, checksum them, restrict access and transfer to approved storage.
Never publish dumps or session/identity contents as test artifacts.

Restore to a **new isolated** database: provision database/role, run `pg_restore`
against the configured restore service, verify collection counts and financial
references, and compare treasury/on-chain balances. A database restore can erase
knowledge of transfers made after the backup: keep signers and checkout disabled
until every intervening chain/provider event is reconciled. Never rerun ambiguous
transfer or execution operations from the restored records. Rotate sessions/keys
if compromise is suspected; preserve immutable evidence and review audit trails.
An application rollback must retain compatible database records; do not restore an
old financial DB merely to undo a UI release.

## 8. Remaining security/production requirements

- **Live payment approval pending:** chain-specific treasury verification or formal
  acceptance of 1Click's report trust model, real wallet/RPC tests and key custody.
- **Public visibility:** legacy public jobs can expose deliverables and client data.
  Do not accept confidential tasks until a privacy/access/retention migration is
  approved; owner-filtered dashboards alone do not make jobs private.
- **Post-release disputes:** already-paid NEAR cannot be reversed by this service;
  a dispute does not guarantee refunds from the pooled treasury. Manual approval
  is the recommended flow pending explicit dispute/custody policy.
- **SSRF:** URL/DNS checks are defense-in-depth. Enforce deny-private egress at the
  network layer, including metadata IPs, IPv6 and DNS rebinding. Never enable
  arbitrary developer endpoint calls from the portal.
- **Browser hardening:** limited CSP blocks objects/base/framing but existing inline
  scripts and remote wallet SDK imports prevent a strict nonce-only script policy.
  Bundle/pin SDK assets and move inline code before claiming strict CSP or supply-
  chain integrity. Escaping is tested but not a penetration-test guarantee.
- **Throttling:** durable API-write limits are basic (30 auth/120 other writes per
  minute per session/IP hash). Edge per-IP/global limits, bot/Sybil protection,
  expensive public GET limits and per-provider spend controls are still required.
  Credentials/session-derived rate keys are hashed, not logged raw.
- **Idempotency boundary:** external sends cannot be exactly-once without provider
  guarantees. Unknown outcomes block automatic retries; operator procedures are
  mandatory. Escrow signer nonce conflicts across different jobs remain bounded
  failures requiring reconciliation, not permission to resend.
- **Operational gaps:** notification delivery, wallet linking, developer payouts,
  fully automated execution workers, load/SLA validation, legal/tax review and
  independent security/financial assessment are not implemented or certified.

## 9. Verification records

The final run records current pytest totals in the task response. Local PostgreSQL
16 tests validate first-write locking, concurrent credit reservations, duplicate
payment settlement and rollback, with isolated random schemas. Security tests
cover CSRF, headers, chunked body caps, rate limits, Secure cookies, OAuth state,
NEAR challenge races, live ownership, double deposit claim, competing transfer,
ambiguous broadcast, private DNS and stale provider terminal outcomes.

Mocked tests establish deterministic financial policy, not mainnet proof. Browser
rehearsals exercise existing marketplace/search/details, demo request/funding/
delivery/approval, history and settings; admin/developer flows were separately
verified with isolated test identities. No secret artifact is published.

### Final Phase 8 evidence

- Full PostgreSQL-enabled pytest run: **193 passed**, no skips, one existing
  Starlette/httpx deprecation warning. Dependency consistency: `pip check` passed.
- Fresh browser demo escrow flow: created → funded → delivered → approved;
  persisted results/history/settings and session action passed; zero browser
  exceptions; no mobile horizontal overflow. Mock-only checkout tests confirmed
  stale quote invalidation, same-key/same-payload retry and no client-set prices.
- PostgreSQL 16 dump/restore rehearsal: isolated synthetic source database backed
  up with custom-format `pg_dump`, restored to a separate database with
  `pg_restore --exit-on-error`, and expected stored balance 42 recovered. Both
  rehearsal databases removed afterward. No customer or production data involved.
- Production preflight intentionally failed: development environment has no
  production origin/database, signing credentials, or configured administrator.
  Live Intents billing and external providers remain disabled.
- See `docs/change-inventory.md` for the complete implementation file list and
  `docs/api-inventory.md` for endpoint paths generated from current OpenAPI.
