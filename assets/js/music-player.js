// Pixel World Music Player - Refactored with "Good Taste"
// "Good programmers worry about data structures" - Linus

const MUSIC_CONFIG = {
    TRACKS: [
        { name: '像素冒险', frequency: [440, 523, 659, 783, 1047] },
        { name: '复古节拍', frequency: [261, 329, 392, 523, 659] },
        { name: '芯片调', frequency: [174, 220, 261, 329, 392] },
        { name: '游戏主题', frequency: [349, 440, 523, 698, 880] }
    ],
    DEFAULT_VOLUME: 0.5,
    NOTE_DURATION: 0.4,
    NOTE_INTERVAL: 500,
    LOOP_DELAY: 200,
    SELECTORS: {
        PLAYER: '#music-player',
        CONTENT: '#music-content',
        TOGGLE: '#music-toggle',
        PLAY_BTN: '#play-btn',
        PREV_BTN: '#prev-btn',
        NEXT_BTN: '#next-btn',
        STOP_BTN: '#stop-btn',
        VOLUME_SLIDER: '#volume-slider',
        VOLUME_DISPLAY: '#volume-display',
        TRACK_NAME: '#track-name',
        TRACK_NUMBER: '#track-number',
        PLAYLIST: '#playlist'
    },
    UI: {
        ICONS: {
            PLAY: '▶️',
            PAUSE: '⏸️',
            PREV: '⏮️',
            NEXT: '⏭️',
            STOP: '⏹️'
        },
        TOGGLE_TEXT: {
            HIDE: '隐藏',
            SHOW: '显示'
        }
    }
};

