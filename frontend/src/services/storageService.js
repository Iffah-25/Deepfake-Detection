import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload media file to Firebase Storage
 * If Firebase Storage is not configured or blocked by rules, falls back to Object URL / Base64.
 */
export const uploadMediaFile = async (userId, file, analysisId) => {
  if (!userId || !file) return null;

  try {
    const storageRef = ref(storage, `users/${userId}/media/${analysisId}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn("Firebase Storage upload skipped/fallback:", error.message);
    // Return a temporary local preview URL
    return URL.createObjectURL(file);
  }
};
