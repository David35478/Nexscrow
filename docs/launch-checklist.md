# Production launch and admin checklist

This guide describes the deployment paths present in this repository. A successful configuration check is not proof that live payments, providers, or billing are ready. Keep the app in demo/staging until the corresponding live rehearsal and operational review are complete.

## 1. Configure Vercel

Import this repository into Vercel with the repository root as the project root. The checked-in `vercel.json` exposes `main.py` as a Python function, bundles `config.yaml`, `templates/`, `static/`, and `src/`, and sets a 60-second function limit. Set the variables below in the Vercel project for **Production** (and separately for Preview if needed), then deploy. Set `APP_ORIGIN` to the exact canonical HTTPS origin users will visit, without a path or query.

Required for a production preflight:

| Variable | Purpose |
| --- | --- |
| `APP_ENV=production` | Enables production behavior and secure cookies. |
| `APP_ORIGIN=https://your-domain.example` | Canonical public HTTPS origin used for security and auth callbacks. |
| `DATABASE_URL` or `POSTGRES_URL` | Durable PostgreSQL connection. Use a production database, never the test database. |

Vercel's local filesystem is not durable across invocations. PostgreSQL is required for production; JSON storage and `NEXSCROW_DATA_DIR` are development/testing options, not a substitute for persistent production storage. JSON-to-PostgreSQL migration is manual; do not expect deployment to migrate existing JSON records automatically.

## 2. Configure sign-in

Privy server verification accepts `PRIVY_APP_ID`, or `NEXT_PUBLIC_PRIVY_APP_ID` as the app-ID alias, plus the server-only `PRIVY_APP_SECRET`. Keep the secret out of browser variables, source control, and client bundles. Configure the matching application/domain and allowed origins in Privy. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are optional for the repository's Google OAuth flow; register `https://<your-domain>/api/auth/google/callback` as the Google redirect URI. NEAR wallet sign-in is also supported.

Demo sign-in is simulated and must not be treated as proof of payment, identity, or provider readiness. The production preflight requires `config.yaml` to have `demo_mode: false`.

## 3. Set up admin access

Admin access is an explicit allowlist, not an automatic role granted by signing in. First deploy and sign in using the intended real Privy identity, then obtain that account's exact verified identity (`privy:<did:privy:...>`) from the authenticated account/session data. Add the exact value to the Vercel **server-side** variable `NEXSCROW_ADMIN_USER_IDS`. Multiple admins can be listed as comma-separated identity values. Redeploy or restart the production deployment after changing the variable, then sign in again and open `/admin`.

The allowlist is matched against the verified user ID; demo identities are rejected even if listed. Do not guess a DID or copy an identity from a demo session. Admin APIs are under `/api/admin/*`; access to the dashboard requires both an authenticated session and an allowlisted non-demo identity. Admin operations include managing agent/provider settings, billing settings, payment reviews, developer submissions, and the kill switch. Keep the allowlist small and review its changes.

## 4. Set agent prices and understand payment boundaries

Agent task prices are configured per agent, expressed in USD cents, and can be overridden through admin management. To set an agent task price to **$0.10 per call**, set that agent's task price to **10 cents** in the admin agent settings, then verify the displayed price and a newly created request in staging. Existing requests snapshot their price, so changing an agent's price does not rewrite existing requests. Confirm any associated credit cost separately; USD task price and credit cost are distinct settings.

Do not confuse these flows:

- **Escrow jobs:** deposits are client-signed NEAR transfers verified on-chain; payouts and refunds require `ESCROW_PRIVATE_KEY` for the configured escrow account. This key grants fund-moving authority and must be stored only as a server secret. The app refuses payouts without it rather than simulating a live payout.
- **Subscription and credit top-up billing:** separate from escrow, disabled by default, and uses `ONECLICK_API_KEY`, `BILLING_TREASURY_ADDRESS`, and `BILLING_SETTLEMENT_ASSET`. The settlement flow trusts 1Click's TLS status report; it does not independently verify every chain transfer or cryptographically validate quote signatures. Leave it disabled until the trust model, accounting, authorized live rehearsal, and reconciliation operations are approved.
- **Provider execution:** provider integrations are separately configured and disabled by default. External provider credentials or API availability do not establish commercial authorization or production readiness.

## 5. Storage, execution, and operations

The app uses PostgreSQL when `DATABASE_URL` or `POSTGRES_URL` is present. Configure backups, restore testing, monitoring, connection limits, and access controls with the database provider. Keep `TEST_DATABASE_URL` isolated for tests only; never point tests at production.

There is no durable background job worker configured in this deployment. Vercel function work is subject to the configured 60-second limit, so do not rely on an in-process task surviving the request or instance. Billing reconciliation is an operator command (`python -m src.billing_reconcile`) for stored 1Click orders; it does not create quotes or move funds. No recurring schedule is defined by this repository's Vercel configuration. If billing is enabled, arrange and monitor a trusted scheduled invocation in the deployment environment and define a procedure for late or ambiguous settlements before launch.

Other optional server-side credentials, only when the matching feature is enabled:

- `NEAR_AI_API_KEY` — first-party live work execution; without it the code can use the demo template path.
- `NEAR_INTENTS_AGENT_API_KEY` — optional live agent policy reads.
- `WIRO_API_KEY` and `WIRO_API_SECRET` — Wiro provider credentials.
- `CUSTOM_AGENT_API_KEY` — credential for a configured custom provider.

The optional `NEXSCROW_DATA_DIR` selects local JSON storage and should not be used as production persistence. `TEST_DATABASE_URL` is for isolated test runs only.

## 6. Preflight and launch gates

Run `python scripts/production_check.py` against the same production configuration before launch. It checks `APP_ENV`, canonical HTTPS `APP_ORIGIN`, PostgreSQL configuration, and `demo_mode: false`, and reports operational warnings such as missing admin identities or live-feature credentials. A passing preflight does **not** verify Vercel secrets, database connectivity/backups, wallet signing, live transfers, provider permissions, billing settlement, or admin access end to end.

Before enabling real use, complete a staging rehearsal with the production auth configuration and persistent database; verify login/logout and `/admin` access; test authorized agent execution; rehearse escrow deposit, release, refund, and ambiguous-transfer recovery with the appropriate network and operator approvals; confirm the $0.10 price on a fresh request; and review monitoring, backups, key rotation, incident response, and financial reconciliation. Keep billing and external providers disabled until their separate gates are complete. Review `docs/production-readiness.md`, `docs/billing.md`, and `docs/providers.md` for their detailed limitations.
