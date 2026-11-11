/* NEAR wallet login.
   Wallet: NEAR Connect (@hot-labs/near-connect) per docs.near.org — the
   connector is initialized with features.signMessage so only wallets that
   support NEP-413 message signing appear. Login is driven by the
   wallet:signIn event and getConnectedWallet() restore. (The deprecated
   @near-wallet-selector fallback was removed per the docs.)
   Google: NEAR Auth (fast-auth) — Auth0 Google login producing an
   MPC-derived NEAR account; the raw signing-audience token is verified
   server-side against the Auth0 JWKS. */

let connector = null;   // NEAR Connect instance
let fastAuthProvider = null;  // NEAR Auth provider

let connectPending = false;
let loginInFlight = false;

function b64urlToBytes(value) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function showErr(err) {
  const box = document.getElementById("auth-error");
  if (!box) return;
  box.classList.remove("hidden");
  box.classList.add("error");
  box.textContent = `✗ ${err.message || err}`;
}

async function getConfig() {
  return fetch("/api/config").then((r) => r.json());
}

/* ------------------------------------------------------ wallet login */

async function loadConnector() {
  if (connector) return connector;
  const config = await getConfig();
  const { NearConnector } = await import("https://esm.sh/@hot-labs/near-connect");
  connector = new NearConnector({
    network: config.auth.near_network || "mainnet",
    // docs.near.org: only show wallets that support message signing
    features: {
      signMessage: true,
      signAndSendTransactions: true,
    },
  });
  connector.on("wallet:signIn", (payload) => {
    if (payload && payload.wallet) completeLogin(payload.wallet);
  });
  return connector;
}

async function primaryAccountOf(wallet) {
  try {
    const accounts = await wallet.getAccounts();
    return accounts && accounts.length ? accounts[0].accountId : null;
  } catch {
    return null;
  }
}

async function completeLogin(wallet) {
  // The signIn event and the connect() promise can both fire for one login.
  if (loginInFlight) return;
  loginInFlight = true;
  try {
    const accountId = await primaryAccountOf(wallet);
    if (!accountId) throw new Error("wallet returned no account");
    await signAndVerify(wallet, accountId, 0);
  } catch (err) {
    showErr(err);
  } finally {
    loginInFlight = false;
  }
}

// One signMessage + backend verification. A burned/expired challenge used to
// dead-end the user ("request expired or already used"); on that error we
// fetch a fresh challenge and retry once before giving up.
async function signAndVerify(wallet, accountId, attempt) {
  const challenge = await fetch("/api/auth/near/init", { method: "POST" })
  .then((r) => r.json());
  const signArgs = {
    message: challenge.message,
    recipient: location.hostname,
    nonce: b64urlToBytes(challenge.nonce),
  };
  if (wallet.type === "browser") {
    signArgs.callbackUrl =
      `${location.origin}/near-callback?challenge=${challenge.nonce}`;
    await wallet.signMessage(signArgs);
    return;
  }
  const signed = await wallet.signMessage(signArgs);
  const res = await fetch("/api/auth/near/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      account_id: accountId,
      public_key: signed.publicKey,
      signature: signed.signature,
      nonce: challenge.nonce,
      recipient: location.hostname,
      callback_url: null,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.detail || res.statusText;
    if (attempt < 1 && /expired|challenge/i.test(msg)) {
      return signAndVerify(wallet, accountId, attempt + 1);
    }
    throw new Error(msg);
  }
  // wallet connected -> open the dashboard
  location.href = "/dashboard";
}

async function connectedWalletOrNull() {
  try {
    const connected = await connector.getConnectedWallet();
    if (connected && connected.wallet) {
      const accounts = connected.accounts || [];
      if (accounts && accounts.length) return connected.wallet;
    }
  } catch {
    /* not connected */
  }
  return null;
}

async function connectNearWallet() {
  const btn = document.getElementById("near-btn");
  if (connectPending) return;
  connectPending = true;
  try {
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Opening wallet…";
    }
    await loadConnector();
    const existing = await connectedWalletOrNull();
    if (existing) {
      await completeLogin(existing);
      return;
    }
    // Modal promise only settles once a wallet is chosen; a dismissal leaves
    // it pending, so race with a timeout — the signIn event still completes
    // any approval either way.
    const wallet = await Promise.race([
      connector.connect().catch(() => null),
      new Promise((resolve) => setTimeout(() => resolve(null), 9000)),
    ]);
    if (wallet && !loginInFlight) await completeLogin(wallet);
  } finally {
    connectPending = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Connect NEAR Wallet";
    }
  }
}

// Restore an approved wallet on load (no session cookie yet). Retrying the
// signature on every page spammed wallets (browser wallets redirect per
// prompt), so attempt at most twice per tab session — enough to recover
// from an expired challenge or a cookie that lapsed mid-tab, without
// re-prompting forever after a dismissal.
async function restoreSession() {
  try {
    await loadConnector();
    const wallet = await connectedWalletOrNull();
    if (!wallet) return;
    const attempts = Number(
      sessionStorage.getItem("nex_wallet_restore_tries") || 0
    );
    if (attempts >= 2) return;
    sessionStorage.setItem("nex_wallet_restore_tries", String(attempts + 1));
    await completeLogin(wallet);
  } catch {
    /* wallet not connected */
  }
}

/* ------------------------------------------ NEAR Auth (Google login) */

