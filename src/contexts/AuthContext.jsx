import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { auth, db } from '../services/firebase/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';

const USER_DATA_KEY = STORAGE_KEYS.USER_DATA;

/**
 * Firestore me mobile number se admin ka email lookup karta hai
 * admins collection → "adminMobileLookup" doc me mobile→email mapping stored hai
 * Ye doc publicly readable hai (sirf mapping hai, koi sensitive data nahi)
 *
 * Fallback: admins collection me query (requires broader read rules)
 */
const getEmailByMobile = async (mobile) => {
  if (!db) throw new Error('Firebase not configured');

  // Approach: Query admins collection where mobile matches
  // Security rule me unauthenticated read allow hai sirf mobile lookup ke liye
  const q = query(collection(db, 'admins'), where('mobile', '==', mobile));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Invalid mobile number or password.');
  }

  const adminData = snapshot.docs[0].data();
  if (!adminData.email) {
    throw new Error('Account setup incomplete. Contact administrator.');
  }
  return adminData.email;
};

const AuthContext = createContext(undefined);

/**
 * AuthProvider - Provides authentication state and controls via Firebase Auth
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const hydrateUser = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      return null;
    }

    const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));

    if (!adminDoc.exists()) {
      await signOut(auth);
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      return null;
    }

    const adminData = adminDoc.data();

    if (adminData.isActive === false || adminData.isActive === 'false') {
      await signOut(auth);
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      return null;
    }

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      mobile: adminData.mobile || '',
      name: adminData.name || '',
      role: adminData.role || 'admin',
      companyName: adminData.companyName || '',
      avatar: adminData.avatar || null,
    };

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch admin profile from Firestore
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));

          if (adminDoc.exists()) {
            const adminData = adminDoc.data();

            if (adminData.isActive === false || adminData.isActive === 'false') {
              // Account is deactivated
              await signOut(auth);
              setUser(null);
              setIsLoading(false);
              return;
            }

            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              mobile: adminData.mobile || '',
              name: adminData.name || '',
              role: adminData.role || 'admin',
              companyName: adminData.companyName || '',
              avatar: adminData.avatar || null,
            };

            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
            setUser(userData);
          } else {
            // User exists in Auth but not in admins collection — not an admin
            await signOut(auth);
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching admin profile:', err);
          setUser(null);
        }
      } else {
        // No user signed in
        localStorage.removeItem(USER_DATA_KEY);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login with mobile number and password
   * Step 1: Firestore me mobile se email lookup
   * Step 2: Firebase Auth me email + password se login
   */
  const login = useCallback(async (mobile, password) => {
    setError(null);

    try {
      // Step 1: Mobile se real email find karo from Firestore
      const email = await getEmailByMobile(mobile);

      // Step 2: Firebase Auth se login
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user and isLoading
    } catch (err) {
      let errorMsg = err.message || 'Login failed. Please try again.';

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid mobile number or password.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed attempts. Please try again later.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your connection.';
      }

      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (auth) {
        await signOut(auth);
      }
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Send password reset email using mobile number
   * Step 1: Mobile se Firestore me email lookup
   * Step 2: Firebase sendPasswordResetEmail
   * Returns the email (masked) for UI display
   */
  const resetPassword = useCallback(async (mobile) => {
    try {
      const email = await getEmailByMobile(mobile);

      await sendPasswordResetEmail(auth, email);

      // Mask email for display: "sha***@gmail.com"
      const [localPart, domain] = email.split('@');
      const masked = localPart.slice(0, 3) + '***@' + domain;

      return { email, maskedEmail: masked };
    } catch (err) {
      let errorMsg = err.message || 'Failed to send reset email.';

      if (err.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this mobile number.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many requests. Please try again later.';
      }

      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Update user profile data in local state
   */
  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  }, []);

  const isAuthenticated = useMemo(() => {
    return Boolean(user);
  }, [user]);

  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      resetPassword,
      updateProfile,
      hasRole,
      setError,
    }),
    [user, isAuthenticated, isLoading, error, login, logout, resetPassword, updateProfile, hasRole]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume AuthContext
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
