import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SOCIAL_LINKS } from '../utils/constants';
import * as firestoreService from '../services/firebase/firestore';
import { db } from '../services/firebase/firebase';

const LS_KEY = 'bharat_insurance_settings';

// Helper: format 10-digit number with space after 5 digits
const fmt5 = (digits) => {
  if (!digits) return '';
  const d = digits.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 5) return d;
  return d.slice(0, 5) + ' ' + d.slice(5);
};

const DEFAULT_COLORS = {
  primary: '#C9A961',   // Heritage Gold (brand-500)
  secondary: '#0A0A0A', // Rich Noir
  accent: '#D4AF37',    // Highlight Gold
};

const DEFAULT_HERO_SETTINGS = {
  badgeText: 'Trusted by 50,000+ customers',
  titlePrefix: 'Insurance that',
  titleHighlight: 'actually shows up',
  titleSuffix: 'when you need it.',
  description:
    'Health, life, vehicle, travel — compare honest quotes from 20+ IRDAI-licensed insurers in under 60 seconds. No call centers, no pushy agents.',
  autoplayMs: 6500,
  iconShowerSpeed: 0.7,
  showIconShower: true,
};

const DEFAULT_SETTINGS = {
  brandName: 'MH Insurance',
  siteTitle: 'MH Insurance - Trusted Vehicle Insurance Partner',
  brandLogo: '',
  brandFavicon: '',
  // Theme — admin manageable (dark|light preset + optional custom overrides)
  themeMode: 'dark',
  customBg: '',
  customText: '',
  phone10: '9876543210',
  altPhone10: '9876543211',
  whatsapp10: '9876543210',
  call10: '9876543210',
  email: 'info@bharatinsurance.in',
  supportEmail: 'support@bharatinsurance.in',
  businessHours: '9:00 AM - 7:00 PM',
  addressLine1: 'Office No. 302, 3rd Floor',
  addressLine2: 'Trade Centre, Bandra Kurla Complex',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400051',
  mapUrl: 'https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai',
  footerDescription:
    'Your trusted insurance partner in India. We provide comprehensive vehicle insurance solutions with the best rates from 20+ top insurance companies. Fast, reliable, and hassle-free.',
  socialMedia: {
    facebook: { url: SOCIAL_LINKS.facebook, enabled: true },
    instagram: { url: SOCIAL_LINKS.instagram, enabled: true },
    twitter: { url: SOCIAL_LINKS.twitter, enabled: true },
    linkedin: { url: SOCIAL_LINKS.linkedin, enabled: true },
    youtube: { url: SOCIAL_LINKS.youtube, enabled: true },
  },
  hero: DEFAULT_HERO_SETTINGS,
};

const SettingsContext = createContext();

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};

// Load settings from localStorage (as initial/fallback)
const loadLocalSettings = () => {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!parsed.phone10 && parsed.phone) {
        const digits = parsed.phone.replace(/\D/g, '');
        parsed.phone10 = digits.length > 10 ? digits.slice(-10) : digits;
      }
      if (!parsed.altPhone10 && parsed.altPhone) {
        const digits = parsed.altPhone.replace(/\D/g, '');
        parsed.altPhone10 = digits.length > 10 ? digits.slice(-10) : digits;
      }
      if (!parsed.whatsapp10 && parsed.whatsappNumber) {
        const digits = parsed.whatsappNumber.replace(/\D/g, '');
        parsed.whatsapp10 = digits.length > 10 ? digits.slice(-10) : digits;
      }
      if (!parsed.call10 && parsed.callNumber) {
        const digits = parsed.callNumber.replace(/\D/g, '');
        parsed.call10 = digits.length > 10 ? digits.slice(-10) : digits;
      }
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        socialMedia: { ...DEFAULT_SETTINGS.socialMedia, ...parsed.socialMedia },
        hero: { ...DEFAULT_HERO_SETTINGS, ...parsed.hero },
      };
    }
  } catch {}
  return DEFAULT_SETTINGS;
};

