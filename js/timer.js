class PomodoroTimer {
    constructor() {
        this.settings = {
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            sessionsUntilLongBreak: 4,
            timer1Before: true,
            timer1After: false,
            timer1BeforeMins: 5,
            timer1AfterMins: 5
        };
        
        this.state = {
            currentSession: 1,
            sessionType: 'work', // 'work', 'shortBreak', 'longBreak'
            timeRemaining: this.settings.workDuration * 60,
            isRunning: false,
            completedSessions: 0,
            isExtendedTime: false // Track if we're in the "after timer ends" period
        };
        
        this.interval = null;
        this.progressCircle = document.querySelector('.progress-ring__circle');
        this.progressRadius = 130;
        this.progressCircumference = 2 * Math.PI * this.progressRadius;
        this.notificationTimers = new Set(); // Track active notification timers
        
        this.initializeProgress();
        this.loadSettings();
    }
    
    initializeProgress() {
        this.progressCircle.style.strokeDasharray = this.progressCircumference;
        this.progressCircle.style.strokeDashoffset = this.progressCircumference;
    }
    
    updateProgress() {
        const totalTime = this.getCurrentSessionDuration() * 60;
        
        if (this.state.isExtendedTime) {
            // During extended time (after timer ends), show progress for the "after" period
            const extendedTime = this.settings.timer1AfterMins * 60;
            const progress = (extendedTime + this.state.timeRemaining) / extendedTime;
            const offset = this.progressCircumference * (1 - progress);
            this.progressCircle.style.strokeDashoffset = offset;
            // Change color to indicate extended time
            this.progressCircle.style.stroke = '#ffa726'; // Orange color for extended time
        } else {
            // Normal timer progress
            const progress = (totalTime - this.state.timeRemaining) / totalTime;
            const offset = this.progressCircumference * (1 - progress);
            this.progressCircle.style.strokeDashoffset = offset;
            this.progressCircle.style.stroke = 'var(--primary-color)';
        }
    }
    
    getCurrentSessionDuration() {
        switch (this.state.sessionType) {
            case 'work':
                return this.settings.workDuration;
            case 'shortBreak':
                return this.settings.shortBreakDuration;
            case 'longBreak':
                return this.settings.longBreakDuration;
            default:
                return this.settings.workDuration;
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        const timeDisplay = document.getElementById('timeDisplay');
        const sessionType = document.getElementById('sessionType');
        const sessionCount = document.getElementById('sessionCount');
        
        if (this.state.isExtendedTime) {
            // Show positive time during extended period with "+" prefix
            const positiveTime = Math.abs(this.state.timeRemaining);
            timeDisplay.textContent = '+' + this.formatTime(positiveTime);
            timeDisplay.style.color = '#ffa726'; // Orange color for extended time
        } else {
            timeDisplay.textContent = this.formatTime(this.state.timeRemaining);
            timeDisplay.style.color = 'var(--primary-color)';
        }
        
        sessionCount.textContent = this.state.currentSession;
        
        // Hide session type display
        sessionType.style.display = 'none';
        
        // Update theme colors based on session type
        this.updateThemeColors();
        this.updateProgress();
    }
    
    updateThemeColors() {
        const root = document.documentElement;
        switch (this.state.sessionType) {
            case 'work':
                root.style.setProperty('--primary-color', '#ff6b6b');
                break;
            case 'shortBreak':
                root.style.setProperty('--primary-color', '#4ecdc4');
                break;
            case 'longBreak':
                root.style.setProperty('--primary-color', '#74b9ff');
                break;
        }
    }
    
    start() {
        if (this.state.isRunning) return;
        
        this.state.isRunning = true;
        this.setupNotificationTimers();
        
        this.interval = setInterval(() => {
            this.state.timeRemaining--;
            this.updateDisplay();
            
            if (!this.state.isExtendedTime && this.state.timeRemaining <= 0) {
                // Main timer reached zero
                if (this.settings.timer1After && this.state.sessionType === 'work') {
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
        
        this.updatePlayPauseButton();
    }
    
    setupNotificationTimers() {
        this.clearNotificationTimers();
        
        const currentTime = this.state.timeRemaining;
        
        // Timer 1 "before" notification
        if (this.settings.timer1Before && currentTime > this.settings.timer1BeforeMins * 60) {
            const timerId = setTimeout(() => {
                this.showCustomNotification('Work Timer', `${this.settings.timer1BeforeMins} minutes remaining`);
                if (window.audioManager) {
                    window.audioManager.playSessionComplete();
                }
            }, (currentTime - (this.settings.timer1BeforeMins * 60)) * 1000);
            this.notificationTimers.add(timerId);
        }
        
        // Note: "after timer ends" notification is now handled by extended timer logic
    }
    
    clearNotificationTimers() {
        this.notificationTimers.forEach(timerId => clearTimeout(timerId));
        this.notificationTimers.clear();
    }
    
    showCustomNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>'
            });
        }
    }
    
    pause() {
        if (!this.state.isRunning) return;
        
        this.state.isRunning = false;
        clearInterval(this.interval);
        this.clearNotificationTimers();
        this.updatePlayPauseButton();
    }
    
    reset() {
        this.pause();
        this.clearNotificationTimers();
        this.state.isExtendedTime = false;
        this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
        this.updateDisplay();
        this.updatePlayPauseButton();
    }
    
    triggerAfterNotification() {
        // Play the "after timer ends" notification
        if (window.audioManager) {
            window.audioManager.playSessionComplete();
        }
        
        this.showCustomNotification('Work Timer', `${this.settings.timer1AfterMins} minutes have passed since timer completion`);
        
        // Add pulse animation
        const timerContent = document.querySelector('.timer-content');
        timerContent.classList.add('pulse');
        setTimeout(() => timerContent.classList.remove('pulse'), 500);
    }
    
    finalizeSession() {
        this.pause();
        this.state.isExtendedTime = false;
        
        if (this.state.sessionType === 'work') {
            this.state.completedSessions++;
            
            // Determine next session type
            if (this.state.completedSessions % this.settings.sessionsUntilLongBreak === 0) {
                this.state.sessionType = 'longBreak';
            } else {
                this.state.sessionType = 'shortBreak';
            }
        } else {
            // After any break, go back to work
            this.state.sessionType = 'work';
            this.state.currentSession++;
        }
        
        this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
        this.updateDisplay();
        this.updatePlayPauseButton();
        
        // Show notification for next session
        this.showNotification();
    }
    
    completeSession() {
        this.pause();
        
        // Play completion sound
        if (window.audioManager) {
            window.audioManager.playSessionComplete();
        }
        
        // Add pulse animation
        const timerContent = document.querySelector('.timer-content');
        timerContent.classList.add('pulse');
        setTimeout(() => timerContent.classList.remove('pulse'), 500);
        
        if (this.state.sessionType === 'work') {
            this.state.completedSessions++;
            
            // Determine next session type
            if (this.state.completedSessions % this.settings.sessionsUntilLongBreak === 0) {
                this.state.sessionType = 'longBreak';
            } else {
                this.state.sessionType = 'shortBreak';
            }
        } else {
            // After any break, go back to work
            this.state.sessionType = 'work';
            this.state.currentSession++;
        }
        
        this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
        this.updateDisplay();
        this.updatePlayPauseButton();
        
        // Show notification
        this.showNotification();
    }
    
    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const sessionName = this.state.sessionType === 'work' ? 'Focus Session' : 
                               this.state.sessionType === 'shortBreak' ? 'Short Break' : 'Long Break';
            
            new Notification('Pomodoro Timer', {
                body: `${sessionName} is ready to start!`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
            });
        }
    }
    
    updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const btnIcon = playPauseBtn.querySelector('.btn-icon');
        const btnText = playPauseBtn.querySelector('.btn-text');
        
        if (this.state.isRunning) {
            btnIcon.textContent = '⏸️';
            btnText.textContent = 'Pause';
        } else {
            btnIcon.textContent = '▶️';
            btnText.textContent = 'Start';
        }
    }
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        // If we're changing the current session type duration, update time remaining
        if (!this.state.isRunning) {
            this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
            this.updateDisplay();
        }
        
        this.saveSettings();
    }
    
    saveSettings() {
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.state.timeRemaining = this.getCurrentSessionDuration() * 60;
            this.updateDisplay();
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// Initialize timer when DOM is loaded
window.timer = new PomodoroTimer(); 