class PixelMusicPlayer {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.volume = MUSIC_CONFIG.DEFAULT_VOLUME;
        this.currentOscillator = null;
        this.tracks = MUSIC_CONFIG.TRACKS;
        this.init();
    }
    
    init() {
        if (document.querySelector(MUSIC_CONFIG.SELECTORS.PLAYER)) return;
        this.createPlayer();
        this.bindEvents();
    }
    
    createPlayer() {
        const musicSection = document.createElement('div');
        musicSection.id = 'music-player';
        musicSection.className = 'pixel-music-player';
        musicSection.innerHTML = this.generatePlayerHTML();
        
        // Insert after header - simple and clear
        const header = document.querySelector('.pixel-header');
        if (header) {
            header.after(musicSection);
        }
    }
    
    // Separate HTML generation - single responsibility
    generatePlayerHTML() {
        const { ICONS, TOGGLE_TEXT } = MUSIC_CONFIG.UI;
        return `
            <div class="music-header">
                <h3>🎵 音乐播放器</h3>
                <button class="music-toggle-btn" id="music-toggle">${TOGGLE_TEXT.HIDE}</button>
            </div>
            <div class="music-content" id="music-content">
                <div class="music-info">
                    <div class="track-display" id="track-display">
                        <span class="track-name" id="track-name">${this.tracks[0].name}</span>
                        <span class="track-number" id="track-number">1/${this.tracks.length}</span>
                    </div>
                </div>
                <div class="music-controls">
                    <button class="music-btn" id="prev-btn">${ICONS.PREV}</button>
                    <button class="music-btn play-btn" id="play-btn">${ICONS.PLAY}</button>
                    <button class="music-btn" id="next-btn">${ICONS.NEXT}</button>
                    <button class="music-btn" id="stop-btn">${ICONS.STOP}</button>
                </div>
                <div class="music-volume">
                    <label for="volume-slider">音量:</label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="${this.volume}">
                    <span id="volume-display">${Math.round(this.volume * 100)}%</span>
                </div>
                <div class="music-playlist">
                    <h4>播放列表:</h4>
                    <ul id="playlist">
                        ${this.tracks.map((track, index) => 
                            `<li class="playlist-item ${index === 0 ? 'active' : ''}" data-track="${index}">
                                ${index + 1}. ${track.name}
                            </li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Use configuration selectors - no more magic strings
        const selectors = MUSIC_CONFIG.SELECTORS;
        
        document.querySelector(selectors.PLAY_BTN).addEventListener('click', () => this.togglePlay());
        document.querySelector(selectors.PREV_BTN).addEventListener('click', () => this.previousTrack());
        document.querySelector(selectors.NEXT_BTN).addEventListener('click', () => this.nextTrack());
        document.querySelector(selectors.STOP_BTN).addEventListener('click', () => this.stop());
        document.querySelector(selectors.VOLUME_SLIDER).addEventListener('input', (e) => this.setVolume(e.target.value));
        document.querySelector(selectors.TOGGLE).addEventListener('click', () => this.toggleVisibility());
        
        // Playlist event delegation - cleaner approach
        document.querySelector(selectors.PLAYLIST).addEventListener('click', (e) => {
            if (e.target.classList.contains('playlist-item')) {
                this.selectTrack(parseInt(e.target.dataset.track));
            }
        });
    }
    
    togglePlay() {
        this.isPlaying ? this.pause() : this.play();
    }
    
    play() {
        this.isPlaying = true;
        document.querySelector(MUSIC_CONFIG.SELECTORS.PLAY_BTN).textContent = MUSIC_CONFIG.UI.ICONS.PAUSE;
        this.playChiptune(this.tracks[this.currentTrack].frequency);
        this.updateDisplay();
    }
    
    pause() {
        this.isPlaying = false;
        document.querySelector(MUSIC_CONFIG.SELECTORS.PLAY_BTN).textContent = MUSIC_CONFIG.UI.ICONS.PLAY;
        
        if (this.currentOscillator) {
            this.currentOscillator.stop();
            this.currentOscillator = null;
        }
    }
    
    stop() {
        this.pause();
        this.currentTrack = 0;
        this.updateDisplay();
    }
    
    // Track navigation with DRY principle
    nextTrack() {
        this.changeTrack(1);
    }
    
    previousTrack() {
        this.changeTrack(-1);
    }
    
    // Eliminate code duplication in track changing
    changeTrack(direction) {
        if (direction > 0) {
            this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        } else {
            this.currentTrack = this.currentTrack === 0 ? this.tracks.length - 1 : this.currentTrack - 1;
        }
        
        if (this.isPlaying) {
            this.pause();
            setTimeout(() => this.play(), 100);
        } else {
            this.updateDisplay();
        }
    }
    
    selectTrack(index) {
        this.currentTrack = index;
        if (this.isPlaying) {
            this.pause();
            setTimeout(() => this.play(), 100);
        } else {
            this.updateDisplay();
        }
    }
    
    setVolume(value) {
        this.volume = parseFloat(value);
        document.querySelector(MUSIC_CONFIG.SELECTORS.VOLUME_DISPLAY).textContent = Math.round(this.volume * 100) + '%';
    }
    
    updateDisplay() {
        const selectors = MUSIC_CONFIG.SELECTORS;
        document.querySelector(selectors.TRACK_NAME).textContent = this.tracks[this.currentTrack].name;
        document.querySelector(selectors.TRACK_NUMBER).textContent = `${this.currentTrack + 1}/${this.tracks.length}`;
        
        // Update playlist highlighting
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrack);
        });
    }
    
    // Use centralized AudioManager instead of local audioContext
    playChiptune(frequencies) {
        if (!this.isPlaying) return;
        
        let noteIndex = 0;
        const playNote = () => {
            if (!this.isPlaying || noteIndex >= frequencies.length) {
                if (this.isPlaying) {
                    // Loop the track
                    noteIndex = 0;
                    setTimeout(playNote, MUSIC_CONFIG.LOOP_DELAY);
                }
                return;
            }
            
            this.currentOscillator = AudioManager.createBeep(
                frequencies[noteIndex], 
                MUSIC_CONFIG.NOTE_DURATION,
                this.volume * 0.1
            );
            
            noteIndex++;
            setTimeout(playNote, MUSIC_CONFIG.NOTE_INTERVAL);
        };
        
        playNote();
    }
    
    toggleVisibility() {
        const content = document.querySelector(MUSIC_CONFIG.SELECTORS.CONTENT);
        const toggleBtn = document.querySelector(MUSIC_CONFIG.SELECTORS.TOGGLE);
        const { HIDE, SHOW } = MUSIC_CONFIG.UI.TOGGLE_TEXT;
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggleBtn.textContent = HIDE;
        } else {
            content.style.display = 'none';
            toggleBtn.textContent = SHOW;
        }
    }
}

// Clean initialization - no duplicate checks needed
document.addEventListener('DOMContentLoaded', function() {
    if (!window.musicPlayer && !document.querySelector(MUSIC_CONFIG.SELECTORS.PLAYER)) {
        window.musicPlayer = new PixelMusicPlayer();
    }
});