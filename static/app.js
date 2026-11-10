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

function card(job, actions = "") {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <div class="title">${escapeHtml(job.title)}
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
      showResult($("#demo-result"), [
        ...trace.map((t) => `→ ${t.step}: ${t.detail}`),
        "",
        `✓ Job ${job.job_id} completed. Payout $${fmt(job.agent_payout_usd)} to ${job.agent}, fee $${fmt(job.fee_usd)}.`,
        "See the full history on the public ledger: /dashboard",
      ]);
    } catch (err) {
      showResult($("#demo-result"), `✗ ${err.message}`, true);
    } finally {
      btn.disabled = false;
      btn.textContent = "▶ Run full demo cycle";
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
        : `<button class="btn small primary" data-act="agent-run" ${j.payment_status !== "locked" ? "disabled" : ""}>Agent accepts &amp; delivers</button>`;
    render($("#open-jobs"), board.open_jobs, openActions);
    render($("#active-jobs"), board.active_jobs, () =>
      `<button class="btn small primary" data-act="agent-run">Continue → proof &amp; release</button>`);
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
    await Promise.all([loadBoard(), loadLedger(), loadConfig()]);
  }

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const id = btn.closest(".card").querySelector(".meta").textContent.split(" ·")[0].trim();
    btn.disabled = true;
    try {
      if (btn.dataset.act === "approve") {
        await api(`/api/jobs/${id}/deposit/approve`, { method: "POST" });
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
