// Theme Switcher JavaScript - Refactored with "Good Taste"
// "Simplicity is the ultimate sophistication" - applied to theme switching

const THEME_CONFIG = {
    THEMES: {
        'pixel': {
            name: '像素艺术',
            cssFile: './assets/css/pixel-style.css',
            jsEffects: true
        },
        'windows': {
            name: 'Windows 95',
            cssFile: './assets/css/windows-retro.css',
            jsEffects: false
        }
    },
    DEFAULT_THEME: 'pixel',
    STORAGE_KEY: 'selectedTheme',
    SELECTORS: {
        NAV: '.pixel-menu',
        SWITCHER: '#theme-switcher',
        PARTICLES: '.pixel-particles',
        MATRIX_CANVAS: 'canvas'
    },
    CLASSES: {
        THEME_LINK: 'link[data-theme]',
        PIXEL_BTN: 'pixel-btn',
        WIN_BORDER: 'theme-switcher win-border-outset'
    }
};

class ThemeSwitcher {
    constructor() {
        this.themes = THEME_CONFIG.THEMES;
        this.currentTheme = localStorage.getItem(THEME_CONFIG.STORAGE_KEY) || THEME_CONFIG.DEFAULT_THEME;
        this.init();
    }
    
    init() {
        this.createSwitcherButton();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }
    
    createSwitcherButton() {
        const nav = document.querySelector(THEME_CONFIG.SELECTORS.NAV);
        if (!nav) return;
        
        const switcher = document.createElement('button');
        switcher.id = 'theme-switcher';
        switcher.title = 'Switch Theme';
        this.updateSwitcherButton(switcher);
        
        nav.insertBefore(switcher, nav.firstChild);
    }
    
    bindEvents() {
        const switcher = document.querySelector(THEME_CONFIG.SELECTORS.SWITCHER);
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
        localStorage.setItem(THEME_CONFIG.STORAGE_KEY, themeName);
        this.applyTheme(themeName);
        this.updateSwitcherButton();
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        
        // Remove existing theme stylesheets - clean approach
        document.querySelectorAll(THEME_CONFIG.CLASSES.THEME_LINK).forEach(link => link.remove());
        
        // Add new theme stylesheet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = theme.cssFile;
        link.setAttribute('data-theme', themeName);
        document.head.appendChild(link);
        
        // Handle effects based on theme
        this.toggleEffects(theme.jsEffects);
        
        // Update body class
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
    }
    
    // Simplified button update using configuration
    updateSwitcherButton(element = null) {
        const switcher = element || document.querySelector(THEME_CONFIG.SELECTORS.SWITCHER);
        if (!switcher) return;
        
        switcher.innerHTML = `🎨 ${this.themes[this.currentTheme].name}`;
        switcher.className = this.currentTheme === 'windows' 
            ? THEME_CONFIG.CLASSES.WIN_BORDER 
            : `theme-switcher ${THEME_CONFIG.CLASSES.PIXEL_BTN}`;
    }
    
    // Unified effects management - eliminates code duplication
    toggleEffects(enable) {
        const particles = document.querySelector(THEME_CONFIG.SELECTORS.PARTICLES);
        const matrix = document.querySelector(THEME_CONFIG.SELECTORS.MATRIX_CANVAS);
        const display = enable ? 'block' : 'none';
        
        if (particles) particles.style.display = display;
        if (matrix) matrix.style.display = display;
    }
}

// Clean initialization - using configuration
document.addEventListener('DOMContentLoaded', function() {
    window.themeSwitcher = new ThemeSwitcher();
    
    // Initialize music player if available
    if (!window.musicPlayer && typeof PixelMusicPlayer === 'function') {
        window.musicPlayer = new PixelMusicPlayer();
    }
    
    // Initialize pixel effects only for pixel theme
    if (window.themeSwitcher.currentTheme === 'pixel') {
        // Use function existence checks - safer approach
        const effects = [createPixelParticles, addSoundEffects, addTypingAnimation, createMatrixRain, addGlitchEffects];
        effects.forEach(effect => {
            if (typeof effect === 'function') effect();
        });
    }
});