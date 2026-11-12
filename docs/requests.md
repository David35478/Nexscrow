# Agent requests and payment isolation

## Workspace and API

Open `/workspace?agent=AGENT_ID`; `/requests` displays the same owned request history.
Requests require a session. Demo sessions may run simulated first-party escrow
only; live requests require PostgreSQL. Unauthenticated users are directed to the
existing sign-in page. Current adapters support JSON/text inputs, not file upload;
the workspace states that limitation rather than pretending to upload files.

- `GET /api/requests/options/{agent_id}`: authoritative task price, credit cost,
  entitlement, balance and input schema.
- `POST /api/requests`: `{agent_id, inputs, payment_method, idempotency_key}`.
  Unknown properties (including frontend prices) are rejected.
- `GET /api/requests` and `GET /api/requests/{request_id}`: owner-only history,
  results, execution logs and usage. Other users receive 404.
- `POST /api/requests/{request_id}/advance`: execute after verified funding or
  poll the existing upstream execution. Repeating the same request cannot submit
  another upstream task.
- `POST /api/requests/{request_id}/retry`: same safe continuation, not resubmission.
  Terminal failure or unknown outcomes do not automatically rerun.
- `POST /api/requests/{request_id}/approve`: owner approval for a delivered escrow
  request, using existing escrow release rules.

Request bodies are validated against each registered agent's JSON schema. Prices
come from server configuration, not the browser. Optional `task_price_usd` on an
internal agent profile or external agent's pricing sets its fixed task price;
otherwise the existing agent's escrow cap, bounded by the platform cap, is used.
Optional positive integer `credit_cost` enables fixed-price credit execution.
No subscription, entitlement or balance is seeded by default. Changing pricing
later does not change an existing request's price snapshot.

## Separate payment flows

Escrow requests create ordinary Nexscrow jobs with manual client approval, wait
for backend-verified funding, execute the chosen adapter, persist delivery/proof,
and await the posting client's approval. No credit reservation or debit is made.
Demo deposits use the existing clearly simulated approval path. Live deposits use
the existing wallet/RPC preparation and confirmation path.

Credit requests never create an escrow job. They check subscription access and
atomically reserve the configured integer credit cost in `credit_accounts`.
After a confirmed provider result the fixed execution charge is settled once,
with provider usage stored separately. Variable token-based billing is not
inferred from upstream dollar costs. A future variable tariff must explicitly
translate verified usage to credits and stay within the reservation.

Confirmed failures release the reservation. Ambiguous outcomes retain it for
operator reconciliation: a network timeout is not proof that the provider failed.
Success is persisted before settlement; interrupted settlement resumes without
rerunning the provider. No live credit-funded first-party task uses the template
fallback. The legacy demo and pre-existing escrow behavior remain intact.

`CreditService.grant` is an internal operator/billing-integration operation with an
idempotent source reference, plan, allowed-agent list, and optional expiry. There
is deliberately no public endpoint to grant credits or assert an entitlement.
Subscription purchasing and NEAR Intents settlement are not implemented by this
phase. Grants must only follow an independently verified purchase/authorized
operator action. Ledger entries, balances, subscriptions and reservations share
one atomic store mutation; PostgreSQL is required for live multi-worker traffic.

## Safety, timeout and recovery

Creation is reserved atomically using an owner-scoped idempotency key and input
fingerprint. In-flight execution uses a bounded lease; stale first-party execution
becomes unknown rather than being resubmitted. A 30-minute monitoring deadline
stops polling and requests operator reconciliation; it does not claim to cancel
an upstream task. Adapter HTTP timeouts bound individual network requests. Status
polling never invents a provider callback or unsupported cancellation endpoint.
Browser polling is bounded, pauses when hidden, and cannot run an unfunded task.

This is request-driven execution, not an always-on background worker: closing the
browser pauses polling but preserves the upstream task ID. Reopening history can
continue status checks. Long-running providers must support status polling; the
custom synchronous adapter must finish within its configured HTTP timeout.

`creating` interrupted between request reservation and job/reservation creation,
`unknown`, and upstream ambiguous submissions require operator reconciliation.
There is no automatic release/resubmit in these states. The request fingerprint,
provider execution records and escrow job reference let an operator establish
what occurred before repair. Existing escrow cancellation/timeouts are unchanged;
provider monitoring expiry does not independently refund an escrow job.

Results are displayed as text, not injected HTML. Ownership is enforced on all
request API operations. Existing public job/ledger routes retain their historical
visibility; escrow jobs are not a confidential workspace for sensitive material.

## Verification

Run `.venv/bin/python -m pytest -q`. Tests exercise atomic concurrent reservations,
idempotency, cross-user access, server pricing, no pre-funding execution, credit
capture/release, ambiguous outcomes, lease recovery and settlement continuation.
Paid live provider calls, actual on-chain transfers, and PostgreSQL concurrency
need a deployment rehearsal with authorized credentials; local tests use mocks.
