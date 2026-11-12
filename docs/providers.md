# Unified provider integration

## Scope and capabilities

The existing Nexscrow agents and NEAR escrow lifecycle are preserved. The catalog
now includes normalized identity, schema, pricing, payment-method, listing, and
commercial-status fields. First-party agents are normalized at runtime; external
registrations and execution history persist through the existing storage layer.
No subscription credits or new payment mechanism are introduced.

Adapters declare capabilities instead of pretending every upstream is equivalent:

| Adapter | Discovery | Metadata | Execute | Status/results/usage | Health |
| --- | --- | --- | --- | --- | --- |
| Existing Nexscrow work engine | Config catalog | Config catalog | Synchronous | Immediate result; no upstream cost | Not claimed |
| Wiro | Tool/List (bounded) | Tool/Detail | Async Run | Task/Detail, terminal outputs and totalcost | Non-billable Tool/List probe |
| Custom JSON API | Operator-configured | Operator-configured | Synchronous POST | Immediate result/optional usage; no polling | Not claimed |
| Mock | Deterministic fixtures | Fixture | Fixture | Fixture | Development only |
| NEAR Agent Market | Not enabled | Not enabled | Not enabled | Not enabled | Not claimed |

The mock is injectable in tests and is never enabled by production configuration.
Provider credentials are loaded only from named environment variables. No provider
instance is created per user. Models are pinned by operators, not auto-published
from discovery results.

## Official references reviewed

- Wiro [API introduction](https://wiro.ai/docs), [authentication](https://wiro.ai/docs/authentication),
  [models](https://wiro.ai/docs/models), [Run](https://wiro.ai/docs/run-a-model),
  [tasks](https://wiro.ai/docs/tasks).
- Wiro [Terms of Service](https://wiro.ai/agreement/terms-of-service): API integration
  is described and output commercialization is discussed, but these do **not**
  establish permission to resell the service or build a competing marketplace.
  Individual model terms also apply. Obtain written approval for Nexscrow's use
  and check each model license before recording approval. The software gate does
  not itself confer permission.
- NEAR [Agent Market worker API](https://market.near.ai/skill/reference/agent-api.md):
  the documented `aat_` token is worker-scoped; assignments, bids, progress, and
  submissions are not a standalone buyer-side agent execution API. Integration
  remains explicitly disabled pending a verified buyer workflow, permissions,
  and review of its separate escrow/economics. The existing NEAR AI inference
  engine is not represented as an Agent Market integration.

Wiro uses `POST https://api.wiro.ai/v1/Tool/Detail`, `/Tool/List`,
`/Run/{owner}/{project}`, and `/Task/Detail`. A Run returns `taskid`; it is stored
before polling. Only `task_postprocess_end` with `pexit == "0"` succeeds.
`task_error` is not necessarily terminal. Authentication uses `x-api-key`; if a
secret is supplied, nonce/signature headers follow Wiro's documented HMAC scheme.
Unsupported input parameter types are excluded rather than guessed.

## Operator setup

1. Configure PostgreSQL (`DATABASE_URL` or `POSTGRES_URL`). JSON remains suitable
   for local tests, not live external execution. Provider reservations use
   PostgreSQL transactional collection locks, including the first insertion.
2. Add `WIRO_API_KEY` and optionally `WIRO_API_SECRET`, or a custom provider key,
   to the server's secret store. Never put values in YAML or browser code.
3. Enable a provider and pin approved model registrations under `providers` in
   `config.yaml`. Example structure (placeholders, not a purchasable listing):

```yaml
providers:
  wiro:
    kind: wiro
    enabled: true
    api_key_env: WIRO_API_KEY
    api_secret_env: WIRO_API_SECRET
    timeout_seconds: 20
    agents:
      - provider_agent_id: OWNER/MODEL
        listing_status: active
        commercial_authorization_status: approved
        commercial_authorization_reference: YOUR_REVIEWED_AGREEMENT_REFERENCE
        pricing:
          max_task_usd: 5
        payout_account: YOUR_REVIEWED_PLATFORM_TREASURY.near
```

4. Run `.venv/bin/python -m src.providers.sync --config config.yaml` in the
   deployment's environment. Optional `--data-dir` is for local development.
   Synchronization never executes models or takes payments. Metadata failures
   remove affected listings; missing credentials, permission, schema, pricing,
   or payout settings keep listings hidden. Repeat sync after model/schema or
   configuration changes, then restart app workers to refresh their allowlist.
5. Verify the model using controlled inputs and provider billing before allowing
   customer traffic. The task cap is an escrow reward cap, **not** a promise that
   upstream cost is capped. Check provider-side spend limits and margins.

Wiro and NEAR Agent Market are disabled by default. There are no verified external
commercial permissions or provider credentials bundled with this repository.

## Custom API contract (Nexscrow-defined, not a claimed upstream standard)

Configure `kind: custom`, `enabled: true`, a key environment variable (or explicitly
`authentication: none` for a public API), and registrations with the same listing
fields above plus:

```yaml
provider_agent_id: your-agent
name: Your agent
description: Your own agent API
category: Research
capabilities: [research]
execution_url: https://YOUR-OWNED-HOST/YOUR-VERIFIED-ROUTE
input_schema:
  type: object
  properties:
    prompt: {type: string}
  required: [prompt]
  additionalProperties: false
output_schema: {type: string}
```

Nexscrow sends `POST` with `{"inputs": {...}}` and optional Bearer authorization.
The service must return `{"execution_id":"...", "result":..., "usage":...}`;
`usage` is optional. Only use this adapter for APIs implementing that exact
contract. It does not invent discovery, health, or polling endpoints. HTTPS fixed
operator-controlled URLs are required; redirects, literal private IPs, embedded
credentials and local hostnames are rejected. Deployment egress policy must also
block private networks/DNS rebinding; provider URLs are not user-editable.

## Execution and marketplace behavior

External catalog entries flow through the existing `/api/agents`, recommendations,
homepage, and detail pages. The hire form exposes JSON inputs for external agents.
Inputs are checked before a job is created when `external_agent_id` is supplied,
and again before acceptance/execution. Existing job APIs accept optional
`provider_inputs`. External actions require the live posting client's session;
demo jobs cannot incur upstream costs. Pending upstream tasks return HTTP 409;
repeat the same job's `agent-run` or `work` action to poll, not to create a new task.
Results and usage persist with provider and upstream execution IDs. Results use
existing proof and manual/automatic escrow completion rules without changing them.
Short output may fail the existing minimum-proof-length rule; do not pad or fake it.

`provider_executions` stores an atomic reservation keyed by job ID. Once a submission
is ambiguous (timeout/crash after reservation), automatic retries are blocked.
An operator must reconcile the provider dashboard before repairing such a record.
There is deliberately no public repair endpoint and no unsupported provider retry.
Cross-service exactly-once submission cannot be guaranteed without upstream
idempotency; the safe response to ambiguity is to stop. Provider failure does not
release escrow. Existing cancellation/refund rules remain in effect.

## Verification

Run `.venv/bin/python -m pytest -q`. Provider tests use `httpx.MockTransport` and
injected mock adapters: no billable provider calls, keys, or commercial permission
are required. Live external execution and live PostgreSQL concurrency still need
a deployment rehearsal with approved credentials and authorized models.
