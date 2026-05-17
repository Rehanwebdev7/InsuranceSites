import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const uploadLottieJson = async (file, fileName) => {
  if (!storage) throw new Error('Firebase Storage not configured');

  const finalName = fileName || file.name || `lottie_${Date.now()}.json`;
  const storagePath = `lottie/${Date.now()}_${finalName}`;
  const fileRef = ref(storage, storagePath);

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return { url, storagePath };
};

export const deleteLottieJson = async (storagePath) => {
  if (!storage || !storagePath) return;

  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.warn('Failed to delete Lottie file from Storage:', error);
  }
};
