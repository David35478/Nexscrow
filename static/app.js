/* nexscrow frontend: job board, ledger, demo actions. */

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => Number(n).toFixed(2);
let authUser = null;

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function showResult(el, lines, isError = false) {
  el.classList.remove("hidden", "error");
  if (isError) el.classList.add("error");
  el.textContent = Array.isArray(lines) ? lines.join("\n") : lines;
}

async function loadSession() {
  const { user } = await api("/api/auth/session");
  authUser = user;
  return user;
}

function renderWho() {
  const who = $("#who");
  if (!who) return;
  if (authUser) {
    who.classList.remove("hidden");
    who.innerHTML = `${escapeHtml(authUser.name)} · <a href="#" id="logout-link" style="color:var(--accent)">logout</a>`;
    $("#logout-link").addEventListener("click", async (e) => {
      e.preventDefault();
      await api("/api/auth/logout", { method: "POST" });
      location.reload();
    });
  } else {
    who.classList.add("hidden");
  }
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function renderMarkdown(src) {
  const lines = escapeHtml(src).split("\n");
  let html = "";
  let inList = false;
  const inline = (s) => s
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
  for (const line of lines) {
    const l = line.trim();
    let m;
    if (!l) {
      if (inList) { html += "</ul>"; inList = false; }
      continue;
    }
    if ((m = l.match(/^(#{1,6})\s+(.*)$/))) {
      if (inList) { html += "</ul>"; inList = false; }
      const lvl = Math.min(m[1].length, 4);
      html += `<h${lvl}>${inline(m[2])}</h${lvl}>`;
    } else if ((m = l.match(/^[-*]\s+(.*)$/))) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(m[1])}</li>`;
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${inline(l)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function card(job, actions = "") {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <div class="title"><a class="job-link" href="/job/${job.job_id}">${escapeHtml(job.title)}</a>
      <span class="pill ${job.status}">${job.status}</span>
      <span class="pill ${job.payment_status}">funds: ${job.payment_status}</span>
    </div>
    <div class="meta">
      ${job.job_id} · $${fmt(job.reward_usd)} · client: ${escapeHtml(job.client || "anonymous")}
      ${job.agent ? ` · agent: <b>${escapeHtml(job.agent)}</b>` : ""}
      ${job.proof_hash ? `<br>proof: ${job.proof_hash}` : ""}
      ${job.agent_payout_usd != null ? `<br>payout: $${fmt(job.agent_payout_usd)} · fee: $${fmt(job.fee_usd)}` : ""}
    </div>
    ${job.deliverable ? `<details><summary>view deliverable</summary><pre>${escapeHtml(job.deliverable)}</pre></details>` : ""}
    <div class="actions">${actions}</div>`;
  return div;
}

// ------------------------------------------------------------- landing page

const postForm = $("#post-job");
  if (postForm) {
  (async () => {
    const [user, config] = await Promise.all([loadSession(), api("/api/config")]);
    renderWho();
    if (config.auth.google_configured) {
      $("#google-btn").classList.remove("hidden");
    }
    if (config.near_auth && config.near_auth.client_id) {
      $("#fastauth-btn").classList.remove("hidden");
      $("#fastauth-btn").addEventListener("click", () => window.nearAuthLogin());
    }
    if (user) {
      $("#login-panel").hidden = true;
      $("#post-panel").hidden = false;
    }
    $("#demo-btn").addEventListener("click", async () => {
      try {
        await api("/api/auth/demo", { method: "POST", body: "{}" });
        location.reload();
      } catch (err) {
        showResult($("#auth-error"), `✗ ${err.message}`, true);
      }
    });
    $("#near-btn").addEventListener("click", () => window.connectNearWallet("my-near-wallet"));
    const authError = new URLSearchParams(location.search).get("auth_error");
    if (authError) {
      showResult($("#auth-error"), `✗ Login failed: ${escapeHtml(authError)}`, true);
    }
  })();

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      postForm.querySelector("input[name='title']").value = chip.dataset.title || "";
      postForm.querySelector("textarea[name='description']").value = chip.dataset.desc || "";
    });
  });

  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(postForm);
    try {
      const { job } = await api("/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          title: fd.get("title"),
          description: fd.get("description"),
          reward_usd: parseFloat(fd.get("reward_usd")),
          client: fd.get("client") || null,
        }),
      });
      showResult($("#post-result"), [
        `✓ Job ${job.job_id} posted.`,
        `Deposit ${job.payment_status}: send $${fmt(job.reward_usd)} to ${job.deposit_address}`,
        `Then approve the transaction below to lock it in escrow.`,
      ]);
      const approveBtn = document.createElement("button");
      approveBtn.className = "btn primary";
      approveBtn.textContent = "Approve transaction & lock deposit";
      approveBtn.addEventListener("click", async () => {
        approveBtn.disabled = true;
        try {
          const updated = await api(`/api/jobs/${job.job_id}/deposit/approve`, { method: "POST" });
          showResult($("#post-result"), [
            `✓ Deposit locked for job ${job.job_id}.`,
            "An agent can now pick it up on the public board: /dashboard",
          ]);
        } catch (err) {
          showResult($("#post-result"), `✗ ${err.message}`, true);
          approveBtn.disabled = false;
        }
      });
      $("#post-result").appendChild(approveBtn);
    } catch (err) {
      showResult($("#post-result"), `✗ ${err.message}`, true);
    }
  });

  $("#run-demo").addEventListener("click", async () => {
    const btn = $("#run-demo");
    btn.disabled = true;
    btn.textContent = "Running agent cycle…";
    try {
      const { job, trace } = await api("/api/demo/cycle", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const box = $("#demo-result");
      box.classList.remove("hidden", "error");
      box.innerHTML =
        trace
          .map((t) => `<div class="tl-item"><div class="tl-dot"></div><div class="tl-body"><b>${escapeHtml(t.step)}</b><span>${escapeHtml(t.detail)}</span></div></div>`)
          .join("") +
        `<div style="margin-top:10px"><a class="btn small primary" href="/job/${job.job_id}">Open the finished job →</a></div>`;
    } catch (err) {
      showResult($("#demo-result"), `✗ ${err.message}`, true);
    } finally {
      btn.disabled = false;
      btn.textContent = "Run the full demo cycle";
    }
  });
}

