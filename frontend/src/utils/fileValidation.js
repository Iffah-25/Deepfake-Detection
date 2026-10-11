import {
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB
} from "../config/constants";

export const validateMediaFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No file was selected." };
  }

  const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type) || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
  const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type) || /\.(mp4|mov|webm)$/i.test(file.name);

  if (!isImage && !isVideo) {
    return {
      isValid: false,
      error: "Unsupported file format. Please upload JPG, PNG, WEBP, MP4, MOV, or WEBM."
    };
  }

  const fileSizeMB = file.size / (1024 * 1024);

  if (isImage && fileSizeMB > MAX_IMAGE_SIZE_MB) {
    return {
      isValid: false,
      error: `Image size exceeds the ${MAX_IMAGE_SIZE_MB}MB limit. (Selected: ${fileSizeMB.toFixed(1)}MB)`
    };
  }

  if (isVideo && fileSizeMB > MAX_VIDEO_SIZE_MB) {
    return {
      isValid: false,
      error: `Video size exceeds the ${MAX_VIDEO_SIZE_MB}MB limit. (Selected: ${fileSizeMB.toFixed(1)}MB)`
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: "Selected file is empty (0 bytes). Please upload a valid media file."
    };
  }

  return {
    isValid: true,
    fileType: isVideo ? "video" : "image",
    fileSizeMB
  };
};
