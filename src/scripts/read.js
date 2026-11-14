(() => {
  const RM = Boolean(window.RM);
  const HOOKS = (window.SCROLL_HOOKS = window.SCROLL_HOOKS || []);

  // ------------------------------------------------------------------------
  // 1. Font Size Switcher (17 / 19 / 22px, persisted in localStorage.fs)
  // ------------------------------------------------------------------------
  const fsBtns = Array.from(document.querySelectorAll('[data-fs]'));
  const fsRemMap = { '17': '1.0625rem', '19': '1.1875rem', '22': '1.375rem' };
  function applyFs(fs) {
    document.documentElement.style.setProperty('--fs', fsRemMap[fs] || '1.1875rem');
    try {
      localStorage.setItem('fs', fs);
    } catch (e) {}
    fsBtns.forEach((b) => {
      const active = b.dataset.fs === fs;
      b.classList.toggle('on', active);
      b.setAttribute('aria-pressed', String(active));
    });
  }

  let savedFs = '19';
  try {
    const v = localStorage.getItem('fs');
    if (v === '17' || v === '19' || v === '22') savedFs = v;
  } catch (e) {}
  applyFs(savedFs);

  fsBtns.forEach((b) => {
    b.addEventListener('click', () => applyFs(b.dataset.fs || '19'));
  });

  // ------------------------------------------------------------------------
  // 2. Prose Paragraph Reveal & Signature Styling
  // ------------------------------------------------------------------------
  const article = document.getElementById('article');
  if (article) {
    const paragraphs = Array.from(article.querySelectorAll('p'));
    paragraphs.forEach((p) => p.classList.add('rv'));
    const lastP = paragraphs[paragraphs.length - 1];
    if (lastP && (lastP.textContent || '').includes('写于')) {
      lastP.classList.add('sign');
    }
    if (window.observeReveal) {
      window.observeReveal(article);
    }
  }

  // ------------------------------------------------------------------------
  // 3. TOC Active Highlight & Circular Progress Badge (.pct)
  // ------------------------------------------------------------------------
  const headings = Array.from(document.querySelectorAll('.prose h2[id]'));
  const tocLinks = new Map(
    Array.from(document.querySelectorAll('.toc-list a[href^="#"]')).map((a) => [
      decodeURIComponent((a.getAttribute('href') || '').slice(1)),
      a,
    ])
  );
  const pctEl = document.querySelector('.pct');
  const arcEl = document.getElementById('arc');
  const pctNumEl = document.getElementById('pct-num');
  const CIRC = 276.5;

  let activeSlug = '';

  HOOKS.push((_, v) => {
    // TOC highlight: last h2 past 35% of viewport height
    if (headings.length) {
      const cut = window.innerHeight * 0.35;
      let curSlug = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= cut) {
          curSlug = h.id;
        }
      }
      if (curSlug !== activeSlug) {
        activeSlug = curSlug;
        tocLinks.forEach((a, slug) => {
          a.classList.toggle('on', slug === activeSlug);
        });
      }
    }

    // Circular reading progress
    if (article && arcEl && pctNumEl && pctEl) {
      const r = article.getBoundingClientRect();
      const total = Math.max(1, r.height);
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / total));
      arcEl.style.strokeDashoffset = String(CIRC * (1 - p));
      pctNumEl.textContent = `${Math.round(p * 100)}%`;
      pctEl.classList.toggle('done', p >= 0.99);
      if (!RM) {
        const deg = Math.max(-18, Math.min(18, v * 1.5));
        pctEl.style.transform = p >= 0.99 ? `scale(1.15) rotate(${deg}deg)` : `rotate(${deg}deg)`;
      }
    }
  });
})();
