import { env } from "../src/config.js";
import { sweep } from "../src/sweep.js";

/**
 * Sweep endpoint, triggered by the Vercel Cron in vercel.json. Vercel sends
 * "Authorization: Bearer $CRON_SECRET" automatically when CRON_SECRET is set.
 */
export default async function handler(
  req: { headers: { authorization?: string } },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (env.CRON_SECRET && req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const result = await sweep(
      `Swept service earnings into ${env.TARGET_TICKER} per treasury policy (threshold $${env.SWEEP_THRESHOLD_USDC}).`,
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
}
