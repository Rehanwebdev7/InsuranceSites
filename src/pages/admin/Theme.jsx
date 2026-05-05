import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiMoon, FiSun, FiSliders, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminTheme = () => {
  const { theme, updateColor, resetTheme, isCustomized } = useTheme();
  const { rawSettings, updateSettings, saveSettings } = useSettings();
  const [colors, setColors] = useState({
    primary: theme.colors?.primary || '#C9A961',
    secondary: theme.colors?.secondary || '#0A0A0A',
    accent: theme.colors?.accent || '#D4AF37',
  });
  const [isSavingMode, setIsSavingMode] = useState(false);

  const handleColorChange = (key, value) => {
    setColors({ ...colors, [key]: value });
    updateColor(key, value);
  };

  const handleModeChange = (mode) => {
    updateSettings({ themeMode: mode });
  };

  const handleCustomChange = (field, value) => {
    updateSettings({ [field]: value });
  };

  const handleSaveModeAndCustom = async () => {
    setIsSavingMode(true);
    try {
      await saveSettings();
      toast.success('Theme settings saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save theme settings');
    } finally {
      setIsSavingMode(false);
    }
  };

  const themeMode = rawSettings.themeMode || 'dark';
  const customBg = rawSettings.customBg || '';
  const customText = rawSettings.customText || '';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Theme Settings</h1>
          <p className="text-gray-500">Switch between dark / light modes, customize background & text colors, and tweak brand palette</p>
        </div>
        {isCustomized && (
          <button onClick={resetTheme} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FiRefreshCw className="w-4 h-4" /> Reset palette
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Theme mode selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FiSliders className="text-amber-600" /> Theme Mode
          </h2>
          <p className="text-sm text-gray-500 mb-5">Choose the dominant background tone for the public site.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleModeChange('dark')}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                themeMode === 'dark'
                  ? 'border-amber-500 bg-amber-50/40 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <FiMoon className="text-gray-700" />
                <span className="font-semibold text-gray-800">Dark (Noir + Gold)</span>
              </div>
              <div className="h-12 rounded-lg overflow-hidden flex">
                <div className="flex-1" style={{ background: 'linear-gradient(135deg,#0A0A0A,#1A1A1A)' }} />
                <div className="w-12" style={{ backgroundColor: '#C9A961' }} />
                <div className="w-6" style={{ backgroundColor: '#D4AF37' }} />
              </div>
              <p className="mt-2 text-xs text-gray-500 italic">Premium luxury — recommended</p>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('light')}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                themeMode === 'light'
                  ? 'border-amber-500 bg-amber-50/40 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <FiSun className="text-gray-700" />
                <span className="font-semibold text-gray-800">Light (Ivory + Gold)</span>
              </div>
              <div className="h-12 rounded-lg overflow-hidden flex border border-gray-200">
                <div className="flex-1" style={{ background: 'linear-gradient(135deg,#FFFCF7,#FAF6EE)' }} />
                <div className="w-12" style={{ backgroundColor: '#C9A961' }} />
                <div className="w-6" style={{ backgroundColor: '#D4AF37' }} />
              </div>
              <p className="mt-2 text-xs text-gray-500 italic">Editorial daylight feel</p>
            </button>
          </div>
        </motion.div>

        {/* Custom bg + text overrides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Custom Override</h2>
          <p className="text-sm text-gray-500 mb-5">Optional — if set, these override the preset background and text color across the whole site.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customBg || '#0A0A0A'}
                  onChange={(e) => handleCustomChange('customBg', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customBg}
                  onChange={(e) => handleCustomChange('customBg', e.target.value)}
                  placeholder="(empty = use preset)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
                {customBg && (
                  <button
                    type="button"
                    onClick={() => handleCustomChange('customBg', '')}
                    className="text-xs text-red-600 hover:underline whitespace-nowrap"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customText || '#FAF6EE'}
                  onChange={(e) => handleCustomChange('customText', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => handleCustomChange('customText', e.target.value)}
                  placeholder="(empty = use preset)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
                {customText && (
                  <button
                    type="button"
                    onClick={() => handleCustomChange('customText', '')}
                    className="text-xs text-red-600 hover:underline whitespace-nowrap"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">
              Tip: leave both empty for the cleanest brand-aligned look. Only override when a specific contrast is needed.
            </p>
          </div>
          <button
            onClick={handleSaveModeAndCustom}
            disabled={isSavingMode}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 font-semibold border border-[#B8923A] shadow hover:shadow-lg transition-all disabled:opacity-60"
          >
            <FiSave className="w-4 h-4" />
            {isSavingMode ? 'Saving…' : 'Save mode & overrides'}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Brand Palette</h2>
          <div className="space-y-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Preview</h2>
          <div
            className="p-4 rounded-lg mb-3"
            style={{
              backgroundColor: themeMode === 'dark' ? (customBg || '#0A0A0A') : (customBg || '#FFFCF7'),
              color: themeMode === 'dark' ? (customText || '#FAF6EE') : (customText || '#0A0A0A'),
              border: '1px solid rgba(201,169,97,0.3)',
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.primary }}>Edition · Vol I</p>
            <h3 className="text-xl font-bold mb-2 italic" style={{ fontFamily: 'serif' }}>
              Insurance, delivered like luxury.
            </h3>
            <p className="text-sm opacity-80 mb-3">Compare quotes from 20+ insurers in 60 seconds.</p>
            <button
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: '#0A0A0A',
              }}
            >
              Get my quote →
            </button>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary, color: '#0A0A0A' }}>
            <p className="text-sm font-semibold">Primary accent preview</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminTheme;
