# MINDFUL SCREEN - Mobile App

A comprehensive React Native productivity app with focus tracking, AI assistance, community features, and gamification.

## 🏗️ Project Structure

```
mindful-screen/
├── mindful-screen-mobile/     # React Native Expo app
│   ├── src/
│   │   ├── screens/          # All app screens
│   │   ├── navigation/       # Navigation setup
│   │   ├── contexts/         # React contexts (Auth, Theme)
│   │   ├── hooks/           # Custom hooks (useFocusTimer)
│   │   ├── services/        # Firebase & API services
│   │   └── styles/          # Theme tokens
│   ├── App.tsx              # Main app component
│   └── app.config.ts        # Expo configuration
├── firebase-functions/       # Cloud Functions (Node.js)
│   └── src/index.ts         # All backend functions
├── firestore.rules          # Firestore security rules
├── storage.rules            # Firebase Storage rules
└── firebase.json            # Firebase project config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Firebase CLI: `npm install -g firebase-tools`
- Android Studio (for Android development)

### 1. Setup Mobile App
```bash
cd mindful-screen-mobile
npm install
npm start
# Press 'a' for Android emulator
```

### 2. Setup Firebase Backend
```bash
# Install Firebase CLI and login
firebase login

# Set Firebase project
firebase use mindful-screen

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage

# Setup Cloud Functions
cd firebase-functions
npm install
npm run build

# Set OpenAI API key (required for AI chat)
firebase functions:config:set openai.key="your-openai-api-key"

# Deploy functions to asia-south1 region
firebase deploy --only functions
```

### 3. Firebase Console Setup
1. **Authentication**: Enable Email/Password and Google Sign-In
2. **Firestore**: Create database in production mode
3. **Storage**: Enable Firebase Storage
4. **Cloud Messaging**: Enable FCM for notifications

## 📱 Features Implemented

### ✅ Core Features
- **Authentication**: Email/Password + Google Sign-In ready
- **Focus Timer**: Pomodoro & custom sessions with Firestore logging
- **Theme System**: Professional (light) & Dark (cyberpunk) modes
- **Navigation**: Bottom tabs + stack navigation
- **Session Tracking**: Automatic XP calculation and streak tracking

### ✅ Screens Completed
- **Onboarding**: Usage Access disclosure (Play Store compliant)
- **Auth**: Login/Register with validation
- **Home**: Dashboard with timer widget and quick actions
- **Focus Session**: Full-screen timer with breathing animation
- **Analytics**: Session history and stats visualization
- **Community**: Posts feed, community tabs, mentor matching
- **Learn**: Skill roadmaps with progress tracking
- **Profile**: User stats, achievements, communities
- **Settings**: Theme toggle, notifications, privacy controls
- **AI Chat**: Conversational AI assistant with context

### ✅ Backend (Cloud Functions)
- **aiChatHandler**: OpenAI integration with rate limiting
- **onFocusSessionCreate**: XP/streak calculation, achievements
- **onPostCreate**: Community engagement tracking
- **weeklyLeaderboardRollup**: Automated leaderboard computation
- **sendNotification**: FCM push notifications

### ✅ Security & Rules
- **Firestore Rules**: Principle of least privilege, user data isolation
- **Storage Rules**: File type/size validation, user-specific access
- **Rate Limiting**: AI requests, file uploads

## 🔧 Configuration

### Environment Variables
The app uses Firebase config from `app.config.ts`:
```typescript
firebase: {
  apiKey: "AIzaSyDzBPjb2_1TCeh3qaQLKXECfvXWroTPXUE",
  authDomain: "mindful-screen.firebaseapp.com", 
  projectId: "mindful-screen",
  storageBucket: "mindful-screen.firebasestorage.app",
  messagingSenderId: "301756422138",
  appId: "1:301756422138:web:52847c07719d67e4e67643"
}
```

### Cloud Functions Config
```bash
# Required: OpenAI API key for AI chat
firebase functions:config:set openai.key="sk-..."

