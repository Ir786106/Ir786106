'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

// Reveal content as it enters the viewport; keep it visible if observers are unavailable.
const reveals = qsa('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .075, rootMargin: '0px 0px 55px 0px' });
  reveals.forEach(el => revealObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}
// Above-the-fold elements should never remain hidden because of screenshot timing.
qsa('.hero .reveal').forEach((el, i) => {
  if (reducedMotion) return;
  window.setTimeout(() => el.classList.add('visible'), 70 + i * 80);
});

const progress = qs('#page-progress');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if (progress) progress.style.width = `${Math.min(100, window.scrollY / scrollable * 100)}%`;
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menuToggle = qs('#menu-toggle');
const navLinks = qs('#nav-links');
function closeMenu() {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('menu-open');
}
menuToggle?.addEventListener('click', () => {
  const opening = !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', opening);
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('menu-open', opening);
});
qsa('#nav-links a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (innerWidth > 780) closeMenu(); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// Active navigation state mirrors the visible content section.
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      qsa('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === entry.target.id));
    });
  }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
  qsa('section[id]').forEach(section => navObserver.observe(section));
}

// A small functional keyboard command palette, not a decorative mockup.
const dialog = qs('#command-dialog');
const commandInput = qs('#command-input');
const commandItems = qsa('#command-items button');
function openPalette() { if (!dialog || dialog.open) return; closeMenu(); dialog.showModal(); commandInput.value = ''; filterCommands(''); commandInput.focus(); }
function closePalette() { if (dialog?.open) dialog.close(); }
function filterCommands(text) { const q = text.trim().toLowerCase(); commandItems.forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(q); }); }
qs('#command-trigger')?.addEventListener('click', openPalette);
qs('#command-close')?.addEventListener('click', closePalette);
commandInput?.addEventListener('input', e => filterCommands(e.target.value));
commandInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const first = commandItems.find(item => !item.hidden);
    if (first) first.click();
  }
});
commandItems.forEach(item => item.addEventListener('click', () => {
  const target = qs(item.dataset.go);
  closePalette();
  target?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
}));
window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (dialog?.open) closePalette(); else openPalette();
  }
});
dialog?.addEventListener('click', e => { if (e.target === dialog) closePalette(); });

const emailButton = qs('#copy-email');
emailButton?.addEventListener('click', async () => {
  const email = emailButton.dataset.email;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(email);
    emailButton.innerHTML = 'COPIED! <span aria-hidden="true">✓</span>';
    window.setTimeout(() => { emailButton.innerHTML = 'COPY EMAIL <span id="copy-icon">⧉</span>'; }, 2100);
  } catch (_) {
    // Clipboard may be blocked when opened as file://. Always provide the address.
    emailButton.textContent = email;
  }
});

// Tiny ambient pointer treatment. Automatically disabled on touch and reduced-motion devices.
const glow = qs('#pointer-glow');
if (glow && !reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  let x = -500, y = -500, tx = -500, ty = -500;
  window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  function animateGlow() {
    x += (tx - x) * .12;
    y += (ty - y) * .12;
    glow.style.transform = `translate(${x - 210}px, ${y - 210}px)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}
qs('#year').textContent = String(new Date().getFullYear());
