(() => {
  const RM = Boolean(window.RM);
  const HOOKS = (window.SCROLL_HOOKS = window.SCROLL_HOOKS || []);

  // ------------------------------------------------------------------------
  // 1. Hero 4-character scatter & Theatrical Set Disassembly on scroll
  // ------------------------------------------------------------------------
  const ttlChars = Array.from(document.querySelectorAll('#ttl b'));
  const fly = [
    [-1, -0.7, -24],
    [-0.35, -1, 18],
    [0.45, -0.9, -16],
    [1, -0.6, 26],
  ];
  let heroAnimDone = RM;
  if (ttlChars.length && !RM) {
    let finished = 0;
    ttlChars.forEach((b) => {
      if (b.getAnimations && b.getAnimations().length === 0) {
        finished++;
        if (finished >= ttlChars.length) heroAnimDone = true;
        return;
      }
      b.addEventListener(
        'animationend',
        () => {
          finished++;
          if (finished >= ttlChars.length) heroAnimDone = true;
        },
        { once: true }
      );
    });
    // Fallback if user scrolls after initial drop duration
    setTimeout(() => {
      heroAnimDone = true;
    }, 1700);

    HOOKS.push((y) => {
      if (RM || !heroAnimDone) return;
      const p = Math.min(1, Math.max(0, y / window.innerHeight));
      for (let i = 0; i < ttlChars.length; i++) {
        const b = ttlChars[i];
        if (p <= 0.001) {
          b.style.transform = '';
          b.style.opacity = '';
          continue;
        }
        const [fx, fy, deg] = fly[i] || [0, -1, 0];
        b.style.animation = 'none';
        b.style.transform = `translate3d(${fx * 60 * p}vw, ${fy * 70 * p}vh, 0) rotate(${deg * p}deg) scale(${1 + p * 0.6})`;
        b.style.opacity = String(Math.max(0, 1 - p * 1.15));
      }
    });
  }

  const heroCanvas = document.querySelector('#hero .naive-canvas');
  const heroSub = document.querySelector('#hero .hero-sub');
  const heroCta = document.querySelector('#hero .hero-cta');
  const setLayers = Array.from(document.querySelectorAll('#hero .naive-canvas [data-layer]'));
  const layerVectors = {
    sky: (p) => [`translate3d(0, ${-p * 28}px, 0) scale(${1 + p * 0.06})`, String(Math.max(0, 1 - p * 0.4))],
    celestial: (p) => [`translate3d(${-p * 42}px, ${-p * 54}px, 0) rotate(${-p * 14}deg)`, String(Math.max(0, 1 - p * 0.75))],
    hills: (p) => [`translate3d(0, ${p * 34}px, 0) scaleY(${1 - p * 0.15})`, String(Math.max(0, 1 - p * 0.55))],
    sea: (p) => [`translate3d(${p * 48}px, ${p * 28}px, 0)`, String(Math.max(0, 1 - p * 0.65))],
    lighthouse: (p) => [`translate3d(${p * 26}px, ${-p * 36}px, 0) rotate(${p * 9}deg)`, String(Math.max(0, 1 - p * 0.65))],
    botanical: (p) => [`translate3d(${-p * 52}px, ${p * 36}px, 0) rotate(${-p * 12}deg)`, String(Math.max(0, 1 - p * 0.75))],
  };

  if (!RM && (heroCanvas || setLayers.length)) {
    HOOKS.push((y) => {
      const p = Math.min(1, Math.max(0, y / (window.innerHeight * 0.85)));
      if (p <= 0.001) {
        if (heroCanvas) heroCanvas.style.transform = '';
        if (heroSub) {
          heroSub.style.transform = '';
          heroSub.style.opacity = '';
        }
        if (heroCta) {
          heroCta.style.transform = '';
          heroCta.style.opacity = '';
        }
        for (let i = 0; i < setLayers.length; i++) {
          setLayers[i].style.transform = '';
          setLayers[i].style.opacity = '';
        }
        return;
      }

      if (heroCanvas) heroCanvas.style.transform = `translate3d(0, ${-p * 26}px, 0)`;
      if (heroSub) {
        heroSub.style.animation = 'none';
        heroSub.style.transform = `translate3d(0, ${-p * 18}px, 0)`;
        heroSub.style.opacity = String(Math.max(0, 1 - p * 1.25));
      }
      if (heroCta) {
        heroCta.style.animation = 'none';
        heroCta.style.transform = `translate3d(0, ${-p * 12}px, 0)`;
        heroCta.style.opacity = String(Math.max(0, 1 - p * 1.35));
      }
      for (let i = 0; i < setLayers.length; i++) {
        const layer = setLayers[i];
        const fn = layerVectors[layer.dataset.layer || ''];
        if (!fn) continue;
        const [tf, op] = fn(p);
        layer.style.transform = tf;
        layer.style.opacity = op;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 1b. Manifesto Bridge Word Illumination & Line/Beat Reveals
  // ------------------------------------------------------------------------
  const bridge = document.getElementById('manifesto-bridge');
  const bridgeLines = bridge ? Array.from(bridge.querySelectorAll('.ln-in')) : [];
  const bridgeWords = bridge ? Array.from(bridge.querySelectorAll('.md-word')) : [];
  const bridgeBeats = bridge ? Array.from(bridge.querySelectorAll('.beat-frag')) : [];

  if (bridge) {
    if (RM) {
      bridgeLines.forEach((el) => el.classList.add('is-on'));
      bridgeBeats.forEach((el) => el.classList.add('is-on'));
      bridgeWords.forEach((el) => el.style.setProperty('--lit', '1'));
    } else {
      HOOKS.push(() => {
        const vh = window.innerHeight || 1;
        const rect = bridge.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.88 - rect.top) / Math.max(1, vh * 0.72)));

        for (let i = 0; i < bridgeLines.length; i++) {
          bridgeLines[i].classList.toggle('is-on', p > 0.05 + i * 0.14);
        }
        for (let i = 0; i < bridgeWords.length; i++) {
          const lit = Math.min(1, Math.max(0, (p - i * 0.13) / 0.28));
          bridgeWords[i].style.setProperty('--lit', lit.toFixed(3));
        }
        for (let i = 0; i < bridgeBeats.length; i++) {
          bridgeBeats[i].classList.toggle('is-on', p > 0.54 + i * 0.12);
        }
      });
    }
  }

  // ------------------------------------------------------------------------
  // 2. Stat Counters (#7)
  // ------------------------------------------------------------------------
  const statNums = document.querySelectorAll('#stats .n[data-n]');
  if (statNums.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          const target = Number(el.dataset.n || 0);
          cio.unobserve(el);
          if (RM) {
            el.textContent = String(target);
            continue;
          }
          const start = performance.now();
          const dur = 1400;
          const tick = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = String(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 }
    );
    statNums.forEach((n) => cio.observe(n));
  }

  // ------------------------------------------------------------------------
  // 3. Recent 8 Horizontal Scroll (#8) - No per-card getBoundingClientRect in loop
  // ------------------------------------------------------------------------
  const hz = document.getElementById('hz');
  const rail = document.getElementById('rail');
  const hzb = document.getElementById('hzb');
  const hCards = rail ? Array.from(rail.querySelectorAll('.hc')) : [];
  let railMax = 0;
  let cardCenters = [];

  function measureHorizontal() {
    if (!rail) return;
    railMax = Math.max(0, rail.scrollWidth - window.innerWidth);
    cardCenters = hCards.map((c) => c.offsetLeft + c.offsetWidth * 0.5);
  }
  measureHorizontal();
  window.addEventListener('resize', measureHorizontal, { passive: true });

  if (hz && rail) {
    HOOKS.push(() => {
      const r = hz.getBoundingClientRect();
      const total = Math.max(1, hz.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / total));
      const tx = p * railMax;
      rail.style.transform = `translate3d(${-tx}px, 0, 0)`;
      if (hzb) hzb.style.transform = `scaleX(${p})`;

      if (RM) return;
      const halfW = window.innerWidth * 0.5;
      for (let i = 0; i < hCards.length; i++) {
        const screenCenter = cardCenters[i] - tx;
        const off = Math.max(-1.2, Math.min(1.2, (screenCenter - halfW) / halfW));
        const absOff = Math.abs(off);
        hCards[i].style.transform = `rotate(${off * 4}deg) translateY(${absOff * 24}px) scale(${1 - absOff * 0.06})`;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. Archive Filtering & Search Highlight (§7.1, §10.4)
  // ------------------------------------------------------------------------
  const catBtns = Array.from(document.querySelectorAll('.filters [data-cat]'));
  const cityBtns = Array.from(document.querySelectorAll('#cloud .city[data-city]'));
  const qInput = document.getElementById('q');
  const cntEl = document.getElementById('cnt');
  const emptyEl = document.getElementById('empty');
  const archiveEl = document.getElementById('archive');
  const monthGroups = Array.from(document.querySelectorAll('#list .month-group'));
  const cards = Array.from(document.querySelectorAll('#list .card'));
  const totalPosts = cards.length;

  let cat = 'all';
  let city = null;
  let q = '';

  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const hl = (text, query) => {
    const safe = esc(text);
    if (!query) return safe;
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  };

  function render() {
    let shown = 0;
    for (const card of cards) {
      const okCat = cat === 'all' || card.dataset.c === cat;
      const okCity = !city || card.dataset.city === city;
      const okQ = !q || (card.dataset.q || '').toLowerCase().includes(q);
      const vis = okCat && okCity && okQ;
      card.hidden = !vis;
      if (vis) {
        shown++;
        const tEl = card.querySelector('.card-title');
        const stEl = card.querySelector('.card-st');
        const exEl = card.querySelector('.card-ex');
        if (tEl) tEl.innerHTML = hl(card.dataset.title || '', q);
        if (stEl) stEl.innerHTML = hl(card.dataset.st || '', q);
        if (exEl) {
          const rawEx = card.dataset.ex || '';
          exEl.innerHTML = hl(rawEx, q) + (rawEx.length >= 80 ? '…' : '');
        }
      }
    }

    for (const group of monthGroups) {
      const hasVisible = Boolean(group.querySelector('.card:not([hidden])'));
      group.hidden = !hasVisible;
    }

    if (cntEl) {
      cntEl.textContent = `${shown} / ${totalPosts} 篇${city ? ' · ' + city : ''}`;
    }
    if (emptyEl) {
      emptyEl.hidden = shown > 0;
    }

    catBtns.forEach((b) => {
      const active = b.dataset.cat === cat;
      b.classList.toggle('on', active);
      b.setAttribute('aria-pressed', String(active));
    });
    cityBtns.forEach((b) => {
      const active = b.dataset.city === city;
      b.classList.toggle('sel', active);
      b.setAttribute('aria-pressed', String(active));
    });

    if (window.observeReveal) window.observeReveal(document.getElementById('list'));
  }

  function renderWithTransition() {
    if (!RM && document.startViewTransition) {
      const root = document.documentElement;
      root.classList.add('vt-filter');
      const vt = document.startViewTransition(() => render());
      vt.finished.finally(() => root.classList.remove('vt-filter'));
    } else {
      render();
    }
  }

  catBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.cat || 'all';
      cat = next;
      if (next !== 'all' && next !== 'travel') {
        city = null;
      }
      renderWithTransition();
    });
  });

  cityBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.city || '';
      if (city === name) {
        city = null;
      } else {
        city = name;
        cat = 'travel';
        archiveEl?.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      }
      renderWithTransition();
    });
  });

  if (qInput) {
    qInput.addEventListener('input', () => {
      q = qInput.value.trim().toLowerCase();
      render();
    });
  }

  // Hero "读一个梦" CTA
  const dreamBtn = document.getElementById('hero-dream-btn');
  if (dreamBtn) {
    dreamBtn.addEventListener('click', () => {
      cat = 'dream';
      city = null;
      renderWithTransition();
      archiveEl?.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    });
  }

  // "/" shortcut to focus search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== qInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
      e.preventDefault();
      archiveEl?.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      qInput?.focus();
    }
  });

  // Support ?cat= from redirects
  const urlCat = new URLSearchParams(window.location.search).get('cat');
  if (urlCat && ['dream', 'travel', 'novel', 'diary'].includes(urlCat)) {
    cat = urlCat;
    render();
  }
})();
