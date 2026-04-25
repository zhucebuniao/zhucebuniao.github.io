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
    audioContext: null
  };

  const playUiBeep = (freq = 520) => {
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
    gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.18);
  };

  const unlockExperience = () => {
    document.body.classList.add('experience-entered');
    gate.setAttribute('aria-hidden', 'true');
    sidebarToggle?.focus();
    playUiBeep(600);
  };

  const openSidebar = () => {
    document.body.classList.add('sidebar-open');
    sidebar?.setAttribute('aria-hidden', 'false');
    playUiBeep(500);
  };

  const closeSidebar = () => {
    document.body.classList.remove('sidebar-open');
    sidebar?.setAttribute('aria-hidden', 'true');
    playUiBeep(360);
  };

  enterBtn.addEventListener('click', unlockExperience);

  sidebarToggle?.addEventListener('click', () => {
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
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      playUiBeep(480);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.22 });

  revealItems.forEach((item) => observer.observe(item));

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 7;
      const ry = (px - 0.5) * 9;

      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    card.querySelector('.btn')?.addEventListener('mouseenter', () => playUiBeep(740));
  });
})();
