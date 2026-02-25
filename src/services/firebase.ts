// Firebase configuration with error handling - Expo Go Compatible
import AsyncStorage from '@react-native-async-storage/async-storage';

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let functions: any = null;
let isInitializing = false;

const initializeFirebase = async () => {
  if (app) return app;
  
  try {
    const Constants = await import('expo-constants');
    const extra = Constants.default.expoConfig?.extra as any;
    const firebaseConfig = extra?.firebase;

    if (!firebaseConfig) {
      console.warn('Firebase config missing');
      return null;
    }

    console.log('🔥 Initializing Firebase...');
    const { initializeApp, getApps } = await import('firebase/app');
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    
    console.log('✅ Firebase initialized');
    return app;
  } catch (error) {
    console.warn('Firebase init failed:', error);
    return null;
  }
};

const getAuth = async () => {
  if (auth) return auth;
  
  try {
    const firebaseApp = await initializeFirebase();
    if (firebaseApp) {
      const { getAuth: getFirebaseAuth } = await import('firebase/auth');
      auth = getFirebaseAuth(firebaseApp);
      console.log('✅ Auth ready');
      return auth;
    }
  } catch (error) {
    console.warn('Auth failed:', error);
  }
  return null;
};

const getFirestore = async () => {
  if (db) return db;
  
  try {
    const firebaseApp = await initializeFirebase();
    if (firebaseApp) {
      const { getFirestore } = await import('firebase/firestore');
      db = getFirestore(firebaseApp);
      return db;
    }
  } catch (error) {
    console.warn('Firestore failed:', error);
  }
  return null;
};

const getStorage = async () => {
  if (storage) return storage;
  
  try {
    const firebaseApp = await initializeFirebase();
    if (firebaseApp) {
      const { getStorage } = await import('firebase/storage');
      storage = getStorage(firebaseApp);
      return storage;
    }
  } catch (error) {
    console.warn('Storage failed:', error);
  }
  return null;
};

const getFunctions = async () => {
  if (functions) return functions;
  
  try {
    const firebaseApp = await initializeFirebase();
    if (firebaseApp) {
      const { getFunctions } = await import('firebase/functions');
      functions = getFunctions(firebaseApp, 'asia-south1');
      return functions;
    }
  } catch (error) {
    console.warn('Functions failed:', error);
  }
  return null;
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    const app = await initializeFirebase();
    if (app) {
      console.log('✅ Firebase app initialized successfully');
      const authService = await getAuth();
      if (authService) {
        console.log('✅ Firebase Auth service available');
        return { success: true, message: 'Firebase fully operational' };
      } else {
        console.log('❌ Firebase Auth service failed');
        return { success: false, message: 'Auth service unavailable' };
      }
    } else {
      console.log('❌ Firebase app initialization failed');
      return { success: false, message: 'Firebase app unavailable' };
    }
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return { success: false, message: `Connection failed: ${error}` };
  }
};

// Export services
export { getAuth as auth, getFirestore as db, getStorage as storage, getFunctions as functions };
