/* NEAR wallet connect: wallet-selector + NEP-413 challenge verification. */

let selector = null;

function b64urlToBytes(value) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
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
    modules: [
      mynear.setupMyNearWallet(),
      meteor.setupMeteorWallet(),
    ],
  });
  return selector;
}

async function connectNearWallet(walletId = "my-near-wallet") {
  const errorBox = document.getElementById("auth-error");
  const btn = document.getElementById("near-btn");
  const show = (msg, isError = false) => {
    if (!errorBox) return;
    errorBox.classList.remove("hidden");
    errorBox.classList.toggle("error", isError);
    errorBox.textContent = msg;
  };

  try {
    btn.disabled = true;
    btn.textContent = "Opening wallet…";
    const sel = await loadSelector();
    const wallet = await sel.wallet(walletId);
    const config = await fetch("/api/config").then((r) => r.json());

    let accounts = await wallet.getAccounts();
    if (!accounts.length) {
      await wallet.signIn({ contractId: config.auth.near_sign_in_contract || "intents.near" });
      accounts = await wallet.getAccounts();
    }
    if (!accounts.length) throw new Error("wallet returned no account");

    const challenge = await fetch("/api/auth/near/init", { method: "POST" }).then((r) => r.json());
    const signArgs = {
      message: challenge.message,
      recipient: location.hostname,
      nonce: b64urlToBytes(challenge.nonce),
    };

    if (wallet.type === "browser") {
      // Redirect wallets return to /near-callback with the signature attached.
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
      show(`✓ Connected as ${data.user.name}. Redirecting…`);
      setTimeout(() => (location.href = "/"), 900);
    }
  } catch (err) {
    show(`✗ ${err.message}`, true);
  } finally {
    btn.disabled = false;
    btn.textContent = "Connect NEAR Wallet";
  }
}

window.connectNearWallet = connectNearWallet;
