
import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

/**
 * Upload an analysis image to Firebase Storage.
 *
 * Returns a Firebase download URL when upload succeeds.
 * Returns null when upload fails, allowing the caller
 * to use a local preview URL instead.
 */
export const uploadMediaFile = async (userId, file, analysisId) => {
  if (!userId || !file) {
    return null;
  }

  try {
    if (!storage) {
      throw new Error("Firebase Storage is not configured.");
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const storageRef = ref(
      storage,
      `users/${userId}/media/${analysisId}_${safeFileName}`
    );

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.info("Media uploaded to Firebase Storage.");
    return downloadUrl;
  } catch (error) {
    console.error("Firebase Storage upload failed:", error);
    return null;
  }
};
