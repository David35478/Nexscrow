(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    reveals.forEach(el => observer.observe(el));
  }
  const cards = [...document.querySelectorAll('.stack-card')];
  let active = 0;
  function go(index) {
    if (!cards.length) return;
    active = (index + cards.length) % cards.length;
    cards[active].scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
    const count = document.getElementById('stack-current');
    if (count) count.textContent = String(active + 1).padStart(2, '0');
    cards.forEach((card,i) => card.classList.toggle('active', i === active));
  }
  cards[0]?.classList.add('active');
  document.querySelectorAll('.stack-controls [data-dir]').forEach(button => button.addEventListener('click', () => go(active + Number(button.dataset.dir))));
  document.querySelector('.stack-controls')?.addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); } if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); } });
  const menu = document.querySelector('.menu'), nav = document.querySelector('.nav nav');
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); }));
  if (reduced) document.querySelector('video')?.pause();
})();
