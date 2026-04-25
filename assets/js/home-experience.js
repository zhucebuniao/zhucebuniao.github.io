(() => {
  document.body.classList.add('js-experience');

  const gate = document.querySelector('[data-gate]');
  const enterBtn = document.querySelector('[data-enter]');
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
  const sidebarCloseTriggers = document.querySelectorAll('[data-sidebar-close], [data-sidebar-link]');
  const revealItems = document.querySelectorAll('[data-reveal]');
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (!gate || !enterBtn) return;

  const state = {
    soundEnabled: false,
    audioContext: null,
    hasEntered: false
  };

  const playUiBeep = (freq = 520, duration = 0.14) => {
    if (!state.soundEnabled) return;

    if (!state.audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      state.audioContext = new Ctx();
    }

    const ctx = state.audioContext;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration + 0.02);
  };

  const closeSidebar = () => {
    document.body.classList.remove('sidebar-open');
    sidebar?.setAttribute('aria-hidden', 'true');
    playUiBeep(360, 0.12);
  };

  const openSidebar = () => {
    if (!state.hasEntered) return;
    document.body.classList.add('sidebar-open');
    sidebar?.setAttribute('aria-hidden', 'false');
    playUiBeep(500, 0.14);
  };

  const unlockExperience = () => {
    if (state.hasEntered) return;

    state.hasEntered = true;
    state.soundEnabled = true;

    document.body.classList.add('experience-transitioning');
    playUiBeep(640, 0.18);

    window.setTimeout(() => {
      document.body.classList.remove('experience-transitioning');
      document.body.classList.add('experience-entered');
      gate.setAttribute('aria-hidden', 'true');
      sidebarToggle?.focus();
      playUiBeep(540, 0.16);
    }, 620);
  };

  enterBtn.addEventListener('click', unlockExperience);

  sidebarToggle?.addEventListener('click', () => {
    if (!state.hasEntered) return;

    if (document.body.classList.contains('sidebar-open')) {
      closeSidebar();
      return;
    }

    openSidebar();
  });

  sidebarCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
      closeSidebar();
    }

    if ((event.key === 'Enter' || event.key === ' ') && document.activeElement === enterBtn) {
      unlockExperience();
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      playUiBeep(460, 0.12);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => observer.observe(item));

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 8;
      const ry = (px - 0.5) * 9;

      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    card.querySelector('.btn')?.addEventListener('mouseenter', () => playUiBeep(720, 0.1));
  });
})();
