import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

const LOCAL_STORAGE_KEY_PREFIX = "freqguard_analyses_";

/**
 * Save an analysis record for a user
 */
export const saveAnalysisRecord = async (userId, analysisData) => {
  const analysisId = analysisData.id || `analysis-${Date.now()}`;
  const payload = {
    ...analysisData,
    id: analysisId,
    userId,
    createdAt: new Date().toISOString(),
    timestamp: serverTimestamp()
  };

  // 1. Save to local storage cache for ultra-fast and resilient UX
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [payload, ...existing.filter(item => item.id !== analysisId)];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn("Local storage cache save error:", e);
  }

  // 2. Persist to Firestore
  try {
    if (userId && db) {
      const docRef = doc(db, "users", userId, "analyses", analysisId);
      await setDoc(docRef, payload);
    }
  } catch (error) {
    console.warn("Firestore save fallback (using local cache):", error.message);
  }

  return payload;
};

/**
 * Get all analyses for a user
 */
export const getUserAnalyses = async (userId) => {
  if (!userId) return [];

  let firestoreResults = [];

  // Try Firestore first
  try {
    const collRef = collection(db, "users", userId, "analyses");
    const q = query(collRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    
    snap.forEach((docSnap) => {
      firestoreResults.push(docSnap.data());
    });
  } catch (error) {
    console.warn("Firestore fetch fallback to local storage:", error.message);
  }

  // If firestore returned results, update local cache and return
  if (firestoreResults.length > 0) {
    try {
      const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
      localStorage.setItem(key, JSON.stringify(firestoreResults));
    } catch (e) {
      console.warn("Failed to sync cache:", e);
    }
    return firestoreResults;
  }

  // Fallback to local storage
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
    const cached = JSON.parse(localStorage.getItem(key) || "[]");
    return cached;
  } catch (e) {
    return [];
  }
};

/**
 * Get a single analysis record by ID
 */
export const getAnalysisById = async (userId, analysisId) => {
  // Check local cache
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
    const cached = JSON.parse(localStorage.getItem(key) || "[]");
    const found = cached.find((item) => item.id === analysisId);
    if (found) return found;
  } catch (e) {
    console.warn(e);
  }

  // Try Firestore
  try {
    if (userId) {
      const docRef = doc(db, "users", userId, "analyses", analysisId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data();
      }
    }
  } catch (err) {
    console.warn("Firestore single item fetch error:", err.message);
  }

  return null;
};

/**
 * Delete an analysis record
 */
export const deleteAnalysisRecord = async (userId, analysisId) => {
  // 1. Delete from local cache
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
    const cached = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = cached.filter((item) => item.id !== analysisId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (e) {
    console.warn(e);
  }

  // 2. Delete from Firestore
  try {
    if (userId) {
      const docRef = doc(db, "users", userId, "analyses", analysisId);
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.warn("Firestore delete fallback:", err.message);
  }

  return true;
};
