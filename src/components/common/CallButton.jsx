import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt } from 'react-icons/fa';
import { useSettings } from '../../contexts/SettingsContext';

const CallButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { settings } = useSettings();

  return (
    <div className="floating-contact-button fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[9998] flex flex-col items-start gap-2 no-print">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="relative ml-1 px-3.5 py-2 rounded-xl bg-ink-900 text-white text-xs font-semibold shadow-[0_12px_24px_-8px_rgba(11,18,32,0.3)] whitespace-nowrap"
          >
            Prefer a human? Call now.
            <div className="absolute -bottom-1 left-6 w-2 h-2 bg-ink-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={`tel:${settings.callNumber}`}
        aria-label={`Call us at ${settings.phone}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="relative group block"
      >
        {/* Ambient rings */}
        <span className="absolute inset-0 rounded-full bg-teal-500/30 animate-ping" />
        <span className="absolute -inset-1.5 rounded-full bg-teal-500/15" />

        {/* Main button */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(16,185,129,0.55)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.6)] transition-shadow duration-300"
        >
          <motion.div
            animate={{ rotate: [0, 12, -12, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, repeatDelay: 3.5 }}
          >
            <FaPhoneAlt className="text-white text-base sm:text-lg" />
          </motion.div>
        </motion.div>
      </a>
    </div>
  );
};

export default CallButton;
