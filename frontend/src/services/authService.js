import {
  auth,
  googleProvider,
  db
} from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

/**
 * Register user with Email, Password and extended profile
 */
export const registerUser = async (name, email, contact, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update Auth Profile Display Name
  await updateProfile(user, {
    displayName: name
  });

  // Create Firestore User Document
  const userDocRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    name: name || user.displayName || "User",
    email: user.email,
    contact: contact || "",
    role: "user",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(userDocRef, userData);
  } catch (err) {
    console.warn("Firestore user creation fallback (offline/rules):", err.message);
  }

  return { user, profile: userData };
};

/**
 * Log in user with Email and Password
 */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const profile = await getUserProfile(user.uid);
  return { user, profile };
};

/**
 * Sign in or Sign up with Google OAuth
 */
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if profile exists, otherwise create it
  const userDocRef = doc(db, "users", user.uid);
  let profile = await getUserProfile(user.uid);

  if (!profile) {
    profile = {
      uid: user.uid,
      name: user.displayName || "Google User",
      email: user.email,
      photoURL: user.photoURL || "",
      contact: user.phoneNumber || "",
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    try {
      await setDoc(userDocRef, profile);
    } catch (err) {
      console.warn("Firestore profile creation fallback:", err.message);
    }
  }

  return { user, profile };
};

/**
 * Retrieve User Profile from Firestore
 */
export const getUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.warn("Could not fetch user profile from Firestore:", err.message);
  }
  return null;
};

/**
 * Send Password Reset Email
 */
export const resetUserPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

/**
 * Log Out Current User
 */
export const logoutUser = async () => {
  return await signOut(auth);
};