// Apply admin-controlled site tokens (--site-*) to the customer-facing UI.
// Mode toggles the data-site-theme attribute on <html>; accent / bg / text
// overrides are stamped as inline style on documentElement so they win over
// the css :root defaults but stay below !important utility classes.
const DEFAULT_GOLD = '#c9a961';
const applySiteTheme = ({ mode, accent, customBg, customText }) => {
  const root = document.documentElement;
  root.setAttribute('data-site-theme', mode === 'light' ? 'light' : 'dark');

  // Accent: only override when it's a CUSTOM color. Default gold falls back to
  // the :root tokens AND skips the data-site-accent attribute, so the literal
  // gold gradient classes (`from-[#C9A961] to-[#D4AF37]`) keep their original
  // bright gold look.
  const isCustomAccent = !!accent && accent.toLowerCase() !== DEFAULT_GOLD;
  if (isCustomAccent) {
    root.setAttribute('data-site-accent', 'custom');
    root.style.setProperty('--site-accent', accent);
    root.style.setProperty('--site-accent-soft', `color-mix(in srgb, ${accent} 18%, transparent)`);
    root.style.setProperty('--site-accent-strong', `color-mix(in srgb, ${accent} 65%, black)`);
  } else {
    root.removeAttribute('data-site-accent');
    root.style.removeProperty('--site-accent');
    root.style.removeProperty('--site-accent-soft');
    root.style.removeProperty('--site-accent-strong');
  }

  if (customBg) {
    root.style.setProperty('--site-bg', customBg);
    root.style.setProperty('--site-bg-soft', `color-mix(in srgb, ${customBg} 88%, white)`);
  } else {
    root.style.removeProperty('--site-bg');
    root.style.removeProperty('--site-bg-soft');
  }

  if (customText) {
    root.style.setProperty('--site-text', customText);
  } else {
    root.style.removeProperty('--site-text');
  }
};

