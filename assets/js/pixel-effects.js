// Pixel Effects JavaScript - Refactored with "Good Taste"
// Note: DOMContentLoaded event handling is now managed by theme-switcher.js

function createPixelParticles() {
    const container = document.querySelector(PIXEL_CONFIG.SELECTORS.PARTICLES_CONTAINER);
    if (!container) return;
    
    // Inject CSS once, not per function call
    StyleManager.inject('particle-styles', `
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); background: ${PIXEL_CONFIG.EFFECTS.PARTICLES.COLORS[0]}; }
            25% { transform: translateY(-20px) translateX(10px) scale(1.2); background: ${PIXEL_CONFIG.EFFECTS.PARTICLES.COLORS[1]}; }
            50% { transform: translateY(-10px) translateX(-10px) scale(0.8); background: ${PIXEL_CONFIG.EFFECTS.PARTICLES.COLORS[2]}; }
            75% { transform: translateY(-30px) translateX(5px) scale(1.1); background: ${PIXEL_CONFIG.EFFECTS.PARTICLES.COLORS[3]}; }
        }
    `);
    
    // Simple loop with extracted helper
    for (let i = 0; i < PIXEL_CONFIG.EFFECTS.PARTICLES.COUNT; i++) {
        container.appendChild(createParticle());
    }
}

// Separated particle creation - single responsibility
function createParticle() {
    const particle = document.createElement('div');
    const [minDuration, maxDuration] = PIXEL_CONFIG.EFFECTS.PARTICLES.ANIMATION_DURATION;
    const [minOpacity, maxOpacity] = PIXEL_CONFIG.EFFECTS.PARTICLES.OPACITY;
    
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: ${PIXEL_CONFIG.EFFECTS.PARTICLES.SIZE}px;
        height: ${PIXEL_CONFIG.EFFECTS.PARTICLES.SIZE}px;
        background: ${PIXEL_CONFIG.EFFECTS.PARTICLES.COLORS[0]};
        animation: float ${minDuration + Math.random() * (maxDuration - minDuration)}s ease-in-out infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${minOpacity + Math.random() * (maxOpacity - minOpacity)};
        animation-delay: ${Math.random() * 2}s;
    `;
    return particle;
}

function addSoundEffects() {
    // Use centralized AudioManager - no more duplicate audioContext creation
    document.querySelectorAll(PIXEL_CONFIG.SELECTORS.PIXEL_BUTTONS).forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            AudioManager.createBeep(
                PIXEL_CONFIG.AUDIO.BEEP_FREQUENCY.CLICK, 
                PIXEL_CONFIG.AUDIO.DURATION.MEDIUM
            );
            
            // Add visual feedback with configuration
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, PIXEL_CONFIG.EFFECTS.ANIMATION_DELAYS.BUTTON_FEEDBACK);
        });
        
        btn.addEventListener('mouseenter', function() {
            AudioManager.createBeep(
                PIXEL_CONFIG.AUDIO.BEEP_FREQUENCY.HOVER, 
                PIXEL_CONFIG.AUDIO.DURATION.SHORT
            );
        });
    });
}

function addTypingAnimation() {
    const terminal = document.querySelector(PIXEL_CONFIG.SELECTORS.TERMINAL);
    if (!terminal) return;
    
    // Inject cursor styles once
    StyleManager.inject('cursor-styles', `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `);
    
    // Create and append cursor - simple and clean
    const cursor = document.createElement('span');
    cursor.className = 'pixel-cursor';
    cursor.textContent = '█';
    cursor.style.cssText = `
        color: #00ff00;
        animation: blink 1s infinite;
        margin-left: 2px;
    `;
    
    terminal.appendChild(cursor);
}

function createMatrixRain() {
    const matrix = document.createElement('canvas');
    matrix.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: ${PIXEL_CONFIG.EFFECTS.MATRIX.OPACITY};
    `;
    document.body.appendChild(matrix);
    
    const ctx = matrix.getContext('2d');
    const config = PIXEL_CONFIG.EFFECTS.MATRIX;
    
    function resizeMatrix() {
        matrix.width = window.innerWidth;
        matrix.height = window.innerHeight;
    }
    
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
    
    const columns = matrix.width / config.FONT_SIZE;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrix.width, matrix.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = config.FONT_SIZE + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = config.CHARACTERS[Math.floor(Math.random() * config.CHARACTERS.length)];
            ctx.fillText(text, i * config.FONT_SIZE, drops[i] * config.FONT_SIZE);
            
            if (drops[i] * config.FONT_SIZE > matrix.height && Math.random() > config.RESET_CHANCE) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, config.SPEED);
}

function addGlitchEffects() {
    const title = document.querySelector(PIXEL_CONFIG.SELECTORS.TITLE);
    if (!title) return;
    
    const config = PIXEL_CONFIG.EFFECTS.GLITCH;
    
    setInterval(() => {
        if (Math.random() < config.CHANCE) {
            const range = config.SHADOW_RANGE;
            title.style.textShadow = `
                ${Math.random() * range - range/2}px ${Math.random() * range - range/2}px 0 #ff00ff,
                ${Math.random() * range - range/2}px ${Math.random() * range - range/2}px 0 #00ffff
            `;
            
            setTimeout(() => {
                title.style.textShadow = '2px 2px 0 var(--pixel-shadow), 0 0 10px var(--pixel-primary)';
            }, config.DURATION);
        }
    }, config.FREQUENCY);
}

// Power-up sound effect - simplified with configuration
function playPowerUp() {
    const frequencies = PIXEL_CONFIG.AUDIO.POWERUP_FREQUENCIES;
    let index = 0;
    
    function playNote() {
        if (index < frequencies.length) {
            AudioManager.createBeep(
                frequencies[index], 
                PIXEL_CONFIG.AUDIO.DURATION.POWERUP_NOTE
            );
            index++;
            setTimeout(playNote, PIXEL_CONFIG.AUDIO.NOTE_INTERVAL);
        }
    }
    
    playNote();
}

// Konami code easter egg - using configuration
let konamiCode = [];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > PIXEL_CONFIG.KONAMI_SEQUENCE.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === PIXEL_CONFIG.KONAMI_SEQUENCE.join(',')) {
        playPowerUp();
        document.body.style.animation = 'rainbow 2s ease-in-out';
        
        // Inject rainbow animation styles once
        StyleManager.inject('rainbow-styles', `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(180deg); }
                75% { filter: hue-rotate(270deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, PIXEL_CONFIG.EFFECTS.ANIMATION_DELAYS.RAINBOW_DURATION);
        
        konamiCode = [];
    }
});