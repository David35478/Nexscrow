import "dotenv/config";
import { z } from "zod";

const Env = z.object({
  // Network selection: base-sepolia (default, dev) or base-mainnet (live demo).
  NETWORK: z.enum(["base-sepolia", "base-mainnet"]).default("base-sepolia"),
  RPC_URL: z.string().url().default("https://sepolia.base.org"),
  // Throwaway test key for dev only. NEVER hold mainnet funds in a key in .env.
  // For the mainnet demo use CdpEvmWalletProvider (CDP_API_KEY_ID etc.) instead.
  PRIVATE_KEY: z.string().startsWith("0x").optional(),

  // Sweep policy
  SWEEP_THRESHOLD_USDC: z.coerce.number().positive().default(10),
  TARGET_TICKER: z.string().min(1).default("AAPL"),
  MAX_SLIPPAGE_BPS: z.coerce.number().int().min(10).max(3000).default(100),

  // x402 research service
  RESEARCH_PRICE_USD: z.string().default("$0.02"),
  SERVICE_PORT: z.coerce.number().int().default(4021),
  // Address that receives x402 payments. Defaults to the agent wallet derived
  // from PRIVATE_KEY; set it explicitly to run the research API without a key.
  PAY_TO_ADDRESS: z.string().startsWith("0x").optional(),
  // Protects /api/sweep when deployed: Vercel Cron sends it as a Bearer token.
  CRON_SECRET: z.string().optional(),

  // Coinbase Tokenized Stocks API (public, keyless)
  STOCKS_API_URL: z.string().url().default("https://api.coinbase.com/v1/tokenized-stocks"),

  // x402 facilitator (CDP-hosted for production; x402.org works on Base Sepolia)
  FACILITATOR_URL: z.string().url().default("https://x402.org/facilitator"),
});

export const env = Env.parse(process.env);

export const CHAIN_IDS: Record<string, number> = {
  "base-sepolia": 84532,
  "base-mainnet": 8453,
};

export const CHAIN_ID = CHAIN_IDS[env.NETWORK];

// USDC (native) addresses on Base. On Sepolia this is the test USDC that the
// x402 facilitator settles against.
export const USDC_ADDRESS: Record<string, string> = {
  "84532": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};

export const usdcAddress = USDC_ADDRESS[String(CHAIN_ID)] as `0x${string}`;
export const USDC = usdcAddress;