// Apply brand colors as CSS custom properties + dynamic overrides
const STYLE_ID = 'brand-colors-override';
const applyBrandColors = (colors) => {
  const root = document.documentElement;
  if (colors.primary) {
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-600', colors.primary);
    root.style.setProperty('--primary', colors.primary);
  }
  if (colors.secondary) {
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--secondary', colors.secondary);
  }
  if (colors.accent) {
    root.style.setProperty('--color-accent', colors.accent);
  }

  // Inject dynamic style overrides for Tailwind hardcoded blue classes
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  const p = colors.primary || '#14B8A6';
  const s = colors.secondary || '#F97316';
  style.textContent = `
    /* --- Design token cascade: CSS vars drive the new design system --- */
    :root {
      --brand-700: ${p};
      --brand-800: color-mix(in srgb, ${p} 85%, black);
      --brand-900: color-mix(in srgb, ${p} 70%, black);
      --brand-600: color-mix(in srgb, ${p} 92%, white);
      --brand-500: color-mix(in srgb, ${p} 80%, white);
      --brand-400: color-mix(in srgb, ${p} 65%, white);
      --brand-300: color-mix(in srgb, ${p} 45%, white);
      --brand-200: color-mix(in srgb, ${p} 25%, white);
      --brand-100: color-mix(in srgb, ${p} 12%, white);
      --brand-50:  color-mix(in srgb, ${p} 6%, white);
      --grad-cta:  linear-gradient(135deg, color-mix(in srgb, ${p} 92%, white) 0%, color-mix(in srgb, ${p} 78%, white) 100%);
      /* NOTE: --grad-hero is intentionally NOT overridden here. The hero gradient
         is a page-surface (noir), not an accent — tinting it with the brand color
         (e.g. gold) makes panels like CTASection / "stick with us" stats render
         in solid brand color, which clashes with the dark theme. Let the dark
         default from index.css (#0A0A0A → #2A2A2A) stand. */
      --shadow-brand: 0 20px 40px -12px color-mix(in srgb, ${p} 35%, transparent);
      --shadow-brand-sm: 0 8px 16px -8px color-mix(in srgb, ${p} 25%, transparent);
    }

    /* --- Legacy Tailwind blue-* class overrides (backward compat) --- */
    .bg-blue-600 { background-color: ${p} !important; }
    .bg-blue-700 { background-color: color-mix(in srgb, ${p} 85%, black) !important; }
    .bg-blue-800 { background-color: color-mix(in srgb, ${p} 70%, black) !important; }
    .bg-blue-50  { background-color: color-mix(in srgb, ${p} 8%, white) !important; }
    .bg-blue-100 { background-color: color-mix(in srgb, ${p} 15%, white) !important; }
    .text-blue-600 { color: ${p} !important; }
    .text-blue-700 { color: color-mix(in srgb, ${p} 85%, black) !important; }
    .text-blue-400 { color: color-mix(in srgb, ${p} 55%, white) !important; }
    .border-blue-500 { border-color: ${p} !important; }
    .hover\\:bg-blue-700:hover { background-color: color-mix(in srgb, ${p} 85%, black) !important; }
    .hover\\:bg-blue-50:hover  { background-color: color-mix(in srgb, ${p} 8%, white) !important; }
    .hover\\:text-blue-600:hover { color: ${p} !important; }
    .hover\\:text-blue-400:hover { color: color-mix(in srgb, ${p} 55%, white) !important; }
    .focus\\:ring-blue-500:focus { --tw-ring-color: ${p} !important; }
    .shadow-blue-500\\/30 { --tw-shadow-color: color-mix(in srgb, ${p} 30%, transparent) !important; }
    .shadow-blue-500\\/20 { --tw-shadow-color: color-mix(in srgb, ${p} 20%, transparent) !important; }
    .from-blue-600 { --tw-gradient-from: ${p} !important; }
    .from-blue-500 { --tw-gradient-from: color-mix(in srgb, ${p} 90%, white) !important; }
    .to-blue-800 { --tw-gradient-to: color-mix(in srgb, ${p} 70%, black) !important; }
    .to-blue-700 { --tw-gradient-to: color-mix(in srgb, ${p} 85%, black) !important; }
    .via-blue-700 { --tw-gradient-via: color-mix(in srgb, ${p} 85%, black) !important; }
    .bg-gradient-to-r.from-blue-600 { --tw-gradient-from: ${p} !important; }

    /* --- New emerald-* class overrides (redesigned components) --- */
    .bg-emerald-50  { background-color: color-mix(in srgb, ${p} 6%, white) !important; }
    .bg-emerald-100 { background-color: color-mix(in srgb, ${p} 12%, white) !important; }
    .bg-emerald-200 { background-color: color-mix(in srgb, ${p} 25%, white) !important; }
    .bg-emerald-500 { background-color: color-mix(in srgb, ${p} 80%, white) !important; }
    .bg-emerald-600 { background-color: color-mix(in srgb, ${p} 92%, white) !important; }
    .bg-emerald-700 { background-color: ${p} !important; }
    .bg-emerald-800 { background-color: color-mix(in srgb, ${p} 85%, black) !important; }
    .bg-emerald-900 { background-color: color-mix(in srgb, ${p} 70%, black) !important; }
    .bg-emerald-950 { background-color: color-mix(in srgb, ${p} 55%, black) !important; }
    .text-emerald-50  { color: color-mix(in srgb, ${p} 6%, white) !important; }
    .text-emerald-100 { color: color-mix(in srgb, ${p} 12%, white) !important; }
    .text-emerald-200 { color: color-mix(in srgb, ${p} 25%, white) !important; }
    .text-emerald-300 { color: color-mix(in srgb, ${p} 45%, white) !important; }
    .text-emerald-400 { color: color-mix(in srgb, ${p} 65%, white) !important; }
    .text-emerald-500 { color: color-mix(in srgb, ${p} 80%, white) !important; }
    .text-emerald-600 { color: color-mix(in srgb, ${p} 92%, white) !important; }
    .text-emerald-700 { color: ${p} !important; }
    .text-emerald-800 { color: color-mix(in srgb, ${p} 85%, black) !important; }
    .text-emerald-900 { color: color-mix(in srgb, ${p} 70%, black) !important; }
    .border-emerald-100 { border-color: color-mix(in srgb, ${p} 12%, white) !important; }
    .border-emerald-200 { border-color: color-mix(in srgb, ${p} 25%, white) !important; }
    .border-emerald-300 { border-color: color-mix(in srgb, ${p} 45%, white) !important; }
    .border-emerald-500 { border-color: color-mix(in srgb, ${p} 80%, white) !important; }
    .border-emerald-600 { border-color: color-mix(in srgb, ${p} 92%, white) !important; }
    .border-emerald-700 { border-color: ${p} !important; }
    .ring-emerald-500 { --tw-ring-color: color-mix(in srgb, ${p} 80%, white) !important; }
    .ring-emerald-600 { --tw-ring-color: color-mix(in srgb, ${p} 92%, white) !important; }
    .ring-emerald-700 { --tw-ring-color: ${p} !important; }
    .from-emerald-500 { --tw-gradient-from: color-mix(in srgb, ${p} 80%, white) !important; }
    .from-emerald-600 { --tw-gradient-from: color-mix(in srgb, ${p} 92%, white) !important; }
    .from-emerald-700 { --tw-gradient-from: ${p} !important; }
    .from-emerald-800 { --tw-gradient-from: color-mix(in srgb, ${p} 85%, black) !important; }
    .from-emerald-900 { --tw-gradient-from: color-mix(in srgb, ${p} 70%, black) !important; }
    .from-emerald-950 { --tw-gradient-from: color-mix(in srgb, ${p} 55%, black) !important; }
    .to-emerald-500 { --tw-gradient-to: color-mix(in srgb, ${p} 80%, white) !important; }
    .to-emerald-600 { --tw-gradient-to: color-mix(in srgb, ${p} 92%, white) !important; }
    .to-emerald-700 { --tw-gradient-to: ${p} !important; }
    .to-emerald-800 { --tw-gradient-to: color-mix(in srgb, ${p} 85%, black) !important; }
    .to-emerald-900 { --tw-gradient-to: color-mix(in srgb, ${p} 70%, black) !important; }
    .via-emerald-700 { --tw-gradient-via: ${p} !important; }
    .via-emerald-800 { --tw-gradient-via: color-mix(in srgb, ${p} 85%, black) !important; }
    .hover\\:bg-emerald-700:hover { background-color: ${p} !important; }
    .hover\\:bg-emerald-800:hover { background-color: color-mix(in srgb, ${p} 85%, black) !important; }
    .hover\\:text-emerald-600:hover { color: color-mix(in srgb, ${p} 92%, white) !important; }
    .hover\\:text-emerald-700:hover { color: ${p} !important; }
    .hover\\:border-emerald-500:hover { border-color: color-mix(in srgb, ${p} 80%, white) !important; }
    .focus\\:ring-emerald-500:focus { --tw-ring-color: color-mix(in srgb, ${p} 80%, white) !important; }
    .shadow-emerald-500\\/30 { --tw-shadow-color: color-mix(in srgb, ${p} 30%, transparent) !important; }
    .shadow-emerald-500\\/20 { --tw-shadow-color: color-mix(in srgb, ${p} 20%, transparent) !important; }
    .shadow-emerald-500\\/40 { --tw-shadow-color: color-mix(in srgb, ${p} 40%, transparent) !important; }

    /* --- Teal-* class overrides (new design system) --- */
    .bg-teal-50  { background-color: color-mix(in srgb, ${p} 6%, white) !important; }
    .bg-teal-100 { background-color: color-mix(in srgb, ${p} 12%, white) !important; }
    .bg-teal-200 { background-color: color-mix(in srgb, ${p} 25%, white) !important; }
    .bg-teal-500 { background-color: ${p} !important; }
    .bg-teal-600 { background-color: color-mix(in srgb, ${p} 88%, black) !important; }
    .bg-teal-700 { background-color: color-mix(in srgb, ${p} 78%, black) !important; }
    .bg-teal-800 { background-color: color-mix(in srgb, ${p} 65%, black) !important; }
    .bg-teal-900 { background-color: color-mix(in srgb, ${p} 50%, black) !important; }
    .text-teal-50  { color: color-mix(in srgb, ${p} 6%, white) !important; }
    .text-teal-100 { color: color-mix(in srgb, ${p} 12%, white) !important; }
    .text-teal-200 { color: color-mix(in srgb, ${p} 25%, white) !important; }
    .text-teal-300 { color: color-mix(in srgb, ${p} 45%, white) !important; }
    .text-teal-400 { color: color-mix(in srgb, ${p} 65%, white) !important; }
    .text-teal-500 { color: ${p} !important; }
    .text-teal-600 { color: color-mix(in srgb, ${p} 88%, black) !important; }
    .text-teal-700 { color: color-mix(in srgb, ${p} 78%, black) !important; }
    .text-teal-800 { color: color-mix(in srgb, ${p} 65%, black) !important; }
    .border-teal-100 { border-color: color-mix(in srgb, ${p} 12%, white) !important; }
    .border-teal-200 { border-color: color-mix(in srgb, ${p} 25%, white) !important; }
    .border-teal-500 { border-color: ${p} !important; }
    .border-teal-600 { border-color: color-mix(in srgb, ${p} 88%, black) !important; }
    .from-teal-500 { --tw-gradient-from: ${p} !important; }
    .from-teal-600 { --tw-gradient-from: color-mix(in srgb, ${p} 88%, black) !important; }
    .from-teal-700 { --tw-gradient-from: color-mix(in srgb, ${p} 78%, black) !important; }
    .to-teal-500 { --tw-gradient-to: ${p} !important; }
    .to-teal-600 { --tw-gradient-to: color-mix(in srgb, ${p} 88%, black) !important; }
    .to-teal-700 { --tw-gradient-to: color-mix(in srgb, ${p} 78%, black) !important; }
    .hover\\:bg-teal-600:hover { background-color: color-mix(in srgb, ${p} 88%, black) !important; }
    .hover\\:bg-teal-700:hover { background-color: color-mix(in srgb, ${p} 78%, black) !important; }
    .hover\\:text-teal-500:hover { color: ${p} !important; }
    .hover\\:text-teal-600:hover { color: color-mix(in srgb, ${p} 88%, black) !important; }
    .hover\\:border-teal-500:hover { border-color: ${p} !important; }
    .focus\\:ring-teal-500:focus { --tw-ring-color: ${p} !important; }
    .ring-teal-500 { --tw-ring-color: ${p} !important; }

    /* --- Secondary (amber / orange legacy) --- */
    .bg-amber-500 { background-color: ${s} !important; }
    .bg-amber-600 { background-color: color-mix(in srgb, ${s} 90%, black) !important; }
    .text-amber-500 { color: ${s} !important; }
    .text-amber-600 { color: color-mix(in srgb, ${s} 90%, black) !important; }
    .from-amber-500 { --tw-gradient-from: ${s} !important; }
    .to-amber-600 { --tw-gradient-to: color-mix(in srgb, ${s} 90%, black) !important; }
    .from-orange-500 { --tw-gradient-from: ${s} !important; }
    .to-orange-600 { --tw-gradient-to: color-mix(in srgb, ${s} 90%, black) !important; }
    .hover\\:from-orange-600:hover { --tw-gradient-from: color-mix(in srgb, ${s} 90%, black) !important; }
    .hover\\:to-orange-700:hover { --tw-gradient-to: color-mix(in srgb, ${s} 80%, black) !important; }
    .shadow-orange-500\\/30 { --tw-shadow-color: color-mix(in srgb, ${s} 30%, transparent) !important; }
  `;
};

