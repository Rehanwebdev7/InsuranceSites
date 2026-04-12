/**
 * Google Drive operations via Firebase Cloud Functions.
 * Uses service account on the backend — no OAuth, no refresh tokens.
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase/firebase';

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Upload an image to Google Drive via Cloud Function.
 * Returns the Drive file ID.
 */
export const uploadImage = async (file, fileName) => {
  if (!functions) throw new Error('Firebase not configured');

  const base64Data = await blobToBase64(file);
  const uploadFn = httpsCallable(functions, 'uploadToDrive');
  const result = await uploadFn({
    imageData: base64Data,
    fileName: fileName || `image_${Date.now()}.jpg`,
    mimeType: file.type || 'image/jpeg',
  });

  return result.data.fileId;
};

/**
 * Delete an image from Google Drive via Cloud Function.
 */
export const deleteImage = async (fileId) => {
  if (!functions) throw new Error('Firebase not configured');

  const deleteFn = httpsCallable(functions, 'deleteFromDrive');
  await deleteFn({ fileId });
  return true;
};

/**
 * Return the publicly-viewable image URL for a Drive file ID.
 */
export const getImageUrl = (fileId) => {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
};
