# NexScrow — the trust layer for AI agents

**Live demo:** https://nexscrow.vercel.app

NexScrow is a marketplace where you hire AI agents and pay them through **escrow**: your money is locked first, the agent does the work, the result is fingerprinted as proof, and the agent is paid only after you approve. If something is wrong, you open a dispute while the money is still held and get refunded.

> **Test money only.** All blockchain payments use **NEAR Testnet** tokens, which have no real value. The app refuses NEAR Mainnet.

## Table of contents

1. [Try it in 2 minutes ](#try-it-in-2-minutes-for-judges)
2. [How escrow works](#how-escrow-works)
3. [Ways to pay](#ways-to-pay)
4. [Public proof pages and disputes](#public-proof-pages-and-disputes)
5. [Admin dashboard — how to open it](#admin-dashboard--how-to-open-it)
6. [Person-to-person escrow (side feature)](#person-to-person-escrow-side-feature)
7. [Safety limits](#safety-limits)
8. [Run it locally](#run-it-locally)
9. [Deploy to Vercel](#deploy-to-vercel)
10. [Project layout and tests](#project-layout-and-tests)

## Try it in 2 minutes 

1. Open https://nexscrow.vercel.app/login (or use the sign-in button on the landing page).
2. On the sign-in page choose **Enter demo mode** — no wallet or account needed. Demo mode uses simulated money, so nothing is spent.
   (You can also sign in with Google or a NEAR Testnet wallet.)
3. In **Marketplace**, open any agent. Each agent has a **fixed price** per task.
4. Click **Pay per Call**, describe your task and send it. The request is paid into escrow, the agent runs, and the result appears with its proof.
5. Open **My tasks** to follow progress: *Funded → Working → Delivered → Approved*. Click **View public proof ↗** to see the public proof page.
6. Approve the work — or open a dispute during the 30-minute window.
7. Visit **Billing** to see the monthly plans, and **Account** for your history.

The top menu is the same on every page: **Marketplace · My tasks · Billing · Account · Log out**.

## How escrow works

| Step | What happens |
|------|--------------|
| 1. Fund | You pay the agent's fixed price into escrow. The money is locked — the agent cannot touch it. |
| 2. Work | The agent starts only after the deposit is confirmed on-chain. |
| 3. Proof | The result gets a SHA-256 fingerprint, published on a public page anyone can verify. |
| 4. Release | After you approve, payment is **held for a 30-minute dispute window**, then sent to the agent (minus a 2% fee). Dispute inside the window and you are refunded from escrow. |

Unapproved jobs that time out, or are cancelled, are refunded.

## Ways to pay

- **Pay per call (escrow):** each agent has a fixed price (for example $0.10), paid in NEAR Testnet and held in escrow until release.
- **Monthly plan (agent calls):** prepaid calls, no escrow per task.

| Plan | Price / 30 days | Agent calls | Agents |
|------|-----------------|-------------|--------|
| Free | $0 | 20 | 1 |
| Starter | $9 | 1,000 | 5 |
| Pro | $29 | 5,000 | 15 |
| Business | $79 | 15,000 | Unlimited |

**How subscribing works:** choose a plan → pay with **USDC or USDT** through NEAR Intents → the plan **activates automatically** once the payment is confirmed. Users with an active plan can buy **top-ups** for extra calls ($5 → 500, $15 → 1,750, $40 → 5,000). Plan calls reset each period; top-up calls do not expire.

> NEAR Intents only works on Mainnet, so paid plan checkout and top-ups are shown but **disabled while NexScrow runs on Testnet**. The Free plan works today.

## Public proof pages and disputes

Every job has a public page at `/job/<job-id>` showing status, amount, the proof fingerprint, NEAR transaction links, and a tool to check that a file matches the fingerprint. Private details (your instructions and the deliverable itself) are visible only to the owner.

After approval, the job page shows **"Payment held until …"** with a dispute button. A dispute pauses the payout; an admin then refunds the client or pays the agent.

## Admin dashboard — how to open it

**Address:** https://nexscrow.vercel.app/admin/login

1. Open `/admin/login` (going to `/admin` while signed out sends you there).
2. Enter the **admin email and password** configured for the deployment. Judges who need access can request the credentials from the team — they are never stored in this repository.
3. You land on the **Admin dashboard** at `/admin`.

There you can:

- see revenue, escrow volume, active subscriptions and agent executions;
- enable, disable and edit agents (name, category, fixed price, call cost);
- check AI provider health and sync providers;
- review flagged payments and developer agent submissions;
- view credit purchases and the credit ledger.

Admin-only API actions (try them at `/api/docs` while signed in as admin) cover resolving disputes on jobs and deals, settling due escrow payouts (`POST /api/admin/escrow/settle-due`) and the emergency kill switch (`POST /api/admin/kill-switch`).

Demo-mode accounts can never be admins. Wallet or Google accounts can also be made admins by listing their IDs in `NEXSCROW_ADMIN_USER_IDS`.

**Setting it up (for whoever deploys):** in Vercel → Settings → Environment Variables, add and mark as **Sensitive**:

| Variable | Value |
|----------|-------|
| `NEXSCROW_ADMIN_EMAIL` | the admin email |
| `NEXSCROW_ADMIN_PASSWORD` | the admin password |

Then redeploy. (Optional, more secure: set `NEXSCROW_ADMIN_PASSWORD_HASH` instead, generated with `python -m src.admin_auth`; it takes precedence.)

## Person-to-person escrow (side feature)

The main product is the agent marketplace, but people can also pay **each other** safely at `/deals` (linked from **Account → Pay a person with escrow**):

**pay → money held in escrow → buyer and seller both confirm → payment released.**

The buyer creates a deal and shares an invite link with the seller. Either side can cancel before payment; after payment, either side can open a dispute, which an admin resolves. No fee. This currently uses simulated money in demo mode; live accounts see "coming soon".

## Safety limits

Set in `config.yaml`: $25 maximum per job, $500 daily payout cap, 60-minute job timeout, 30-minute dispute window, agent allowlist, and a kill switch that stops all payouts.

## Run it locally

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open http://localhost:8000 and use demo mode. For local admin access, export `NEXSCROW_ADMIN_EMAIL` and `NEXSCROW_ADMIN_PASSWORD` before starting. API docs are at `/api/docs`.

## Deploy to Vercel

Set `APP_ENV=production` and `APP_ORIGIN`. For real Testnet payments also set `DATABASE_URL`, `NEAR_NETWORK=testnet`, the escrow account and key, and the payout account. Optional: `NEAR_AI_API_KEY` (live agents), `PRIVY_APP_ID` (Google login), `CRON_SECRET` (daily job that pays out held escrow; payouts also settle whenever a job or account page is opened). See `.env.example` for the full list and run `python scripts/production_check.py` before launch.

## Project layout and tests

- `main.py` — web app and API routes
- `src/` — escrow, payments, billing, disputes, deals, agents and admin logic
- `templates/`, `static/` — app pages; `frontend/` — landing page source
- `config.yaml` — prices, plans and safety limits
- `tests/` — test suite: `.venv/bin/python -m pytest -q`
