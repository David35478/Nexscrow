(() => {
  const root = document.getElementById('request-workspace');
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  let agentId = root.dataset.agentId;
  const requestedId = root.dataset.requestId;
  const historyPage = root.dataset.history === 'true';
  const form = $('request-form');
  let options = null, active = null, pollTimer = null, polls = 0, busy = false;
  let idempotencyKey = crypto.randomUUID();
  const advanceStatuses = new Set(['creating', 'ready', 'running', 'pending', 'settling']);
  const terminalStatuses = new Set(['delivered', 'completed', 'failed', 'unknown']);
  const labelStatus = (s) => String(s || 'unknown').replaceAll('_', ' ');
  function alert(message, error = false) {
    const el = $('workspace-alert'); el.textContent = message; el.hidden = !message;
    el.dataset.error = error ? 'true' : 'false';
  }
  async function api(path, init = {}) {
    const response = await fetch(path, {credentials:'same-origin', ...init,
      headers:{'Content-Type':'application/json', ...(init.headers || {})}});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status})`);
    return data;
  }
  function renderOptions(data) {
    options = data.agent || data;
    $('agent-title').textContent = options.name || options.display_name || agentId || 'Agent';
    $('agent-description').textContent = options.description || '';
    const price = data.task_price_usd;
    $('escrow-price').textContent = price != null && Number.isFinite(Number(price)) ? `$${Number(price).toFixed(2)} USD per call` : 'Price unavailable';
    const credits = data.credits || {};
    const creditCost = data.credit_cost;
    $('credit-price').textContent = creditCost != null && Number.isFinite(Number(creditCost)) ? `${creditCost} ${Number(creditCost) === 1 ? "call" : "calls"}` : 'Unavailable';
    $('credit-detail').textContent = credits.allowed
      ? `Uses 1 call from your plan · ${credits.available ?? credits.balance ?? '—'} calls left · ${credits.plan || 'eligible subscription'}`
      : 'Not available for this account or agent.';
    const escrow = $('pay-escrow'), credit = $('pay-credits');
    escrow.disabled = price == null; credit.disabled = !credits.allowed || creditCost == null || Number(credits.available ?? credits.balance ?? 0) < Number(creditCost);
    const schema = options.input_schema || {};
    const props = schema.properties || {};
    const hasPrompt = Object.prototype.hasOwnProperty.call(props, 'prompt');
    $('task-input').required = hasPrompt && (schema.required || []).includes('prompt');
    if (!hasPrompt) {
      $('task-label').textContent = 'Task description (optional)';
      $('task-help').textContent = 'This description is sent only when the agent input schema includes a prompt field.';
    }
    if (Object.keys(props).some(key => key !== 'prompt') || !hasPrompt) $('schema-wrap').hidden = false;
    if (hasPrompt && (schema.required || []).includes('prompt')) $('task-label').textContent = 'Task description (required)';
    const creditsRadio = $('pay-credits');
    if (new URLSearchParams(location.search).get('payment') === 'credits' && !creditsRadio.disabled) creditsRadio.checked = true;
    if (data.file_upload_supported === false) $('upload-note').hidden = false;
    updateSubmit();
  }
  async function refreshOptions() {
    if (!agentId) return;
    renderOptions(await api(`/api/requests/options/${encodeURIComponent(agentId)}`));
  }
  function updateSubmit() {
    const selected = document.querySelector('input[name="payment_method"]:checked');
    $('submit-request').disabled = !selected || selected.disabled || !$('confirm-execution').checked || !form.checkValidity();
  }
  async function loadHistory() {
    try {
      const {requests = []} = await api('/api/requests');
      const list = $('history-list'); list.replaceChildren();
      if (!requests.length) { list.innerHTML = '<p class="workspace-muted">No tasks yet — pick an agent to start. <a class="btn btn-primary btn-sm empty-cta" href="/app">Browse agents</a></p>'; return; }
      for (const item of requests) {
        const link = document.createElement('a'); link.href = `/workspace?request=${encodeURIComponent(item.request_id)}`;
        const name = document.createElement('strong'); name.textContent = item.agent_name || item.agent_id || 'Agent request';
        const state = document.createElement('span'); state.textContent = labelStatus(item.status);
        link.append(name, state); list.append(link);
      }
    } catch (e) { $('history-list').textContent = `Could not load request history: ${e.message}`; }
  }
  function renderTracker(record, state) {
    const credits = record.payment_method === 'credits';
    const labels = [credits ? 'Plan call' : 'Funded', 'Working', 'Delivered', 'Approved'];
    const approved = record.approved || record.payment_status === 'released' || (credits && state === 'completed');
    let idx = 0, bad = '';
    if (state === 'failed' || state === 'cancelled') { bad = state === 'failed' ? 'Failed' : 'Cancelled'; idx = record.job_id && state === 'failed' ? 1 : 0; }
    else if (approved || state === 'completed' && !credits) idx = 3;
    else if (state === 'delivered') idx = 2;
    else if (state === 'awaiting_funding') idx = -1;
    else if (advanceStatuses.has(state)) idx = 1;
    const ol = $('step-tracker'); ol.replaceChildren();
    labels.forEach((label, i) => {
      const li = document.createElement('li'); li.textContent = label;
      if (i < idx || (i === idx && idx === 3)) li.className = 'done';
      if (i === idx) { if (bad) { li.className = 'bad'; li.textContent = `${label} — ${bad}`; } else li.setAttribute('aria-current', 'step'); }
      if (idx === -1 && i === 0) li.setAttribute('aria-current', 'step');
      ol.append(li);
    });
    const proof = $('proof-link');
    proof.hidden = !record.job_id; if (record.job_id) proof.href = `/job/${encodeURIComponent(record.job_id)}`;
  }
  function showRecord(record) {
    active = record;
    renderTracker(record, String(record.status || '').toLowerCase());
    $('execution-empty').hidden = true; $('execution-detail').hidden = false;
    $('execution-title').textContent = record.agent_name || record.agent_id || 'Agent request';
    $('request-status').textContent = labelStatus(record.status);
    $('request-message').textContent = record.error || record.message || '';
    const state = String(record.status || '').toLowerCase();
    const track = document.querySelector('.progress-track');
    track.dataset.state = ['completed','delivered'].includes(state) ? 'done' : advanceStatuses.has(state) || state === 'awaiting_funding' ? 'working' : '';
    $('funding-actions').hidden = state !== 'awaiting_funding' || !record.job_id;
    $('approval-actions').hidden = !(state === 'delivered' && record.payment_method === 'escrow');
    $('retry-button').hidden = !advanceStatuses.has(state);
    $('retry-button').textContent = 'Check status again';
    const result = record.result;
    $('result-section').hidden = result == null;
    if (result != null) $('request-result').textContent = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    $('usage-section').hidden = record.usage == null;
    if (record.usage != null) $('request-usage').textContent = JSON.stringify(record.usage, null, 2);
    const logs = $('request-logs'); logs.replaceChildren();
    if (Array.isArray(record.logs) && record.logs.length) {
      $('logs-section').hidden = false;
      record.logs.forEach(entry => { const li = document.createElement('li'); li.textContent = typeof entry === 'string' ? entry : JSON.stringify(entry); logs.append(li); });
    } else $('logs-section').hidden = true;
    if (['delivered', 'completed', 'failed', 'unknown'].includes(state)) {
      loadHistory();
      if (record.payment_method === 'credits') refreshOptions().catch(e => alert(`Could not refresh call balance: ${e.message}`, true));
    }
    if (advanceStatuses.has(state)) schedulePoll(); else clearTimeout(pollTimer);
  }
  function schedulePoll() {
    clearTimeout(pollTimer);
    if (document.hidden || polls >= 360 || busy || !active || !advanceStatuses.has(String(active.status).toLowerCase())) return;
    pollTimer = setTimeout(async () => {
      if (!active || document.hidden) return;
      busy = true; polls++;
      try { showRecord(await api(`/api/requests/${encodeURIComponent(active.request_id)}/advance`, {method:'POST', body:'{}'})); }
      catch (e) { alert(`Status check failed: ${e.message}`, true); }
      finally { busy = false; if (active && advanceStatuses.has(String(active.status).toLowerCase())) schedulePoll(); }
    }, 5000);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(pollTimer); else if (active && advanceStatuses.has(String(active.status).toLowerCase())) schedulePoll(); });
  form?.addEventListener('input', updateSubmit);
  form?.addEventListener('change', updateSubmit);
  form?.addEventListener('submit', async (event) => {
    event.preventDefault(); alert('');
    if (!form.reportValidity()) return;
    const method = document.querySelector('input[name="payment_method"]:checked')?.value;
    if (!method || busy) return;
    let inputs;
    try { inputs = JSON.parse($('inputs-json').value || '{}'); if (!inputs || Array.isArray(inputs) || typeof inputs !== 'object') throw new Error('Inputs must be a JSON object.'); }
    catch (e) { alert(`Invalid agent input: ${e.message}`, true); $('inputs-json').focus(); return; }
    const schema = options?.input_schema || {};
    if (Object.prototype.hasOwnProperty.call(schema.properties || {}, 'prompt') && $('task-input').value.trim())
      inputs.prompt = $('task-input').value.trim();
    busy = true; $('submit-request').disabled = true; $('submit-request').textContent = 'Submitting…';
    try {
      const record = await api('/api/requests', {method:'POST', body:JSON.stringify({agent_id:agentId, inputs, payment_method:method, idempotency_key:idempotencyKey})});
      history.replaceState(null, '', `/workspace?request=${encodeURIComponent(record.request_id)}`);
      $('confirm-execution').checked = false;
      idempotencyKey = crypto.randomUUID();
      polls = 0; showRecord(record); await loadHistory();
      if (record.payment_method === 'credits') await refreshOptions();
    } catch (e) { alert(`Request could not be submitted: ${e.message}. You can submit again safely.`, true); }
    finally { busy = false; $('submit-request').textContent = 'Submit request'; updateSubmit(); }
  });
  $('fund-button')?.addEventListener('click', async () => {
    if (!active?.job_id || busy) return;
    busy = true;
    try {
      if (active.demo) {
        await api(`/api/jobs/${encodeURIComponent(active.job_id)}/deposit/approve`, {method:'POST',body:'{}'});
      } else {
        if (typeof window.payEscrow !== 'function') throw new Error('Escrow wallet payment is unavailable.');
        const payment = await window.payEscrow(active.job_id);
        if (payment?.redirected) { alert('Wallet confirmation is in progress. This page will update when you return.'); return; }
      }
      polls = 0;
      showRecord(await api(`/api/requests/${encodeURIComponent(active.request_id)}/advance`, {method:'POST',body:'{}'}));
    } catch (e) { alert(`Escrow funding was not confirmed: ${e.message}`, true); }
    finally { busy = false; }
  });
  $('approve-button')?.addEventListener('click', async () => {
    if (!active?.request_id || busy || !confirm('Approve the delivered work and release the escrow payment?')) return;
    busy = true;
    try { showRecord(await api(`/api/requests/${encodeURIComponent(active.request_id)}/approve`, {method:'POST',body:'{}'})); await loadHistory(); }
    catch (e) { alert(`Could not approve request: ${e.message}`, true); }
    finally { busy = false; }
  });
  $('retry-button')?.addEventListener('click', async () => {
    if (!active?.request_id || busy) return;
    busy = true;
    try { showRecord(await api(`/api/requests/${encodeURIComponent(active.request_id)}/advance`, {method:'POST',body:'{}'})); polls = 0; }
    catch (e) { alert(`Could not check request status: ${e.message}`, true); }
    finally { busy = false; }
  });
  $('copy-result')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('request-result').textContent); $('copy-result').textContent = 'Copied'; }
    catch (_) { alert('Clipboard access is unavailable.', true); }
  });
  loadHistory();
  if (requestedId) {
    $('request-form-card').hidden = true;
    api(`/api/requests/${encodeURIComponent(requestedId)}`).then(record => {
      agentId = record.agent_id;
      showRecord(record);
      return refreshOptions();
    }).catch(e => alert(`Could not load request: ${e.message}`, true));
  } else if (!historyPage && agentId) {
    refreshOptions().catch(e => alert(`Could not load agent options: ${e.message}`, true));
  } else if (!historyPage) alert('Choose an agent from the marketplace to start a request.', true);
})();
