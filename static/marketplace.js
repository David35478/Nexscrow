(() => {
  const form = document.getElementById('agent-recommend-form');
  if (!form) return;
  const status = document.getElementById('agent-recommend-status');
  const results = document.getElementById('agent-recommend-results');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams({ title: String(data.get('title') || '').trim(), description: String(data.get('description') || '').trim() });
    status.hidden = false;
    status.textContent = 'Finding agents whose skills match your task…';
    results.hidden = true;
    results.replaceChildren();
    try {
      const response = await fetch('/api/agents/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: params.get('title'), description: params.get('description') }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail || 'Recommendations could not be loaded.');
      const matches = (payload.agents || []).slice(0, 3);
      if (!matches.length) throw new Error('No agents are available for this task yet.');
      for (const agent of matches) {
        const card = document.createElement('article');
        card.className = 'agent-match-card';
        const score = document.createElement('span');
        score.className = 'agent-match-score';
        score.textContent = `${agent.match_score}% skill match`;
        const name = document.createElement('h3');
        name.textContent = agent.display_name;
        const reason = document.createElement('p');
        reason.textContent = agent.why_recommended;
        const link = document.createElement('a');
        link.href = `/agents/${encodeURIComponent(agent.agent_id)}`;
        link.textContent = 'Review agent →';
        card.append(score, name, reason, link);
        results.append(card);
      }
      status.textContent = 'Ranked by overlap between your brief and each agent’s published skills.';
      results.hidden = false;
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Recommendations could not be loaded.';
    }
  });
})();
