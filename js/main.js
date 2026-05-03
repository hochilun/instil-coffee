const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

// Nav scroll behavior
if (hero) {
  const observer = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('scrolled', !entry.isIntersecting),
    { threshold: 0.05 }
  );
  observer.observe(hero);
} else {
  nav.classList.add('scrolled');
}

// Mobile menu
if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
}

links.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Highlight today's hours row
const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const today = days[new Date().getDay()];
const todayRow = document.querySelector(`.hours-row[data-day="${today}"]`);
if (todayRow) todayRow.classList.add('today');

// ── i18n ──────────────────────────────────────
const DEFAULT_LANG = 'en';

function applyLang(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t[el.getAttribute('data-i18n')];
    if (v !== undefined) el.textContent = v;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t[el.getAttribute('data-i18n-html')];
    if (v !== undefined) el.innerHTML = v;
  });

  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang)
  );

  document.documentElement.lang = lang;
  localStorage.setItem('instil-lang', lang);
}

document.querySelectorAll('.lang-btn').forEach(btn =>
  btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')))
);

applyLang(localStorage.getItem('instil-lang') || DEFAULT_LANG);
