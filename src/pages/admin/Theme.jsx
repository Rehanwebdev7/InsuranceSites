import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiMoon, FiSun, FiDroplet, FiSave, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useAdminTheme from '../../hooks/useAdminTheme';

const DEFAULT_ACCENT = '#C9A961';

const AdminTheme = () => {
  const adminTheme = useAdminTheme();
  const isLightAdmin = adminTheme === 'light';

  const { rawSettings, updateSettings, saveSettings, brandColors, setBrandColors, isLoading } = useSettings();

  // Local working state — initialized once from settings, NOT kept in sync.
  // The previous version had four sync-from-settings effects + a live-preview
  // effect that wrote back into settings — which created a feedback loop on
  // every color-picker tick. Now: edit only touches local state + DOM tokens;
  // context state is updated only on Save.
  const [mode, setMode] = useState(rawSettings.themeMode || 'dark');
  const [accent, setAccent] = useState(brandColors?.primary || DEFAULT_ACCENT);
  const [bgOverride, setBgOverride] = useState(rawSettings.customBg || '');
  const [textOverride, setTextOverride] = useState(rawSettings.customText || '');
  const [isSaving, setIsSaving] = useState(false);

  // One-time hydration after Firestore finishes loading (settings may not be
  // ready when this page mounts).
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current || isLoading) return;
    setMode(rawSettings.themeMode || 'dark');
    setAccent(brandColors?.primary || DEFAULT_ACCENT);
    setBgOverride(rawSettings.customBg || '');
    setTextOverride(rawSettings.customText || '');
    hydrated.current = true;
  }, [isLoading, rawSettings.themeMode, rawSettings.customBg, rawSettings.customText, brandColors?.primary]);

  // Live preview — write CSS tokens directly to <html>. No React state cascade,
  // so picker drag is smooth and there is no loop. Mirrors SettingsContext.applySiteTheme.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-site-theme', mode === 'light' ? 'light' : 'dark');

    const isCustomAccent = !!accent && accent.toLowerCase() !== DEFAULT_ACCENT.toLowerCase();
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

    if (bgOverride) {
      root.style.setProperty('--site-bg', bgOverride);
      root.style.setProperty('--site-bg-soft', `color-mix(in srgb, ${bgOverride} 88%, white)`);
    } else {
      root.style.removeProperty('--site-bg');
      root.style.removeProperty('--site-bg-soft');
    }
    if (textOverride) {
      root.style.setProperty('--site-text', textOverride);
    } else {
      root.style.removeProperty('--site-text');
    }
  }, [mode, accent, bgOverride, textOverride]);

  const isDirty =
    mode !== (rawSettings.themeMode || 'dark') ||
    accent !== (brandColors?.primary || DEFAULT_ACCENT) ||
    bgOverride !== (rawSettings.customBg || '') ||
    textOverride !== (rawSettings.customText || '');

  // Form-level revert (no Firestore write) — undoes unsaved edits.
  const handleReset = () => {
    setMode(rawSettings.themeMode || 'dark');
    setAccent(brandColors?.primary || DEFAULT_ACCENT);
    setBgOverride(rawSettings.customBg || '');
    setTextOverride(rawSettings.customText || '');
    toast.info('Reverted unsaved changes');
  };

  // One-click restore: sets all four controls back to the brand baseline
  // (Heritage Gold · Dark) AND persists immediately to Firestore. Use this if
  // the theme has been messed up and you want a known-good starting point.
  const handleRestoreDefault = async () => {
    if (!window.confirm('Restore the default Heritage Gold (Dark) theme? This will overwrite the saved theme.')) return;
    setIsSaving(true);
    try {
      const next = {
        ...rawSettings,
        themeMode: 'dark',
        customBg: '',
        customText: '',
        colors: { ...(rawSettings.colors || {}), primary: DEFAULT_ACCENT },
      };
      await saveSettings(next);
      setMode('dark');
      setAccent(DEFAULT_ACCENT);
      setBgOverride('');
      setTextOverride('');
      updateSettings({ themeMode: 'dark', customBg: '', customText: '' });
      setBrandColors((prev) => ({ ...prev, primary: DEFAULT_ACCENT }));
      toast.success('Default Heritage Gold (Dark) restored');
    } catch (err) {
      console.error(err);
      toast.error('Restore failed: ' + (err.message || 'try again'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const next = {
        ...rawSettings,
        themeMode: mode,
        customBg: bgOverride,
        customText: textOverride,
        colors: { ...(rawSettings.colors || {}), primary: accent },
      };
      await saveSettings(next);
      // Sync context state so SettingsContext's effects re-run with the new
      // values and isDirty flips to false.
      updateSettings({ themeMode: mode, customBg: bgOverride, customText: textOverride });
      setBrandColors((prev) => ({ ...prev, primary: accent }));
      toast.success('Theme saved — customer site updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save theme: ' + (err.message || 'try again'));
    } finally {
      setIsSaving(false);
    }
  };

  // Admin-panel theme tokens (page chrome, not the customer-site preview)
  const tt = isLightAdmin
    ? {
        heading: 'text-noir-950',
        sub: 'text-ink-500',
        card: 'bg-white border border-[#EBDCB1]',
        cardHeading: 'text-noir-950',
        cardSub: 'text-ink-500',
        label: 'text-ink-700',
        input: 'bg-white text-noir-900 border-[#EBDCB1] focus:border-[#C9A961] focus:ring-[rgba(201,169,97,0.30)]',
        chipIdle: 'border-[#EBDCB1] hover:border-[#C9A961] bg-white',
        chipActive: 'border-[#C9A961] bg-[rgba(201,169,97,0.12)] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.45)]',
        clearLink: 'text-red-600 hover:underline',
      }
    : {
        heading: 'text-white',
        sub: 'text-ink-400',
        card: 'bg-noir-900 border border-[rgba(201,169,97,0.22)]',
        cardHeading: 'text-white',
        cardSub: 'text-ink-400',
        label: 'text-ink-200',
        input: 'bg-noir-800 text-white border-[rgba(201,169,97,0.25)] focus:border-[#C9A961] focus:ring-[rgba(201,169,97,0.30)]',
        chipIdle: 'border-[rgba(201,169,97,0.22)] hover:border-[#C9A961] bg-noir-800',
        chipActive: 'border-[#C9A961] bg-[rgba(201,169,97,0.15)] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.45)]',
        clearLink: 'text-red-300 hover:underline',
      };

  // Compute preview tokens using the SAME logic SettingsContext applies at runtime,
  // so the swatch previews are pixel-accurate.
  const previewBg = bgOverride || (mode === 'light' ? '#FAF6EE' : '#0A0A0A');
  const previewSurface = mode === 'light' ? '#FFFFFF' : '#1A1A1A';
  const previewText = textOverride || (mode === 'light' ? '#0F0F0F' : '#FFFFFF');
  const previewMuted = mode === 'light' ? '#475569' : '#A3A3A3';
  const previewBorder = mode === 'light' ? '#EBDCB1' : 'rgba(201,169,97,0.22)';

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display italic text-[0.6rem] font-semibold text-[#C9A961] tracking-widest">Nº 04</span>
            <span className="w-5 h-px bg-[#C9A961]" />
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] ${tt.cardSub}`}>Site theme</span>
          </div>
          <h1 className={`text-2xl font-display font-bold tracking-tight ${tt.heading}`}>Customer-site theme</h1>
          <p className={`text-sm ${tt.sub}`}>Light / dark, accent color, optional background &amp; text overrides. Drives the public site only — admin panel keeps its own toggle.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReset}
            disabled={!isDirty}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isLightAdmin ? 'text-ink-700 hover:bg-ivory-100 border border-[#EBDCB1]' : 'text-ink-200 hover:bg-noir-800 border border-[rgba(201,169,97,0.22)]'}`}
            title="Discard unsaved edits"
          >
            <FiRefreshCw className="w-4 h-4" /> Revert
          </button>
          <button
            onClick={handleRestoreDefault}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isLightAdmin ? 'text-[#8B6F2C] border border-[#C9A961] bg-[rgba(201,169,97,0.08)] hover:bg-[rgba(201,169,97,0.16)]' : 'text-[#E5C770] border border-[#C9A961] bg-[rgba(201,169,97,0.08)] hover:bg-[rgba(201,169,97,0.18)]'}`}
            title="Restore the default Heritage Gold (Dark) theme and save"
          >
            <FiDroplet className="w-4 h-4" /> Restore default
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold border border-[#E5C770] bg-gradient-to-r from-[#C9A961] to-[#8B6F2C] text-noir-950 hover:from-[#D4AF37] hover:to-[#C9A961] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)] hover:shadow-[0_16px_32px_-12px_rgba(201,169,97,0.65)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiSave className="w-4 h-4" /> {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ----------- Left column: controls ----------- */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mode */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-sm p-6 ${tt.card}`}
          >
            <h2 className={`text-lg font-display font-semibold tracking-tight mb-1 ${tt.cardHeading}`}>1. Mode</h2>
            <p className={`text-sm mb-5 ${tt.cardSub}`}>Sets the dominant background &amp; text contrast for the public site.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'dark', label: 'Heritage Dark', icon: FiMoon, swatch: 'linear-gradient(135deg,#0A0A0A,#1A1A1A)', accentChip: '#C9A961', sub: 'Premium · noir + gold' },
                { id: 'light', label: 'Heritage Light', icon: FiSun, swatch: 'linear-gradient(135deg,#FFFCF7,#FAF6EE)', accentChip: '#8B6F2C', sub: 'Daylight · ivory + gold' },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMode(opt.id)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${active ? tt.chipActive : tt.chipIdle}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={active ? 'text-[#C9A961]' : (isLightAdmin ? 'text-noir-700' : 'text-ink-300')} />
                      <span className={`font-semibold tracking-tight ${tt.cardHeading}`}>{opt.label}</span>
                    </div>
                    <div className="h-12 rounded-lg overflow-hidden flex border" style={{ borderColor: previewBorder }}>
                      <div className="flex-1" style={{ background: opt.swatch }} />
                      <div className="w-10" style={{ backgroundColor: opt.accentChip }} />
                    </div>
                    <p className={`mt-2 text-xs italic ${tt.cardSub}`}>{opt.sub}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Accent */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className={`rounded-2xl shadow-sm p-6 ${tt.card}`}
          >
            <h2 className={`text-lg font-display font-semibold tracking-tight mb-1 ${tt.cardHeading}`}>2. Accent color</h2>
            <p className={`text-sm mb-5 ${tt.cardSub}`}>Buttons, links, highlights, focus rings. Default Heritage Gold (#C9A961).</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-14 h-12 rounded-lg cursor-pointer p-0.5 border"
                style={{ borderColor: previewBorder }}
                aria-label="Pick accent color"
              />
              <input
                type="text"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className={`flex-1 px-3 py-2.5 border rounded-lg font-mono text-sm focus:ring-2 focus:outline-none ${tt.input}`}
                placeholder="#C9A961"
              />
              {accent.toUpperCase() !== DEFAULT_ACCENT && (
                <button type="button" onClick={() => setAccent(DEFAULT_ACCENT)} className={`text-xs whitespace-nowrap ${tt.clearLink}`}>
                  Use gold default
                </button>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2">
              {['#C9A961', '#1F6FEB', '#0F8C48', '#A23E48', '#5C3A8B', '#0F2A4A'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAccent(preset)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    accent.toUpperCase() === preset.toUpperCase() ? 'border-[#C9A961] shadow-[0_0_0_2px_rgba(201,169,97,0.30)]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: preset }}
                  title={preset}
                />
              ))}
            </div>
          </motion.div>

          {/* Bg & text overrides */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className={`rounded-2xl shadow-sm p-6 ${tt.card}`}
          >
            <h2 className={`text-lg font-display font-semibold tracking-tight mb-1 ${tt.cardHeading}`}>3. Optional overrides</h2>
            <p className={`text-sm mb-5 ${tt.cardSub}`}>Leave empty to use the mode preset. Override only when a specific contrast is needed.</p>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${tt.label}`}>Background color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgOverride || (mode === 'light' ? '#FAF6EE' : '#0A0A0A')}
                    onChange={(e) => setBgOverride(e.target.value)}
                    className="w-14 h-10 rounded cursor-pointer p-0.5 border"
                    style={{ borderColor: previewBorder }}
                  />
                  <input
                    type="text"
                    value={bgOverride}
                    onChange={(e) => setBgOverride(e.target.value)}
                    placeholder="(empty = use preset)"
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:outline-none ${tt.input}`}
                  />
                  {bgOverride && (
                    <button type="button" onClick={() => setBgOverride('')} className={`text-xs whitespace-nowrap ${tt.clearLink}`}>
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${tt.label}`}>Body text color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={textOverride || (mode === 'light' ? '#0F0F0F' : '#FFFFFF')}
                    onChange={(e) => setTextOverride(e.target.value)}
                    className="w-14 h-10 rounded cursor-pointer p-0.5 border"
                    style={{ borderColor: previewBorder }}
                  />
                  <input
                    type="text"
                    value={textOverride}
                    onChange={(e) => setTextOverride(e.target.value)}
                    placeholder="(empty = use preset)"
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:outline-none ${tt.input}`}
                  />
                  {textOverride && (
                    <button type="button" onClick={() => setTextOverride('')} className={`text-xs whitespace-nowrap ${tt.clearLink}`}>
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ----------- Right column: live preview ----------- */}
        <div className="lg:col-span-2 lg:sticky lg:top-20 lg:self-start space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className={`rounded-2xl shadow-sm p-6 ${tt.card}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <FiDroplet className="text-[#C9A961]" />
              <h2 className={`text-lg font-display font-semibold tracking-tight ${tt.cardHeading}`}>Live preview</h2>
            </div>
            <p className={`text-xs italic mb-4 ${tt.cardSub}`}>This panel renders with the same tokens the public site uses.</p>

            {/* Preview hero card */}
            <div
              className="rounded-xl p-5 mb-3 relative overflow-hidden"
              style={{
                backgroundColor: previewBg,
                color: previewText,
                border: `1px solid ${previewBorder}`,
              }}
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${accent}1F 0%, transparent 70%)`,
                }}
              />
              <p className="text-[0.6rem] uppercase tracking-[0.22em] mb-2 italic font-semibold relative" style={{ color: accent }}>
                Edition · Vol I
              </p>
              <h3 className="text-xl font-display font-bold mb-2 italic leading-tight relative" style={{ color: previewText }}>
                Insurance, delivered like luxury.
              </h3>
              <p className="text-sm mb-4 relative" style={{ color: previewMuted }}>
                Compare honest quotes from 20+ insurers in 60 seconds.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold relative"
                style={{
                  background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 65%, black))`,
                  color: mode === 'light' ? '#FFFFFF' : '#0A0A0A',
                }}
              >
                Get my quote <FiArrowRight />
              </button>
            </div>

            {/* Surface card */}
            <div
              className="rounded-xl p-4 mb-3"
              style={{
                backgroundColor: previewSurface,
                color: previewText,
                border: `1px solid ${previewBorder}`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>Service card</p>
              <p className="font-display font-semibold mb-1 tracking-tight" style={{ color: previewText }}>Two-Wheeler Insurance</p>
              <p className="text-xs" style={{ color: previewMuted }}>Comprehensive cover from ₹538/yr.</p>
            </div>

            {/* Token swatches */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Bg', value: previewBg },
                { label: 'Surface', value: previewSurface },
                { label: 'Text', value: previewText },
                { label: 'Accent', value: accent },
              ].map((tk) => (
                <div key={tk.label} className="flex items-center gap-2 px-2 py-1.5 rounded-md border" style={{ borderColor: previewBorder }}>
                  <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: tk.value, borderColor: previewBorder }} />
                  <span className={`font-mono ${tt.cardSub}`}>{tk.label}</span>
                  <span className={`ml-auto font-mono ${tt.cardHeading}`}>{tk.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminTheme;
