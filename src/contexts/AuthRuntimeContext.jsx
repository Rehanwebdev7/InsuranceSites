import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { auth, db } from '../services/firebase/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';

const USER_DATA_KEY = STORAGE_KEYS.USER_DATA;
const AuthRuntimeContext = createContext(undefined);

const getEmailByMobile = async (mobile) => {
  if (!db) throw new Error('Firebase not configured');

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
      const disabledErr = new Error('ACCOUNT_DISABLED');
      disabledErr.code = 'account/disabled';
      throw disabledErr;
    }

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      mobile: adminData.mobile || '',
      name: adminData.name || '',
      role: adminData.role || 'admin',
      permissions: adminData.permissions || [],
      companyName: adminData.companyName || '',
      avatar: adminData.avatar || null,
    };

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await hydrateUser(firebaseUser);
        } else {
          localStorage.removeItem(USER_DATA_KEY);
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        localStorage.removeItem(USER_DATA_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [hydrateUser]);

  const login = useCallback(async (mobile, password) => {
    setError(null);

    try {
      const email = await getEmailByMobile(mobile);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await hydrateUser(credential.user);
      if (!userData) {
        throw new Error('Your account does not have admin access.');
      }
      return userData;
    } catch (err) {
      let errorMsg = err.message || 'Login failed. Please try again.';

      if (err.code === 'account/disabled' || err.code === 'auth/user-disabled') {
        errorMsg = 'Your account has been suspended by the administrator. Please contact your admin for support.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect mobile number or password. Please check and try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed attempts. Please wait a few minutes before trying again.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your internet connection and try again.';
      }

      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [hydrateUser]);

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

  const resetPassword = useCallback(async (mobile) => {
    try {
      const email = await getEmailByMobile(mobile);
      console.log('[ResetPassword] Sending reset email to:', email.replace(/(.{3}).*@/, '$1***@'));
      await sendPasswordResetEmail(auth, email);

      const [localPart, domain] = email.split('@');
      const masked = localPart.slice(0, 3) + '***@' + domain;

      return { email, maskedEmail: masked };
    } catch (err) {
      console.error('[ResetPassword] Error:', err.code, err.message);
      let errorMsg = err.message || 'Failed to send reset email.';

      if (err.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this mobile number.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many requests. Please try again later.';
      } else if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        errorMsg = 'Service temporarily unavailable. Please contact support.';
      }

      throw new Error(errorMsg);
    }
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((previous) => {
      if (!previous) return previous;
      const updated = { ...previous, ...updates };
      try {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  const hasRole = useCallback(
    (role) => user?.role === role,
    [user]
  );

  const isSuperAdmin = useMemo(() => user?.role === 'super_admin', [user]);

  const hasPermission = useCallback(
    (permission) => {
      if (user?.role === 'super_admin') return true;
      return (user?.permissions || []).includes(permission);
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
      hasPermission,
      isSuperAdmin,
      setError,
    }),
    [user, isAuthenticated, isLoading, error, login, logout, resetPassword, updateProfile, hasRole, hasPermission, isSuperAdmin]
  );

  return (
    <AuthRuntimeContext.Provider value={contextValue}>
      {children}
    </AuthRuntimeContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthRuntimeContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthRuntimeContext;
