(() => {
  const RM = Boolean(window.RM);
  const HOOKS = (window.SCROLL_HOOKS = window.SCROLL_HOOKS || []);

  // ------------------------------------------------------------------------
  // 1. About Hero Split ("关" bottom-left, "于" top-right)
  // ------------------------------------------------------------------------
  const abA = document.getElementById('ab-a');
  const abB = document.getElementById('ab-b');
  if (abA && abB) {
    HOOKS.push((y) => {
      if (RM) return;
      const p = Math.min(1, Math.max(0, y / window.innerHeight));
      abA.style.transform = `translate3d(${-p * 45}vw, ${p * 35}vh, 0) rotate(${-p * 24}deg)`;
      abB.style.transform = `translate3d(${p * 45}vw, ${-p * 35}vh, 0) rotate(${p * 24}deg)`;
      const op = String(Math.max(0, 1 - p * 1.1));
      abA.style.opacity = op;
      abB.style.opacity = op;
    });
  }

  // ------------------------------------------------------------------------
  // 2. Character-by-character Scroll Light-up (#fp) - Diff-only updates (§8.2)
  // ------------------------------------------------------------------------
  const fp = document.getElementById('fp');
  const spans = fp ? Array.from(fp.querySelectorAll('span')) : [];
  let prevLit = 0;

  if (fp && spans.length) {
    HOOKS.push(() => {
      const r = fp.getBoundingClientRect();
      const totalH = Math.max(1, r.height + window.innerHeight * 0.3);
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / totalH));
      const nextLit = Math.floor(p * spans.length);
      if (nextLit === prevLit) return;
      if (nextLit > prevLit) {
        for (let i = prevLit; i < nextLit; i++) spans[i].classList.add('on');
      } else {
        for (let i = nextLit; i < prevLit; i++) spans[i].classList.remove('on');
      }
      prevLit = nextLit;
    });
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
