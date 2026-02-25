import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MINDFUL SCREEN',
  slug: 'mindful-screen',
  scheme: 'mindfulscreen',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android', 'web'],
  // icon: './assets/icon.png',
  plugins: [
    'expo-web-browser'
  ],
  android: {
    package: 'com.mindfulscreen.app',
    versionCode: 1,
    // adaptiveIcon: {
    //   foregroundImage: './assets/adaptive-icon.png',
    //   backgroundColor: '#ffffff',
    // },
    permissions: [
      'android.permission.INTERNET',
      'android.permission.WAKE_LOCK',
      'android.permission.VIBRATE',
    ],
  },
  ios: {
    bundleIdentifier: 'com.mindfulscreen.app',
    buildNumber: '1.0.0',
  },
  // web: {
  //   favicon: './assets/favicon.png',
  // },
  extra: {
    firebase: {
      apiKey: 'AIzaSyDzBPjb2_1TCeh3qaQLKXECfvXWroTPXUE',
      authDomain: 'mindful-screen.firebaseapp.com',
      projectId: 'mindful-screen',
      storageBucket: 'mindful-screen.firebasestorage.app',
      messagingSenderId: '301756422138',
      appId: '1:301756422138:web:52847c07719d67e4e67643',
      measurementId: 'G-6BSQCTM2KB',
    },
    expoGo: true,
    eas: {
      projectId: "mindful-screen"
    }
  },
  // splash: {
  //   image: './assets/splash.png',
  //   backgroundColor: '#ffffff',
  //   resizeMode: 'contain',
  // },
  updates: { fallbackToCacheTimeout: 0 },
  assetBundlePatterns: ['**/*'],
});
