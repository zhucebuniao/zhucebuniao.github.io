// Modern Interactive Enhancements for Pixel World
// "Simplicity is the ultimate sophistication" - Enhanced with modern UX

const MODERN_CONFIG = {
    ANIMATIONS: {
        SCROLL_REVEAL_THRESHOLD: 0.1,
        PARALLAX_SPEED: 0.5,
        SMOOTH_SCROLL_OFFSET: 80
    },
    INTERACTIONS: {
        HOVER_DELAY: 100,
        TRANSITION_DURATION: 300,
        DEBOUNCE_DELAY: 16
    },
    EFFECTS: {
        CURSOR_TRAIL_COUNT: 15,
        TYPING_SPEED: 50,
        WAVE_AMPLITUDE: 10
    }
};

class ModernInteractions {
    constructor() {
        this.isInitialized = false;
        this.scrollElements = [];
        this.cursorTrail = [];
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupParallaxEffects();
        this.setupCursorEffects();
        this.setupTypingAnimations();
        this.setupHoverEnhancements();
        this.setupPageTransitions();
        
        this.isInitialized = true;
        console.log('🎮 Modern interactions initialized');
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - MODERN_CONFIG.ANIMATIONS.SMOOTH_SCROLL_OFFSET;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: MODERN_CONFIG.ANIMATIONS.SCROLL_REVEAL_THRESHOLD,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.style.animationDelay = '0s';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const elementsToAnimate = document.querySelectorAll(
            '.pixel-terminal, .pixel-btn, .pixel-status, .pixel-interactive'
        );
        
        elementsToAnimate.forEach(el => {
            el.classList.add('page-transition');
            observer.observe(el);
        });
    }

    // Parallax scrolling effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.pixel-particles, .pixel-header');
        
        const handleParallax = this.debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -MODERN_CONFIG.ANIMATIONS.PARALLAX_SPEED;

            parallaxElements.forEach(element => {
                if (element.classList.contains('pixel-particles')) {
                    element.style.transform = `translateY(${rate * 0.3}px)`;
                }
            });
        }, MODERN_CONFIG.INTERACTIONS.DEBOUNCE_DELAY);

        window.addEventListener('scroll', handleParallax);
    }

    // Enhanced cursor effects
    setupCursorEffects() {
        if (window.innerWidth < 768) return; // Skip on mobile

        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.style.mixBlendMode = 'screen';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        document.addEventListener('mousemove', (e) => {
            particles.push({
                x: e.clientX,
                y: e.clientY,
                life: 1.0,
                decay: 0.05
            });

            if (particles.length > MODERN_CONFIG.EFFECTS.CURSOR_TRAIL_COUNT) {
                particles.shift();
            }
        });

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.life -= particle.decay;
                
                if (particle.life <= 0) {
                    particles.splice(index, 1);
                    return;
                }

                ctx.globalAlpha = particle.life;
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
            });

            requestAnimationFrame(animateParticles);
        };

        animateParticles();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Typing animation for text elements
    setupTypingAnimations() {
        const typeElements = document.querySelectorAll('[data-type]');
        
        typeElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--pixel-primary)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                
                if (i >= text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, MODERN_CONFIG.EFFECTS.TYPING_SPEED);
        });
    }

    // Enhanced hover effects
    setupHoverEnhancements() {
        const interactiveElements = document.querySelectorAll('.pixel-btn, .pixel-interactive');
        
        interactiveElements.forEach(element => {
            let hoverTimeout;
            
            element.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    this.createHoverRipple(element);
                }, MODERN_CONFIG.INTERACTIONS.HOVER_DELAY);
            });

            element.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });

            // Add sound feedback
            element.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }

    // Create ripple effect on hover
    createHoverRipple(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.background = 'rgba(0, 255, 0, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1';

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        // Inject ripple animation if not exists
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes rippleEffect {
                    to {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Page transition effects
    setupPageTransitions() {
        // Add loading state management
        document.addEventListener('beforeunload', () => {
            document.body.style.opacity = '0';
            document.body.style.transform = 'scale(0.95)';
        });

        window.addEventListener('load', () => {
            document.body.style.transition = 'all 0.5s ease';
            document.body.style.opacity = '1';
            document.body.style.transform = 'scale(1)';
        });
    }

    // Enhanced sound feedback
    playClickSound() {
        if (typeof AudioManager !== 'undefined') {
            AudioManager.createBeep(800, 0.1, 0.2);
        }
    }

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Dynamic theme adaptation
    adaptToTheme(themeName) {
        const body = document.body;
        body.classList.remove('theme-pixel', 'theme-windows');
        body.classList.add(`theme-${themeName}`);

        if (themeName === 'pixel') {
            this.enableAdvancedEffects();
        } else {
            this.disableAdvancedEffects();
        }
    }

    enableAdvancedEffects() {
        document.querySelectorAll('.pixel-particles').forEach(el => {
            el.style.display = 'block';
        });
    }

    disableAdvancedEffects() {
        document.querySelectorAll('.pixel-particles').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Enhanced section animations
class SectionAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section, .pixel-terminal');
        this.setupSectionAnimations();
    }

    setupSectionAnimations() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSection(entry.target);
                }
            });
        }, options);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    animateSection(section) {
        const children = section.querySelectorAll('h1, h2, h3, p, .pixel-btn, .pixel-interactive');
        
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, 100);
        });
    }
}

// Initialize modern interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for theme switcher to initialize first
    setTimeout(() => {
        window.modernInteractions = new ModernInteractions();
        window.sectionAnimations = new SectionAnimations();
        
        // Integrate with existing theme switcher
        if (window.themeSwitcher) {
            const originalSwitchTheme = window.themeSwitcher.switchToTheme.bind(window.themeSwitcher);
            window.themeSwitcher.switchToTheme = function(themeName) {
                originalSwitchTheme(themeName);
                if (window.modernInteractions) {
                    window.modernInteractions.adaptToTheme(themeName);
                }
            };
        }
    }, 500);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernInteractions, SectionAnimations, MODERN_CONFIG };
}