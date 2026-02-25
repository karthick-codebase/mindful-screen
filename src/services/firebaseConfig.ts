// Firebase Configuration - Expo Compatible
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDzBPjb2_1TCeh3qaQLKXECfvXWroTPXUE',
  authDomain: 'mindful-screen.firebaseapp.com',
  projectId: 'mindful-screen',
  storageBucket: 'mindful-screen.firebasestorage.app',
  messagingSenderId: '301756422138',
  appId: '1:301756422138:web:52847c07719d67e4e67643',
  measurementId: 'G-6BSQCTM2KB',
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'asia-south1');

console.log('Firebase services initialized successfully');

// Export Firebase services
export { 
  app, 
  auth, 
  db, 
  storage, 
  functions 
};

export default app;
