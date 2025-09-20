/**
 * Music Player Component
 * HTML5 Audio API based music player for Jekyll blog
 * Supports pixel art aesthetics and minimalist design
 */

class MusicPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: false,
            volume: 0.7,
            showCover: true,
            compact: false,
            ...options
        };
        
        this.audio = null;
        this.isPlaying = false;
        this.isLoading = false;
        this.duration = 0;
        this.currentTime = 0;
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
        
        if (this.options.src) {
            this.loadTrack(this.options.src, this.options);
        }
    }
    
    render() {
        const compactClass = this.options.compact ? ' compact' : '';
        const coverHTML = this.options.showCover ? this.renderCover() : '';
        
        this.container.innerHTML = `
            <div class="music-player${compactClass}">
                <div class="music-player__header">
                    ${coverHTML}
                    <div class="track-info">
                        <div class="track-title">${this.options.title || '未知标题'}</div>
                        <div class="track-artist">${this.options.artist || '未知艺术家'}</div>
                    </div>
                </div>
                
                <div class="music-player__controls">
                    <button class="control-btn play-pause" title="播放/暂停">
                        <span class="play-icon">▶</span>
                        <span class="pause-icon" style="display: none;">⏸</span>
                    </button>
                    
                    <span class="time-display">
                        <span class="current-time">0:00</span> / <span class="total-time">0:00</span>
                    </span>
                    
                    <div class="volume-control">
                        <span class="volume-icon">🔊</span>
                        <input type="range" class="volume-slider" min="0" max="100" value="${this.options.volume * 100}">
                    </div>
                </div>
                
                <div class="music-player__progress">
                    <div class="progress-bar">
                        <div class="progress-buffer"></div>
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.cacheElements();
    }
    
    renderCover() {
        if (this.options.cover) {
            return `<div class="track-cover"><img src="${this.options.cover}" alt="专辑封面"></div>`;
        }
        return '<div class="track-cover">🎵</div>';
    }
    
    cacheElements() {
        this.elements = {
            player: this.container.querySelector('.music-player'),
            playPauseBtn: this.container.querySelector('.play-pause'),
            playIcon: this.container.querySelector('.play-icon'),
            pauseIcon: this.container.querySelector('.pause-icon'),
            currentTimeSpan: this.container.querySelector('.current-time'),
            totalTimeSpan: this.container.querySelector('.total-time'),
            volumeSlider: this.container.querySelector('.volume-slider'),
            volumeIcon: this.container.querySelector('.volume-icon'),
            progressBar: this.container.querySelector('.progress-bar'),
            progressFill: this.container.querySelector('.progress-fill'),
            progressBuffer: this.container.querySelector('.progress-buffer'),
            trackTitle: this.container.querySelector('.track-title'),
            trackArtist: this.container.querySelector('.track-artist')
        };
    }
    
    bindEvents() {
        // Play/Pause button
        this.elements.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // Volume control
        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Progress bar click
        this.elements.progressBar.addEventListener('click', (e) => {
            this.seekTo(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.music-player') === this.elements.player) {
                this.handleKeyboard(e);
            }
        });
    }
    
    async loadTrack(src, metadata = {}) {
        this.setLoadingState(true);
        
        try {
            // Clean up existing audio
            if (this.audio) {
                this.cleanupAudio();
            }
            
            this.audio = new Audio(src);
            this.audio.preload = 'metadata';
            this.audio.volume = this.options.volume;
            
            // Update track info
            this.updateTrackInfo(metadata);
            
            // Bind audio events
            this.bindAudioEvents();
            
            // Wait for metadata to load
            await this.waitForMetadata();
            
            this.setLoadingState(false);
            
            if (this.options.autoplay) {
                this.play();
            }
            
        } catch (error) {
            console.error('Failed to load audio:', error);
            this.setErrorState();
        }
    }
    
    bindAudioEvents() {
        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
            this.updateTimeDisplay();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
            this.updateProgress();
            this.updateTimeDisplay();
        });
        
        this.audio.addEventListener('progress', () => {
            this.updateBuffer();
        });
        
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.currentTime = 0;
            this.updatePlayButton();
            this.updateProgress();
            this.updateTimeDisplay();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.setErrorState();
        });
    }
    
    async waitForMetadata() {
        return new Promise((resolve, reject) => {
            if (this.audio.readyState >= 1) {
                resolve();
            } else {
                const onLoadedMetadata = () => {
                    this.audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                    this.audio.removeEventListener('error', onError);
                    resolve();
                };
                
                const onError = (e) => {
                    this.audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                    this.audio.removeEventListener('error', onError);
                    reject(e);
                };
                
                this.audio.addEventListener('loadedmetadata', onLoadedMetadata);
                this.audio.addEventListener('error', onError);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    this.audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                    this.audio.removeEventListener('error', onError);
                    reject(new Error('Metadata loading timeout'));
                }, 10000);
            }
        });
    }
    
    togglePlayPause() {
        if (!this.audio || this.isLoading) return;
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    async play() {
        if (!this.audio || this.isLoading) return;
        
        try {
            await this.audio.play();
        } catch (error) {
            console.error('Failed to play audio:', error);
            this.setErrorState();
        }
    }
    
    pause() {
        if (!this.audio) return;
        this.audio.pause();
    }
    
    setVolume(volume) {
        this.options.volume = Math.max(0, Math.min(1, volume));
        
        if (this.audio) {
            this.audio.volume = this.options.volume;
        }
        
        this.updateVolumeIcon();
    }
    
    seekTo(event) {
        if (!this.audio || !this.duration) return;
        
        const rect = this.elements.progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.duration;
        
        this.audio.currentTime = newTime;
    }
    
    updateTrackInfo(metadata) {
        if (metadata.title) {
            this.elements.trackTitle.textContent = metadata.title;
        }
        if (metadata.artist) {
            this.elements.trackArtist.textContent = metadata.artist;
        }
    }
    
    updatePlayButton() {
        if (this.isPlaying) {
            this.elements.playIcon.style.display = 'none';
            this.elements.pauseIcon.style.display = 'inline';
        } else {
            this.elements.playIcon.style.display = 'inline';
            this.elements.pauseIcon.style.display = 'none';
        }
    }
    
    updateTimeDisplay() {
        this.elements.currentTimeSpan.textContent = this.formatTime(this.currentTime);
        this.elements.totalTimeSpan.textContent = this.formatTime(this.duration);
    }
    
    updateProgress() {
        if (!this.duration) return;
        
        const percentage = (this.currentTime / this.duration) * 100;
        this.elements.progressFill.style.width = `${percentage}%`;
    }
    
    updateBuffer() {
        if (!this.audio || !this.duration) return;
        
        const buffered = this.audio.buffered;
        if (buffered.length > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1);
            const percentage = (bufferedEnd / this.duration) * 100;
            this.elements.progressBuffer.style.width = `${percentage}%`;
        }
    }
    
    updateVolumeIcon() {
        const volume = this.options.volume;
        let icon = '🔊';
        
        if (volume === 0) {
            icon = '🔇';
        } else if (volume < 0.3) {
            icon = '🔈';
        } else if (volume < 0.7) {
            icon = '🔉';
        }
        
        this.elements.volumeIcon.textContent = icon;
    }
    
    setLoadingState(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.elements.player.classList.add('loading');
        } else {
            this.elements.player.classList.remove('loading');
        }
    }
    
    setErrorState() {
        this.elements.player.classList.add('error');
        this.setLoadingState(false);
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    handleKeyboard(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.audio.currentTime = Math.min(this.duration, this.audio.currentTime + 10);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.setVolume(this.options.volume + 0.1);
                this.elements.volumeSlider.value = this.options.volume * 100;
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.setVolume(this.options.volume - 0.1);
                this.elements.volumeSlider.value = this.options.volume * 100;
                break;
        }
    }
    
    cleanupAudio() {
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('loadedmetadata', this.bindAudioEvents);
            this.audio.removeEventListener('timeupdate', this.bindAudioEvents);
            this.audio.removeEventListener('progress', this.bindAudioEvents);
            this.audio.removeEventListener('play', this.bindAudioEvents);
            this.audio.removeEventListener('pause', this.bindAudioEvents);
            this.audio.removeEventListener('ended', this.bindAudioEvents);
            this.audio.removeEventListener('error', this.bindAudioEvents);
            this.audio.src = '';
            this.audio = null;
        }
    }
    
    destroy() {
        this.cleanupAudio();
        this.container.innerHTML = '';
    }
}

// Auto-initialize music players from data attributes
document.addEventListener('DOMContentLoaded', function() {
    const playerElements = document.querySelectorAll('[data-music-player]');
    
    playerElements.forEach(element => {
        const options = {
            src: element.dataset.src,
            title: element.dataset.title,
            artist: element.dataset.artist,
            cover: element.dataset.cover,
            autoplay: element.dataset.autoplay === 'true',
            compact: element.dataset.compact === 'true',
            showCover: element.dataset.showCover !== 'false'
        };
        
        new MusicPlayer(element, options);
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicPlayer;
} else if (typeof window !== 'undefined') {
    window.MusicPlayer = MusicPlayer;
}