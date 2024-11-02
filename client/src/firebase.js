// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import pentru Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn070fP1Jh2dJMKF5O3i9YXzALDWS-R2E",
  authDomain: "citybadgedb.firebaseapp.com",
  projectId: "citybadgedb",
  storageBucket: "citybadgedb.firebasestorage.app",
  messagingSenderId: "812137945133",
  appId: "1:812137945133:web:a8154952d0bd7b124fc0a4",
  measurementId: "G-MLG3G342MG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Inițializarea Firestore

export { db, analytics }; // Exportă Firestore pentru utilizare în alte fișiere