// -------------------------------------------------------------- dashboard

const statsEl = $("#stats");
if (statsEl) {
  let view = null;

  async function loadConfig() {
    view = await api("/api/config");
    const sel = $("#agent-select");
    sel.innerHTML = (view.constraints.allowed_agents || [])
      .map((a) => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`)
      .join("");
    const kv = [
      ["Mode", view.constraints.demo_mode ? "demo (simulated money)" : "live"],
      ["Kill switch", view.constraints.kill_switch ? "ENGAGED" : "off"],
      ["Max reward / job", `$${fmt(view.constraints.max_job_reward_usd)}`],
      ["Daily payout cap", `$${fmt(view.constraints.max_daily_payout_usd)}`],
      ["Min proof length", `${view.constraints.min_proof_length} chars`],
      ["Protocol fee", `${view.constraints.protocol_fee_percent}%`],
      ["Job timeout", `${view.constraints.job_timeout_minutes} min`],
      ["Allowed agents", (view.constraints.allowed_agents || []).join(", ")],
      ["Work engine", view.constraints.work_engine],
    ];
    $("#constraints").innerHTML = `<h2>Constraints</h2><div class="kv">${
      kv.map(([k, v]) => `<div><span class="k">${k}</span><span class="v">${escapeHtml(v)}</span></div>`).join("")
    }</div>`;
  }

  loadSession().then(renderWho);

  async function loadBoard() {
    const board = await api("/api/jobs");
    const s = board.stats;
    statsEl.innerHTML = [
      [s.total_jobs, "jobs posted"],
      [s.completed_jobs, "completed"],
      [`$${fmt(s.total_released_usd)}`, "released from escrow"],
      [`$${fmt(s.total_fees_usd)}`, "protocol fees"],
      [`$${fmt(s.released_today_usd)}`, "released today"],
    ].map(([num, lbl]) => `<div class="stat"><div class="num">${num}</div><div class="lbl">${lbl}</div></div>`).join("");

    const render = (el, jobs, actions) => {
      el.innerHTML = "";
      if (!jobs.length) { el.innerHTML = '<span class="empty">none yet</span>'; return; }
      jobs.forEach((j) => el.appendChild(card(j, actions(j))));
    };
    const pending = (j) => j.payment_status === "pending" && authUser && j.client_id === authUser.user_id;
    const openActions = (j) =>
      pending(j)
        ? `<button class="btn small primary" data-act="approve">Approve deposit ($${fmt(j.reward_usd)})</button>`
        : (j.bids || []).length
          ? (j.bids || []).map((b) => `<span class="bid-tag">${escapeHtml(b.agent_id)}: $${fmt(b.amount_usd)}${j.selected_bid && j.selected_bid.agent_id === b.agent_id ? " ✓ awarded" : ""}</span>`).join(" ")
          : `<button class="btn small primary" data-act="agent-run" ${j.payment_status !== "locked" ? "disabled" : ""}>Agent accepts &amp; delivers</button>`;
    render($("#open-jobs"), board.open_jobs, openActions);
    render($("#active-jobs"), board.active_jobs, () =>
      `<button class="btn small primary" data-act="agent-run">Continue → proof &amp; release</button>`);
    render($("#delivered-jobs"), board.delivered_jobs, () =>
      `<button class="btn small primary" data-act="approve-work">Approve &amp; release payment</button>`);
    render($("#completed-jobs"), board.completed_jobs, () => "");
    render($("#expired-jobs"), board.expired_jobs, () => "");
  }

  async function loadLedger() {
    const { events } = await api("/api/ledger");
    const el = $("#ledger");
    el.innerHTML = "";
    if (!events.length) { el.innerHTML = '<span class="empty">no events yet</span>'; return; }
    [...events].reverse().forEach((e) => {
      const div = document.createElement("div");
      div.className = "event";
      div.innerHTML = `<div><span class="etype">${escapeHtml(e.event_type)}</span> <span class="ets">${escapeHtml(e.ts)}</span></div>` +
        (e.details ? `<div class="edetail">${escapeHtml(e.details)}</div>` : "");
      el.appendChild(div);
    });
  }

  async function refreshAll() {
    await Promise.all([loadBoard(), loadLedger(), loadConfig(), loadReputation()]);
  }

  async function loadReputation() {
    const { agents } = await api("/api/reputation");
    $("#reputation").innerHTML = Object.values(agents)
      .map(
        (s) =>
          `<div><span class="k">${escapeHtml(s.agent_id)}</span><span class="v">rank ${s.rank} · ${s.completed} done · ${s.failed} failed · ${s.disputed} disputed · ${s.success_rate}%</span></div>`
      )
      .join("");
  }

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const id = btn.closest(".card").querySelector(".meta").textContent.split(" ·")[0].trim();
    btn.disabled = true;
    try {
      if (btn.dataset.act === "approve") {
        await api(`/api/jobs/${id}/deposit/approve`, { method: "POST" });
      } else if (btn.dataset.act === "approve-work") {
        await api(`/api/jobs/${id}/approve-work`, { method: "POST" });
      } else {
        await api(`/api/jobs/${id}/agent-run`, {
          method: "POST",
          body: JSON.stringify({ agent_id: $("#agent-select").value }),
        });
      }
    } catch (err) {
      alert(err.message);
    }
    btn.disabled = false;
    refreshAll();
  });

  $("#refresh").addEventListener("click", refreshAll);
  $("#kill-switch").addEventListener("click", async () => {
    const enabled = !(view && view.constraints.kill_switch);
    await api("/api/admin/kill-switch", { method: "POST", body: JSON.stringify({ enabled }) });
    refreshAll();
  });

  refreshAll();
  setInterval(refreshAll, 5000);
}

// ------------------------------------------------------------- job page

const jobHeader = document.getElementById("job-header");
if (jobHeader) initJobPage(jobHeader);

const EVENT_ICONS = {
  job_posted: "Job posted",
  deposit_approved: "Client approved the transaction",
  deposit_locked: "Funds locked in escrow",
  job_accepted: "Agent accepted the job",
  agent_working: "Agent working",
  proof_submitted: "Proof submitted",
  funds_released: "Funds released to agent",
  protocol_fee_collected: "Protocol fee collected",
  job_expired: "Job expired",
  funds_refunded: "Funds refunded to client",
  release_blocked: "Release blocked",
  kill_switch_engaged: "Kill switch engaged",
  kill_switch_released: "Kill switch released",
  work_delivered: "Work delivered — awaiting client approval",
  work_approved: "Client approved the work",
  bid_placed: "Bid placed",
  bid_awarded: "Bid awarded",
  dispute_opened: "Dispute opened",
  dispute_resolved: "Dispute resolved",
};

function eventItem(e) {
  const label = EVENT_ICONS[e.event_type] || e.event_type;
  const ts = String(e.ts || "").replace("T", " ").slice(0, 19) + " UTC";
  return `<div class="tl-item"><div class="tl-dot"></div><div class="tl-body"><b>${escapeHtml(label)}</b><span>${escapeHtml(e.details || "")}</span><span class="tl-ts">${escapeHtml(ts)}</span></div></div>`;
}

async function initJobPage(root) {
  const jobId = root.dataset.jobId || location.pathname.split("/").pop();
  let job;
  try {
    job = await api(`/api/jobs/${jobId}`);
  } catch (err) {
    root.innerHTML = `<h2>Job not found</h2><p class="hint">${escapeHtml(err.message)}</p>`;
    return;
  }
  const { events } = await api("/api/ledger");
  const mine = events.filter((e) => e.job_id === jobId);

  const steps = [
    ["Posted", true],
    ["Funded", job.payment_status !== "pending"],
    ["In progress", ["accepted", "delivered", "completed"].includes(job.status)],
    ["Delivered", ["delivered", "completed"].includes(job.status)],
    ["Proof verified", !!job.proof_hash],
    ["Released", job.payment_status === "released"],
  ];
  root.innerHTML = `
    <div class="panel-head">
      <h2 style="margin:0">${escapeHtml(job.title)}</h2>
      <div><span class="pill ${job.status}">${job.status}</span>
      <span class="pill ${job.payment_status}">funds: ${job.payment_status}</span></div>
    </div>
    <div class="stepper">${steps
      .map(([label, on]) => `<span class="step-pill ${on ? "on" : ""}">${on ? "✓" : "○"} ${label}</span>`)
      .join("")}</div>`;

  $("#timeline").innerHTML = mine.length
    ? mine.map(eventItem).join("")
    : '<span class="empty">no events yet</span>';

  $("#money").innerHTML = `<h2>Escrow</h2><div class="kv">
    <div><span class="k">Reward</span><span class="v">$${fmt(job.reward_usd)}</span></div>
    <div><span class="k">Protocol fee</span><span class="v">${job.fee_usd != null ? "$" + fmt(job.fee_usd) : "—"}</span></div>
    <div><span class="k">Agent payout</span><span class="v">${job.agent_payout_usd != null ? "$" + fmt(job.agent_payout_usd) : "—"}</span></div>
    <div><span class="k">Client</span><span class="v">${escapeHtml(job.client || "anonymous")}</span></div>
    <div><span class="k">Agent</span><span class="v">${escapeHtml(job.agent || "unassigned")}</span></div>
    <div><span class="k">Deposit</span><span class="v mono">${escapeHtml(job.deposit_address || "")}</span></div>
  </div>`;

  // buyer approval for delivered jobs
  if (job.status === "delivered") {
    const approval = document.createElement("div");
    approval.style.marginTop = "16px";
    approval.innerHTML = `
      <p class="hint" style="margin:0 0 12px">The agent delivered and the proof hash verified. Approve the work to release the escrow, or open a dispute within the window.</p>
      <button id="approve-btn" class="btn primary">Approve work &amp; release $${fmt(job.reward_usd)}</button>`;
    $("#money").appendChild(approval);
    $("#approve-btn").addEventListener("click", async (e) => {
      e.target.disabled = true;
      try {
        await api(`/api/jobs/${jobId}/approve-work`, { method: "POST" });
        location.reload();
      } catch (err) {
        e.target.disabled = false;
        alert(err.message);
      }
    });
  }

  $("#deliverable").innerHTML = job.deliverable
    ? renderMarkdown(job.deliverable)
    : '<span class="empty">The agent has not delivered yet.</span>';

  $("#proof-hash").textContent = job.proof_hash || "not submitted yet";
  $("#verify-btn").addEventListener("click", async () => {
    const res = $("#verify-result");
    res.classList.remove("hidden", "error");
    if (!job.proof_hash || !job.deliverable) {
      res.textContent = "No proof submitted yet — nothing to verify.";
      return;
    }
    try {
      const hex = await sha256Hex(job.deliverable);
      const ok = hex === job.proof_hash;
      res.classList.toggle("error", !ok);
      res.textContent = ok
        ? "✓ Verified: the SHA-256 computed in your browser matches the submitted proof. Funds were released on valid proof of work."
        : "✗ Mismatch: the recomputed hash does not match the submitted proof.";
    } catch (err) {
      res.classList.add("error");
      res.textContent = `Browser crypto unavailable: ${err.message}`;
    }
  });

  $("#copy-link").addEventListener("click", () => {
    navigator.clipboard?.writeText(location.href);
    $("#copy-link").textContent = "Link copied ✓";
  });

  // bids
  if ((job.bids || []).length) {
    $("#bid-panel").hidden = false;
    $("#bids").innerHTML =
      job.bids
        .map(
          (b) =>
            `<div><span class="k">${escapeHtml(b.agent_id)}</span><span class="v">$${fmt(b.amount_usd)}${job.selected_bid && job.selected_bid.agent_id === b.agent_id ? " ✓ awarded" : ""}</span></div>`
        )
        .join("");
  }

  // dispute (completed jobs within the window, owner only)
  if (job.status === "completed" && !job.disputed && (job.dispute_window_minutes || 0) > 0) {
    $("#dispute-panel").hidden = false;
    $("#dispute-btn").addEventListener("click", async () => {
      const reason = $("#dispute-reason").value.trim();
      const res = $("#dispute-result");
      res.classList.remove("hidden", "error");
      if (reason.length < 3) {
        res.classList.add("error");
        res.textContent = "Describe what went wrong (at least 3 characters).";
        return;
      }
      try {
        await api(`/api/jobs/${jobId}/dispute`, {
          method: "POST",
          body: JSON.stringify({ reason }),
        });
        res.textContent = "✓ Dispute opened. The protocol will resolve it and refund or uphold the payout.";
        $("#dispute-btn").disabled = true;
      } catch (err) {
        res.classList.add("error");
        res.textContent = `✗ ${err.message}`;
      }
    });
  } else if (job.disputed) {
    $("#dispute-panel").hidden = false;
    $("#dispute-panel").querySelector("h2").textContent = "Dispute (open)";
    $("#dispute-panel").querySelector(".hint").textContent = job.dispute_reason || "";
    $("#dispute-btn").remove();
    $("#dispute-reason").remove();
  }
}
