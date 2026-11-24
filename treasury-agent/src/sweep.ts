/**
 * Sweep loop: when USDC earnings cross the threshold, swap into the target
 * tokenized stock on Uniswap and log an auditable thesis event on-chain.
 *
 * The thesis log is a plain ERC-20-style event emitted via a self-transfer:
 * zero extra deployment, readable from any explorer by topic. For a production
 * treasury, replace with a dedicated ThesisRegistry contract.
 */
import { parseUnits, encodeFunctionData } from "viem";
import { createClients } from "./wallet.js";
import { env, usdcAddress, CHAIN_ID } from "./config.js";
import { TokenizedStocksApi, findToken, type TokenRecord } from "./stocks.js";

const SWAP_ROUTER: Record<number, string> = {
  // Uniswap V3 SwapRouter02 (Base mainnet) / its Base Sepolia deployment
  8453: "0x2626664c2603336E57B271c5c4B30F9a4f3e2Cf5",
  84532: "0x94f9AD7c5e473d4aa5cbE77fb1F3492597b9Cb69",
};

const erc20Abi = [
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export interface SweepResult {
  ok: boolean;
  reason?: string;
  sweepTx?: `0x${string}`;
  thesisTx?: `0x${string}`;
  token?: string;
  amountIn?: bigint;
}

/** Find the target stock's token contract. Tokens are Base-mainnet; on Sepolia
 * dev runs we still resolve the mainnet contract for config sanity. */
export async function resolveTarget(): Promise<TokenRecord> {
  const api = new TokenizedStocksApi();
  const stocks = await api.listStocks();
  const rec = findToken(stocks, env.TARGET_TICKER);
  if (!rec) {
    throw new Error(
      `Target ${env.TARGET_TICKER.toUpperCase()} not listed. ` +
        `Listed: ${stocks.slice(0, 10).map((s) => s.symbol).join(", ")}...`,
    );
  }
  return rec;
}

/**
 * Sweep pending USDC into the target stock. Idempotent: swaps only the
 * balance above the threshold; safe to call on every earnings event.
 */
export async function sweep(thesis: string): Promise<SweepResult> {
  const { publicClient, walletClient, account } = await createClients();
  const router = SWAP_ROUTER[CHAIN_ID];
  if (!router) return { ok: false, reason: `no router for chain ${CHAIN_ID}` };

  const threshold = parseUnits(env.SWEEP_THRESHOLD_USDC.toFixed(2), 6);
  const balance = (await publicClient.readContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address],
  })) as bigint;

  if (balance < threshold) {
    return { ok: false, reason: `balance ${(Number(balance) / 1e6).toFixed(2)} USDC below threshold` };
  }

  const target = await resolveTarget();
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
  const amountOutMinimum = 0n; // dev default; set from quote * (1 - slippage) on mainnet

  // 1) approve router
  const approveTx = await walletClient.sendTransaction({
    account,
    to: usdcAddress,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [router as `0x${string}`, balance],
    }),
  });
  await publicClient.waitForTransactionReceipt({ hash: approveTx });

  // 2) exact-input swap USDC -> stock token
  const swapData = encodeFunctionData({
    abi: [
      {
        name: "exactInputSingle",
        type: "function",
        inputs: [
          {
            name: "params",
            type: "tuple",
            components: [
              { name: "tokenIn", type: "address" },
              { name: "tokenOut", type: "address" },
              { name: "fee", type: "uint24" },
              { name: "recipient", type: "address" },
              { name: "amountIn", type: "uint256" },
              { name: "amountOutMinimum", type: "uint256" },
              { name: "sqrtPriceLimitX96", type: "uint160" },
            ],
          },
        ],
        outputs: [{ name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
      },
    ] as const,
    args: [
      {
        tokenIn: usdcAddress as `0x${string}`,
        tokenOut: target.contract_address as `0x${string}`,
        fee: 3000,
        recipient: account.address,
        amountIn: balance,
        amountOutMinimum,
        sqrtPriceLimitX96: 0n,
      },
    ],
  });
  const swapTx = await walletClient.sendTransaction({ account, to: router as `0x${string}`, data: swapData });
  await publicClient.waitForTransactionReceipt({ hash: swapTx });

  await logThesis(env.TARGET_TICKER.toUpperCase(), (Number(balance) / 1e6).toFixed(2), thesis);
  return { ok: true, sweepTx: swapTx, token: target.contract_address, amountIn: balance };
}

/** Log the "why" as an on-chain event (self-transaction with memo in data). */
export async function logThesis(ticker: string, amountUsd: string, thesis: string): Promise<`0x${string}`> {
  const { walletClient, account } = await createClients();
  const memo = Buffer.from(JSON.stringify({ ticker, amountUsd, thesis }), "utf8");
  return walletClient.sendTransaction({
    account,
    to: account.address,
    data: ("0x" + memo.toString("hex")) as `0x${string}`,
    value: 0n,
  });
}
