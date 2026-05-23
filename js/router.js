(function () {
  const INTERNAL = /^(?!https?:\/\/)(?!mailto:|tel:|#).*\.html$/;

  function isInternal(href) {
    if (!href) return false;
    return INTERNAL.test(href) || href === '/' || href === './';
  }

  function swapPage(newDoc) {
    // Save persistent elements
    const player = document.getElementById('musicPlayer');
    const audio  = document.getElementById('bgAudio');

    // Strip music player + audio.js from incoming body so they're not duplicated
    ['musicPlayer', 'bgAudio'].forEach(id => {
      const el = newDoc.body.querySelector('#' + id);
      if (el) el.remove();
    });
    newDoc.body.querySelectorAll('script[src*="audio.js"], script[src*="router.js"]')
      .forEach(s => s.remove());

    // Swap body
    document.body.innerHTML = newDoc.body.innerHTML;

    // Re-attach persistent elements
    if (player) document.body.appendChild(player);
    if (audio)  document.body.appendChild(audio);

    // Update title
    document.title = newDoc.title;

    // Re-init page JS
    if (typeof window._initPage === 'function') window._initPage();

    window.scrollTo(0, 0);
  }

  function navigate(href) {
    fetch(href)
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        swapPage(newDoc);
        history.pushState({ href }, '', href);
      })
      .catch(() => { window.location.href = href; });
  }

  // Intercept clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!isInternal(href)) return;
    e.preventDefault();
    navigate(href);
  });

  // Back / forward
  window.addEventListener('popstate', () => {
    fetch(window.location.pathname + window.location.search)
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        swapPage(parser.parseFromString(html, 'text/html'));
      })
      .catch(() => window.location.reload());
  });
})();
