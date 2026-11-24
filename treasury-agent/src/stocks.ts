/**
 * Client for the public Coinbase Tokenized Stocks API (read-only, keyless).
 * Docs: https://docs.base.org/sdks/tokenized-stocks/overview
 *
 * Live API shapes (verified 2026-11-24):
 * - GET /            -> { tokens: TokenRecord[] }  (one page; page_size up to ~500)
 * - GET /nav-feeds   -> { nav_feeds: NavFeed[] }   (contract + nav feed addresses only)
 * - GET /metadata/:symbol, /chains, /total-supply/:address
 *
 * NAV (price + timestamp) is carried on the token record itself, not the feed.
 * Feed addresses are Base mainnet (chain 8453); NAV is read on-chain from the
 * nav_feed_address for programmatic use.
 */
import { env } from "./config.js";

export interface TokenRecord {
  contract_address: string;
  /** e.g. "AAPLc" — the trailing "c" marks the Coinbase-issued token. */
  symbol: string;
  name: string;
  decimals: number;
  icon_url?: string;
  total_supply?: number;
  isin?: string;
  multiplier?: number;
  description?: string;
  nav_price?: number;
  nav_price_updated_at?: string; // ISO 8601
  adgm_isin?: string;
  first_mint_date?: string;
}

export interface NavFeed {
  contract_address: string;
  nav_feed_address: string;
}

export class TokenizedStocksApi {
  private base = env.STOCKS_API_URL.replace(/\/$/, "").replace(/\/tokenized-stocks$/, "");

  private async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${this.base}${path}`);
    for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, String(v));
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`stocks api ${path} -> ${res.status} ${await res.text()}`);
    return (await res.json()) as T;
  }

  /** All listed tokenized stocks with their NAV anchors (single page, 500). */
  async listStocks(): Promise<TokenRecord[]> {
    const res = await this.get<{ tokens: TokenRecord[] }>("/tokenized-stocks", { page_size: 500 });
    return res.tokens ?? [];
  }

  /** NAV feed contract addresses per token (Base mainnet). */
  async navFeeds(): Promise<NavFeed[]> {
    const res = await this.get<{ nav_feeds: NavFeed[] }>("/tokenized-stocks/nav-feeds");
    return res.nav_feeds ?? [];
  }

  /** Metadata keyed by token symbol (e.g. "AAPLc", not "AAPL"). */
  async metadata(symbol: string): Promise<unknown> {
    return this.get(`/tokenized-stocks/metadata/${encodeURIComponent(symbol.toUpperCase())}`);
  }

  /** Protocol contract addresses per chain. */
  async chains(): Promise<unknown> {
    return this.get("/tokenized-stocks/chains");
  }

  async totalSupply(contractAddress: string): Promise<number> {
    return this.get(`/tokenized-stocks/total-supply/${contractAddress}`);
  }
}

/**
 * Ticker lookup: symbols carry a trailing "c" (Coinbase-issued), so "AAPL"
 * matches "AAPLc" as well as an exact symbol match.
 */
export function findToken(tokens: TokenRecord[], ticker: string): TokenRecord | undefined {
  const t = ticker.toUpperCase();
  return tokens.find((s) => {
    const sym = s.symbol.toUpperCase();
    return sym === t || (sym.length > 1 && sym.endsWith("C") && sym.slice(0, -1) === t);
  });
}

/**
 * NAV staleness guard: feeds update only on price deviation or heartbeat and
 * hold their last value outside market hours, so any consumer must check age.
 */
export function navAgeSeconds(rec: { nav_price_updated_at?: string }, now = Date.now()): number | null {
  if (!rec.nav_price_updated_at) return null;
  return Math.max(0, Math.floor((now - Date.parse(rec.nav_price_updated_at)) / 1000));
}

export function isNavFresh(rec: TokenRecord, maxAgeSeconds = 15 * 60): boolean {
  const age = navAgeSeconds(rec);
  return age !== null && age <= maxAgeSeconds;
}
