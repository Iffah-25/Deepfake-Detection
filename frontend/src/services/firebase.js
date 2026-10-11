import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

// Web App Firebase configuration using env vars with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAFS9PexUDMlRwUL4EOVqPUCqP2r82bAgg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mini-project-8bdfa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mini-project-8bdfa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mini-project-8bdfa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "861717381431",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:861717381431:web:5dae08628f40a1921f9ab2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZQSNZRL8Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
