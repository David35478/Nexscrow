document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const money = (value) => value == null ? '—' : `$${Number(value).toFixed(2)}`;
  const date = (value) => value ? new Date(value).toLocaleString() : '—';
  const safe = (value) => value == null ? '' : String(value);
  const state = { plans: [], packages: [], assets: [], enabled: false, checkoutEnabled: false, kind: 'subscription', quote: null, quoteInput: null, order: null, idempotency: null, creating: false, uncertain: false, pollTimer: null };
  const descriptions = { payments: 'Your subscription and payment history will appear here.', topups: 'Your purchased call top-ups will appear here.', usage: 'Your plan-funded agent calls will appear here.' };
  const status = (id, message, error = false) => { const el = $(id); el.textContent = message; el.classList.toggle('error', error); };
  const option = (select, value, label) => { const el = document.createElement('option'); el.value = value; el.textContent = label; select.append(el); };
  async function request(path, opts) { if (typeof api === 'function') return api(path, opts); const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts }); const data = await res.json(); if (!res.ok) throw new Error(data.detail || data.error || res.statusText); return data; }

  function displayPlan(plan) {
    const card = document.createElement('article'); card.className = 'plan-card';
    const name = document.createElement('span'); name.className = 'plan-name'; name.textContent = safe(plan.name); card.append(name);
    const price = document.createElement('div'); price.className = 'plan-price'; price.textContent = money(plan.price_usd);
    const period = document.createElement('small'); period.textContent = ` / ${Number(plan.period_days) || 30} days`; price.append(period); card.append(price);
    const credits = document.createElement('div'); credits.className = 'plan-credits'; credits.textContent = `${plan.agent_limit ? Number(plan.agent_limit) + (Number(plan.agent_limit) === 1 ? " agent" : " agents") : "Unlimited agents"} · ${(Number(plan.credits) || 0).toLocaleString()} calls${Number(plan.price_usd) === 0 ? ' · one-time enrollment' : ` / ${Number(plan.period_days) || 30} days`}${plan.rollover ? ' · rollover enabled' : ''}`; card.append(credits);
    const button = document.createElement('button'); button.type = 'button'; button.className = 'btn btn-primary btn-block';
    const isFree = Number(plan.price_usd) === 0;
    const active = state.subscription;
    const activePrice = active ? Number(active.price_usd) : null;
    const targetPrice = Number(plan.price_usd);
    if (active && targetPrice < activePrice) {
      button.textContent = 'Schedule downgrade';
      button.disabled = false;
      button.addEventListener('click', () => scheduleDowngrade(plan.id, plan.name));
    } else {
      button.textContent = isFree ? 'Choose free plan' : active && plan.id === active.plan ? 'Renew with payment' : 'Continue to payment';
      button.disabled = !state.enabled || (!isFree && !state.checkoutEnabled);
      button.addEventListener('click', () => isFree ? enrollFree() : openCheckout('subscription', plan.id));
    }
    card.append(button);
    $('plans-grid').append(card);
  }
  async function enrollFree() {
    try { await request('/api/subscription/free', { method: 'POST', body: '{}' }); status('plan-status', 'Free plan activated.'); await loadAccount(); }
    catch (error) { status('plan-status', error.message, true); }
  }
  async function loadAccount() {
    const [me, credits] = await Promise.all([request('/api/subscription/me'), request('/api/credits/me')]);
    const balance = credits.balance ?? me.balance;
    $('balance').textContent = Number(balance ?? 0).toLocaleString();
    $('balance-detail').textContent = `${Number(credits.available ?? me.available ?? 0).toLocaleString()} available · ${Number(credits.plan_credits ?? me.plan_credits ?? 0).toLocaleString()} plan · ${Number(credits.topup_credits ?? me.topup_credits ?? 0).toLocaleString()} top-up calls`;
    state.checkoutEnabled = Boolean(me.checkout_enabled);
    const sub = me.subscription;
    state.subscription = sub;
    const topup = $('buy-credits-btn');
    topup.disabled = !sub; topup.style.opacity = sub ? '' : '0.5'; topup.style.cursor = sub ? '' : 'not-allowed';
    $('topup-note').hidden = Boolean(sub);
    $('subscription-status').textContent = sub ? safe(sub.status || 'Active') : 'No active plan';
    $('subscription-detail').textContent = sub ? `${safe(sub.plan_name || sub.name || sub.plan_id)} · ${safe(sub.status || 'active')}` : 'Choose a plan to get a monthly call allowance and access eligible agents.';
    $('subscription-extra').textContent = sub ? `Starts ${date(sub.starts_at || sub.start_at)} · expires ${date(sub.expires_at || sub.end_at)}. Paid renewals require a new payment; no automatic crypto charges.` : 'No subscription yet';
    const scheduled = me.scheduled_change || sub?.scheduled_change;
    if (scheduled) $('subscription-extra').textContent += ` Scheduled change to ${safe(scheduled.plan_id)} effective ${date(scheduled.effective_at)}${scheduled.requires_payment ? '; requires a new payment after expiry' : ''}.`;
    const futurePeriods = me.scheduled_subscriptions || [];
    if (futurePeriods.length) $('subscription-extra').textContent += ` Prepaid future periods: ${futurePeriods.map(period => `${safe(period.name || period.plan)} (${date(period.start_at)}–${date(period.expires_at)})`).join('; ')}. These calls are unavailable until their period starts.`;
    const frozen = Boolean(me.frozen ?? credits.frozen);
    if (frozen) {
      const warning = document.createElement('p'); warning.className = 'billing-notice'; warning.setAttribute('role', 'alert');
      warning.textContent = `Account restricted for payment reconciliation${me.freeze_reason || credits.freeze_reason ? `: ${safe(me.freeze_reason || credits.freeze_reason)}` : '.'} Plan-funded calls may be unavailable while this is reviewed.`;
      $('subscription-extra').append(document.createElement('br'), warning);
    }
  }
  async function scheduleDowngrade(planId, planName) {
    try {
      const result = await request('/api/subscription/change', { method: 'POST', body: JSON.stringify({ plan_id: planId }) });
      const active = result.subscription || state.subscription || {};
      const effective = result.effective_at || result.scheduled_change?.effective_at || active.expires_at || active.end_at;
      status('plan-status', `Downgrade to ${planName} scheduled for ${date(effective)}. A paid plan requires a new payment after the current period ends; no automatic charge will occur.`);
      await loadAccount();
    } catch (error) { status('plan-status', error.message, true); }
  }
  async function loadPlans() {
    const data = await request('/api/subscription/plans'); state.plans = data.plans || []; state.enabled = Boolean(data.enabled);
    state.plans.forEach(displayPlan);
    status('plan-status', data.enabled ? '' : (data.disabled_reason || 'Plan purchases are currently unavailable.'));
  }
  function setSelectorOptions() {
    const network = $('checkout-network'), token = $('checkout-token'); network.replaceChildren(); token.replaceChildren();
    const chains = [...new Set(state.assets.map(asset => asset.blockchain).filter(Boolean))];
    chains.forEach(chain => option(network, chain, chain));
    function update() {
      token.replaceChildren();
      state.assets.filter(asset => asset.blockchain === network.value).forEach(asset => option(token, asset.assetId, `${asset.symbol} (${asset.blockchain})`));
    }
    network.addEventListener('change', update); update();
  }
  function openCheckout(kind, id) {
    if (kind === 'topup' && !state.subscription) { status('checkout-status', 'Top-ups are available once you have an active plan.'); return; }
    if (state.uncertain) {
      status('checkout-status', 'Resolve the previous payment request using its original details before starting another.');
      if (!$('checkout-dialog').open) $('checkout-dialog').showModal();
      return;
    }
    state.idempotency = null;
    clearTimeout(state.pollTimer);
    ['checkout-package', 'checkout-network', 'checkout-token', 'refund-address'].forEach(id => $(id).disabled = false);
    state.kind = kind; state.quote = null; state.quoteInput = null; state.order = null;
    $('checkout-title').textContent = kind === 'subscription' ? 'Subscribe or renew' : 'Top up agent calls';
    const select = $('checkout-package'); select.replaceChildren();
    const records = kind === 'subscription' ? state.plans.filter(x => Number(x.price_usd) > 0) : state.packages;
    records.forEach(item => option(select, item.id, `${item.name || item.id} — ${money(item.price_usd)}, ${Number(item.credits) || 0} calls`));
    if (id) select.value = id;
    $('quote-details').hidden = true; $('confirm-payment').checked = false; $('create-payment').disabled = true;
    $('quote-button').disabled = !state.enabled || !state.checkoutEnabled;
    $('checkout-status').textContent = $('quote-button').disabled
      ? ($('plan-status').textContent || 'Checkout is currently unavailable.')
      : '';
    $('checkout-dialog').showModal();
  }
  function quoteData() {
    return { [state.kind === 'subscription' ? 'plan_id' : 'package_id']: $('checkout-package').value, origin_asset: $('checkout-token').value, refund_address: $('refund-address').value.trim() };
  }
  function invalidateQuote() {
    if (state.creating || state.order || state.uncertain) return;
    state.quote = null; state.quoteInput = null; state.idempotency = null;
    $('quote-details').hidden = true; $('confirm-payment').checked = false; $('create-payment').disabled = true;
    status('checkout-status', 'Payment details changed. Get a new quote before creating an order.');
  }
  ['checkout-package', 'checkout-network', 'checkout-token', 'refund-address'].forEach(id => {
    $(id).addEventListener('change', invalidateQuote);
    $(id).addEventListener('input', invalidateQuote);
  });
  function showQuote(record) {
    state.quote = record; const quote = record.quote_response?.quote || record.quote || {};
    const fields = [
      ['USD price', money(record.price_usd)], ['Agent calls', record.credits], ['Deposit amount', quote.amountInFormatted || quote.amountIn],
      ['Input amount (USD)', quote.amountInUsd], ['Settlement amount (USD)', quote.amountOutUsd],
      ['Deposit address', quote.depositAddress || record.deposit_address], ['Memo', quote.depositMemo || record.deposit_memo],
      ['Quote expires', quote.deadline || record.quote_expires_at], ['Estimated time', quote.timeEstimate],
      ['Estimated route cost incl. price impact (USD)', record.estimated_fees?.route_cost_usd], ['Refund fee', record.estimated_fees?.refundFee ?? quote.refundFee], ['Withdrawal fee', record.estimated_fees?.withdrawFee ?? quote.withdrawFee], ['Destination', quote.destination || record.destination]
    ].filter(([, value]) => value != null && value !== '');
    if (record.estimated_fees?.note) fields.push(['Fee estimate', record.estimated_fees.note]);
    const dl = $('quote-fields'); dl.replaceChildren();
    fields.forEach(([label, value]) => { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = safe(value); dl.append(dt, dd); });
    const preview = record.dry === true;
    $('quote-details').hidden = false;
    $('confirm-payment').closest('label').hidden = !preview;
    $('create-payment').hidden = !preview;
    $('confirm-payment').checked = false; $('create-payment').disabled = true;
    status('checkout-status', preview ? 'Review quote, amount, destination, fees, and expiry before creating a payment.' : `Payment order ${safe(record.payment_id || record.id)} created. Calls are added only after verified settlement.`);
  }
  $('confirm-payment').addEventListener('change', () => { $('create-payment').disabled = !state.quote || !state.quote.dry || !$('confirm-payment').checked; });
  $('quote-button').addEventListener('click', async () => {
    if (!state.enabled || !state.checkoutEnabled) return status('checkout-status', $('plan-status').textContent || 'Checkout is currently unavailable.', true);
    if (state.creating || state.uncertain || state.order) return;
    if (!$('checkout-token').value || !$('refund-address').value.trim()) return status('checkout-status', 'Choose a supported asset and enter a refund address.', true);
    try {
      const endpoint = state.kind === 'subscription' ? '/api/subscription/quote' : '/api/credits/topup/quote';
      const input = quoteData();
      const record = await request(endpoint, { method: 'POST', body: JSON.stringify(input) });
      if (JSON.stringify(input) !== JSON.stringify(quoteData())) return;
      if (record.dry !== true) throw new Error('The service did not return a preview quote. No payment was created.');
      state.quoteInput = input; showQuote(record);
    } catch (error) { status('checkout-status', error.message, true); }
  });
  $('create-payment').addEventListener('click', async () => {
    if (state.creating || !state.quote?.dry || !state.quoteInput || !$('confirm-payment').checked) return;
    if (!state.idempotency) state.idempotency = crypto.randomUUID();
    state.creating = true; state.uncertain = false;
    ['checkout-package', 'checkout-network', 'checkout-token', 'refund-address', 'quote-button', 'create-payment'].forEach(id => $(id).disabled = true);
    try {
      const endpoint = state.kind === 'subscription' ? '/api/subscription/checkout' : '/api/credits/topup/create';
      const order = await request(endpoint, { method: 'POST', body: JSON.stringify({ ...state.quoteInput, idempotency_key: state.idempotency }) });
      state.idempotency = null; state.order = order; showQuote({ ...order, dry: false }); startPolling(order.payment_id || order.id);
      await loadHistory('payments');
    } catch (error) { state.uncertain = true; status('checkout-status', `${error.message} The result is uncertain. Retry the same request; the original details and idempotency key are retained.`, true); }
    finally {
      state.creating = false;
      ['checkout-package', 'checkout-network', 'checkout-token', 'refund-address', 'quote-button'].forEach(id => $(id).disabled = Boolean(state.order || state.uncertain));
      $('create-payment').disabled = Boolean(state.order) || !state.quote?.dry || !$('confirm-payment').checked;
    }
  });
  function startPolling(id) {
    clearTimeout(state.pollTimer); let count = 0;
    const poll = async () => {
      if (document.hidden || count >= 60 || !id) { if (count < 60) state.pollTimer = setTimeout(poll, 5000); return; }
      count++;
      try {
        const order = await request(`/api/credits/topup/${encodeURIComponent(id)}/status`); state.order = order;
        const label = safe(order.status || 'pending');
        const statusKey = label.toLowerCase();
        const statusText = statusKey === 'review_after_settlement'
          ? 'Settlement requires operator reconciliation. The account may be restricted; existing credits have not been silently reversed.'
          : ['underpaid', 'expired', 'refunded', 'review', 'quarantined', 'failed', 'unknown'].includes(statusKey)
            ? `Payment ${label}. Calls have not been added. Contact support if you sent funds.`
            : ['paid', 'completed', 'settled', 'success', 'succeeded'].includes(statusKey)
              ? (order.purpose === 'topup' ? 'Top-up added ✓' : 'Plan active ✓')
              : ['deposit_detected', 'processing'].includes(statusKey) ? 'Payment detected — confirming…' : 'Waiting for your payment…';
        status('checkout-status', statusText); await loadAccount(); await loadHistory('payments');
        if (['paid', 'completed', 'settled', 'success', 'succeeded'].includes(statusKey)) { $('plans-grid').replaceChildren(); state.plans.forEach(displayPlan); status('plan-status', statusText); }
        if (['paid', 'completed', 'settled', 'success', 'succeeded', 'failed', 'expired', 'refunded', 'underpaid', 'review', 'review_after_settlement', 'unknown', 'quarantined'].includes(label.toLowerCase())) return;
      } catch (error) { status('checkout-status', `Could not refresh payment status: ${error.message}`, true); }
      state.pollTimer = setTimeout(poll, 5000);
    };
    state.pollTimer = setTimeout(poll, 5000);
  }
  async function loadHistory(kind) {
    $('history-rows').replaceChildren(); $('history-empty').hidden = true; status('history-status', 'Loading activity…');
    try {
      const data = await request(kind !== 'usage' ? '/api/billing/history' : '/api/credits/history');
      const rows = kind === 'usage' ? (data.entries || []) : (data.payments || []).filter(entry => kind !== 'topups' || entry.purpose === 'topup');
      rows.forEach(entry => {
        const row = document.createElement('tr');
        const values = kind !== 'usage'
          ? [date(entry.created_at), `${safe(entry.purpose)}${entry.plan_id ? ` · ${safe(entry.plan_id)}` : ''}`, money(entry.price_usd), safe(entry.status)]
          : [date(entry.created_at), safe(entry.description || entry.type), `${Number(entry.delta ?? entry.amount) > 0 ? '+' : ''}${safe(entry.delta ?? entry.amount)} calls`, safe(entry.status || entry.type)];
        values.forEach(value => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); });
        if (kind !== 'usage' && entry.payment_id && !['paid', 'expired', 'refunded', 'failed', 'review', 'review_after_settlement', 'unknown'].includes(String(entry.status).toLowerCase())) {
          const cell = document.createElement('td'); const check = document.createElement('button'); check.type = 'button'; check.className = 'btn btn-secondary'; check.textContent = 'Check status';
          check.addEventListener('click', () => { state.order = entry; $('checkout-dialog').showModal(); $('checkout-title').textContent = 'Payment status'; showQuote({...entry, dry: false}); $('quote-button').disabled = true; ['checkout-package', 'checkout-network', 'checkout-token', 'refund-address'].forEach(id => $(id).disabled = true); status('checkout-status', `Checking payment ${entry.payment_id}…`); startPolling(entry.payment_id); }); cell.append(check); row.append(cell);
        }
        $('history-rows').append(row);
      });
      $('history-empty').hidden = rows.length > 0; $('history-empty-text').textContent = descriptions[kind]; status('history-status', '');
    } catch (error) { $('history-empty').hidden = true; status('history-status', error.message, true); }
  }
  document.querySelectorAll('[data-history]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-history]').forEach(item => item.classList.toggle('active', item === button)); loadHistory(button.dataset.history);
  }));
  $('buy-credits-btn').addEventListener('click', () => openCheckout('topup'));
  document.addEventListener('visibilitychange', () => { if (!document.hidden && state.order) startPolling(state.order.payment_id || state.order.id); else clearTimeout(state.pollTimer); });

  Promise.all([loadPlans(), loadAccount(), request('/api/credits/packages').then(data => { state.packages = data.packages || []; }), request('/api/billing/payment-assets').then(data => { state.assets = Array.isArray(data) ? data : data.assets || []; })])
    .then(() => { $('plans-grid').replaceChildren(); state.plans.forEach(displayPlan); setSelectorOptions(); loadHistory('payments'); })
    .catch(error => { status('plan-status', error.message, true); status('history-status', error.message, true); });
});
