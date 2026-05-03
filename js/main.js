const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

// Scroll: transparent nav over hero, solid nav otherwise
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
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const today = days[new Date().getDay()];
const todayRow = document.querySelector(`.hours-row[data-day="${today}"]`);
if (todayRow) todayRow.classList.add('today');
