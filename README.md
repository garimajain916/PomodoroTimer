# 🍅 Pomodoro Timer

A beautiful, minimalistic Pomodoro timer to boost your productivity and maintain focus.

## ✨ Features

- **Clean & Minimalistic Design** - Distraction-free interface
- **Customizable Timer** - Adjust work and break intervals
- **Visual Progress** - Elegant circular progress indicator
- **Audio Notifications** - Gentle sounds for session transitions
- **Session Tracking** - Keep track of completed pomodoros
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Mode** - Switch between themes for comfort
- **Analytics Integration** - Firebase Analytics for usage insights and optimization

## 🚀 Demo

[Live Demo](https://your-pomodoro-timer.vercel.app) <!-- Add your deployed link here -->

## 📱 Screenshots

<!-- Add screenshots here -->
```
Work Session                    Break Time
┌─────────────────┐            ┌─────────────────┐
│     🍅 25:00    │            │     ☕ 05:00    │
│  ●●●●●●●●○○○○   │            │  ●●○○○○○○○○○○   │
│                 │            │                 │
│     [PAUSE]     │            │    [SKIP]       │
└─────────────────┘            └─────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Audio**: Web Audio API
- **Storage**: localStorage for preferences
- **Analytics**: Firebase Analytics (Google Analytics 4)
- **Build**: Vanilla JS (no framework dependencies)
- **Deployment**: Vercel/Netlify

## 📋 Requirements

### System Requirements
- Modern web browser (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- Audio support for notifications

### Development Requirements
- Node.js 16+ (for development server)
- npm or yarn
- Git

## 🚦 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PomodoroTimer.git
cd PomodoroTimer
```

2. Install dependencies (if using a build process):
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or simply open index.html in your browser
```

4. Open your browser and navigate to `http://localhost:3000`

### Usage

1. **Start a Session**: Click the play button to begin a 25-minute focus session
2. **Pause/Resume**: Use the pause button to take breaks as needed
3. **Customize**: Click settings to adjust work/break durations
4. **Track Progress**: View your completed pomodoros in the session counter

## 📁 Project Structure

```
PomodoroTimer/
├── index.html              # Main HTML file
├── css/
│   ├── style.css           # Main styles
│   └── themes.css          # Theme variables
├── js/
│   ├── app.js              # Main application logic
│   ├── timer.js            # Timer functionality
│   ├── audio.js            # Audio notifications
│   ├── analytics.js        # Firebase Analytics manager
│   └── analytics-integration.js # Analytics event tracking
├── assets/
│   ├── sounds/             # Notification sounds
│   └── icons/              # App icons
├── firebase-setup.md       # Firebase Analytics setup guide
├── README.md
└── package.json            # Dependencies (optional)
```

## 🎨 Customization

### Themes
The app uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --background-color: #f8f9fa;
  --text-color: #2c3e50;
}
```

### Adding New Sounds
Place audio files in `assets/sounds/` and update the audio configuration in `js/audio.js`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique by Francesco Cirillo
- Icons from [Feather Icons](https://feathericons.com/)
- Sound effects from [Freesound](https://freesound.org/)

## 📧 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 📊 Analytics

This app includes Firebase Analytics to track usage patterns and improve user experience:

### Tracked Events
- Timer interactions (start, pause, reset, complete)
- Settings changes and preferences
- Session completions and productivity metrics
- User engagement and feature usage
- Performance metrics

### Privacy
- No personal data is collected
- All analytics data is anonymized
- GDPR and privacy regulation compliant
- Users can opt-out of analytics

### Setup
To configure Firebase Analytics for your deployment, see the [Firebase Setup Guide](firebase-setup.md).

## ⚙️ Configuration

The timer supports the following customizations:

- **Work Duration**: 15-60 minutes (default: 25 minutes)
- **Short Break**: 3-15 minutes (default: 5 minutes)
- **Long Break**: 15-45 minutes (default: 15 minutes)
- **Sessions Until Long Break**: 2-8 sessions (default: 4 sessions)
- **Audio Notifications**: On/Off toggle
- **Theme**: Light/Dark mode

---

**Happy focusing! 🍅** 