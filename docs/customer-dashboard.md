# Customer dashboard

`/account` is the private customer dashboard; the existing `/dashboard` public job
board remains unchanged. Marketplace navigation links to the customer dashboard.
The page loads owned data from authenticated `GET /api/customer/dashboard`.
Unauthenticated visitors use the existing sign-in portal; no demo account or
financial balance is created by opening the page.

Overview counts owned task requests plus older owned escrow jobs without counting
linked jobs twice. Delivered/completed work counts as successful execution (not as
proof that payment was released). Active subscriptions and available credits come
from the billing ledger. My Agents shows actual usage and eligible subscription
access, not invented per-agent subscriptions. Unavailable catalog agents retain
their historical identity but cannot be executed from the dashboard.

Request history links persisted results back to the workspace; legacy jobs keep
their original job IDs and detail-page links. Escrow billing lists deposit, payout
and refund transaction hashes separately from subscription/top-up payments.
Subscription dates, prepaid renewal periods, scheduled changes and credit usage
are shown from the existing records. No accounting mutations, payment submissions,
or automatic credits are introduced by the dashboard.

Account preferences use `GET/PUT /api/account/settings` and the separate
`customer_settings` collection keyed by the authenticated identity. Display names
are not authentication identifiers. Notification booleans are stored, but delivery
is explicitly not enabled. Connected wallets show only the current verified NEAR
sign-in account. Adding/linking unrelated wallets is not implemented. Security
shows the current provider and active session count; authenticated
`POST /api/account/sessions/revoke-other` revokes only this user's other sessions,
not the current session or another customer's sessions. No session tokens, provider
credentials, request input contents, or results are included in the overview API.

Existing public job/ledger visibility remains unchanged. The private dashboard
is an owner-filtered view, not a change to historical job confidentiality rules.
