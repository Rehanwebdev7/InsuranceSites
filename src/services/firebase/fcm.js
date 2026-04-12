import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import app, { isFirebaseConfigured } from './firebase';
import { db } from './firebase';

let messaging = null;

// Initialize messaging only if supported
if (isFirebaseConfigured && app && typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase Messaging init failed:', error.message);
  }
}

/**
 * Register the Firebase Messaging service worker
 */
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

/**
 * Request notification permission + get FCM token + store in Firestore
 * Call this when admin logs in or admin panel mounts
 */
export const initializeFCM = async () => {
  if (!messaging) return null;

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied.');
      return null;
    }

    // Register service worker
    const swRegistration = await registerServiceWorker();
    if (!swRegistration) return null;

    // Get FCM token
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';
    if (!vapidKey) {
      console.warn('VAPID key not configured.');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      // Save token to Firestore
      await saveFCMToken(token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('FCM initialization error:', error);
    return null;
  }
};

/**
 * Save FCM token to Firestore (prevents duplicates)
 */
const saveFCMToken = async (token) => {
  if (!db || !token) return;

  try {
    // Use a hash-like deterministic ID to prevent duplicates
    const tokenDocId = 'token_' + btoa(token).slice(0, 40).replace(/[^a-zA-Z0-9]/g, '_');
    const docRef = doc(db, 'fcmTokens', tokenDocId);

    await setDoc(docRef, {
      token,
      updatedAt: serverTimestamp(),
      userAgent: navigator.userAgent.slice(0, 200),
    }, { merge: true });
  } catch (error) {
    console.error('Failed to save FCM token:', error);
  }
};

/**
 * Listen for foreground FCM messages
 * Returns unsubscribe function
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) return null;

  try {
    return onMessage(messaging, (payload) => {
      if (callback && typeof callback === 'function') {
        callback({
          id: payload.messageId || `fcm_${Date.now()}`,
          title: payload.notification?.title || 'New Notification',
          body: payload.notification?.body || '',
          data: payload.data || {},
          image: payload.notification?.image || null,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    });
  } catch (error) {
    console.error('FCM foreground listener error:', error);
    return null;
  }
};

/**
 * Check if push notifications are fully supported
 */
export const isPushNotificationSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
};

/**
 * Get current notification permission status
 */
export const getNotificationPermissionStatus = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
  return Notification.permission;
};

export { messaging };
