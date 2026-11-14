(() => {
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function notice(msg) {
    const el = $('#deal-notice');
    el.textContent = msg;
    el.hidden = !msg;
  }

  async function api(path, method = 'GET', body) {
    const res = await fetch(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || data.error || `Request failed (${res.status})`);
    return data;
  }

  async function list() {
    const box = $('#deal-list');
    const { deals } = await api('/api/deals');
    box.innerHTML = deals.length
      ? deals.map((d) => `<p><a href="/deals/${esc(d.id)}">${esc(d.title)}</a> — $${esc(d.amount_usd)} · ${esc(d.role)} · <strong>${esc(d.status)}</strong></p>`).join('')
      : '<p class="muted">No deals yet.</p>';
  }

  function initList() {
    list().catch((e) => notice(e.message));
    $('#deal-form').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      try {
        const deal = await api('/api/deals', 'POST', {
          title: f.get('title'),
          description: f.get('description'),
          amount_usd: Number(f.get('amount_usd')),
          seller_account: f.get('seller_account') || null,
        });
        notice('');
        $('#invite').hidden = false;
        $('#invite-link').value = location.origin + deal.invite_path;
        ev.target.reset();
        list();
      } catch (e) { notice(e.message); }
    });
  }

  const STEPS = [
    ['Paid', (d) => d.status !== 'draft' && d.status !== 'cancelled'],
    ['Held in escrow', (d) => ['funded', 'disputed', 'released', 'refunded'].includes(d.status)],
    ['Buyer confirmed', (d) => d.buyer_confirmed],
    ['Seller confirmed', (d) => d.seller_confirmed],
    ['Released', (d) => d.status === 'released'],
  ];

  function render(d) {
    $('#deal-title').textContent = d.title;
    $('#deal-meta').textContent = `$${d.amount_usd} · you are the ${d.role} · ${d.status}${d.seller_id ? '' : ' · waiting for seller to join'}`;
    $('#deal-desc').textContent = d.description || '';
    $('#deal-steps').innerHTML = STEPS.map(([n, ok]) => `<li>${ok(d) ? '✅' : '⬜'} ${n}</li>`).join('');
    const mine = d.role === 'buyer' ? d.buyer_confirmed : d.seller_confirmed;
    const acts = [];
    if (d.status === 'draft' && d.role === 'buyer') acts.push(['fund', 'Pay into escrow']);
    if (d.status === 'draft') acts.push(['cancel', 'Cancel deal']);
    if (d.status === 'funded' && !mine && d.seller_id) acts.push(['confirm', 'Confirm delivery']);
    if (d.status === 'funded') acts.push(['dispute', 'Open dispute']);
    $('#deal-actions').innerHTML = acts.map(([a, l]) => `<button class="btn btn-dark" data-act="${a}">${l}</button> `).join('')
      + (d.status === 'disputed' ? '<p class="muted">Disputed — an administrator will refund the buyer or release to the seller.</p>' : '');
  }

  async function initDetail() {
    const root = $('#deal-root');
    const id = root.dataset.dealId;
    const load = async () => render(await api(`/api/deals/${encodeURIComponent(id)}`));
    try {
      await load();
    } catch (e) {
      if (root.dataset.token) {
        try {
          await api(`/api/deals/${encodeURIComponent(id)}/join`, 'POST', { token: root.dataset.token });
          history.replaceState(null, '', `/deals/${id}`);
          await load();
        } catch (err) { notice(err.message); }
      } else notice(e.message);
    }
    $('#deal-actions').addEventListener('click', async (ev) => {
      const act = ev.target.dataset.act;
      if (!act) return;
      const body = act === 'dispute' ? { reason: prompt('Reason for dispute?') || '' } : undefined;
      try { render(await api(`/api/deals/${encodeURIComponent(id)}/${act}`, 'POST', body)); notice(''); } catch (e) { notice(e.message); }
    });
  }

  if ($('#deal-form')) initList();
  else if ($('#deal-root')) initDetail();
})();
