/**
 * Paid tokenized-stock research service (x402).
 *
 * Another agent (or a browser) GETs /research/:ticker, pays the USDC price
 * via x402, and receives a structured thesis + snapshot. Earnings pool in
 * the agent's wallet where the sweep loop converts them into the target stock.
 */
import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme, registerExactEvmScheme } from "@x402/evm/exact/server";
import { env, CHAIN_ID } from "./config.js";
import { createClients } from "./wallet.js";
import { TokenizedStocksApi, findToken, navAgeSeconds } from "./stocks.js";

const network = `eip155:${CHAIN_ID}` as `${string}:${string}`;

/** Deterministic thesis generator — swap for an LLM call in the real build. */
function buildThesis(ticker: string, meta: unknown, rec: unknown) {
  const token = rec as { nav_price?: number; nav_price_updated_at?: string } | undefined;
  const nav = token?.nav_price;
  const navUpdatedAt = token?.nav_price_updated_at;
  return {
    ticker,
    verdict: "accumulate",
    thesis:
      `Mechanical sweep target of the treasury agent. ${ticker} is tracked via ` +
      `Coinbase tokenized stocks on Base (chain ${CHAIN_ID}); NAV anchor ${nav ?? "n/a"}` +
      `${navUpdatedAt ? `, published ${navUpdatedAt}` : " (no timestamp)"}. Earnings are converted ` +
      `on threshold crossings, so exposure grows with service revenue, not market timing.`,
    snapshot: { meta, nav: nav ?? null, navUpdatedAt: navUpdatedAt ?? null },
    generatedAt: new Date().toISOString(),
  };
}

/** Build the research app without binding a port, for serverless or local use. */
export async function createResearchApp(): Promise<express.Express> {
  const app = express();
  const api = new TokenizedStocksApi();
  const account = env.PAY_TO_ADDRESS
    ? { address: env.PAY_TO_ADDRESS as `0x${string}` }
    : (await createClients()).account;

  const facilitator = new HTTPFacilitatorClient({ url: env.FACILITATOR_URL });
  const server = new x402ResourceServer(facilitator);
  registerExactEvmScheme(server, { networks: [network] });

  app.use(
    paymentMiddlewareFromConfig(
      {
        "GET /research/:ticker": {
          accepts: {
            scheme: "exact",
            payTo: account.address,
            price: env.RESEARCH_PRICE_USD,
            network,
          },
        },
      },
      facilitator,
      [{ network, server: new ExactEvmScheme() }],
    ),
  );
  app.get("/research/:ticker", async (req, res) => {
    const ticker = String(req.params.ticker || "").toUpperCase();
    try {
      const stocks = await api.listStocks();
      const rec = findToken(stocks, ticker);
      const [meta] = await Promise.all([rec ? api.metadata(rec.symbol) : Promise.resolve(null)]);
      res.json({
        ...buildThesis(ticker, meta, rec),
        navAgeSeconds: rec ? navAgeSeconds(rec) : null,
      });
    } catch (err) {
      res.status(502).json({ error: String((err as Error).message) });
    }
  });

  return app;
}

/** Local entry: run the research service as a long-lived server. */
export async function startResearchService(): Promise<{ walletAddress: string }> {
  const app = await createResearchApp();
  const account = env.PAY_TO_ADDRESS
    ? { address: env.PAY_TO_ADDRESS as `0x${string}` }
    : (await createClients()).account;
  return new Promise((resolve) => {
    app.listen(env.SERVICE_PORT, () => {
      console.log(`x402 research service on :${env.SERVICE_PORT} (${env.NETWORK}, ${env.RESEARCH_PRICE_USD}/call)`);
      resolve({ walletAddress: account.address });
    });
  });
}
