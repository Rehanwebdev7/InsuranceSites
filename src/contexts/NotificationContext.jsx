import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/firebase';
import { initializeFCM, onForegroundMessage, isPushNotificationSupported } from '../services/firebase/fcm';
import { FORM_TYPES } from '../utils/constants';
import { toast } from 'react-toastify';

const NotificationContext = createContext(undefined);

const LS_KEY = 'bharat_notification_queue';
const SOUND_PREF_KEY = 'bharat_notification_sound';

// ========== Notification Sound (Web Audio API) — LOUD ALARM ==========
const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    const playTone = (time, freq, dur, vol, type = 'square') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, time);
      gain.gain.setValueAtTime(vol, time + dur * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.start(time);
      osc.stop(time + dur);
    };

    // Round 1: 3 rapid ascending beeps
    playTone(now + 0.0, 800, 0.12, 0.7);
    playTone(now + 0.15, 1000, 0.12, 0.7);
    playTone(now + 0.30, 1200, 0.18, 0.8);

    // Round 2: repeat
    playTone(now + 0.65, 800, 0.12, 0.7);
    playTone(now + 0.80, 1000, 0.12, 0.7);
    playTone(now + 0.95, 1200, 0.18, 0.8);

    // Round 3: final emphasis — higher pitch, longer hold
    playTone(now + 1.30, 800, 0.12, 0.7);
    playTone(now + 1.45, 1000, 0.12, 0.7);
    playTone(now + 1.60, 1400, 0.30, 0.9);

    setTimeout(() => ctx.close(), 2500);
  } catch {
    // AudioContext not available
  }
};

// ========== Relative Time Helper ==========
const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

// ========== Provider ==========
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(SOUND_PREF_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [fcmReady, setFcmReady] = useState(false);
  const isInitialLoad = useRef(true);
  const soundEnabledRef = useRef(soundEnabled);
  // Dedup: track recently notified lead IDs to prevent double notifications
  const recentLeadIds = useRef(new Set());

  // Keep ref in sync (so onSnapshot callback always has latest value)
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Persist notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(notifications.slice(0, 100)));
    } catch { /* storage full */ }
  }, [notifications]);

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem(SOUND_PREF_KEY, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // ========== Initialize Real FCM ==========
  useEffect(() => {
    if (!isPushNotificationSupported()) return;

    const setupFCM = async () => {
      try {
        const token = await initializeFCM();
        if (token) {
          setFcmReady(true);
        }
      } catch (error) {
        console.error('FCM setup failed:', error);
      }
    };

    setupFCM();
  }, []);

  // ========== FCM Foreground Message Listener ==========
  useEffect(() => {
    if (!fcmReady) return;

    const unsubscribe = onForegroundMessage((message) => {
      const { data } = message;
      const fullName = data?.fullName || message.title || 'New Lead';
      const serviceTitle = data?.serviceTitle || '';
      const mobile = data?.mobile || '';
      const leadId = data?.leadId || '';

      // Deduplicate: skip if already notified via onSnapshot
      if (leadId && recentLeadIds.current.has(leadId)) return;
      if (leadId) {
        recentLeadIds.current.add(leadId);
        setTimeout(() => recentLeadIds.current.delete(leadId), 15000);
      }

      const notification = {
        id: `fcm_${leadId}_${Date.now()}`,
        leadId,
        fullName,
        mobile,
        formType: data?.formType || '',
        serviceTitle,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);

      // Play sound
      if (soundEnabledRef.current) {
        playNotificationSound();
      }

      // Toast
      toast.info(
        `New Lead: ${fullName}${serviceTitle ? ` — ${serviceTitle}` : ''}`,
        { position: 'top-right', autoClose: 6000, closeOnClick: true }
      );
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fcmReady]);

  // ========== Firestore onSnapshot (fallback + real-time UI sync) ==========
  // This ensures leads list updates in real-time even without FCM
  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'leads'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      const newDocs = snapshot.docChanges().filter((change) => change.type === 'added');

      newDocs.forEach((change) => {
        const data = change.doc.data();
        const leadId = change.doc.id;

        // Deduplicate: skip if already notified via FCM
        if (recentLeadIds.current.has(leadId)) return;
        recentLeadIds.current.add(leadId);
        setTimeout(() => recentLeadIds.current.delete(leadId), 15000);

        const fullName = data.personalInfo?.fullName || 'Unknown';
        const mobile = data.personalInfo?.mobile || '';
        const formType = data.formType || '';
        const serviceTitle = data.serviceTitle || FORM_TYPES[formType]?.title || formType;
        const createdAt = data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString();

        const notification = {
          id: `snap_${leadId}_${Date.now()}`,
          leadId,
          fullName,
          mobile,
          formType,
          serviceTitle,
          createdAt,
          read: false,
        };

        setNotifications((prev) => [notification, ...prev]);

        if (soundEnabledRef.current) {
          playNotificationSound();
        }

        toast.info(
          `New Lead: ${fullName} — ${serviceTitle}`,
          { position: 'top-right', autoClose: 5000, closeOnClick: true }
        );
      });
    });

    return () => unsubscribe();
  }, []);

  // ========== Context Methods ==========
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearAll,
      soundEnabled,
      setSoundEnabled,
      fcmReady,
      timeAgo,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, clearAll, soundEnabled, fcmReady]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
