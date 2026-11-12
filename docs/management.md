# Admin and developer portals

`/admin` and every `/api/admin/*` management route require an authenticated,
non-demo identity explicitly listed in `NEXSCROW_ADMIN_USER_IDS` (comma-separated
existing auth user IDs, e.g. `near:operator.near`). There is no first-user admin,
client role claim, default admin, or public role assignment endpoint. Configure
this only in the deployment secret/configuration system. The existing kill-switch
route now requires the same admin check. `/developer` requires ordinary sign-in.

## Operations

Admins edit existing executable agents' metadata, categories, fixed task prices,
credit costs, payment-method availability and enabled state. Overrides persist in
`marketplace_management`; catalog reads and new request prices apply them without
rewriting configuration files. Disabling also blocks legacy escrow execution.
Existing request price snapshots and ledger grants are not retroactively changed.
New external APIs enter through developer submissions, not an unverified catalog
entry; admin approval is a review decision, not automatic execution permission.

Provider controls expose only credential **environment variable names** and
presence flags. Secrets are never entered in the browser, returned, or stored in
admin audit JSON. Operators provision/rotate keys in their server secret manager.
Provider enable/timeout changes are durable overrides and require a worker restart;
synchronization uses existing pinned, commercially reviewed registry settings.
Health probes use only the configured adapter's supported non-execution operation.
Unsupported providers remain unsupported. This portal does not invent upstream
endpoints or accept arbitrary outbound test targets.

Plan and top-up package configuration is validated before saving. New checkouts
read the persistent offers; immutable existing orders and subscriptions retain
their snapshotted terms. Checkout enablement, treasury, asset and API secrets remain
operator configuration, not editable payment destinations in this portal.
Financial investigations append audit notes only. They do not change settlement
status, grant credits, refund money, or release escrow. Payment repair must follow
the documented billing reconciliation procedure.

## Metrics definitions

Escrow volume includes only real jobs funded/locked, released, or refunded and
excludes simulation. It is distinct from verified paid subscription receipts and
verified paid top-up receipts. Recorded released-escrow fees are the displayed
platform revenue. Prepaid credit receipts are not presented as earned revenue,
and no profit/net-margin claim is made. Costs total explicitly reported provider
USD costs; unavailable costs are counted separately, not assumed zero. Failures
and review states are included in clearly described failure-rate denominators.
User count is distinct persisted auth identities, not unique humans; demo users
are included. The user directory preserves new identities after sessions expire;
older identities are also found in durable request, account and profile records.
Historical users with no remaining records cannot be reconstructed.

## Developer onboarding

Developers register a display name/contact email, submit a credential-free public
HTTPS endpoint, input/output JSON schemas and requested pricing/payment methods.
The endpoint must implement Nexscrow's documented custom synchronous JSON contract
(see providers.md). Private IP literals, local hostnames, URL credentials/query
secrets and remote schema references are rejected. The portal **never calls** a
submitted endpoint. Testing validates the input schema only and explicitly says
no execution occurred. Provider live testing requires separately configured,
reviewed operator adapters/egress policy.

Only the owner can edit/test/view their submissions. Every edit increments the
revision and resets status to pending/unverified. An admin can approve or reject
metadata, but publication remains blocked until commercial authorization,
credential setup, provider execution verification, pricing/economics and treasury
review are complete through the existing pinned-registry process. No developer
agent is automatically added to the allowlist. Submission analytics are empty
until actual publication/execution support exists; they are not simulated.

Developer payouts, revenue sharing and automatic developer transfers are disabled.
There is no payout endpoint and no percentage is represented as payable earnings.
All mutations and health/sync operations are recorded in the management audit log.
