import { createWalletClient, createPublicClient, http, defineChain, type PublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ViemWalletProvider } from "@coinbase/agentkit";
import { env } from "./config.js";

export const baseChain = defineChain({
  id: env.NETWORK === "base-mainnet" ? 8453 : 84532,
  name: env.NETWORK,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [env.RPC_URL] } },
});

export async function createClients() {
  if (!env.PRIVATE_KEY) {
    throw new Error(
      "PRIVATE_KEY missing. For dev on Base Sepolia use a throwaway key " +
        "(fund it from a Base Sepolia faucet). For mainnet, use CdpEvmWalletProvider " +
        "with CDP_API_KEY_ID / CDP_API_KEY_SECRET / CDP_WALLET_SECRET instead.",
    );
  }
  const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: baseChain,
    transport: http(env.RPC_URL),
  });
  const publicClient: PublicClient = createPublicClient({
    chain: baseChain,
    transport: http(env.RPC_URL),
  });
  const walletProvider = new ViemWalletProvider(walletClient);
  return { account, walletClient, publicClient, walletProvider };
}

export type Clients = ReturnType<typeof createClients>;
