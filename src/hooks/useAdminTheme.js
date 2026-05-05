import { useEffect, useState } from 'react';

/**
 * useAdminTheme — read the current admin panel theme ('dark' | 'light').
 *
 * Source of truth: `localStorage.bharat_admin_theme`, written by AdminLayout's
 * theme toggle. AdminLayout also fires a `admin-theme-change` CustomEvent so any
 * component using this hook re-renders immediately when the toggle is flipped.
 */
const STORAGE_KEY = 'bharat_admin_theme';

const readTheme = () => {
  try { return localStorage.getItem(STORAGE_KEY) || 'dark'; } catch { return 'dark'; }
};

const useAdminTheme = () => {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const onAdminChange = (e) => {
      const next = e?.detail === 'dark' || e?.detail === 'light' ? e.detail : readTheme();
      setTheme(next);
    };
    const onStorage = (e) => {
      if (e && e.key && e.key !== STORAGE_KEY) return;
      setTheme(readTheme());
    };
    window.addEventListener('admin-theme-change', onAdminChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('admin-theme-change', onAdminChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return theme;
};

export default useAdminTheme;
