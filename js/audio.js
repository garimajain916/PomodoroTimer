class AudioManager {
    constructor() {
        this.soundEnabled = true;
        this.selectedSound = 'bell'; // Default sound
        this.audioContext = null;
        this.loadSettings();
        this.initializeAudio();
        this.initializeSounds();
    }
    
    initializeAudio() {
        // Initialize Web Audio API on user interaction
        const initAudio = () => {
            if (!this.audioContext) {
                this.createAudioContext();
            }
        };
        
        // Listen for any user interaction to initialize audio - enhanced for mobile
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
        document.addEventListener('touchstart', initAudio, { once: true, passive: true });
        document.addEventListener('touchend', initAudio, { once: true, passive: true });
        
        // Additional mobile-specific initialization
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        });
    }
    
    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle audio context state changes on mobile
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    initializeSounds() {
        this.sounds = {
            bell: {
                name: 'Bell',
                icon: '🔔',
                description: 'Classic bell chime'
            },
            chime: {
                name: 'Chime',
                icon: '🎵',
                description: 'Gentle wind chime'
            },
            ding: {
                name: 'Ding',
                icon: '🛎️',
                description: 'Simple ding sound'
            },
            gong: {
                name: 'Gong',
                icon: '🥇',
                description: 'Deep meditation gong'
            },
            chirp: {
                name: 'Chirp',
                icon: '🐦',
                description: 'Pleasant bird chirp'
            },
            beep: {
                name: 'Beep',
                icon: '📱',
                description: 'Digital notification'
            }
        };
    }
    
    // Generate notification sounds using Web Audio API
    playSessionComplete() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            switch (this.selectedSound) {
                case 'bell':
                    this.playBellSound();
                    break;
                case 'chime':
                    this.playChimeSound();
                    break;
                case 'ding':
                    this.playDingSound();
                    break;
                case 'gong':
                    this.playGongSound();
                    break;
                case 'chirp':
                    this.playChirpSound();
                    break;
                case 'beep':
                    this.playBeepSound();
                    break;
                default:
                    this.playBellSound();
            }
        } catch (error) {
            console.warn('Failed to play audio:', error);
        }
    }
    
    playBellSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Create a gentle bell-like sound
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
        
        // Fade in and out
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.3);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    playChimeSound() {
        // Create multiple tones for wind chime effect
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            const startTime = this.audioContext.currentTime + (index * 0.1);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 1.0);
        });
    }
    
    playDingSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.8);
    }
    
    playGongSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(130.81, this.audioContext.currentTime); // C3
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2.0);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 2.0);
    }
    
    playChirpSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Quick frequency sweep like a bird chirp
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1500, this.audioContext.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.15);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    playBeepSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.15);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    playTickSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            // Subtle tick sound for the last 10 seconds
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        } catch (error) {
            console.warn('Failed to play tick sound:', error);
        }
    }
    
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.saveSettings();
    }
    
    setSelectedSound(soundKey) {
        this.selectedSound = soundKey;
        this.saveSettings();
    }
    
    getSounds() {
        return this.sounds;
    }
    
    getSelectedSound() {
        return this.selectedSound;
    }
    
    // Preview a sound for testing
    previewSound(soundKey) {
        const oldSound = this.selectedSound;
        this.selectedSound = soundKey;
        this.playSessionComplete();
        this.selectedSound = oldSound;
    }
    
    saveSettings() {
        localStorage.setItem('pomodoroAudioSettings', JSON.stringify({
            soundEnabled: this.soundEnabled,
            selectedSound: this.selectedSound
        }));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('pomodoroAudioSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
                this.selectedSound = settings.selectedSound || 'bell';
            }
        } catch (error) {
            console.warn('Failed to load audio settings:', error);
        }
    }
}

// Initialize audio manager
window.audioManager = new AudioManager(); 