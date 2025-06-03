class AnalyticsManager {
    constructor() {
        this.firebaseConfig = {  
            apiKey: "AIzaSyBj24Y-QqSarWsfU5hdmDTEGsxW3gNEePQ",
            authDomain: "pomodoro-timer-analytics.firebaseapp.com",
            projectId: "pomodoro-timer-analytics",
            storageBucket: "pomodoro-timer-analytics.firebasestorage.app",
            messagingSenderId: "483941770214",
            appId: "1:483941770214:web:ad53efd6ebe4141e3fec27",
            measurementId: "G-N3V3H63K7L"
        };
        
        this.isInitialized = false;
        this.initializeFirebase();
    }
    
    initializeFirebase() {
        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                console.warn('Firebase SDK not loaded. Analytics disabled.');
                return;
            }
            
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(this.firebaseConfig);
            }
            
            // Initialize Analytics
            if (firebase.analytics) {
                this.analytics = firebase.analytics();
                this.isInitialized = true;
                console.log('Firebase Analytics initialized successfully');
                
                // Track page view
                this.trackPageView();
            } else {
                console.warn('Firebase Analytics not available');
            }
        } catch (error) {
            console.error('Failed to initialize Firebase Analytics:', error);
        }
    }
    
    // Helper method to safely log events
    logEvent(eventName, eventParams = {}) {
        if (!this.isInitialized) {
            console.log(`Analytics not initialized. Would track: ${eventName}`, eventParams);
            return;
        }
        
        try {
            this.analytics.logEvent(eventName, eventParams);
            console.log(`Analytics event logged: ${eventName}`, eventParams);
        } catch (error) {
            console.error('Failed to log analytics event:', error);
        }
    }
    
    // Track page view
    trackPageView() {
        this.logEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Timer Events
    trackTimerStart(sessionType = 'work', duration = 25) {
        this.logEvent('timer_start', {
            session_type: sessionType,
            duration_minutes: duration,
            timestamp: new Date().toISOString()
        });
    }
    
    trackTimerPause(sessionType = 'work', timeRemaining = 0) {
        this.logEvent('timer_pause', {
            session_type: sessionType,
            time_remaining_seconds: timeRemaining,
            timestamp: new Date().toISOString()
        });
    }
    
    trackTimerReset(sessionType = 'work', timeRemaining = 0) {
        this.logEvent('timer_reset', {
            session_type: sessionType,
            time_remaining_seconds: timeRemaining,
            timestamp: new Date().toISOString()
        });
    }
    
    trackTimerComplete(sessionType = 'work', duration = 25) {
        this.logEvent('timer_complete', {
            session_type: sessionType,
            duration_minutes: duration,
            timestamp: new Date().toISOString()
        });
    }
    
    trackSessionComplete(sessionNumber = 1, totalSessions = 0) {
        this.logEvent('session_complete', {
            session_number: sessionNumber,
            total_completed_sessions: totalSessions,
            timestamp: new Date().toISOString()
        });
    }
    
    // Settings Events
    trackSettingsOpen() {
        this.logEvent('settings_open', {
            timestamp: new Date().toISOString()
        });
    }
    
    trackSettingsChange(settingName, oldValue, newValue) {
        this.logEvent('settings_change', {
            setting_name: settingName,
            old_value: oldValue,
            new_value: newValue,
            timestamp: new Date().toISOString()
        });
    }
    
    trackWorkDurationChange(oldDuration, newDuration) {
        this.trackSettingsChange('work_duration', oldDuration, newDuration);
    }
    
    trackSoundToggle(isEnabled) {
        this.logEvent('sound_toggle', {
            sound_enabled: isEnabled,
            timestamp: new Date().toISOString()
        });
    }
    
    trackSoundChange(soundType) {
        this.logEvent('sound_change', {
            sound_type: soundType,
            timestamp: new Date().toISOString()
        });
    }
    
    trackNotificationSettingChange(settingType, isEnabled, minutes = null) {
        this.logEvent('notification_setting_change', {
            setting_type: settingType, // 'before' or 'after'
            enabled: isEnabled,
            minutes: minutes,
            timestamp: new Date().toISOString()
        });
    }
    
    // User Engagement Events
    trackKeyboardShortcut(shortcut) {
        this.logEvent('keyboard_shortcut_used', {
            shortcut: shortcut, // 'space', 'r', 'escape'
            timestamp: new Date().toISOString()
        });
    }
    
    trackNotificationPermission(status) {
        this.logEvent('notification_permission', {
            permission_status: status, // 'granted', 'denied', 'default'
            timestamp: new Date().toISOString()
        });
    }
    
    trackSoundPreview(soundType) {
        this.logEvent('sound_preview', {
            sound_type: soundType,
            timestamp: new Date().toISOString()
        });
    }
    
    // Extended Timer Events (unique to this app)
    trackExtendedTimerStart(afterMinutes) {
        this.logEvent('extended_timer_start', {
            after_minutes: afterMinutes,
            timestamp: new Date().toISOString()
        });
    }
    
    trackExtendedTimerComplete(afterMinutes) {
        this.logEvent('extended_timer_complete', {
            after_minutes: afterMinutes,
            timestamp: new Date().toISOString()
        });
    }
    
    // User Behavior Analytics
    trackUserSessionStart() {
        this.logEvent('user_session_start', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
    }
    
    trackUserSessionEnd(sessionDuration) {
        this.logEvent('user_session_end', {
            session_duration_seconds: sessionDuration,
            timestamp: new Date().toISOString()
        });
    }
    
    // Error Tracking
    trackError(errorType, errorMessage, errorStack = null) {
        this.logEvent('app_error', {
            error_type: errorType,
            error_message: errorMessage,
            error_stack: errorStack,
            timestamp: new Date().toISOString()
        });
    }
    
    // Performance Tracking
    trackPerformanceMetric(metricName, value, unit = 'ms') {
        this.logEvent('performance_metric', {
            metric_name: metricName,
            value: value,
            unit: unit,
            timestamp: new Date().toISOString()
        });
    }
}

// Make AnalyticsManager available globally
window.AnalyticsManager = AnalyticsManager; 