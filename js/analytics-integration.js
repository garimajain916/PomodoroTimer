// Analytics Integration for Pomodoro Timer
// This file extends the existing classes with analytics tracking

// Store original methods to call after tracking
const originalMethods = {};

// Function to safely track analytics
function trackAnalytics(eventName, ...args) {
    if (window.analyticsManager) {
        try {
            window.analyticsManager[eventName](...args);
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }
}

// Extend PomodoroApp with analytics tracking
function enhanceAppWithAnalytics() {
    if (!window.app || !window.app.constructor) return;
    
    const appClass = window.app.constructor;
    const prototype = appClass.prototype;
    
    // Store original methods
    originalMethods.startTimer = prototype.startTimer;
    originalMethods.pauseTimer = prototype.pauseTimer;
    originalMethods.resetTimer = prototype.resetTimer;
    originalMethods.openSettings = prototype.openSettings;
    originalMethods.updateTimerSettings = prototype.updateTimerSettings;
    originalMethods.selectSound = prototype.selectSound;
    originalMethods.previewSound = prototype.previewSound;
    
    // Enhanced startTimer with analytics
    prototype.startTimer = function() {
        if (this.timer) {
            trackAnalytics('trackTimerStart', 
                this.timer.state.sessionType, 
                this.timer.getCurrentSessionDuration()
            );
        }
        return originalMethods.startTimer.call(this);
    };
    
    // Enhanced pauseTimer with analytics
    prototype.pauseTimer = function() {
        if (this.timer) {
            trackAnalytics('trackTimerPause', 
                this.timer.state.sessionType, 
                this.timer.state.timeRemaining
            );
        }
        return originalMethods.pauseTimer.call(this);
    };
    
    // Enhanced resetTimer with analytics
    prototype.resetTimer = function() {
        if (this.timer) {
            trackAnalytics('trackTimerReset', 
                this.timer.state.sessionType, 
                this.timer.state.timeRemaining
            );
        }
        return originalMethods.resetTimer.call(this);
    };
    
    // Enhanced openSettings with analytics
    prototype.openSettings = function() {
        trackAnalytics('trackSettingsOpen');
        return originalMethods.openSettings.call(this);
    };
    
    // Enhanced updateTimerSettings with analytics
    prototype.updateTimerSettings = function() {
        const oldSettings = { ...this.timer.settings };
        const result = originalMethods.updateTimerSettings.call(this);
        
        // Track settings changes after update
        const newSettings = this.timer.settings;
        
        if (oldSettings.workDuration !== newSettings.workDuration) {
            trackAnalytics('trackWorkDurationChange', oldSettings.workDuration, newSettings.workDuration);
        }
        
        if (oldSettings.timer1Before !== newSettings.timer1Before) {
            trackAnalytics('trackNotificationSettingChange', 'before', newSettings.timer1Before, newSettings.timer1BeforeMins);
        }
        
        if (oldSettings.timer1After !== newSettings.timer1After) {
            trackAnalytics('trackNotificationSettingChange', 'after', newSettings.timer1After, newSettings.timer1AfterMins);
        }
        
        if (oldSettings.timer1BeforeMins !== newSettings.timer1BeforeMins) {
            trackAnalytics('trackSettingsChange', 'timer1_before_minutes', oldSettings.timer1BeforeMins, newSettings.timer1BeforeMins);
        }
        
        if (oldSettings.timer1AfterMins !== newSettings.timer1AfterMins) {
            trackAnalytics('trackSettingsChange', 'timer1_after_minutes', oldSettings.timer1AfterMins, newSettings.timer1AfterMins);
        }
        
        return result;
    };
    
    // Enhanced selectSound with analytics
    prototype.selectSound = function(soundKey) {
        trackAnalytics('trackSoundChange', soundKey);
        return originalMethods.selectSound.call(this, soundKey);
    };
    
    // Enhanced previewSound with analytics
    prototype.previewSound = function(soundKey) {
        trackAnalytics('trackSoundPreview', soundKey);
        return originalMethods.previewSound.call(this, soundKey);
    };
}

// Extend PomodoroTimer with analytics tracking
function enhanceTimerWithAnalytics() {
    if (!window.timer || !window.timer.constructor) return;
    
    const timerClass = window.timer.constructor;
    const prototype = timerClass.prototype;
    
    // Store original methods
    originalMethods.completeSession = prototype.completeSession;
    originalMethods.finalizeSession = prototype.finalizeSession;
    originalMethods.requestNotificationPermission = prototype.requestNotificationPermission;
    
    // Enhanced completeSession with analytics
    prototype.completeSession = function() {
        trackAnalytics('trackTimerComplete', this.state.sessionType, this.getCurrentSessionDuration());
        
        const result = originalMethods.completeSession.call(this);
        
        if (this.state.sessionType === 'work') {
            trackAnalytics('trackSessionComplete', this.state.currentSession, this.state.completedSessions);
        }
        
        return result;
    };
    
    // Enhanced finalizeSession with analytics
    prototype.finalizeSession = function() {
        trackAnalytics('trackExtendedTimerComplete', this.settings.timer1AfterMins);
        
        const result = originalMethods.finalizeSession.call(this);
        
        if (this.state.sessionType === 'work') {
            trackAnalytics('trackSessionComplete', this.state.currentSession, this.state.completedSessions);
        }
        
        return result;
    };
    
    // Enhanced requestNotificationPermission with analytics
    prototype.requestNotificationPermission = function() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                trackAnalytics('trackNotificationPermission', permission);
            });
        }
    };
}

