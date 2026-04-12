import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if Firebase is properly configured
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app = null;
let db = null;
let storage = null;
let auth = null;
let functions = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    functions = getFunctions(app);
    // Connect to emulator only if explicitly enabled via env var
    // Set VITE_USE_EMULATOR=true in .env to use local emulator
    if (import.meta.env.VITE_USE_EMULATOR === 'true') {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    console.warn('The app will continue using localStorage fallback.');
  }
} else {
  console.warn(
    'Firebase environment variables are not set. ' +
    'The app will use localStorage as a fallback. ' +
    'To enable Firebase, set VITE_FIREBASE_* variables in your .env file.'
  );
}

export { db, storage, auth, functions, isFirebaseConfigured };
export default app;
