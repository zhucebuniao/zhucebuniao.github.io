// Pixel World Configuration Constants
// "Bad programmers worry about the code. Good programmers worry about data structures." - Linus
const PIXEL_CONFIG = {
    // Audio settings
    AUDIO: {
        VOLUME: 0.1,
        BEEP_FREQUENCY: {
            CLICK: 800,
            HOVER: 400
        },
        DURATION: {
            SHORT: 0.05,
            MEDIUM: 0.1,
            LONG: 0.2,
            POWERUP_NOTE: 0.2
        },
        POWERUP_FREQUENCIES: [262, 330, 392, 523, 659, 784, 1047],
        NOTE_INTERVAL: 100
    },

    // Visual effects
    EFFECTS: {
        PARTICLES: {
            COUNT: 20,
            SIZE: 4,
            COLORS: ['#00ff00', '#ffff00', '#ff00ff', '#00ffff'],
            ANIMATION_DURATION: [3, 7], // min, max
            OPACITY: [0.3, 1.0]
        },
        MATRIX: {
            FONT_SIZE: 14,
            OPACITY: 0.1,
            SPEED: 35,
            CHARACTERS: '01アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロゴゾドボポヴッン',
            RESET_CHANCE: 0.975
        },
        GLITCH: {
            FREQUENCY: 1000, // ms
            CHANCE: 0.1,
            DURATION: 100,
            SHADOW_RANGE: 4
        },
        ANIMATION_DELAYS: {
            BUTTON_FEEDBACK: 100,
            RAINBOW_DURATION: 2000
        }
    },

    // Konami code
    KONAMI_SEQUENCE: [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ],

    // CSS selectors - centralized to avoid magic strings
    SELECTORS: {
        PARTICLES_CONTAINER: '.pixel-particles',
        PIXEL_BUTTONS: '.pixel-btn',
        TERMINAL: '.pixel-terminal',
        TITLE: '.pixel-title'
    }
};

// Singleton AudioContext manager
const AudioManager = {
    _context: null,
    
    getContext() {
        if (!this._context) {
            this._context = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this._context;
    },

    createBeep(frequency, duration, volume = PIXEL_CONFIG.AUDIO.VOLUME) {
        const ctx = this.getContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
        
        return oscillator;
    }
};

// CSS injection helper - eliminates repeated inline styles
const StyleManager = {
    _injected: new Set(),
    
    inject(id, css) {
        if (this._injected.has(id)) return;
        
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
        this._injected.add(id);
    }
};