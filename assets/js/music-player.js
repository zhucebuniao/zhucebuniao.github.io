// Pixel World Music Player
class PixelMusicPlayer {
    constructor() {
        this.audioContext = null;
        this.currentTrack = 0;
        this.isPlaying = false;
        this.volume = 0.5;
        this.tracks = [
            { name: '像素冒险', frequency: [440, 523, 659, 783, 1047] },
            { name: '复古节拍', frequency: [261, 329, 392, 523, 659] },
            { name: '芯片调', frequency: [174, 220, 261, 329, 392] },
            { name: '游戏主题', frequency: [349, 440, 523, 698, 880] }
        ];
        this.init();
    }
    
    init() {
        this.createPlayer();
        this.bindEvents();
    }
    
    createPlayer() {
        // Check if music player already exists
        if (document.getElementById('music-player')) {
            return;
        }
        
        const musicSection = document.createElement('div');
        musicSection.id = 'music-player';
        musicSection.className = 'pixel-music-player';
        musicSection.innerHTML = `
            <div class="music-header">
                <h3>🎵 音乐播放器</h3>
                <button class="music-toggle-btn" id="music-toggle">隐藏</button>
            </div>
            <div class="music-content" id="music-content">
                <div class="music-info">
                    <div class="track-display" id="track-display">
                        <span class="track-name" id="track-name">${this.tracks[0].name}</span>
                        <span class="track-number" id="track-number">1/${this.tracks.length}</span>
                    </div>
                </div>
                <div class="music-controls">
                    <button class="music-btn" id="prev-btn">⏮️</button>
                    <button class="music-btn play-btn" id="play-btn">▶️</button>
                    <button class="music-btn" id="next-btn">⏭️</button>
                    <button class="music-btn" id="stop-btn">⏹️</button>
                </div>
                <div class="music-volume">
                    <label for="volume-slider">音量:</label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.5">
                    <span id="volume-display">50%</span>
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
        
        // Insert after the header
        const header = document.querySelector('.pixel-header');
        if (header) {
            header.after(musicSection);
        }
    }
    
    bindEvents() {
        // Control buttons
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousTrack());
        document.getElementById('next-btn').addEventListener('click', () => this.nextTrack());
        document.getElementById('stop-btn').addEventListener('click', () => this.stop());
        
        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Playlist
        document.getElementById('playlist').addEventListener('click', (e) => {
            if (e.target.classList.contains('playlist-item')) {
                const trackIndex = parseInt(e.target.dataset.track);
                this.selectTrack(trackIndex);
            }
        });
        
        // Toggle player visibility
        document.getElementById('music-toggle').addEventListener('click', () => this.toggleVisibility());
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        this.isPlaying = true;
        document.getElementById('play-btn').textContent = '⏸️';
        
        this.playChiptune(this.tracks[this.currentTrack].frequency);
        this.updateDisplay();
    }
    
    pause() {
        this.isPlaying = false;
        document.getElementById('play-btn').textContent = '▶️';
        
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
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        if (this.isPlaying) {
            this.pause();
            setTimeout(() => this.play(), 100);
        } else {
            this.updateDisplay();
        }
    }
    
    previousTrack() {
        this.currentTrack = this.currentTrack === 0 ? this.tracks.length - 1 : this.currentTrack - 1;
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
        document.getElementById('volume-display').textContent = Math.round(this.volume * 100) + '%';
    }
    
    updateDisplay() {
        document.getElementById('track-name').textContent = this.tracks[this.currentTrack].name;
        document.getElementById('track-number').textContent = `${this.currentTrack + 1}/${this.tracks.length}`;
        
        // Update playlist highlighting
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrack);
        });
    }
    
    playChiptune(frequencies) {
        if (!this.audioContext || !this.isPlaying) return;
        
        let noteIndex = 0;
        const playNote = () => {
            if (!this.isPlaying || noteIndex >= frequencies.length) {
                if (this.isPlaying) {
                    // Loop the track
                    noteIndex = 0;
                    setTimeout(playNote, 200);
                }
                return;
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequencies[noteIndex];
            oscillator.type = 'square'; // 8-bit sound
            
            gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.4);
            
            this.currentOscillator = oscillator;
            noteIndex++;
            
            setTimeout(playNote, 500);
        };
        
        playNote();
    }
    
    toggleVisibility() {
        const content = document.getElementById('music-content');
        const toggleBtn = document.getElementById('music-toggle');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggleBtn.textContent = '隐藏';
        } else {
            content.style.display = 'none';
            toggleBtn.textContent = '显示';
        }
    }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already done and if no instance exists
    if (!window.musicPlayer && !document.getElementById('music-player')) {
        window.musicPlayer = new PixelMusicPlayer();
    }
});