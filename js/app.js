class PomodoroApp {
    constructor() {
        this.timer = window.timer;
        this.audioManager = window.audioManager;
        this.initializeElements();
        this.attachEventListeners();
        this.initializeSettings();
        this.requestNotificationPermission();
        this.initializeMobileOptimizations();
    }
    
    initializeElements() {
        // Timer display elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionType = document.getElementById('sessionType');
        this.sessionCount = document.getElementById('sessionCount');
        this.progressCircle = document.querySelector('.progress-ring__circle');
        
        // Control buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Settings
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        
        // Setting inputs
        this.workDurationInput = document.getElementById('workDuration');
        this.soundToggle = document.getElementById('soundEnabled');
        this.soundSelection = document.getElementById('soundSelection');
        
        // Timer 1 notification elements
        this.timer1BeforeToggle = document.getElementById('timer1Before');
        this.timer1AfterToggle = document.getElementById('timer1After');
        this.timer1BeforeMinsInput = document.getElementById('timer1BeforeMins');
        this.timer1AfterMinsInput = document.getElementById('timer1AfterMins');
        
        // Setting value displays
        this.workValue = document.getElementById('workValue');
        this.timer1BeforeValue = document.getElementById('timer1BeforeValue');
        this.timer1AfterValue = document.getElementById('timer1AfterValue');
    }
    
    attachEventListeners() {
        // Timer controls
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startTimer());
        }
        
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        }
        
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetTimer());
        }
        
        // Settings
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.settingsPanel.addEventListener('click', (e) => {
            if (e.target === this.settingsPanel) {
                this.closeSettings();
            }
        });
        
        // Settings inputs
        this.workDurationInput.addEventListener('input', (e) => {
            this.workValue.textContent = e.target.value;
            this.updateTimerSettings();
        });
        
        // Timer 1 event listeners
        this.timer1BeforeMinsInput.addEventListener('input', (e) => {
            this.timer1BeforeValue.textContent = e.target.value;
            this.updateTimerSettings();
        });
        
        this.timer1AfterMinsInput.addEventListener('input', (e) => {
            this.timer1AfterValue.textContent = e.target.value;
            this.updateTimerSettings();
        });
        
        this.timer1BeforeToggle.addEventListener('change', () => {
            this.updateTimerSettings();
        });
        
        this.timer1AfterToggle.addEventListener('change', () => {
            this.updateTimerSettings();
        });
        
        this.soundToggle.addEventListener('change', (e) => {
            this.audioManager.setSoundEnabled(e.target.checked);
            // Track analytics
            if (window.analyticsManager) {
                window.analyticsManager.trackSoundToggle(e.target.checked);
            }
        });
        
        // Initialize sound selection
        this.initializeSoundSelection();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSettingsOpen()) {
                e.preventDefault();
                this.toggleTimer();
                // Track analytics
                if (window.analyticsManager) {
                    window.analyticsManager.trackKeyboardShortcut('space');
                }
            } else if (e.code === 'KeyR' && !this.isSettingsOpen()) {
                e.preventDefault();
                this.resetTimer();
                // Track analytics
                if (window.analyticsManager) {
                    window.analyticsManager.trackKeyboardShortcut('r');
                }
            } else if (e.code === 'Escape' && this.isSettingsOpen()) {
                this.closeSettings();
                // Track analytics
                if (window.analyticsManager) {
                    window.analyticsManager.trackKeyboardShortcut('escape');
                }
            }
        });
    }
    
    startTimer() {
        if (this.timer) {
            this.timer.start();
            this.updateButtonStates();
            
            // Track analytics
            if (window.analyticsManager) {
                window.analyticsManager.trackTimerStart('work', this.timer.settings.workDuration);
            }
        }
    }
    
    pauseTimer() {
        if (this.timer) {
            this.timer.pause();
            this.updateButtonStates();
            
            // Track analytics
            if (window.analyticsManager) {
                window.analyticsManager.trackTimerPause('work', this.timer.state.timeRemaining);
            }
        }
    }
    
    toggleTimer() {
        if (this.timer.state.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    resetTimer() {
        if (this.timer) {
            this.timer.reset();
            this.updateButtonStates();
            
            // Track analytics
            if (window.analyticsManager) {
                window.analyticsManager.trackTimerReset('work', this.timer.state.timeRemaining);
            }
        }
    }
    
    updateButtonStates() {
        const isRunning = this.timer.state.isRunning;
        
        this.startBtn.disabled = isRunning;
        this.pauseBtn.disabled = !isRunning;
        
        // Update button appearance based on state
        if (isRunning) {
            this.startBtn.style.opacity = '0.5';
            this.pauseBtn.style.opacity = '1';
        } else {
            this.startBtn.style.opacity = '1';
            this.pauseBtn.style.opacity = '0.5';
        }
    }
    
    openSettings() {
        this.settingsPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track analytics
        if (window.analyticsManager) {
            window.analyticsManager.trackSettingsOpen();
        }
    }
    
    closeSettings() {
        this.settingsPanel.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    isSettingsOpen() {
        return this.settingsPanel.classList.contains('active');
    }
    
    updateTimerSettings() {
        const settings = {
            workDuration: parseInt(this.workDurationInput.value),
            timer1Before: this.timer1BeforeToggle.checked,
            timer1After: this.timer1AfterToggle.checked,
            timer1BeforeMins: parseInt(this.timer1BeforeMinsInput.value),
            timer1AfterMins: parseInt(this.timer1AfterMinsInput.value)
        };
        
        this.timer.updateSettings(settings);
    }
    
    initializeSettings() {
        // Load current settings into UI
        const settings = this.timer.settings;
        
        this.workDurationInput.value = settings.workDuration;
        this.workValue.textContent = settings.workDuration;
        
        this.timer1BeforeToggle.checked = settings.timer1Before;
        this.timer1AfterToggle.checked = settings.timer1After;
        this.timer1BeforeMinsInput.value = settings.timer1BeforeMins;
        this.timer1AfterMinsInput.value = settings.timer1AfterMins;
        this.timer1BeforeValue.textContent = settings.timer1BeforeMins;
        this.timer1AfterValue.textContent = settings.timer1AfterMins;
        
        this.soundToggle.checked = this.audioManager.soundEnabled;
        
        // Set initial button states
        this.updateButtonStates();
    }
    
    requestNotificationPermission() {
        this.timer.requestNotificationPermission();
    }
    
    // Handle visibility change (tab switching)
    handleVisibilityChange() {
        if (document.hidden && this.timer.state.isRunning) {
            // Optional: Show notification when tab becomes hidden
            console.log('Timer running in background');
        }
    }
    
    // Initialize sound selection
    initializeSoundSelection() {
        const sounds = this.audioManager.getSounds();
        const selectedSound = this.audioManager.getSelectedSound();
        
        // Clear existing sound options
        this.soundSelection.innerHTML = '';
        
        // Create sound option cards
        Object.entries(sounds).forEach(([key, sound]) => {
            const soundOption = document.createElement('div');
            soundOption.className = `sound-option ${key === selectedSound ? 'selected' : ''}`;
            soundOption.dataset.sound = key;
            
            soundOption.innerHTML = `
                <span class="sound-icon">${sound.icon}</span>
                <div class="sound-name">${sound.name}</div>
                <div class="sound-description">${sound.description}</div>
                <button class="sound-preview" title="Preview sound" aria-label="Preview ${sound.name}">▶</button>
            `;
            
            // Handle sound selection - improve for mobile
            soundOption.addEventListener('click', (e) => {
                if (!e.target.classList.contains('sound-preview')) {
                    this.selectSound(key);
                }
            });
            
            // Handle sound selection on touch devices
            soundOption.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (!e.target.classList.contains('sound-preview')) {
                    this.selectSound(key);
                }
            });
            
            // Handle sound preview
            const previewBtn = soundOption.querySelector('.sound-preview');
            previewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.previewSound(key);
            });
            
            // Handle preview on touch
            previewBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previewSound(key);
            });
            
            this.soundSelection.appendChild(soundOption);
        });
    }
    
    selectSound(soundKey) {
        // Track analytics for sound change
        if (window.analyticsManager) {
            window.analyticsManager.trackSoundChange(soundKey);
        }
        
        // Update audio manager
        this.audioManager.setSelectedSound(soundKey);
        
        // Update UI
        this.updateSoundSelection(soundKey);
    }
    
    updateSoundSelection(selectedSound) {
        const soundOptions = this.soundSelection.querySelectorAll('.sound-option');
        soundOptions.forEach(option => {
            if (option.dataset.sound === selectedSound) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    previewSound(soundKey) {
        // Track analytics for sound preview
        if (window.analyticsManager) {
            window.analyticsManager.trackSoundPreview(soundKey);
        }
        
        // Only preview if sound is enabled
        if (this.soundToggle.checked) {
            this.audioManager.previewSound(soundKey);
        }
    }
    
    initializeMobileOptimizations() {
        // Prevent double-tap zoom on iOS
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Optimize for mobile viewport changes
        const handleViewportChange = () => {
            // Update CSS custom property for viewport height
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);
        handleViewportChange();
        
        // Add touch feedback for buttons
        this.addTouchFeedback();
        
        // Handle mobile keyboard
        this.handleMobileKeyboard();
    }
    
    addTouchFeedback() {
        const touchElements = document.querySelectorAll('.control-btn, .settings-btn, .close-settings, .sound-option');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);
            }, { passive: true });
            
            element.addEventListener('touchcancel', () => {
                element.style.transform = '';
            }, { passive: true });
        });
    }
    
    handleMobileKeyboard() {
        // Adjust layout when mobile keyboard appears
        const initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        
        const handleKeyboard = () => {
            if (window.visualViewport) {
                const currentHeight = window.visualViewport.height;
                const diff = initialViewportHeight - currentHeight;
                
                if (diff > 150) { // Keyboard is likely open
                    document.body.style.height = `${currentHeight}px`;
                } else {
                    document.body.style.height = '';
                }
            }
        };
        
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleKeyboard);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PomodoroApp();
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (window.app) {
            window.app.handleVisibilityChange();
        }
    });
    
    // Handle page unload (save state)
    window.addEventListener('beforeunload', () => {
        // State is automatically saved in the timer
    });
}); 