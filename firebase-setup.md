# Firebase Analytics Setup Guide

## Overview
This guide will help you set up Firebase Analytics for your Pomodoro Timer to track user behavior, usage patterns, and app performance.

## Prerequisites
- A Google account
- Access to the Firebase Console
- Your Pomodoro Timer app hosted on a domain (for production)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "Pomodoro Timer Analytics")
4. Enable Google Analytics for your project (recommended)
5. Configure Google Analytics settings:
   - Choose or create an Analytics account
   - Select your country/region
   - Accept terms and conditions
6. Click "Create project"

## Step 2: Add Web App to Firebase Project

1. In your Firebase project dashboard, click the web icon (`</>`) to add a web app
2. Register your app:
   - App nickname: "Pomodoro Timer Web"
   - Check "Also set up Firebase Hosting" if you want to use Firebase Hosting
3. Click "Register app"

## Step 3: Get Your Firebase Configuration

After registering your app, you'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 4: Configure Your App

1. Open `js/analytics.js` in your Pomodoro Timer project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
this.firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id", 
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-actual-sender-id",
    appId: "your-actual-app-id",
    measurementId: "your-actual-measurement-id"
};
```

## Step 5: Deploy and Test

1. Deploy your updated Pomodoro Timer to your hosting platform
2. Open your app in a browser
3. Check the browser console for the message: "Firebase Analytics initialized successfully"
4. Use the app (start timer, change settings, etc.) to generate test events

## Step 6: Verify Analytics Data

1. Go to your Firebase Console
2. Navigate to Analytics > Events
3. Select "Real-time" to see live events
4. You should see events like:
   - `page_view`
   - `timer_start`
   - `timer_complete` 
   - `settings_open`
   - And more!

## Events Being Tracked

### Timer Events
- `timer_start` - When user starts a timer
- `timer_pause` - When user pauses a timer  
- `timer_reset` - When user resets a timer
- `timer_complete` - When a timer session completes
- `session_complete` - When a work session is completed

### Settings Events
- `settings_open` - When settings panel is opened
- `settings_change` - When any setting is modified
- `work_duration_change` - When work duration is changed
- `notification_setting_change` - When notification settings change
- `sound_toggle` - When sound is enabled/disabled
- `sound_change` - When notification sound is changed
- `sound_preview` - When user previews a sound

### User Engagement Events
- `keyboard_shortcut_used` - When user uses keyboard shortcuts
- `notification_permission` - When notification permission is granted/denied
- `user_session_start` - When user starts using the app
- `user_session_end` - When user stops using the app

### Unique Features
- `extended_timer_start` - When the extended timer starts (after main timer)
- `extended_timer_complete` - When extended timer completes

## Analytics Dashboard

After data collection begins, you can view:

### Real-time Data
- Active users right now
- Events happening in real-time
- Geographic data

### Engagement Reports
- User engagement metrics
- Session duration
- Pages per session
- Bounce rate

### Custom Events Analysis
- Timer usage patterns
- Feature adoption rates
- Settings preferences
- User behavior flows

## Privacy Considerations

### Data Collection
The analytics implementation collects:
- User interactions with timer controls
- Settings preferences (but not personal data)
- Session duration and frequency
- Device and browser information
- Geographic location (country/region level)

### Data NOT Collected
- Personal identifying information
- Specific timer content or tasks
- Keyboard inputs (except shortcuts)
- Sensitive user data

### GDPR Compliance
Consider adding:
- Cookie consent banner
- Privacy policy updates
- Data processing notifications
- User opt-out mechanisms

## Troubleshooting

### Analytics Not Working
1. Check browser console for error messages
2. Verify Firebase configuration is correct
3. Ensure your domain is added to Firebase project settings
4. Check that Firebase Analytics is enabled in project settings

### No Events Showing
1. Wait 24-48 hours for data to appear in reports
2. Use Real-time reports for immediate verification
3. Check that events are being logged in browser console
4. Verify gtag is properly loaded

### Debug Mode
To enable debug mode for testing:

```javascript
// Add this to your analytics initialization
gtag('config', 'your-measurement-id', {
  debug_mode: true
});
```

## Advanced Configuration

### Custom Parameters
You can add custom parameters to events for deeper insights:

```javascript
// Example: Track timer duration preferences
analytics.logEvent('settings_change', {
  setting_name: 'work_duration',
  old_value: 25,
  new_value: 30,
  user_experience_level: 'intermediate'
});
```

### User Properties
Set user properties for segmentation:

```javascript
// Example: Track user preferences
analytics.setUserProperties({
  preferred_session_length: '25_minutes',
  notification_preference: 'sound_enabled',
  theme_preference: 'dark_mode'
});
```

## Performance Impact

The analytics implementation is designed to be lightweight:
- Lazy loading of Firebase SDK
- Asynchronous event tracking
- Error handling to prevent app crashes
- Minimal performance overhead

## Next Steps

1. Set up Firebase Analytics using this guide
2. Deploy your updated app
3. Monitor analytics data for insights
4. Consider adding more custom events for specific insights
5. Set up automated reports for regular monitoring

## Support

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics/web/start)
- [Google Analytics Help Center](https://support.google.com/analytics)
- [Firebase Support](https://firebase.google.com/support) 