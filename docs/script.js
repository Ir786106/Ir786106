(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const links = document.getElementById('site-links');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation menu');
    links?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    links?.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });
  links?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.nav') && links?.classList.contains('is-open')) closeMenu(); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', ({matches}) => { if (matches) closeMenu(); });

  const projectCards = [...document.querySelectorAll('.project')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(other => {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
  }));

  const revealed = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .06, rootMargin: '0px 0px -30px 0px' });
    revealed.forEach(el => observer.observe(el));
  } else {
    revealed.forEach(el => el.classList.add('visible'));
  }

  const progress = document.getElementById('scroll-progress');
  let scrolling = false;
  const scrollUpdate = () => {
    if (scrolling) return;
    scrolling = true;
    window.requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? Math.max(0, Math.min(100, 100 * window.scrollY / max)) : 0) + '%';
      scrolling = false;
    });
  };
  addEventListener('scroll', scrollUpdate, { passive: true });
  scrollUpdate();

  const visual = document.querySelector('.hero-visual');
  if (visual && !motion.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    visual.addEventListener('pointermove', e => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      visual.style.setProperty('--pointer-x', (x * 12).toFixed(2) + 'px');
      visual.style.setProperty('--pointer-y', (y * 12).toFixed(2) + 'px');
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--pointer-x', '0px');
      visual.style.setProperty('--pointer-y', '0px');
    });
  }

  const copy = document.getElementById('copy-email');
  const copyLabel = document.getElementById('copy-label');
  copy?.addEventListener('click', async () => {
    const email = copy.dataset.email;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      copyLabel.textContent = 'Email copied ✓';
      copy.classList.add('copied');
    } catch {
      copyLabel.textContent = email;
    }
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
