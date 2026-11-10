/* NEAR wallet connect.
   Primary: NEAR Connect (@hot-labs/near-connect) — connector.connect() opens
   the supported-wallet modal. Login is driven by the connector's
   wallet:signIn event and getConnectedWallet() restore (the documented
   docs.near.org pattern), so a closed modal never orphans an approved wallet.
   Fallback: wallet-selector modal. Both finish with a NEP-413 signMessage
   challenge verified by the backend. */

let connector = null;   // NEAR Connect instance
let selector = null;    // wallet-selector fallback instance
let selectorModal = null;
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

async function primaryAccount(wallet) {
  try {
    const accounts = await wallet.getAccounts();
    return accounts && accounts.length ? accounts[0].accountId : null;
  } catch {
    return null;
  }
}

async function completeLogin(wallet) {
  // The signIn event and the connect() promise can both fire for one login;
  // the guard keeps the second from consuming a second challenge.
  if (loginInFlight) return;
  loginInFlight = true;
  try {
    const accountId = await primaryAccount(wallet);
    if (!accountId) throw new Error("wallet returned no account");
    const challenge = await fetch("/api/auth/near/init", { method: "POST" })
      .then((r) => r.json());
    const signArgs = {
      message: challenge.message,
      recipient: location.hostname,
      nonce: b64urlToBytes(challenge.nonce),
    };
    if (wallet.type === "browser") {
      // Redirect wallets sign, then return to /near-callback with the
      // signature attached.
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
    if (!res.ok) throw new Error(data.error || data.detail || res.statusText);
    location.href = "/";
  } catch (err) {
    showErr(err);
  } finally {
    loginInFlight = false;
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
  // Documented pattern: the connector announces wallet sign-in. Driving the
  // login from this event means an approval always completes the login, even
  // if the selection modal promise settles late or rejects when it closes.
  connector.on("wallet:signIn", (payload) => {
    if (payload && payload.wallet) completeLogin(payload.wallet);
  });
  return connector;
}

async function connectedWalletOrNull() {
  // Restore path (docs: getConnectedWallet during initialization).
  try {
    const connected = await connector.getConnectedWallet();
    if (connected && connected.wallet) {
      const accounts = connected.accounts || await connected.wallet.getAccounts().catch(() => []);
      if (accounts && accounts.length) return connected.wallet;
    }
  } catch {
    /* not connected */
  }
  return null;
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
      if ((await wallet.getAccounts().catch(() => [])).length) {
        await completeLogin(wallet);
      }
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
    await completeLogin(wallet);
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

async function connectNearWallet() {
  const btn = document.getElementById("near-btn");
  if (connectPending) return;
  connectPending = true;
  try {
    btn.disabled = true;
    btn.textContent = "Opening wallet…";
    let nearConnectReady = true;
    try {
      await loadConnector();
    } catch {
      nearConnectReady = false; // module/network unavailable -> fallback
    }
    if (!nearConnectReady) {
      await selectorFlow();
      return;
    }
    // Already-approved wallet (e.g. user signed in previously)? Skip the
    // picker and log straight in.
    const existing = await connectedWalletOrNull();
    if (existing) {
      await completeLogin(existing);
      return;
    }
    // connector.connect() opens the NEAR Connect wallet-selection modal.
    // If it settles null/rejects when the modal closes, the wallet:signIn
    // event still completes the login; only surface an error when neither
    // path fired. The race keeps the button from hanging on a dismissal
    // (connect() only settles once a wallet is chosen).
    let modalErr = null;
    const wallet = await Promise.race([
      connector.connect().catch((err) => {
        modalErr = err;
        return null;
      }),
      new Promise((resolve) => setTimeout(() => resolve(null), 9000)),
    ]);
    if (wallet) {
      await completeLogin(wallet);
    } else if (modalErr && !loginInFlight) {
      // no signIn event either - show the real reason instead of silently
      // leaving the user logged out
      showErr(modalErr);
    }
  } finally {
    connectPending = false;
    btn.disabled = false;
    btn.textContent = "Connect NEAR Wallet";
  }
}

// Restore an already-approved wallet after page reloads: if the wallet says
// we are signed in but no nexscrow session cookie exists, complete the login.
async function restoreSession() {
  try {
    await loadConnector();
    const wallet = await connectedWalletOrNull();
    if (wallet) await completeLogin(wallet);
  } catch {
    /* wallet not connected; nothing to restore */
  }
}

if (!document.cookie.includes("nexscrow_session")) {
  // defer so the landing page renders first
  (window.requestIdleCallback || setTimeout)(() => restoreSession());
  // legacy wallet-selector restore (redirect wallets persist their state)
  (function autoResume() {
    try {
      if (!localStorage.getItem("near-wallet-selector:wallets")) return;
      loadSelector()
        .then(async () => {
          const wallet = await selector.wallet().catch(() => null);
          if (wallet && (await wallet.getAccounts().catch(() => [])).length) {
            await completeLogin(wallet);
          }
        })
        .catch(() => {});
    } catch {
      /* ignore */
    }
  })();
}

window.connectNearWallet = connectNearWallet;
