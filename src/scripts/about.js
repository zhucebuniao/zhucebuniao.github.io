(() => {
  const RM = Boolean(window.RM);
  const HOOKS = (window.SCROLL_HOOKS = window.SCROLL_HOOKS || []);

  // ------------------------------------------------------------------------
  // 1. About Hero Split ("关" bottom-left, "于" top-right) & Stage Disassembly
  // ------------------------------------------------------------------------
  const abA = document.getElementById('ab-a');
  const abB = document.getElementById('ab-b');
  const aboutStage = document.querySelector('.about-stage');
  const aboutQuote = document.querySelector('.ahero .md-quote');
  const aboutLayers = Array.from(document.querySelectorAll('.about-stage [data-layer]'));
  const aboutVectors = {
    window: (p) => [`translate3d(${-p * 36}px, ${-p * 26}px, 0) rotate(${-p * 5}deg)`, String(Math.max(0, 1 - p * 0.65))],
    lighthouse: (p) => [`translate3d(${p * 24}px, ${-p * 42}px, 0) rotate(${p * 8}deg)`, String(Math.max(0, 1 - p * 0.7))],
    desk: (p) => [`translate3d(0, ${p * 36}px, 0)`, String(Math.max(0, 1 - p * 0.6))],
    mug: (p) => [`translate3d(${p * 44}px, ${-p * 28}px, 0) rotate(${p * 12}deg)`, String(Math.max(0, 1 - p * 0.75))],
  };

  if (abA && abB && !RM) {
    HOOKS.push((y) => {
      const p = Math.min(1, Math.max(0, y / window.innerHeight));
      if (p <= 0.001) {
        abA.style.transform = '';
        abB.style.transform = '';
        abA.style.opacity = '';
        abB.style.opacity = '';
        if (aboutStage) aboutStage.style.transform = '';
        if (aboutQuote) {
          aboutQuote.style.transform = '';
          aboutQuote.style.opacity = '';
        }
        for (let i = 0; i < aboutLayers.length; i++) {
          aboutLayers[i].style.transform = '';
          aboutLayers[i].style.opacity = '';
        }
        return;
      }
      abA.style.transform = `translate3d(${-p * 45}vw, ${p * 35}vh, 0) rotate(${-p * 24}deg)`;
      abB.style.transform = `translate3d(${p * 45}vw, ${-p * 35}vh, 0) rotate(${p * 24}deg)`;
      const op = String(Math.max(0, 1 - p * 1.1));
      abA.style.opacity = op;
      abB.style.opacity = op;

      if (aboutStage) aboutStage.style.transform = `translate3d(0, ${-p * 22}px, 0)`;
      if (aboutQuote) {
        aboutQuote.style.transform = `translate3d(0, ${p * 24}px, 0)`;
        aboutQuote.style.opacity = String(Math.max(0, 1 - p * 1.25));
      }
      for (let i = 0; i < aboutLayers.length; i++) {
        const layer = aboutLayers[i];
        const fn = aboutVectors[layer.dataset.layer || ''];
        if (!fn) continue;
        const [tf, lop] = fn(p);
        layer.style.transform = tf;
        layer.style.opacity = lop;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. Character-by-character Scroll Light-up (#fp) with Wavefront
  // ------------------------------------------------------------------------
  const fp = document.getElementById('fp');
  const spans = fp ? Array.from(fp.querySelectorAll('span')) : [];
  let prevLit = 0;
  let prevExact = -1;

  if (fp && spans.length) {
    if (RM) {
      spans.forEach((s) => {
        s.classList.add('on');
        s.style.setProperty('--lit', '1');
      });
    } else {
      HOOKS.push(() => {
        const r = fp.getBoundingClientRect();
        const totalH = Math.max(1, r.height + window.innerHeight * 0.3);
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / totalH));
        const exactLit = p * spans.length;
        const nextLit = Math.floor(exactLit);

        if (nextLit === prevLit && Math.abs(exactLit - prevExact) < 0.05) return;

        if (nextLit > prevLit) {
          for (let i = prevLit; i < nextLit; i++) spans[i].classList.add('on');
        } else if (nextLit < prevLit) {
          for (let i = nextLit; i < prevLit; i++) spans[i].classList.remove('on');
        }

        const waveStart = Math.max(0, Math.min(prevLit, nextLit) - 6);
        const waveEnd = Math.min(spans.length, Math.max(prevLit, nextLit) + 6);
        for (let i = waveStart; i < waveEnd; i++) {
          if (i < nextLit) {
            spans[i].style.setProperty('--lit', '1');
          } else {
            const dist = i - exactLit;
            if (dist < 6) {
              const lit = Math.max(0.2, Math.min(1, 1 - dist / 6));
              spans[i].style.setProperty('--lit', lit.toFixed(3));
            } else {
              spans[i].style.removeProperty('--lit');
            }
          }
        }

        prevLit = nextLit;
        prevExact = exactLit;
      });
    }
  }

  // ------------------------------------------------------------------------
  // 3. Sticky Category Stack (.sc)
  // ------------------------------------------------------------------------
  const cards = Array.from(document.querySelectorAll('.stack .sc'));
  if (cards.length) {
    HOOKS.push(() => {
      if (RM) return;
      const vh = window.innerHeight || 1;
      for (let i = 0; i < cards.length - 1; i++) {
        const cur = cards[i];
        const nxt = cards[i + 1];
        const gap = nxt.getBoundingClientRect().top - cur.getBoundingClientRect().top;
        const t = Math.min(1, Math.max(0, 1 - gap / vh));
        if (t <= 0.001) {
          cur.style.transform = '';
          cur.style.filter = '';
        } else {
          const dir = i % 2 === 0 ? -1 : 1;
          cur.style.transform = `scale(${1 - t * 0.08}) rotate(${dir * t * 4}deg)`;
          cur.style.filter = `brightness(${1 - t * 0.25})`;
        }
      }
    });
  }
})();