// Add keyboard shortcut tracking
function enhanceKeyboardShortcuts() {
    // Override existing keyboard event listeners
    document.addEventListener('keydown', (e) => {
        if (!window.app) return;
        
        if (e.code === 'Space' && !window.app.isSettingsOpen()) {
            trackAnalytics('trackKeyboardShortcut', 'space');
        } else if (e.code === 'KeyR' && !window.app.isSettingsOpen()) {
            trackAnalytics('trackKeyboardShortcut', 'r');
        } else if (e.code === 'Escape' && window.app.isSettingsOpen()) {
            trackAnalytics('trackKeyboardShortcut', 'escape');
        }
    });
}

// Add sound toggle tracking
function enhanceSoundToggle() {
    // Find sound toggle and add analytics
    const soundToggle = document.getElementById('soundEnabled');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            trackAnalytics('trackSoundToggle', e.target.checked);
        });
    }
}

// Track extended timer events
function trackExtendedTimerEvents() {
    if (!window.timer) return;
    
    const originalStart = window.timer.start;
    window.timer.start = function() {
        const result = originalStart.call(this);
        
        // Override the interval to track extended timer start
        const originalInterval = this.interval;
        clearInterval(this.interval);
        
        this.interval = setInterval(() => {
            this.state.timeRemaining--;
            this.updateDisplay();
            
            if (!this.state.isExtendedTime && this.state.timeRemaining <= 0) {
                // Main timer reached zero
                if (this.settings.timer1After && this.state.sessionType === 'work') {
                    trackAnalytics('trackExtendedTimerStart', this.settings.timer1AfterMins);
                    
                    // Enter extended time mode
                    this.state.isExtendedTime = true;
                    this.state.timeRemaining = -(this.settings.timer1AfterMins * 60);
                    
                    // Play completion sound for main timer
                    if (window.audioManager) {
                        window.audioManager.playSessionComplete();
                    }
                    
                    // Add pulse animation
                    const timerContent = document.querySelector('.timer-content');
                    timerContent.classList.add('pulse');
                    setTimeout(() => timerContent.classList.remove('pulse'), 500);
                    
                    this.updateDisplay();
                    // Update button states through app
                    if (window.app) {
                        window.app.updateButtonStates();
                    }
                } else {
                    // Complete session normally
                    this.completeSession();
                }
            } else if (this.state.isExtendedTime && this.state.timeRemaining >= 0) {
                // Extended timer finished
                this.triggerAfterNotification();
                this.finalizeSession();
            }
        }, 1000);
        
        return result;
    };
}

// Track user session start/end
function trackUserSession() {
    let sessionStartTime = Date.now();
    
    // Track session start
    trackAnalytics('trackUserSessionStart');
    
    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
        trackAnalytics('trackUserSessionEnd', sessionDuration);
    });
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
            trackAnalytics('trackUserSessionEnd', sessionDuration);
        } else {
            sessionStartTime = Date.now();
            trackAnalytics('trackUserSessionStart');
        }
    });
}

// Initialize analytics integration
function initializeAnalyticsIntegration() {
    // Wait for all components to be loaded
    setTimeout(() => {
        enhanceAppWithAnalytics();
        enhanceTimerWithAnalytics();
        enhanceKeyboardShortcuts();
        enhanceSoundToggle();
        trackExtendedTimerEvents();
        trackUserSession();
        
        console.log('Analytics integration initialized');
    }, 1000);
}

// Start integration when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalyticsIntegration);
} else {
    initializeAnalyticsIntegration();
} 