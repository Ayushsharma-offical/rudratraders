// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxS1C3p_lDUhMemirmau3_bKRJojm0HCE",
  authDomain: "rudra-traders-dc4b2.firebaseapp.com",
  projectId: "rudra-traders-dc4b2",
  storageBucket: "rudra-traders-dc4b2.firebasestorage.app",
  messagingSenderId: "889317845633",
  appId: "1:889317845633:web:5f81f2bf14a0f60647bb80",
  measurementId: "G-2NW9K4FG7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const provider = new GoogleAuthProvider();
export { app, analytics, db, auth, storage, provider };
