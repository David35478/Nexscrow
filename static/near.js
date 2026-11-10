/* NEAR wallet connect: wallet-selector modal (supported-wallet picker)
   + NEP-413 challenge verification. */

let selector = null;
let modal = null;

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

async function loadSelector() {
  if (selector) return selector;
  const [core, mynear, meteor] = await Promise.all([
    import("https://esm.sh/@near-wallet-selector/core"),
    import("https://esm.sh/@near-wallet-selector/my-near-wallet"),
    import("https://esm.sh/@near-wallet-selector/meteor-wallet"),
  ]);
  const config = await fetch("/api/config").then((r) => r.json());
  selector = await core.setupWalletSelector({
    network: config.auth.near_network || "mainnet",
    modules: [mynear.setupMyNearWallet(), meteor.setupMeteorWallet()],
  });
  // Any wallet signed in from the modal (injected wallets) continues
  // straight into the nexscrow sign-in challenge.
  selector.on("signedIn", () => {
    completeLogin().catch(showErr);
  });
  return selector;
}

async function ensureModal(contractId) {
  if (!modal) {
    const { setupModal } = await import("https://esm.sh/@near-wallet-selector/modal-ui-js");
    modal = setupModal(selector, { contractId, theme: "light" });
  }
  return modal;
}

async function activeAccounts() {
  try {
    const wallet = await selector.wallet();
    return await wallet.getAccounts();
  } catch {
    return [];
  }
}

async function completeLogin() {
  const wallet = await selector.wallet();
  const accounts = await wallet.getAccounts();
  if (!accounts.length) throw new Error("wallet returned no account");
  const challenge = await fetch("/api/auth/near/init", { method: "POST" }).then((r) => r.json());
  const signArgs = {
    message: challenge.message,
    recipient: location.hostname,
    nonce: b64urlToBytes(challenge.nonce),
  };
  if (wallet.type === "browser") {
    // Redirect wallets sign, then return to /near-callback with the signature.
    signArgs.callbackUrl = `${location.origin}/near-callback?challenge=${challenge.nonce}`;
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

async function connectNearWallet() {
  const btn = document.getElementById("near-btn");
  try {
    btn.disabled = true;
    btn.textContent = "Opening wallet…";
    const config = await fetch("/api/config").then((r) => r.json());
    await loadSelector();
    // Already signed in to a wallet? Skip the picker and go straight to login.
    if ((await activeAccounts()).length) {
      await completeLogin();
      return;
    }
    // Show the supported-wallet picker popup.
    (await ensureModal(config.auth.near_sign_in_contract || "intents.near")).show();
  } catch (err) {
    showErr(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Connect NEAR Wallet";
  }
}

// After a browser wallet (e.g. MyNearWallet) redirects back from sign-in,
// the account is persisted but the nexscrow session is not yet issued:
// resume the signMessage login automatically.
async function autoResume() {
  try {
    if (!localStorage.getItem("near-wallet-selector:wallets")) return;
    await loadSelector();
    if ((await activeAccounts()).length) await completeLogin();
  } catch {
    /* not signed in to a wallet; ignore */
  }
}
if (!document.cookie.includes("nexscrow_session")) autoResume();

window.connectNearWallet = connectNearWallet;
