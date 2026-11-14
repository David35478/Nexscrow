// Public proof page: safe fields for everyone, decision controls for the job owner.
(function () {
  const root = document.getElementById("proof-root");
  const jobId = root.dataset.jobId;
  const explorer = root.dataset.explorer;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const show = (el, msg, err) => { el.textContent = msg; el.classList.remove("hidden"); el.classList.toggle("error", !!err); };

  async function sha256Hex(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  async function call(path, opts) {
    const res = await fetch(path, { credentials: "same-origin", headers: { "Content-Type": "application/json" }, ...opts });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Request failed");
    return data;
  }
  function txRow(label, hash) {
    if (!hash) return "";
    return `<div><span class="k">${label}</span><a class="v mono" href="${esc(explorer)}/txns/${esc(hash)}" target="_blank" rel="noopener">${esc(hash.slice(0, 12))}… ↗</a></div>`;
  }

  function render(job) {
    $("#p-title").textContent = job.title;
    $("#p-sub").textContent = `Job ${job.job_id} · agent ${job.agent || "not assigned"}`;
    $("#proof-hash").textContent = job.proof_hash || "not submitted yet";
    $("#proof-verified").textContent = job.proof_hash ? "✓ hash recorded and verified" : "Not yet";
    const chain = job.simulated
      ? `<div><span class="k">Network</span><span class="v">Simulated (demo) — no on-chain transaction</span></div>`
      : txRow("Deposit tx", job.deposit_tx_hash) + txRow("Payout tx", job.payout_tx_hash) + txRow("Refund tx", job.refund_tx_hash);
    $("#money").innerHTML = `<h2>Escrow</h2><div class="kv">
      <div><span class="k">Status</span><span class="v">${esc(job.status)}</span></div>
      <div><span class="k">Payment</span><span class="v">${esc(job.payment_status)}</span></div>
      <div><span class="k">Reward</span><span class="v">$${Number(job.reward_usd).toFixed(2)}</span></div>
      ${chain}
      ${job.disputed ? `<div><span class="k">Dispute</span><span class="v">${job.dispute_resolved ? "resolved" : "open"}</span></div>` : ""}</div>`;
  }

  function owner(job) {
    const panel = $("#owner-panel");
    const res = $("#owner-result");
    panel.hidden = false;
    if (job.disputed) {
      $("#owner-hint").textContent = `Dispute ${job.dispute_resolved ? "resolved" : "open"}: ${job.dispute_reason || ""}`;
      return;
    }
    if (job.status === "delivered") {
      $("#owner-hint").textContent = "Delivered. Approve to release the escrow.";
      $("#approve-btn").hidden = false;
      $("#approve-btn").onclick = async () => {
        try { await call(`/api/jobs/${jobId}/approve-work`, { method: "POST" }); location.reload(); }
        catch (e) { show(res, e.message, true); }
      };
      return;
    }
    const win = Number(job.dispute_window_minutes || 0);
    if (job.status !== "completed" || win <= 0 || !job.completed_at) {
      panel.hidden = true;
      return;
    }
    $("#owner-hint").textContent = "Completed. If the work missed the brief, open a dispute before the window closes.";
    $("#dispute-box").hidden = false;
    const end = new Date(job.completed_at).getTime() + win * 60000;
    const tick = () => {
      const left = Math.floor((end - Date.now()) / 1000);
      if (left <= 0) {
        $("#dispute-countdown").textContent = "Dispute window closed.";
        $("#dispute-btn").disabled = true;
        $("#dispute-reason").disabled = true;
        return;
      }
      const m = String(Math.floor(left / 60)).padStart(2, "0"), s = String(left % 60).padStart(2, "0");
      $("#dispute-countdown").textContent = `Dispute window closes in ${m}:${s}`;
      setTimeout(tick, 1000);
    };
    tick();
    $("#dispute-btn").onclick = async () => {
      const reason = $("#dispute-reason").value.trim();
      if (reason.length < 3) return show(res, "Please describe the problem (at least 3 characters).", true);
      try { await call(`/api/jobs/${jobId}/dispute`, { method: "POST", body: JSON.stringify({ reason }) }); location.reload(); }
      catch (e) { show(res, e.message, true); }
    };
  }

  $("#verify-btn").onclick = async () => {
    const out = $("#verify-result");
    const text = $("#verify-text").value;
    const expected = $("#proof-hash").textContent;
    if (!text) return show(out, "Paste the deliverable text first.", true);
    const hex = await sha256Hex(text);
    const ok = hex === expected;
    show(out, ok ? "Match ✓ — SHA-256 equals the recorded proof hash." : `Mismatch ✗ — computed ${hex}`, !ok);
  };
  $("#copy-link").onclick = async () => {
    try { await navigator.clipboard.writeText(location.href); $("#copy-link").textContent = "Copied ✓"; }
    catch (_) { $("#copy-link").textContent = "Copy failed"; }
  };

  (async () => {
    try {
      const job = await call(`/api/jobs/${jobId}`);
      render(job);
      if ("client_id" in job) {
        const { user } = await call("/api/auth/session");
        if (user && user.user_id === job.client_id) owner(job);
      }
    } catch (e) { $("#p-title").textContent = "Job not found"; $("#p-sub").textContent = e.message; }
  })();
})();
