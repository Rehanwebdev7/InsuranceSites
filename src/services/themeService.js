import { STORAGE_KEYS, DEFAULT_THEME } from '../utils/constants';

const THEME_KEY = STORAGE_KEYS.THEME;

/**
 * Convert a camelCase theme key to a CSS custom property name
 * e.g. 'primaryLight' -> '--color-primary-light'
 * @param {string} key - camelCase key
 * @returns {string} CSS variable name
 */
const toCSSVariable = (key) => {
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `--color-${kebab}`;
};

/**
 * Apply theme colors as CSS custom properties on :root
 * @param {Object} theme - Theme object with color values
 */
export const applyThemeToDOM = (theme) => {
  if (!theme || typeof theme !== 'object') return;

  const root = document.documentElement;

  Object.entries(theme).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('#')) {
      root.style.setProperty(toCSSVariable(key), value);
    }
  });

  // Also set some common aliases for convenience
  if (theme.primary) {
    root.style.setProperty('--primary', theme.primary);
  }
  if (theme.primaryLight) {
    root.style.setProperty('--primary-light', theme.primaryLight);
  }
  if (theme.primaryDark) {
    root.style.setProperty('--primary-dark', theme.primaryDark);
  }
  if (theme.secondary) {
    root.style.setProperty('--secondary', theme.secondary);
  }
  if (theme.secondaryLight) {
    root.style.setProperty('--secondary-light', theme.secondaryLight);
  }
  if (theme.secondaryDark) {
    root.style.setProperty('--secondary-dark', theme.secondaryDark);
  }
  if (theme.success) {
    root.style.setProperty('--success', theme.success);
  }
  if (theme.warning) {
    root.style.setProperty('--warning', theme.warning);
  }
  if (theme.error) {
    root.style.setProperty('--error', theme.error);
  }
  if (theme.info) {
    root.style.setProperty('--info', theme.info);
  }
  if (theme.textPrimary) {
    root.style.setProperty('--text-primary', theme.textPrimary);
  }
  if (theme.textSecondary) {
    root.style.setProperty('--text-secondary', theme.textSecondary);
  }
  if (theme.bgPrimary) {
    root.style.setProperty('--bg-primary', theme.bgPrimary);
  }
  if (theme.bgSecondary) {
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
  }
  if (theme.bgDark) {
    root.style.setProperty('--bg-dark', theme.bgDark);
  }
};

/**
 * Load theme from localStorage, falling back to DEFAULT_THEME
 * @returns {Object} The current theme
 */
export const loadTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      const theme = { ...DEFAULT_THEME, ...parsed };
      return theme;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }

  return { ...DEFAULT_THEME };
};

/**
 * Save theme to localStorage and apply to DOM
 * @param {Object} theme - Theme object to save
 * @returns {Object} The saved theme
 */
export const saveTheme = (theme) => {
  const merged = { ...DEFAULT_THEME, ...theme };

  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(merged));
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }

  applyThemeToDOM(merged);
  return merged;
};

/**
 * Reset theme to defaults, clear stored theme, and apply to DOM
 * @returns {Object} The default theme
 */
export const resetTheme = () => {
  try {
    localStorage.removeItem(THEME_KEY);
  } catch (error) {
    console.warn('Failed to remove theme from localStorage:', error);
  }

  const defaultTheme = { ...DEFAULT_THEME };
  applyThemeToDOM(defaultTheme);
  return defaultTheme;
};

/**
 * Get a specific theme color value
 * @param {string} key - Theme key (e.g. 'primary', 'bgSecondary')
 * @returns {string} The color value
 */
export const getThemeColor = (key) => {
  const theme = loadTheme();
  return theme[key] || DEFAULT_THEME[key] || '#000000';
};

/**
 * Update a single theme color
 * @param {string} key - Theme key
 * @param {string} value - Color value (hex)
 * @returns {Object} The updated theme
 */
export const updateThemeColor = (key, value) => {
  const theme = loadTheme();
  theme[key] = value;
  return saveTheme(theme);
};
