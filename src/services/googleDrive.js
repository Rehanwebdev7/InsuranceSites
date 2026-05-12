/**
 * Google Drive operations via the local Express backend.
 * Backend lives in `backend/` and runs at VITE_DRIVE_BACKEND_URL (default http://localhost:8001).
 * Same exported API as before — admin pages don't need to change.
 */
import axios from 'axios';

const BASE = import.meta.env.VITE_DRIVE_BACKEND_URL || 'http://localhost:8001';

const driveAxios = axios.create({
  baseURL: BASE,
  timeout: 60000,
});

/**
 * Upload an image to Google Drive via the backend.
 * Returns the Drive file ID.
 */
export const uploadImage = async (file, fileName) => {
  const form = new FormData();
  const finalName = fileName || (file && file.name) || `image_${Date.now()}.jpg`;
  form.append('file', file, finalName);
  form.append('fileName', finalName);

  const { data } = await driveAxios.post('/api/drive/upload', form);
  if (!data?.ok || !data?.id) {
    throw new Error(data?.error || 'Drive upload failed');
  }
  return data.id;
};

/**
 * Delete an image from Google Drive via the backend.
 */
export const deleteImage = async (fileId) => {
  if (!fileId) return true;
  const { data } = await driveAxios.delete(`/api/drive/files/${encodeURIComponent(fileId)}`);
  return data?.ok === true;
};

/**
 * Return the publicly-viewable image URL for a Drive file ID.
 */
export const getImageUrl = (fileId) => {
  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : '';
};
