import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is complete
const isFirebaseConfigured: boolean = 
  !!(firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId);

let app: any = null;
let db: any = null;
let auth: any = null;
let messaging: any = null;

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase (avoid duplicate initialization)
    const existingApps = getApps();
    if (existingApps.length === 0) {
      app = initializeApp(firebaseConfig);
      
      // Initialize services
      db = getFirestore(app);
      auth = getAuth(app);
      
      // Initialize messaging (only in browser with support)
      if (typeof window !== "undefined") {
        isSupported().then((supported) => {
          if (supported) {
            messaging = getMessaging(app);
          }
        });
      }

      console.log("✅ Firebase initialized successfully");
    } else {
      app = existingApps[0];
      db = getFirestore(app);
      auth = getAuth(app);
    }
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
  }
} else {
  console.warn(
    "⚠️ Firebase not configured. Running in DEMO MODE.",
    "Add credentials to .env.local to enable live features."
  );
}

export { app, db, auth, messaging, isFirebaseConfigured };
