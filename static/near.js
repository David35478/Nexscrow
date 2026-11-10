/* NEAR wallet connect.
   Primary: NEAR Connect (@hot-labs/near-connect) — the docs.near.org
   connector; connector.connect() opens the supported-wallet modal.
   Fallback: wallet-selector modal (previously primary).
   Both finish with a NEP-413 signMessage challenge verified by the backend. */

let connector = null;   // NEAR Connect instance
let selector = null;    // wallet-selector fallback instance
let selectorModal = null;

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

async function loginWithWallet(wallet, opts = {}) {
  const challenge = await fetch("/api/auth/near/init", { method: "POST" })
    .then((r) => r.json());
  const signArgs = {
    message: challenge.message,
    recipient: location.hostname,
    nonce: b64urlToBytes(challenge.nonce),
  };
  if (wallet.type === "browser" || opts.redirect) {
    // Browser wallets sign then redirect back with the signature attached.
    signArgs.callbackUrl =
      `${location.origin}/near-callback?challenge=${challenge.nonce}`;
    await wallet.signMessage(signArgs);
  } else {
    const signed = await wallet.signMessage(signArgs);
    const res = await fetch("/api/auth/near/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: signed.accountId,
        public_key: signed.publicKey,
        signature: signed.signature,
        nonce: challenge.nonce,
        recipient: location.hostname,
        callback_url: null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.detail || res.statusText);
    location.href = "/";
  }
}

/* ------------------------------------------------------------ NEAR Connect */

async function loadConnector() {
  if (connector) return connector;
  const config = await getConfig();
  const { NearConnector } = await import("https://esm.sh/@hot-labs/near-connect");
  connector = new NearConnector({
    network: config.auth.near_network || "mainnet",
  });
  return connector;
}

/* --------------------------------------------------- wallet-selector fallback */

async function loadSelector() {
  if (selector) return selector;
  const [core, mynear, meteor] = await Promise.all([
    import("https://esm.sh/@near-wallet-selector/core"),
    import("https://esm.sh/@near-wallet-selector/my-near-wallet"),
    import("https://esm.sh/@near-wallet-selector/meteor-wallet"),
  ]);
  const config = await getConfig();
  selector = await core.setupWalletSelector({
    network: config.auth.near_network || "mainnet",
    modules: [mynear.setupMyNearWallet(), meteor.setupMeteorWallet()],
  });
  selector.on("signedIn", async () => {
    try {
      const wallet = await selector.wallet();
      if ((await wallet.getAccounts()).length) await loginWithWallet(wallet);
    } catch (err) {
      showErr(err);
    }
  });
  return selector;
}

async function selectorFlow() {
  const config = await getConfig();
  await loadSelector();
  const wallet = await selector.wallet().catch(() => null);
  if (wallet && (await wallet.getAccounts().catch(() => [])).length) {
    await loginWithWallet(wallet);
    return;
  }
  if (!selectorModal) {
    const { setupModal } = await import("https://esm.sh/@near-wallet-selector/modal-ui-js");
    selectorModal = setupModal(selector, {
      contractId: config.auth.near_sign_in_contract || "intents.near",
      theme: "light",
    });
  }
  selectorModal.show();
}

/* ----------------------------------------------------------------- entry */

let connectPending = false;

async function connectNearWallet() {
  const btn = document.getElementById("near-btn");
  if (connectPending) return; // a connect() call is still awaiting the wallet
  try {
    connectPending = true;
    btn.disabled = true;
    btn.textContent = "Opening wallet…";
    // connect() only settles once a wallet is chosen; if the user dismisses
    // the picker it stays pending, so recover the button after a grace period.
    const recover = setTimeout(() => {
      connectPending = false;
      btn.disabled = false;
      btn.textContent = "Connect NEAR Wallet";
    }, 6000);
    let nearConnectReady = true;
    try {
      await loadConnector();
    } catch {
      nearConnectReady = false; // module/network unavailable -> fallback
    }
    if (!nearConnectReady) {
      clearTimeout(recover);
      await selectorFlow();
      return;
    }
    // connector.connect() opens the NEAR Connect wallet-selection modal.
    const wallet = await connector.connect().catch(() => null);
    clearTimeout(recover);
    if (!wallet) return; // user dismissed the picker - stop quietly
    await loginWithWallet(wallet);
  } catch (err) {
    if (String(err.message || err).includes("cancelled")) {
      // wallet's own sign-in step cancelled - no error needed
      return;
    }
    showErr(err);
  } finally {
    connectPending = false;
    btn.disabled = false;
    btn.textContent = "Connect NEAR Wallet";
  }
}

// After a browser-wallet redirect round-trip the wallet account is persisted
// but the nexscrow session is not yet issued: resume the signMessage login.
async function autoResume() {
  try {
    if (!localStorage.getItem("near-wallet-selector:wallets")) return;
    await loadSelector();
    const wallet = await selector.wallet().catch(() => null);
    if (wallet && (await wallet.getAccounts().catch(() => [])).length) {
      await loginWithWallet(wallet);
    }
  } catch {
    /* not signed in to a wallet; ignore */
  }
}
if (!document.cookie.includes("nexscrow_session")) autoResume();

window.connectNearWallet = connectNearWallet;
