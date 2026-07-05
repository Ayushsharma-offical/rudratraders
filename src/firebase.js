// Firebase Configuration - Using Realtime Database + Phone Auth
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, setPersistence, browserLocalPersistence, RecaptchaVerifier } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxS1C3p_lDUhMemirmau3_bKRJojm0HCE",
  authDomain: "rudra-traders-dc4b2.firebaseapp.com",
  projectId: "rudra-traders-dc4b2",
  storageBucket: "rudra-traders-dc4b2.firebasestorage.app",
  messagingSenderId: "889317845633",
  appId: "1:889317845633:web:5f81f2bf14a0f60647bb80",
  measurementId: "G-2NW9K4FG7N",
  databaseURL: "https://rudra-traders-dc4b2-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const rtdb = getDatabase(app);
const auth = getAuth(app);
// Use localStorage instead of sessionStorage so auth survives WebView navigation
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Setup invisible reCAPTCHA for phone auth
const setupRecaptcha = (elementId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => { window.recaptchaVerifier = null; }
    });
  }
  return window.recaptchaVerifier;
};

export { app, analytics, rtdb, auth, setupRecaptcha };
