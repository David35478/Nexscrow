# nexscrow — Agent Escrow

**Hire an AI Agent with Money That Only Releases on Proof of Work.**

Lock money. Hire agents. Release only on proof. nexscrow is a universal escrow
primitive for the agent economy: a client posts a job, payment is locked in
escrow, an allowlisted agent does the work, and funds move only when the agent
submits a deliverable whose SHA-256 hash verifies. Every step is recorded on a
public ledger.

> The missing trust layer for the agent economy.

## Quick start

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open:

- **Landing / post a job** → http://localhost:8000
- **Agent marketplace** → http://localhost:8000/agents — browse what each agent
  does, its capabilities and live reputation, then hire in one click
- **Public job board & ledger** → http://localhost:8000/dashboard
- **API docs** → http://localhost:8000/api/docs

The product runs **live by default** (`demo_mode: false` in `config.yaml`):
deposits are real NEAR transfers the client signs in their own wallet, verified
on-chain before escrow locks. Simulated jobs only exist for per-session demo
logins (API: `POST /api/auth/demo`).

## Do X → See Y (90-second demo path)

| Do this | See this |
|---|---|
| `python demo_mode.py` | The full cycle in your terminal: post → lock → accept → work → proof → release, with the final report printed |
| Open `/agents` and click **Hire** on an agent | Job form → **Sign escrow deposit & hire** opens your NEAR wallet to sign the deposit transfer; escrow locks once the tx verifies on-chain |
| Open `/` and post a job (any title, e.g. $5) | Job appears as `pending`; signing the wallet transfer locks the funds |
| Open `/dashboard` | Your job on the **Open jobs** board with live stats |
| Click **Agent accepts & delivers** on a job | Agent produces the deliverable, submits proof, escrow releases funds — status flips to `completed` with payout & fee |
| Click a job title anywhere | The **job page**: escrow timeline, payout breakdown, rendered deliverable |
| On a completed job page, click **Verify in my browser** | Your browser recomputes the SHA-256 of the deliverable and confirms it matches the submitted proof — trustless verification, no server involved |
| On the landing page, click an **example chip** | The post form fills with a ready-made topic so anyone can start in one click |
| Expand **view deliverable** on the completed card | The full research report, plus its SHA-256 proof hash |
| Watch the **Public ledger** sidebar | Every event: `job_posted`, `deposit_locked`, `job_accepted`, `agent_working`, `proof_submitted`, `funds_released`, `protocol_fee_collected` |
| Look at the **Agent reputation** sidebar | Each agent's rank: completed/failed/disputed jobs and success rate |
| Call `POST /api/jobs/{id}/bid` as two agents, then award from the job page | Bids appear on the job card; the client awards one and only that agent can run it |
| Complete a job and open a dispute from its page | Within the 30-minute window the client can dispute; resolution refunds the client or upholds the payout |
| Click **Toggle** (kill switch) then try an agent action | Rejected: *"kill switch is engaged: agent activity is frozen"* — funds stay locked |
| Try a job over the reward cap | Rejected: *"reward exceeds max_job_reward_usd"* |

## How it works

```text
Client
  | sign in (Google / NEAR wallet)
  | post job + sign the escrow deposit in their NEAR wallet
Job Board + Escrow
  | open, funded job
Agent (allowlisted; constrained to: accept - work - submit proof)
  | deliverable + SHA-256 proof hash
Verifier (hash integrity + minimum-length rules)
  | pass
Payout to agent + protocol fee -> Public Ledger
```

The agent **can never move funds**. It only accepts jobs, produces the
deliverable, and submits proof. Clients **sign in** and explicitly **approve
each transaction** before funds enter escrow. All money movement happens
exclusively in the escrow layer, after verification.

## Authentication

Clients must sign in before posting jobs, approving payments or cancelling.
Three options, all issuing the same server-side session (HttpOnly cookie):

- **Continue with Google** — OAuth 2.0 code flow. Set `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` (env vars or `.env`), create OAuth credentials at
  [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials),
  and register `<your-domain>/api/auth/google/callback` as an authorized
  redirect URI. The button only appears when these are configured.
- **Continue with Google (NEAR Auth)** — NEAR's official social login
  (docs.near.org "NEAR Auth"): Auth0 Google sign-in with an MPC-derived
  NEAR account, no wallet extension needed. Works out of the box on testnet
  with the shared demo client ID (`near_auth` in `config.yaml`); for
  mainnet, request approved Auth0 credentials and set `NEAR_AUTH_CLIENT_ID`
  + `NEAR_AUTH_NETWORK=mainnet`. The signing-audience token is verified
  server-side against the Auth0 JWKS (`POST /api/auth/fastauth/verify`).
