import { env, CHAIN_ID } from "../src/config.js";

/** Public status page for the treasury agent. Contains no secrets. */
export default function handler(
  _req: unknown,
  res: { json: (body: unknown) => void },
) {
  res.json({
    service: "stock-treasury-agent",
    network: env.NETWORK,
    chainId: CHAIN_ID,
    treasuryAddress: env.PAY_TO_ADDRESS ?? "not configured (set PAY_TO_ADDRESS or PRIVATE_KEY)",
    endpoints: {
      status: "/ (this page)",
      research: "/research/AAPL — paid $0.02/call via x402",
      sweep: "/api/sweep — cron: swaps USDC earnings into tokenized stock above the threshold",
    },
    sweepPolicy: {
      thresholdUsdc: env.SWEEP_THRESHOLD_USDC,
      targetTicker: env.TARGET_TICKER,
    },
  });
}
