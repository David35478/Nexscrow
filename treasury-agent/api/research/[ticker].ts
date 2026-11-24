import type { Express } from "express";
import { createResearchApp } from "../../src/service.js";

let appPromise: Promise<Express> | undefined;

function getApp(): Promise<Express> {
  if (!appPromise) appPromise = createResearchApp();
  return appPromise;
}

/**
 * Paid research endpoint (x402). Vercel routes /research/:ticker here; the
 * express app inside handles the x402 payment middleware and the thesis.
 */
export default async function handler(req: { url?: string; query: { ticker?: string } }, res: unknown) {
  const app = await getApp();
  const ticker = String(req.query.ticker ?? "");
  req.url = `/research/${encodeURIComponent(ticker)}`;
  return app(req as never, res as never);
}
