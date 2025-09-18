// Pixel Effects JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Create floating pixel particles
    createPixelParticles();
    
    // Add click sound effects
    addSoundEffects();
    
    // Typing animation for terminal
    addTypingAnimation();
    
    // Matrix rain effect
    createMatrixRain();
    
    // Add random glitch effects
    addGlitchEffects();
});

function createPixelParticles() {
    const particlesContainer = document.querySelector('.pixel-particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00ff00;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${0.3 + Math.random() * 0.7};
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Add CSS for floating animation
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes float {
                0%, 100% { 
                    transform: translateY(0) translateX(0) scale(1);
                    background: #00ff00;
                }
                25% { 
                    transform: translateY(-20px) translateX(10px) scale(1.2);
                    background: #ffff00;
                }
                50% { 
                    transform: translateY(-10px) translateX(-10px) scale(0.8);
                    background: #ff00ff;
                }
                75% { 
                    transform: translateY(-30px) translateX(5px) scale(1.1);
                    background: #00ffff;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function addSoundEffects() {
    // Create audio context for beep sounds
    let audioContext;
    
    function createBeep(frequency, duration) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square'; // 8-bit sound
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Add click sounds to buttons
    document.querySelectorAll('.pixel-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            createBeep(800, 0.1);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
        
        btn.addEventListener('mouseenter', function() {
            createBeep(400, 0.05);
        });
    });
}

function addTypingAnimation() {
    const terminal = document.querySelector('.pixel-terminal');
    if (!terminal) return;
    
    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'pixel-cursor';
    cursor.textContent = '█';
    cursor.style.cssText = `
        color: #00ff00;
        animation: blink 1s infinite;
        margin-left: 2px;
    `;
    
    // Add cursor blink animation
    if (!document.querySelector('#cursor-styles')) {
        const style = document.createElement('style');
        style.id = 'cursor-styles';
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
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
        opacity: 0.1;
    `;
    document.body.appendChild(matrix);
    
    const ctx = matrix.getContext('2d');
    
    function resizeMatrix() {
        matrix.width = window.innerWidth;
        matrix.height = window.innerHeight;
    }
    
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
    
    const letters = '01アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロゴゾドボポヴッン';
    const fontSize = 14;
    const columns = matrix.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrix.width, matrix.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrix.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
}

function addGlitchEffects() {
    const title = document.querySelector('.pixel-title');
    if (!title) return;
    
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance
            title.style.textShadow = `
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #ff00ff,
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #00ffff
            `;
            
            setTimeout(() => {
                title.style.textShadow = '2px 2px 0 var(--pixel-shadow), 0 0 10px var(--pixel-primary)';
            }, 100);
        }
    }, 1000);
}

// Add power-up sound effect
function playPowerUp() {
    if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const frequencies = [262, 330, 392, 523, 659, 784, 1047];
    let index = 0;
    
    function playNote() {
        if (index < frequencies.length) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequencies[index];
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            
            index++;
            setTimeout(playNote, 100);
        }
    }
    
    playNote();
}

// Add konami code easter egg
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        playPowerUp();
        document.body.style.animation = 'rainbow 2s ease-in-out';
        
        // Add rainbow animation
        if (!document.querySelector('#rainbow-styles')) {
            const style = document.createElement('style');
            style.id = 'rainbow-styles';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        konamiCode = [];
    }
});