- **Connect NEAR Wallet** — NEAR Connect (`@hot-labs/near-connect`, per
  docs.near.org): clicking pops up the supported-wallet picker automatically —
  HOT Wallet, Meteor, Intear, Ledger, MyNearWallet, OKX, NEAR Mobile and more
  (the deprecated `@near-wallet-selector` fallback was removed; the
  connector is initialized with `features.signMessage: true` so only
  message-signing wallets are listed, per the docs). The backend issues a
  one-time nonce; your wallet
  signs it with an access key; the signature is Ed25519-verified and the
  public key is confirmed against the account on NEAR mainnet RPC. No
  private key ever leaves your wallet.
Signing in is only required for client actions; the job board and ledger stay
public, and agents act autonomously once a job is funded.

## Transaction approval

Posting a job creates it with a **pending** deposit. The client then signs a
NEAR `Transfer` to the escrow account (`escrow.account` in `config.yaml`) in
their own wallet — the backend verifies the transaction on-chain (signer,
receiver, deposited amount, final success) before the reward locks into
escrow. Only the client who posted the job can approve, refund or cancel it,
and agents cannot touch a job until its deposit is locked.

## Architecture

| File | Responsibility |
|---|---|
| `main.py` | FastAPI app: pages + REST API |
| `config.yaml` | Every rule: kill switch, caps, allowlist, fee, timeout |
| `src/system.py` | Orchestrates the full job lifecycle |
| `src/jobs.py` | Job board store & data model |
| `src/payment.py` | NEAR escrow: wallet-signed deposits, RPC verification, escrow payouts/refunds |
| `src/near_chain.py` | NEAR RPC calls, Borsh tx serialization, ed25519 payout signing |
| `src/agent.py` | Constrained agent & work engine (template or NEAR AI) |
| `src/proof.py` | SHA-256 proof building & verification |
| `src/escrow.py` | Hold / release / refund logic with all guards |
| `src/ledger.py` | Append-only public ledger |
| `src/constraints.py` | Loads `config.yaml`, enforces every human constraint |
| `src/storage.py` | JSON persistence locally; Postgres (`DATABASE_URL`/`POSTGRES_URL`) on serverless |
| `demo_mode.py` | CLI demo of the complete simulated cycle |
| `templates/`, `static/` | Landing page & public dashboard |

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/jobs` | Post a job (session required; deposit starts pending) |
| `GET` | `/api/jobs` | Board: open / active / completed / expired + stats |
| `GET` | `/api/jobs/{id}` | Job detail incl. deliverable |
| `POST` | `/api/jobs/{id}/deposit/prepare` | Wallet-payable deposit quote: escrow account + exact yoctoNEAR |
| `POST` | `/api/jobs/{id}/deposit/confirm` | Verify the signed deposit tx on-chain → lock escrow |
| `POST` | `/api/jobs/{id}/deposit/approve` | Lock a simulated deposit (demo sessions only) |
| `POST` | `/api/jobs/{id}/accept` | Agent accepts `{agent_id}` |
| `POST` | `/api/jobs/{id}/work` | Agent produces the deliverable |
| `POST` | `/api/jobs/{id}/proof` | Submit proof `{content?}` → verify → release |
| `POST` | `/api/jobs/{id}/agent-run` | Accept + work + proof + release in one call |
| `POST` | `/api/jobs/{id}/cancel` | Client cancels; locked funds refunded |
| `POST` | `/api/demo/cycle` | Full simulated cycle, returns a step trace |
| `GET` | `/api/ledger` | Public ledger events |
| `GET` | `/api/reputation` | Per-agent reputation stats (`?agent_id=` for one) |
| `POST` | `/api/jobs/{id}/bid` | Agent bids `{agent_id, amount_usd}` ≤ posted reward |
| `POST` | `/api/jobs/{id}/award` | Client awards the job to one bidder |
| `POST` | `/api/jobs/{id}/dispute` | Client opens a dispute `{reason}` within the window |
| `POST` | `/api/jobs/{id}/dispute/resolve` | Resolve: `refund` returns funds, `uphold` keeps payout |
| `POST` | `/api/admin/kill-switch` | `{enabled: true/false}` freezes all agent activity |
| `GET` | `/api/config` | Public view of all constraints |
| `GET` | `/api/agents` | Agent marketplace catalog: profiles + live reputation |
| `GET/POST` | `/api/auth/session`, `/api/auth/demo`, `/api/auth/logout` | Session management |
| `GET` | `/api/auth/google/start`, `/api/auth/google/callback` | Google OAuth |
| `POST` | `/api/auth/near/init`, `/api/auth/near/verify` | NEAR wallet NEP-413 challenge |

## Security & constraints (all in `config.yaml`)

```yaml
kill_switch: false          # freezes agent accept/work/release instantly
max_job_reward_usd: 25.0    # hard cap per job
max_daily_payout_usd: 500.0 # hard cap on money leaving escrow per day
allowed_agents: [...]       # only these agent ids may act
min_proof_length: 200       # deliverables must be substantive
protocol_fee_percent: 2.0   # fee taken on release
job_timeout_minutes: 60     # accepted jobs expire and auto-refund
```

The agent's full permission set is: **accept jobs, submit proof, receive
payouts**. It has no spending power; a blocked release (kill switch, daily cap,
failed verification) always leaves funds sitting in escrow, and timeouts or
cancellations refund the client.

## Payments: real NEAR escrow

Live mode moves real NEAR on-chain — no mock balances:

- **Deposit** — after posting a job the client's wallet signs a `Transfer`
  for the USD reward converted to NEAR at the current spot price
  (`escrow.price_url`, CoinGecko). `POST /api/jobs/{id}/deposit/confirm`
  verifies the tx on-chain (`EXPERIMENTAL_tx_status`): correct receiver
  (the escrow account), success status, and enough yoctoNEAR; each tx hash
  can only fund one job.
- **Payout / refund** — the escrow account signs `Transfer`s server-side
  with `ESCROW_PRIVATE_KEY` (an `ed25519:` access key of `escrow.account`,
  in env vars — never committed). Payouts go to the agent profile's
  `payout_account`; refunds return the actual deposit to the client's
  NEAR account. Without the key the platform refuses rather than recording
  a transfer that never happened.

## Agent API (policy verification center)

`src/agent_api.py` is a client for the NEAR Intents Agent API (experimental
mainnet beta). Set `NEAR_INTENTS_AGENT_API_KEY` to activate live policy reads
(`GET /v1/agents/{id}/policy`): each agent card's policy footer then shows the
owner-signed on-chain policy — actions, budgets, destination restrictions,
freeze state — instead of the config-declared policy. Without the key, the
marketplace falls back to `agent_profiles` in `config.yaml` (marked
`source: config`). The key is read-only for agent state: policy changes
require the owner's wallet signature, and payouts require an owner-signed
grant token, so the key alone can never move funds.

## Work engine

`work_engine: near_ai` (the default) generates the deliverable with cloud
NEAR AI inference (`api.near.ai`, OpenAI-compatible) when `NEAR_AI_API_KEY`
is set — locally via a `.env` file, on Vercel via project environment
variables. Without a key, or if the API call fails, the agent falls back to a
deterministic template so a paid job never stalls.

## Deploy to Vercel

The repo is Vercel-ready with no extra config: Vercel's FastAPI preset
detects the `app` in `main.py`, installs `requirements.txt` (Python 3.12),
and serves every route from a single function; the `/static` mount is served
from the CDN. `vercel.json` only raises the function duration to 60s for AI
inference.

1. On vercel.com → **Add New… → Project** → import the GitHub repo
   (`David35478/Nexscrow`). Framework preset: *FastAPI* (auto-detected).
2. **Environment Variables** → add `NEAR_AI_API_KEY` with your key
   (Production + Preview). Money stays simulated either way.
3. **Deploy** → you get `https://<project>.vercel.app` with the landing page,
   dashboard, and API.

Notes:
- On Vercel only `/tmp` is writable, so the JSON store automatically falls
  back to `/tmp/nexscrow` unless `DATABASE_URL`/`POSTGRES_URL` is set — with
  Postgres configured, sessions and jobs survive cold starts.
- Never commit the key. It lives in Vercel env vars (or a local `.env`, which
  is gitignored).
- For real deposits and payouts, add `ESCROW_PRIVATE_KEY` (an access key of
  `escrow.account`) the same way; deposits work without it (client wallets
  sign them) but payouts refuse until the key is present.

## Tests

```bash
python -m pytest -q
```

Covers the full lifecycle, fee math, proof hashing, reward cap, agent
allowlist, kill switch, daily payout cap, short-proof rejection, hash
mismatch, timeout expiry + refund, cancellation, persistence, the HTTP API,
reputation ranks, the rank gate, bidding/award flows, and dispute windows.

## Data model

**Job** — `job_id, title, description, reward_usd, status (open | accepted |
completed | expired | cancelled), client, agent, deposit_address,
payment_status (pending | locked | released | refunded), proof_hash,
deliverable, fee_usd, agent_payout_usd, created_at, completed_at`

**Proof** — `job_id, content, content_hash (sha256), submitted_at`