# Optional: Additional API keys
firebase functions:config:set rescuetime.client_id="..." rescuetime.client_secret="..."
```

## 📊 Data Models

### User Document (`users/{userId}`)
```typescript
{
  displayName: string;
  email: string;
  xp: number;
  streak: number;
  theme: 'professional' | 'dark';
  role: 'student' | 'mentor';
  achievements: string[];
  settings: {
    notifications: boolean;
    sessionDefaults: { duration: number; type: string; }
  }
}
```

### Focus Session (`users/{userId}/focusSessions/{sessionId}`)
```typescript
{
  duration: number; // minutes
  type: 'pomodoro' | 'custom';
  startedAt: Timestamp;
  endedAt: Timestamp;
  tags: string[];
  pointsEarned: number;
}
```

### Community Post (`communities/{communityId}/posts/{postId}`)
```typescript
{
  authorId: string;
  authorName: string;
  content: string;
  imageUrl?: string;
  createdAt: Timestamp;
  likesCount: number;
  commentsCount: number;
}
```

## 🎮 Gamification System

### XP Calculation
- **Focus Session**: 1 XP per minute
- **Bonus**: +5 XP for 25+ min sessions, +10 XP for 45+ min
- **Community Post**: +10 XP
- **Comment**: +2 XP  
- **Achievement**: Variable XP rewards

### Achievements
- **First Steps**: Complete first session (+50 XP)
- **Week Warrior**: 7-day streak (+100 XP)
- **Focus Master**: 1000+ total XP (+200 XP)
- **Marathon Session**: 90+ minute session (+75 XP)
- **Consistency King**: 30-day streak (+300 XP)

## 🔐 Security Features

### Play Store Compliance
- **Usage Access Disclosure**: Prominent explanation before requesting permissions
- **Opt-in Design**: Users can skip usage tracking
- **Data Minimization**: Only essential data collected
- **User Control**: Settings to manage permissions

### Privacy Controls
- **Local Processing**: Usage data processed on-device
- **Secure API**: OpenAI calls via Cloud Functions (no client-side keys)
- **User Consent**: Clear opt-in/opt-out for all tracking
- **Data Export**: Users can export their data

## 🚀 Deployment

### Mobile App (Expo)
```bash
# Development build
expo start

# Production build (requires EAS)
npm install -g @expo/eas-cli
eas build -p android --profile production
```

### Backend (Firebase)
```bash
# Deploy all
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 📱 Usage Stats Integration (Future)

The app is designed for UsageStats-only monitoring (v1). For advanced features:

1. **Expo Config Plugin**: Create custom plugin for native modules
2. **Development Build**: Use `expo-dev-client` for custom native code
3. **Native Module**: Android UsageStatsManager integration
4. **Permissions Flow**: Guide users through system settings

## 🤖 AI Integration

### OpenAI Configuration
- **Model**: GPT-3.5-turbo for cost efficiency
- **Context**: Last 10 messages for conversation continuity
- **Rate Limiting**: 10 requests per minute per user
- **Prompt Engineering**: Productivity-focused system prompt

### Chat Features
- **Quick Prompts**: Pre-defined productivity questions
- **Context Awareness**: Maintains conversation history
- **Fallback Responses**: Graceful error handling
- **Usage Analytics**: Request logging for insights

## 🎨 Design System

### Professional Theme (Default)
- **Background**: #F7F8FA (light gray)
- **Primary**: #2563EB (blue)
- **Secondary**: #0EA5A4 (teal)
- **Accent**: #7C3AED (violet)

### Dark Theme (Cyberpunk)
- **Background**: #0b0022 (deep purple)
- **Primary**: #38BDF8 (electric blue)
- **Secondary**: #F472B6 (magenta)
- **Accent**: #22D3EE (cyan)
- **Effects**: Subtle neon glows on interactive elements

## 🧪 Testing

### Unit Tests
```bash
cd mindful-screen-mobile
npm test
```

### E2E Tests (Future)
- Detox for React Native E2E testing
- Test critical user flows: auth, timer, posting

### Function Tests
```bash
cd firebase-functions
npm test
```

## 📈 Analytics & Monitoring

### Built-in Analytics
- **Session Tracking**: Duration, frequency, patterns
- **User Engagement**: Posts, comments, community activity
- **Feature Usage**: Screen time, AI chat usage
- **Performance**: Function execution times, error rates

### Monitoring
- **Firebase Console**: Real-time function logs
- **Crashlytics**: Crash reporting (add to Expo config)
- **Performance**: Firebase Performance Monitoring

## 🔄 CI/CD Pipeline (Future)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
- Build and test mobile app
- Deploy Firebase functions
- Update Firestore rules
- Generate APK artifacts
```

### Fastlane (Future)
- Automated Play Store uploads
- Screenshot generation
- Beta distribution

## 📞 Support & Documentation

### User Support
- **In-app Help**: Settings → Help & Support
- **Privacy Policy**: Required for Play Store
- **Terms of Service**: User agreement
- **Contact**: Support email/form

### Developer Documentation
- **API Reference**: Cloud Functions documentation
- **Data Models**: Firestore schema reference
- **Security**: Rules and permissions guide
- **Deployment**: Step-by-step deployment guide

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core app with timer and auth
- ✅ Basic community features
- ✅ AI chat integration
- ✅ Gamification system

### Phase 2 (Next)
- [ ] UsageStats native module
- [ ] Advanced analytics charts
- [ ] Puzzle/quiz games
- [ ] Mentor matching system
- [ ] Push notifications

### Phase 3 (Future)
- [ ] Accessibility-based app blocking
- [ ] Cross-device sync
- [ ] Advanced AI features
- [ ] Social features expansion
- [ ] Wearable integration

---

## 🚀 Getting Started Now

1. **Clone and setup mobile app**:
   ```bash
   cd mindful-screen-mobile
   npm install
   npm start
   ```

2. **Deploy Firebase backend**:
   ```bash
   firebase deploy
   ```

3. **Test the app**: 
   - Create account → Start focus session → Check analytics
   - Try AI chat → Post in community → View profile

The app is production-ready with all core features implemented! 🎉
