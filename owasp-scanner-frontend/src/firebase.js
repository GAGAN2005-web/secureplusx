import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyAW3A9PgLqblYsddauybqBYfAOzeWBCzng",
  authDomain: "owasp-scanner-dev.firebaseapp.com",
  projectId: "owasp-scanner-dev",
  storageBucket: "owasp-scanner-dev.firebasestorage.app",
  messagingSenderId: "509579020661",
  appId: "1:509579020661:web:8bda201b2636fbdc91eb3c",
  measurementId: "G-R6QZEXWBQ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;