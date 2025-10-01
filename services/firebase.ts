// Firebase v9 modular SDK configuration
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase configuration - replace with your project config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'demo-api-key';

let app: any = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Auto sign-in anonymously when the service is imported
export const initializeAuth = async (): Promise<void> => {
  if (!auth || !isFirebaseConfigured) {
    console.warn('Firebase not configured. Please set up your .env.local file with valid Firebase credentials.');
    return;
  }
  
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
      console.log('Signed in anonymously');
    }
  } catch (error) {
    console.error('Error signing in anonymously:', error);
  }
};

// Export services (may be null if not configured)
export { auth, db, functions };

// Call initialization only if Firebase is configured
if (isFirebaseConfigured) {
  initializeAuth();
}
