/* Lightweight, progressive-enhancement interactions — no external JS libraries. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  const updateMenu = open => {
    menuButton?.classList.toggle('is-open', open);
    menu?.classList.toggle('is-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };
  menuButton?.addEventListener('click', () => updateMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => updateMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') updateMenu(false); });
  document.addEventListener('click', event => {
    if (menu?.classList.contains('is-open') && !event.target.closest('.nav')) updateMenu(false);
  });

  // Filter projects without re-ordering or modifying any external content.
  const cards = Array.from(document.querySelectorAll('.project-card'));
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(filter => {
        const active = filter === button;
        filter.classList.toggle('active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
    });
  });

  const reveal = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
    reveal.forEach(element => observer.observe(element));
  } else {
    reveal.forEach(element => element.classList.add('is-visible'));
  }

  // Animate the title in place; no constant layout shifts or flashing content.
  const typeTarget = document.getElementById('typed-role');
  const roles = ['Flutter developer', 'Full-stack builder', 'Security learner'];
  if (typeTarget && !reducedMotion.matches) {
    let roleIndex = 0, charIndex = roles[0].length, erasing = false;
    const tick = () => {
      const role = roles[roleIndex];
      typeTarget.textContent = role.slice(0, charIndex);
      let delay = erasing ? 43 : 79;
      if (!erasing && charIndex === role.length) { erasing = true; delay = 2150; }
      else if (erasing && charIndex === 0) { erasing = false; roleIndex = (roleIndex + 1) % roles.length; delay = 420; }
      else { charIndex += erasing ? -1 : 1; }
      window.setTimeout(tick, delay);
    };
    window.setTimeout(tick, 1850);
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const progress = document.getElementById('page-progress');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + '%';
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
