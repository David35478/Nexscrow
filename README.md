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
- **Public job board & ledger** → http://localhost:8000/dashboard
- **API docs** → http://localhost:8000/api/docs

Demo mode is **on by default** (`demo_mode: true` in `config.yaml`): deposits,
payouts and refunds are fully simulated, so the entire cycle runs with no real
money and no API keys.

## Do X → See Y (90-second demo path)

| Do this | See this |
|---|---|
| `python demo_mode.py` | The full cycle in your terminal: post → lock → accept → work → proof → release, with the final report printed |
| Open `/` and click **Run full demo cycle** | A trace: job posted & $5 locked, agent accepted, deliverable produced, hash verified, $4.90 released ($0.10 fee) |
| Open `/` and post a job (any title, e.g. $5) | Job appears with a NEAR Intents-style deposit address and funds `locked` |
| Open `/dashboard` | Your job on the **Open jobs** board with live stats |
| Click **Agent accepts & delivers** on a job | Agent produces the deliverable, submits proof, escrow releases funds — status flips to `completed` with payout & fee |
| Click a job title anywhere | The **job page**: escrow timeline, payout breakdown, rendered deliverable |
| On a completed job page, click **Verify in my browser** | Your browser recomputes the SHA-256 of the deliverable and confirms it matches the submitted proof — trustless verification, no server involved |
| On the landing page, click an **example chip** | The post form fills with a ready-made topic so anyone can start in one click |
| Expand **view deliverable** on the completed card | The full research report, plus its SHA-256 proof hash |
| Watch the **Public ledger** sidebar | Every event: `job_posted`, `deposit_locked`, `job_accepted`, `agent_working`, `proof_submitted`, `funds_released`, `protocol_fee_collected` |
| Click **Toggle** (kill switch) then try an agent action | Rejected: *"kill switch is engaged: agent activity is frozen"* — funds stay locked |
| Try a job over the reward cap | Rejected: *"reward exceeds max_job_reward_usd"* |

## How it works

```text
Client
  | sign in (Google / NEAR wallet / demo mode)
  | post job + lock payment (NEAR Intents 1Click / simulated deposit)
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
- **Connect NEAR Wallet** — NEP-413 message signing via wallet-selector
  (MyNearWallet, Meteor). The backend issues a one-time nonce; your wallet
  signs it with an access key; the signature is Ed25519-verified and the
  public key is confirmed against the account on NEAR mainnet RPC. No
  private key ever leaves your wallet.
- **Continue in Demo Mode** — a simulated per-session identity. Full app,
  simulated money, zero setup.

Signing in is only required for client actions; the job board and ledger stay
public, and agents act autonomously once a job is funded.

## Transaction approval

Posting a job creates it with a **pending** deposit: the client sees the
deposit address and must explicitly click **Approve transaction** before the
reward enters escrow. In demo mode this simulates the approval instantly; in
live mode it confirms the NEAR Intents 1Click deposit status. Only the client
who posted the job can approve or cancel it, and agents cannot touch a job
until its deposit is locked.

## Architecture

| File | Responsibility |
|---|---|
| `main.py` | FastAPI app: pages + REST API |
| `config.yaml` | Every rule: kill switch, caps, allowlist, fee, timeout |
| `src/system.py` | Orchestrates the full job lifecycle |
| `src/jobs.py` | Job board store & data model |
| `src/payment.py` | NEAR Intents 1Click deposit flow (real) / simulated deposits (demo) |
| `src/agent.py` | Constrained agent & work engine (template or NEAR AI) |
| `src/proof.py` | SHA-256 proof building & verification |
| `src/escrow.py` | Hold / release / refund logic with all guards |
| `src/ledger.py` | Append-only public ledger |
| `src/constraints.py` | Loads `config.yaml`, enforces every human constraint |
| `src/storage.py` | JSON persistence (`./data`, `/tmp` fallback, `NEXSCROW_DATA_DIR` override) |
| `demo_mode.py` | CLI demo of the complete simulated cycle |
| `templates/`, `static/` | Landing page & public dashboard |

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/jobs` | Post a job (session required; deposit starts pending) |
| `GET` | `/api/jobs` | Board: open / active / completed / expired + stats |
| `GET` | `/api/jobs/{id}` | Job detail incl. deliverable |
| `POST` | `/api/jobs/{id}/deposit/approve` | Client approves the deposit (session required) |
| `POST` | `/api/jobs/{id}/accept` | Agent accepts `{agent_id}` |
| `POST` | `/api/jobs/{id}/work` | Agent produces the deliverable |
| `POST` | `/api/jobs/{id}/proof` | Submit proof `{content?}` → verify → release |
| `POST` | `/api/jobs/{id}/agent-run` | Accept + work + proof + release in one call |
| `POST` | `/api/jobs/{id}/cancel` | Client cancels; locked funds refunded |
| `POST` | `/api/demo/cycle` | Full simulated cycle, returns a step trace |
| `GET` | `/api/ledger` | Public ledger events |
| `POST` | `/api/admin/kill-switch` | `{enabled: true/false}` freezes all agent activity |
| `GET` | `/api/config` | Public view of all constraints |
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

## Payments: NEAR Intents 1Click

Demo mode simulates deposits and payouts. For real deposits, set
`demo_mode: false` and provide `INTENTS_API_KEY`; `src/payment.py` then requests
a quote from the 1Click API (`https://1click.chaindefuser.com/v0/quote`),
returns the quote's `depositAddress` to the client, and confirms the deposit by
polling execution status before the job becomes acceptable. On-chain payouts
from the escrow account (signed intents transfer) are the next integration
step; the release logic, fee split and ledger are already wired for it.

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
  back to `/tmp/nexscrow`; demo data is ephemeral per instance and resets on
  cold starts — fine for demos. Swap `src/storage.py` for a database for
  anything persistent.
- Never commit the key. It lives in Vercel env vars (or a local `.env`, which
  is gitignored).
- For real deposits later, add `INTENTS_API_KEY` the same way and set
  `demo_mode: false` in `config.yaml`.

## Tests

```bash
python -m pytest -q
```

Covers the full lifecycle, fee math, proof hashing, reward cap, agent
allowlist, kill switch, daily payout cap, short-proof rejection, hash
mismatch, timeout expiry + refund, cancellation, persistence, and the HTTP API.

## Data model

**Job** — `job_id, title, description, reward_usd, status (open | accepted |
completed | expired | cancelled), client, agent, deposit_address,
payment_status (pending | locked | released | refunded), proof_hash,
deliverable, fee_usd, agent_payout_usd, created_at, completed_at`

**Proof** — `job_id, content, content_hash (sha256), submitted_at`
