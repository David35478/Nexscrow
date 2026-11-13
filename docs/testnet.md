# NEAR Testnet

NexScrow runs on **NEAR Testnet only**. Testnet NEAR has no monetary value.
`src/network.py` is the single source of truth: it registers only testnet, and
every RPC call (`src/near_chain.py`) is refused unless it targets
`https://rpc.testnet.near.org`. No setting or environment variable can route a
transaction to mainnet; enabling mainnet requires an audited release that adds
it to `src/network.py`.

| Setting | Value |
|---|---|
| Network ID | `testnet` |
| RPC | `https://rpc.testnet.near.org` |
| Explorer | `https://testnet.nearblocks.io/txns/<hash>` |
| Web wallet | `https://testnet.mynearwallet.com` |
| NEAR Auth (Google) | `testnet` (`login.testnet.fast-auth.com`) |

## Environments

- **Development** (`APP_ENV` unset): testnet is active by default from
  `config.yaml` (`near.network: testnet`).
- **Production** (`APP_ENV=production`): on-chain escrow is **disabled** until
  `NEAR_NETWORK=testnet` is set explicitly for that deployment. Demo mode keeps
  working. `NEAR_NETWORK=mainnet` is rejected.

## Escrow accounts

There is no escrow smart contract. Escrow is a NEAR account you control:
clients transfer test NEAR to it, the backend verifies the transfer through
testnet RPC, and payouts/refunds are signed with that account's key.

| Variable | Purpose |
|---|---|
| `NEXSCROW_ESCROW_ACCOUNT` | Escrow account, e.g. `nexscrow-escrow.testnet` |
| `ESCROW_PRIVATE_KEY` | Full-access key for that account (server-side only) |
| `NEXSCROW_AGENT_PAYOUT_ACCOUNT` | Agent payout account, unless set per agent in `config.yaml` |

Every account is validated before use: it must end in `.testnet` or be an
implicit account. `*.near` accounts are refused for wallet sign-in, deposits,
payouts and refunds.

## Network checks before signing

- Server: `prepare_deposit` returns `network_id: testnet`; deposit signers,
  escrow, payout and refund receivers are validated; deposits are verified on
  testnet RPC, so a mainnet transaction hash cannot be found or accepted.
  Payouts embed a testnet block hash, so the signed transaction is only valid
  on testnet.
- Browser (`static/near.js`): the wallet connector is fixed to testnet, and
  signing is refused unless the server prepared a testnet deposit and the
  wallet account and receiver are testnet accounts.

## NEAR Intents

NEAR Intents (1Click API) and the Agents-on-Intents API have **no testnet
deployment** ([1Click docs](https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart/introduction):
"There is no testnet version of NEAR Intents"). Both are isolated:

- 1Click billing uses `TestnetUnavailableClient`, which refuses every call.
  `NEXSCROW_INTENTS_MOCK=1` (never in production) swaps in a mock whose orders
  never settle, so it cannot grant credits.
- The Agent API stays off; agent policies come from `config.yaml`.

The escrow itself uses plain NEAR transfers, which work on testnet.

## Running a testnet demo

1. Create two testnet accounts (for example with MyNearWallet testnet or
   `near account create-account sponsor-by-faucet-service <name>.testnet`):
   one for escrow, one for agent payouts. Fund the escrow from the faucet.
2. Set `NEXSCROW_ESCROW_ACCOUNT`, `ESCROW_PRIVATE_KEY`,
   `NEXSCROW_AGENT_PAYOUT_ACCOUNT`, and in production `NEAR_NETWORK=testnet`,
   `DATABASE_URL` (live escrow requires PostgreSQL), and `NEAR_AI_API_KEY` for
   real agent output.
3. Connect a testnet wallet, create a task, fund escrow, wait for delivery,
   approve, and open the deposit and payout links from the account dashboard.