export const SettingsProvider = ({ children }) => {
  const [rawSettings, setRawSettings] = useState(loadLocalSettings);
  const [brandColors, setBrandColors] = useState(DEFAULT_COLORS);
  const [settingsDocId, setSettingsDocId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply colors whenever they change
  useEffect(() => {
    applyBrandColors(brandColors);
  }, [brandColors]);

  // Apply theme mode + custom bg/text overrides
  useEffect(() => {
    const mode = rawSettings.themeMode === 'light' ? 'light' : 'dark';
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${mode}`);

    // Drive customer-site tokens (--site-*) — picked up by header, hero,
    // footer, buttons, cards. Admin panel is unaffected (uses data-admin-theme).
    applySiteTheme({
      mode,
      accent: brandColors.primary,
      customBg: rawSettings.customBg,
      customText: rawSettings.customText,
    });
  }, [rawSettings.themeMode, rawSettings.customBg, rawSettings.customText, brandColors.primary]);

  // Update favicon and page title dynamically.
  // We remember the original SVG default written into index.html and restore it
  // whenever the admin hasn't uploaded a custom favicon (so the tab is never blank).
  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      if (!link.dataset.defaultHref) {
        link.dataset.defaultHref = link.getAttribute('href') || '';
      }
      const next = (rawSettings.brandFavicon && rawSettings.brandFavicon.trim()) || link.dataset.defaultHref;
      if (next) {
        // Force the browser to re-fetch by setting type only when switching to a raster URL.
        if (rawSettings.brandFavicon && rawSettings.brandFavicon.trim()) {
          link.removeAttribute('type');
        } else {
          link.setAttribute('type', 'image/svg+xml');
        }
        link.href = next;
      }
    }
    if (rawSettings.siteTitle) {
      document.title = rawSettings.siteTitle;
    }
  }, [rawSettings.brandFavicon, rawSettings.siteTitle, isLoading]);

  // Load settings from Firestore on mount
  useEffect(() => {
    const loadFirestoreSettings = async () => {
      if (!db) {
        setIsLoading(false);
        return;
      }
      try {
        const fsSettings = await firestoreService.getSettings();
        if (fsSettings) {
          setSettingsDocId(fsSettings.id);
          const { id, colors, ...rest } = fsSettings;
          if (colors) {
            setBrandColors({ ...DEFAULT_COLORS, ...colors });
          }
          setRawSettings((prev) => ({
            ...prev,
            ...rest,
            socialMedia: { ...prev.socialMedia, ...rest.socialMedia },
            hero: { ...DEFAULT_HERO_SETTINGS, ...rest.hero },
          }));
          localStorage.setItem(LS_KEY, JSON.stringify({ ...rawSettings, ...rest }));
        }
      } catch (error) {
        console.error('Failed to load settings from Firestore:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFirestoreSettings();
  }, []);

  const updateSettings = useCallback(async (updates) => {
    setRawSettings((prev) => {
      const next = { ...prev, ...updates };
      if (updates.socialMedia) {
        next.socialMedia = { ...prev.socialMedia, ...updates.socialMedia };
      }
      if (updates.hero) {
        next.hero = { ...prev.hero, ...updates.hero };
      }
      return next;
    });
  }, []);

  // Save settings to both localStorage and Firestore
  const saveSettings = useCallback(async (settingsToSave) => {
    const dataToSave = settingsToSave || rawSettings;

    // Save to localStorage
    localStorage.setItem(LS_KEY, JSON.stringify(dataToSave));

    // Save to Firestore
    if (db) {
      try {
        const result = await firestoreService.saveSettings(dataToSave, settingsDocId);
        if (result.id && !settingsDocId) {
          setSettingsDocId(result.id);
        }
        return result;
      } catch (error) {
        console.error('Failed to save settings to Firestore:', error);
        throw error;
      }
    }
  }, [rawSettings, settingsDocId]);

  // Compute formatted values from raw 10-digit numbers
  const settings = useMemo(() => ({
    ...rawSettings,
    brandName: rawSettings.brandName || 'MH Insurance',
    phone: '+91 ' + fmt5(rawSettings.phone10),
    phoneRaw: '91' + rawSettings.phone10,
    altPhone: rawSettings.altPhone10 ? '+91 ' + fmt5(rawSettings.altPhone10) : '',
    whatsappNumber: '91' + rawSettings.whatsapp10,
    callNumber: '91' + rawSettings.call10,
    hero: { ...DEFAULT_HERO_SETTINGS, ...rawSettings.hero },
  }), [rawSettings]);

  const fullAddress = `${settings.addressLine1}, ${settings.addressLine2}, ${settings.city}, ${settings.state} - ${settings.pincode}`;
  const whatsappLink = `https://wa.me/${settings.whatsappNumber}`;

  return (
    <SettingsContext.Provider value={{
      settings,
      rawSettings,
      updateSettings,
      saveSettings,
      fullAddress,
      whatsappLink,
      DEFAULT_SETTINGS,
      isLoading,
      brandColors,
      setBrandColors,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
