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
  // 4. Footer #bye Scroll Hook (fallback when CSS view-timeline unsupported)
  // ------------------------------------------------------------------------
  const supportsViewTimeline = CSS.supports(
    '(animation-timeline: view()) and (animation-range: entry)'
  );
  const bye = document.getElementById('bye');
  if (bye && !supportsViewTimeline) {
    window.SCROLL_HOOKS.push(() => {
      if (RM) return;
      const r = bye.getBoundingClientRect();
      if (r.top < window.innerHeight + 120 && r.bottom > -120) {
        bye.style.transform = `translateX(${-(window.innerHeight - r.top) * 0.6}px)`;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Scene Crumb Tracker & Watch Mode (#story-hud)
  // ------------------------------------------------------------------------
  const hud = document.getElementById('story-hud');
  const hudCrumb = document.getElementById('hud-crumb');
  const hudCrumbText = document.getElementById('hud-crumb-text');
  const hudTopBtn = document.getElementById('hud-top-btn');
  const hudWatchBtn = document.getElementById('hud-watch');
  const scenes = Array.from(document.querySelectorAll('[data-scene]'));
  let activeScene = '';
  let watching = false;

  const setWatching = (next) => {
    watching = Boolean(next);
    document.documentElement.classList.toggle('is-watching', watching);
    if (hudWatchBtn) {
      hudWatchBtn.textContent = watching ? '⏸ 暂停' : '▶ 巡礼';
    }
  };

  if (hud && scenes.length) {
    hud.hidden = false;

    window.SCROLL_HOOKS.push(() => {
      const thresh = window.innerHeight * 0.45;
      let curScene = scenes[0];
      for (let i = 0; i < scenes.length; i++) {
        if (scenes[i].getBoundingClientRect().top <= thresh) {
          curScene = scenes[i];
        } else {
          break;
        }
      }
      const name = curScene?.dataset.scene || '';
      if (name && name !== activeScene) {
        activeScene = name;
        if (hudCrumbText) hudCrumbText.textContent = name;
        if (hudCrumb) {
          hudCrumb.classList.remove('is-change');
          void hudCrumb.offsetWidth;
          hudCrumb.classList.add('is-change');
        }
      }
    });

    hudTopBtn?.addEventListener('click', () => {
      if (watching) setWatching(false);
      window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    });

    hudWatchBtn?.addEventListener('click', () => {
      if (RM) {
        const thresh = window.innerHeight * 0.45;
        const nextScene = scenes.find((s) => s.getBoundingClientRect().top > thresh + 16) || scenes[0];
        nextScene?.scrollIntoView({ behavior: 'auto' });
        return;
      }
      setWatching(!watching);
    });

    const stopWatchOnInput = (e) => {
      if (!watching) return;
      if (e.target?.closest?.('#story-hud')) return;
      setWatching(false);
    };
    window.addEventListener('wheel', () => {
      if (watching) setWatching(false);
    }, { passive: true });
    window.addEventListener('touchstart', stopWatchOnInput, { passive: true });
    window.addEventListener('pointerdown', stopWatchOnInput, { passive: true });
    window.addEventListener('keydown', (e) => {
      if (!watching) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(e.key)) {
        setWatching(false);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6. Protagonist Orb Choreography (#story-orb)
  // ------------------------------------------------------------------------
  const orb = document.getElementById('story-orb');
  const orbAnchors = Array.from(document.querySelectorAll('[data-orb-anchor]'));
  let orbTargetX = -100;
  let orbTargetY = -100;
  let orbTargetScale = 1;
  let orbX = -100;
  let orbY = -100;
  let orbScale = 1;
  let orbReady = false;
  let lastAnchorIdx = -1;

  if (orb && orbAnchors.length && !RM) {
    orb.classList.add('is-active');
    window.SCROLL_HOOKS.push(() => {
      const focalY = window.innerHeight * 0.42;
      const pts = orbAnchors.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
      });

      let currIdx = 0;
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].y <= focalY) currIdx = i;
      }
      const nextIdx = Math.min(pts.length - 1, currIdx + 1);

      if (currIdx !== nextIdx) {
        const span = Math.max(1, pts[nextIdx].y - pts[currIdx].y);
        const t = Math.min(1, Math.max(0, (focalY - pts[currIdx].y) / span));
        const e = t * t * (3 - 2 * t);
        const arcY = -Math.sin(e * Math.PI) * 32;
        orbTargetX = pts[currIdx].x + (pts[nextIdx].x - pts[currIdx].x) * e;
        orbTargetY = pts[currIdx].y + (pts[nextIdx].y - pts[currIdx].y) * e + arcY;
        orbTargetScale = 1 + Math.sin(e * Math.PI) * 0.35;
      } else {
        orbTargetX = pts[currIdx].x;
        orbTargetY = pts[currIdx].y;
        orbTargetScale = 1;
      }

      let nearestIdx = 0;
      let minDist = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const d = Math.abs(pts[i].y - focalY);
        if (d < minDist) {
          minDist = d;
          nearestIdx = i;
        }
      }
      if (nearestIdx !== lastAnchorIdx) {
        if (lastAnchorIdx !== -1) {
          orb.classList.remove('is-strike');
          void orb.offsetWidth;
          orb.classList.add('is-strike');
        }
        lastAnchorIdx = nearestIdx;
      }

      if (!orbReady) {
        orbX = orbTargetX;
        orbY = orbTargetY;
        orbScale = orbTargetScale;
        orbReady = true;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 7. Circular Iris Stages (.iris-stage)
  // ------------------------------------------------------------------------
  const irisStages = Array.from(document.querySelectorAll('.iris-stage'));
  if (irisStages.length && !RM) {
    window.SCROLL_HOOKS.push(() => {
      const vh = window.innerHeight || 1;
      const startY = vh * 0.92;
      const endY = vh * 0.25;
      for (let i = 0; i < irisStages.length; i++) {
        const el = irisStages[i];
        const top = el.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, (startY - top) / Math.max(1, startY - endY)));
        el.style.setProperty('--iris-r', `${(8 + p * 115).toFixed(1)}%`);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. Main rAF Loop
  // ------------------------------------------------------------------------
  const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');
  const bar = document.getElementById('bar');
  const nav = document.querySelector('.nav');
  let lastY = window.scrollY;
  let vel = 0;
  let skew = 0;
  let rafId = 0;
  let firstFrame = true;

  window.addEventListener(
    'resize',
    () => {
      firstFrame = true;
    },
    { passive: true }
  );

  function frame() {
    if (document.hidden) {
      rafId = 0;
      return;
    }

    if (watching && !RM) {
      window.scrollBy(0, 1.8);
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        setWatching(false);
      }
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

    // Protagonist orb easing
    if (orb && orbReady && !RM) {
      orbX += (orbTargetX - orbX) * 0.22;
      orbY += (orbTargetY - orbY) * 0.22;
      orbScale += (orbTargetScale - orbScale) * 0.22;
      orb.style.transform = `translate3d(${orbX.toFixed(1)}px, ${orbY.toFixed(1)}px, 0) scale(${orbScale.toFixed(3)})`;
    }

    // Top progress bar (fallback when CSS scroll-timeline unsupported)
    if (bar && !supportsScrollTimeline) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / maxScroll));
      bar.style.transform = `scaleX(${p})`;
    }

    // Nav hide / show
    if (nav) {
      if (dy > 4 && y > 200) nav.classList.add('hide');
      else if (dy < -4 || y <= 40) nav.classList.remove('hide');
    }

    // Velocity skew (gentle storybook sway)
    if (!RM) {
      const targetSkew = Math.max(-2.5, Math.min(2.5, vel * 0.08));
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

    // Registered scroll hooks (only on first frame or when scrolling / settling)
    if (firstFrame || dy !== 0 || Math.abs(vel) > 0.01) {
      const hooks = window.SCROLL_HOOKS;
      for (let i = 0; i < hooks.length; i++) {
        hooks[i](y, vel);
      }
      firstFrame = false;
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
