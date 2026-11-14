(() => {
  const RM = Boolean(window.RM);
  window.SCROLL_HOOKS = window.SCROLL_HOOKS || [];

  // ------------------------------------------------------------------------
  // 1. Reveal Observer (window.observeReveal)
  // ------------------------------------------------------------------------
  const revealIO =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealIO.unobserve(entry.target);
              }
            }
          },
          { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
        )
      : null;

  window.observeReveal = (root = document) => {
    const els = root.querySelectorAll('.rv, .prose h2');
    if (RM || !revealIO) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    els.forEach((el) => {
      if (!el.classList.contains('in')) revealIO.observe(el);
    });
  };

  window.observeReveal(document);

  // ------------------------------------------------------------------------
  // 2. Custom Cursor (#cur)
  // ------------------------------------------------------------------------
  const cur = document.getElementById('cur');
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let mx = -100;
  let my = -100;
  let cx = -100;
  let cy = -100;
  let curVisible = false;

  if (cur && canHover && !RM) {
    document.body.classList.add('has-cur');
    window.addEventListener(
      'pointermove',
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!curVisible) {
          cx = mx;
          cy = my;
          curVisible = true;
        }
        const hit = e.target?.closest?.('a, button, .card, .city, .hc, .btn');
        cur.classList.toggle('big', Boolean(hit));
      },
      { passive: true }
    );
    document.addEventListener('mouseleave', () => {
      curVisible = false;
      cur.style.transform = 'translate3d(-100px, -100px, 0)';
    });
  }

  // ------------------------------------------------------------------------
  // 3. Marquees (.mq)
  // ------------------------------------------------------------------------
  const marquees = Array.from(document.querySelectorAll('.mq')).map((el, idx) => {
    const track = el.querySelector('.track');
    const chunk = el.querySelector('.chunk');
    if (!track || !chunk) return null;
    if (!track.dataset.cloned) {
      track.appendChild(chunk.cloneNode(true));
      track.dataset.cloned = 'true';
    }
    return {
      track,
      chunk,
      dir: idx % 2 === 0 ? -1 : 1,
      x: 0,
      w: chunk.offsetWidth || 800,
    };
  }).filter(Boolean);

  window.addEventListener(
    'resize',
    () => {
      for (const m of marquees) {
        m.w = m.chunk.offsetWidth || 800;
      }
    },
    { passive: true }
  );

  // ------------------------------------------------------------------------
  // 4. Footer #bye Scroll Hook
  // ------------------------------------------------------------------------
  const bye = document.getElementById('bye');
  if (bye) {
    window.SCROLL_HOOKS.push(() => {
      if (RM) return;
      const r = bye.getBoundingClientRect();
      if (r.top < window.innerHeight + 120 && r.bottom > -120) {
        bye.style.transform = `translateX(${-(window.innerHeight - r.top) * 0.6}px)`;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Main rAF Loop
  // ------------------------------------------------------------------------
  const bar = document.getElementById('bar');
  const nav = document.querySelector('.nav');
  let lastY = window.scrollY;
  let vel = 0;
  let skew = 0;
  let rafId = 0;

  function frame() {
    if (document.hidden) {
      rafId = 0;
      return;
    }

    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    vel += (dy - vel) * 0.2;

    // Cursor easing
    if (cur && curVisible && !RM) {
      cx += (mx - cx) * 0.25;
      cy += (my - cy) * 0.25;
      cur.style.transform = `translate3d(${cx - (cur.classList.contains('big') ? 32 : 11)}px, ${cy - (cur.classList.contains('big') ? 18 : 11)}px, 0)`;
    }

    // Top progress bar
    if (bar) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / maxScroll));
      bar.style.transform = `scaleX(${p})`;
    }

    // Nav hide / show
    if (nav) {
      if (dy > 4 && y > 200) nav.classList.add('hide');
      else if (dy < -4 || y <= 40) nav.classList.remove('hide');
    }

    // Velocity skew
    if (!RM) {
      const targetSkew = Math.max(-12, Math.min(12, vel * 0.35));
      skew += (targetSkew - skew) * 0.15;
      if (Math.abs(skew) > 0.01) {
        document.documentElement.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
      } else if (skew !== 0) {
        skew = 0;
        document.documentElement.style.setProperty('--skew', '0deg');
      }
    }

    // Marquee movement
    if (!RM && marquees.length) {
      const speed = 1.2 + Math.min(24, Math.abs(vel) * 0.6);
      const rev = vel < -1 ? -1 : 1;
      for (const m of marquees) {
        m.x += m.dir * rev * speed;
        if (m.x <= -m.w) m.x += m.w;
        if (m.x >= 0) m.x -= m.w;
        m.track.style.transform = `translate3d(${m.x}px, 0, 0)`;
      }
    }

    // Registered scroll hooks
    const hooks = window.SCROLL_HOOKS;
    for (let i = 0; i < hooks.length; i++) {
      hooks[i](y, vel);
    }

    rafId = requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !rafId) {
      lastY = window.scrollY;
      rafId = requestAnimationFrame(frame);
    }
  });

  rafId = requestAnimationFrame(frame);
})();
