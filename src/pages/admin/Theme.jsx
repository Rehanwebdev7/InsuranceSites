import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

const AdminTheme = () => {
  const { theme, updateColor, resetTheme, isCustomized } = useTheme();
  const [colors, setColors] = useState({
    primary: theme.colors?.primary || '#2563eb',
    secondary: theme.colors?.secondary || '#7c3aed',
    accent: theme.colors?.accent || '#059669',
  });

  const handleColorChange = (key, value) => {
    setColors({ ...colors, [key]: value });
    updateColor(key, value);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Theme Settings</h1>
          <p className="text-gray-500">Customize your website appearance</p>
        </div>
        {isCustomized && (
          <button onClick={resetTheme} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FiRefreshCw className="w-4 h-4" /> Reset to Default
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Brand Colors</h2>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Preview</h2>
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary }}>
            <h3 className="text-white text-xl font-bold mb-2">Primary Button</h3>
            <p className="text-white/80">Sample preview text</p>
            <button className="mt-3 px-4 py-2 bg-white rounded-lg" style={{ color: colors.primary }}>Button</button>
          </div>
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.secondary }}>
            <h3 className="text-white text-xl font-bold mb-2">Secondary</h3>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminTheme;