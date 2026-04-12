import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_THEME } from '../utils/constants';
import { loadTheme, saveTheme, resetTheme as resetThemeService, applyThemeToDOM } from '../services/themeService';

const ThemeContext = createContext(undefined);

/**
 * ThemeProvider - Provides theme state and controls to the entire app
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => loadTheme());
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme to DOM on initial load
  useEffect(() => {
    const currentTheme = loadTheme();
    setTheme(currentTheme);
    applyThemeToDOM(currentTheme);
    setIsLoading(false);
  }, []);

  /**
   * Update one or more theme properties
   * @param {Object} updates - Partial theme object with updated values
   */
  const updateTheme = useCallback((updates) => {
    setTheme((prev) => {
      const newTheme = { ...prev, ...updates };
      saveTheme(newTheme);
      return newTheme;
    });
  }, []);

  /**
   * Update a single theme color
   * @param {string} key - Theme key (e.g. 'primary')
   * @param {string} value - Hex color value
   */
  const updateColor = useCallback((key, value) => {
    updateTheme({ [key]: value });
  }, [updateTheme]);

  /**
   * Reset theme to default values
   */
  const resetToDefault = useCallback(() => {
    const defaultTheme = resetThemeService();
    setTheme(defaultTheme);
  }, []);

  /**
   * Check if current theme differs from default
   */
  const isCustomized = useMemo(() => {
    return Object.keys(DEFAULT_THEME).some(
      (key) => theme[key] !== DEFAULT_THEME[key]
    );
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      updateTheme,
      updateColor,
      resetTheme: resetToDefault,
      isCustomized,
      isLoading,
      defaultTheme: DEFAULT_THEME,
    }),
    [theme, updateTheme, updateColor, resetToDefault, isCustomized, isLoading]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to consume ThemeContext
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
