// Firebase Configuration - Using Realtime Database
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

const provider = new GoogleAuthProvider();
export { app, analytics, rtdb, auth, provider };
