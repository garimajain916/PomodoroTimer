class PomodoroApp {
    constructor() {
        this.timer = window.timer;
        this.audioManager = window.audioManager;
        this.initializeElements();
        this.attachEventListeners();
        this.initializeTheme();
        this.initializeSettings();
        this.requestNotificationPermission();
    }
    
    initializeElements() {
        // Control buttons
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Settings
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        
        // Theme toggle
        this.themeToggle = document.getElementById('themeToggle');
        
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
        this.playPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Settings
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.settingsPanel.addEventListener('click', (e) => {
            if (e.target === this.settingsPanel) {
                this.closeSettings();
            }
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
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
        });
        
        // Initialize sound selection
        this.initializeSoundSelection();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSettingsOpen()) {
                e.preventDefault();
                this.toggleTimer();
            } else if (e.code === 'KeyR' && !this.isSettingsOpen()) {
                e.preventDefault();
                this.resetTimer();
            } else if (e.code === 'Escape' && this.isSettingsOpen()) {
                this.closeSettings();
            }
        });
    }
    
    toggleTimer() {
        if (this.timer.state.isRunning) {
            this.timer.pause();
        } else {
            this.timer.start();
        }
    }
    
    resetTimer() {
        this.timer.reset();
    }
    
    openSettings() {
        this.settingsPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
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
    }
    
    initializeTheme() {
        // Load saved theme
        const savedTheme = localStorage.getItem('pomodoroTheme') || 'light';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pomodoroTheme', theme);
        
        // Update theme toggle icon
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
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
                <button class="sound-preview" title="Preview sound">▶</button>
            `;
            
            // Handle sound selection
            soundOption.addEventListener('click', (e) => {
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
            
            this.soundSelection.appendChild(soundOption);
        });
    }
    
    selectSound(soundKey) {
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
        // Only preview if sound is enabled
        if (this.soundToggle.checked) {
            this.audioManager.previewSound(soundKey);
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