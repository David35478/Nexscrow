/**
 * Arb check: compare the on-chain DEX quote for a tokenized stock against its
 * Chainlink NAV reference value. The NAV feed is only a sanity anchor — it is
 * NOT a live execution price and goes stale outside market hours, so every
 * signal carries a staleness verdict and the caller must skip stale quotes.
 */
import { createPublicClient, http, formatUnits } from "viem";
import { baseChain } from "./wallet.js";
import { env, usdcAddress } from "./config.js";
import { TokenizedStocksApi, findToken, isNavFresh, type NavFeed } from "./stocks.js";

const IQuoterV2Abi = [
  {
    name: "quoteExactInputSingle",
    type: "function",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "fee", type: "uint24" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "sqrtPriceX96After", type: "uint160" },
      { name: "initializedTicksCrossed", type: "uint32" },
      { name: "gasEstimate", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
] as const;

const QUOTER_V2: Record<number, string> = {
  8453: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
  84532: "0x27e8C5B6c8bd21Aea558c34C351Ee107E54e7A5c",
};

export interface ArbSignal {
  ticker: string;
  dexPriceUsd: number | null;
  navPriceUsd: number | null;
  spreadBps: number | null;
  navFresh: boolean;
  navAgeSeconds: number | null;
  action: "buy" | "skip-stale-nav" | "skip-below-cost" | "no-data";
}

/** DEX price (USDC per stock token) via Uniswap quoter. */
export async function dexPrice(token: string, usdPerShare: number): Promise<number | null> {
  if (!usdPerShare) return null;
  const client = createPublicClient({ chain: baseChain, transport: http(env.RPC_URL) });
  const quoter = QUOTER_V2[baseChain.id];
  if (!quoter) return null;
  try {
    // Price one "share unit": token decimals x multiplier = one share.
    const out = await client.readContract({
      address: quoter as `0x${string}`,
      abi: IQuoterV2Abi,
      functionName: "quoteExactInputSingle",
      args: [{ tokenIn: usdcAddress, tokenOut: token as `0x${string}`, amountIn: 10n ** 6n, fee: 3000, sqrtPriceLimitX96: 0n }],
    });
    return Number(formatUnits(out[0], 6));
  } catch {
    return null;
  }
}

/**
 * Evaluate one ticker. Spreads are gross; a real check subtracts gas + swap
 * fees + the underlying's own market spread before acting.
 */
export async function checkArb(ticker: string): Promise<ArbSignal> {
  const api = new TokenizedStocksApi();
  // NAV feeds are Base-mainnet-only; skip the lookup on dev chains.
  const [stocks, feeds] = await Promise.all([api.listStocks(), baseChain.id === 8453 ? api.navFeeds() : Promise.resolve([])]);
  const rec = findToken(stocks, ticker);
  const feed: NavFeed | undefined = feeds.find((f) => f.contract_address.toLowerCase() === rec?.contract_address.toLowerCase());

  const signal: ArbSignal = {
    ticker,
    dexPriceUsd: null,
    navPriceUsd: null,
    spreadBps: null,
    navFresh: rec ? isNavFresh(rec) : false,
    navAgeSeconds: rec?.nav_price_updated_at ? Math.round((Date.now() - Date.parse(rec.nav_price_updated_at)) / 1000) : null,
    action: "no-data",
  };

  if (!rec || rec.nav_price == null) return signal;

  const nav = rec.nav_price;
  signal.navPriceUsd = nav;
  if (!signal.navFresh) {
    signal.action = "skip-stale-nav";
    return signal;
  }

  const px = await dexPrice(rec.contract_address, nav);
  signal.dexPriceUsd = px;
  if (px === null || nav <= 0) return signal;

  signal.spreadBps = Math.round(((px - nav) / nav) * 10_000);
  // Buy when DEX trades below NAV by more than assumed round-trip cost (30 bps).
  signal.action = signal.spreadBps < -30 ? "buy" : "skip-below-cost";
  return signal;
}
