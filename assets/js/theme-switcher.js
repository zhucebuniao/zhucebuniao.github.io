// Theme Switcher JavaScript
class ThemeSwitcher {
    constructor() {
        this.themes = {
            'pixel': {
                name: 'Pixel Art',
                cssFile: './assets/css/pixel-style.css',
                jsEffects: true
            },
            'windows': {
                name: 'Windows 95',
                cssFile: './assets/css/windows-retro.css',
                jsEffects: false
            }
        };
        
        this.currentTheme = localStorage.getItem('selectedTheme') || 'pixel';
        this.init();
    }
    
    init() {
        this.createSwitcherButton();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }
    
    createSwitcherButton() {
        const nav = document.querySelector('.pixel-menu');
        if (!nav) return;
        
        // Create theme switcher button
        const switcher = document.createElement('button');
        switcher.className = 'theme-switcher win-border-outset';
        switcher.id = 'theme-switcher';
        switcher.innerHTML = `🎨 ${this.themes[this.currentTheme].name}`;
        switcher.title = 'Switch Theme';
        
        // Insert before the first navigation item
        nav.insertBefore(switcher, nav.firstChild);
    }
    
    bindEvents() {
        const switcher = document.getElementById('theme-switcher');
        if (switcher) {
            switcher.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'pixel' ? 'windows' : 'pixel';
        this.switchToTheme(newTheme);
    }
    
    switchToTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        this.currentTheme = themeName;
        localStorage.setItem('selectedTheme', themeName);
        this.applyTheme(themeName);
        this.updateSwitcherButton();
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        
        // Remove existing theme stylesheets
        const existingThemeLinks = document.querySelectorAll('link[data-theme]');
        existingThemeLinks.forEach(link => link.remove());
        
        // Add new theme stylesheet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = theme.cssFile;
        link.setAttribute('data-theme', themeName);
        document.head.appendChild(link);
        
        // Handle JavaScript effects
        if (themeName === 'pixel' && theme.jsEffects) {
            this.enablePixelEffects();
        } else {
            this.disablePixelEffects();
        }
        
        // Update body class for theme-specific styling
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
    }
    
    updateSwitcherButton() {
        const switcher = document.getElementById('theme-switcher');
        if (switcher) {
            switcher.innerHTML = `🎨 ${this.themes[this.currentTheme].name}`;
            
            // Update button styling based on current theme
            if (this.currentTheme === 'windows') {
                switcher.className = 'theme-switcher win-border-outset';
            } else {
                switcher.className = 'theme-switcher pixel-btn';
            }
        }
    }
    
    enablePixelEffects() {
        // Restore pixel particles
        const particlesContainer = document.querySelector('.pixel-particles');
        if (particlesContainer) {
            particlesContainer.style.display = 'block';
        }
        
        // Re-enable matrix rain if it exists
        const matrixCanvas = document.querySelector('canvas');
        if (matrixCanvas) {
            matrixCanvas.style.display = 'block';
        }
    }
    
    disablePixelEffects() {
        // Hide pixel particles
        const particlesContainer = document.querySelector('.pixel-particles');
        if (particlesContainer) {
            particlesContainer.style.display = 'none';
        }
        
        // Hide matrix rain
        const matrixCanvas = document.querySelector('canvas');
        if (matrixCanvas) {
            matrixCanvas.style.display = 'none';
        }
    }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme switcher first
    window.themeSwitcher = new ThemeSwitcher();
    
    // Only initialize pixel effects if pixel theme is active
    if (window.themeSwitcher.currentTheme === 'pixel') {
        // Original pixel effects initialization
        if (typeof createPixelParticles === 'function') createPixelParticles();
        if (typeof addSoundEffects === 'function') addSoundEffects();
        if (typeof addTypingAnimation === 'function') addTypingAnimation();
        if (typeof createMatrixRain === 'function') createMatrixRain();
        if (typeof addGlitchEffects === 'function') addGlitchEffects();
    }
});