async function nearAuthLogin() {
  const btn = document.getElementById("fastauth-btn");
  try {
    btn.disabled = true;
    btn.textContent = "Opening Google…";
    const config = await getConfig();
    const na = config.near_auth;
    if (!na || !na.client_id) {
      throw new Error("NEAR Auth is not configured");
    }
    if (!fastAuthProvider) {
      const { JavascriptProvider } = await import(
        "https://esm.sh/@fast-auth-near/javascript-provider"
      );
      fastAuthProvider = new JavascriptProvider({
        network: na.network || "testnet",
        clientId: na.client_id,
      });
    }
    // Popup Google login; resolves after Auth0 returns.
    await fastAuthProvider.login();
    // Raw token for the signing audience — verified by our backend against
    // the Auth0 JWKS.
    const { FAST_AUTH_AUTH0_DEFAULTS } = await import(
      "https://esm.sh/@fast-auth-near/javascript-provider"
    );
    const audience = (FAST_AUTH_AUTH0_DEFAULTS[na.network] || {}).signingAudience;
    const token = await fastAuthProvider.client.getTokenSilently({
      authorizationParams: { audience },
    });
    const res = await fetch("/api/auth/fastauth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, network: na.network || "testnet" }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.detail || res.statusText);
    location.href = "/";
  } catch (err) {
    showErr(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Continue with Google";
  }
}

/* ------------------------------------------------- escrow deposits
   Live deposits are real on-chain transfers: we ask the connected wallet
   to sign a Transfer of NEAR to the escrow account, then the backend
   verifies the transaction via RPC and locks the escrow. */

async function walletOrConnect() {
  await loadConnector();
  const existing = await connectedWalletOrNull();
  if (existing) return existing;
  try {
    const wallet = await connector.wallet();
    if (wallet) return wallet;
  } catch {
    /* not connected */
  }
  // No approved wallet yet: open the picker. signIn completes the session
  // via the wallet:signIn event; payment continues right after.
  const wallet = await Promise.race([
    connector.connect().catch(() => null),
    new Promise((resolve) => setTimeout(() => resolve(null), 9000)),
  ]);
  if (wallet) return wallet;
  throw new Error("No NEAR wallet connected — connect one to fund the escrow.");
}

function txHashOf(outcome) {
  return (
    outcome?.transaction_outcome?.id ||
    outcome?.transaction?.hash ||
    outcome?.transaction_outcome?.outcome?.receipt_ids?.[0] ||
    null
  );
}

function signerOf(outcome) {
  return outcome?.transaction?.signer_id || null;
}

async function confirmDeposit(jobId, txHash, signerId) {
  const res = await fetch(`/api/jobs/${jobId}/deposit/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tx_hash: txHash, signer_id: signerId || "" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || res.statusText);
  return data;
}

// Prepare the deposit, open the wallet for signing, verify on-chain.
// Returns the locked job. Throws on any failure (nothing is recorded unless
// the on-chain deposit actually verifies).
async function payEscrow(jobId, retried) {
  const prep = await fetch(`/api/jobs/${jobId}/deposit/prepare`, { method: "POST" })
    .then(async (r) => {
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || d.detail || r.statusText);
      return d;
    });
  const wallet = await walletOrConnect();
  // If the session is NEAR-authed, the wallet must hold that account —
  // signing from a different account would move NEAR the job can't claim.
  try {
    const session = await fetch("/api/auth/session").then((r) => r.json());
    const uid = session && session.user && session.user.user_id;
    if (uid && uid.startsWith("near:") && wallet.getAccounts) {
      const accounts = await wallet.getAccounts();
      const acct = accounts && accounts[0] && accounts[0].accountId;
      const expected = uid.slice(5);
      if (acct && acct !== expected) {
        throw new Error(
          `Connected wallet is ${acct} but you're signed in as ${expected} —` +
            " switch wallets or sign in again."
        );
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Connected wallet")) throw err;
    // session lookup failing shouldn't block a signature
  }
  const tx = {
    receiverId: prep.receiver_id,
    actions: [
      {
        type: "Transfer",
        params: { deposit: prep.amount_yocto },
      },
    ],
  };
  if (wallet.type === "browser") {
    // Redirect wallets return transactionHashes on the callback page,
    // which posts deposit/confirm itself.
    await wallet.signAndSendTransactions({
      transactions: [tx],
      callbackUrl: `${location.origin}/near-callback?job_id=${jobId}`,
    });
    return { redirected: true };
  }
  let outcomes;
  try {
    outcomes = await wallet.signAndSendTransactions({ transactions: [tx] });
  } catch (err) {
    // A restored-but-expired wallet session leaves a stale selection;
    // clear it once and fall back to the picker.
    if (!retried && /sign(ed)?[ -]?in|not connected|not authorized/i.test(String(err && err.message))) {
      try { localStorage.removeItem("selected-wallet"); } catch (_) {}
      try { await connector.disconnect(); } catch (_) {}
      return payEscrow(jobId, true);
    }
    throw err;
  }
  const first = Array.isArray(outcomes) ? outcomes[0] : outcomes;
  const txHash = txHashOf(first);
  if (!txHash) throw new Error("wallet returned no transaction hash");
  // The RPC may lag a beat behind broadcast — retry briefly.
  let lastErr = null;
  for (let i = 0; i < 5; i++) {
    try {
      return await confirmDeposit(jobId, txHash, signerOf(first));
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr;
}

if (!document.cookie.includes("nexscrow_session")) {
  (window.requestIdleCallback || setTimeout)(() => restoreSession());
}

window.nearAuthLogin = nearAuthLogin;
window.connectNearWallet = connectNearWallet;
window.payEscrow = payEscrow;
