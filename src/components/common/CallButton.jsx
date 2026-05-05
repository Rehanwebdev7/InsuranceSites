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
            className="relative ml-1 px-3.5 py-2 rounded-xl bg-noir-950 text-[#E5C770] border border-[#C9A961] text-xs font-semibold shadow-[0_12px_24px_-8px_rgba(10,10,10,0.4)] whitespace-nowrap"
          >
            Prefer a human? Call now.
            <div className="absolute -bottom-1 left-6 w-2 h-2 bg-noir-950 border-r border-b border-[#C9A961] rotate-45" />
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
        {/* Ambient gold rings */}
        <span className="absolute inset-0 rounded-full bg-[#C9A961]/35 animate-ping" />
        <span className="absolute -inset-1.5 rounded-full bg-[#C9A961]/15" />

        {/* Main button — noir disc with gold ring */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-noir-950 border-2 border-[#C9A961] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(10,10,10,0.55)] hover:shadow-[0_20px_40px_-12px_rgba(201,169,97,0.55)] transition-shadow duration-300"
        >
          <motion.div
            animate={{ rotate: [0, 12, -12, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, repeatDelay: 3.5 }}
          >
            <FaPhoneAlt className="text-[#E5C770] text-base sm:text-lg" />
          </motion.div>
        </motion.div>
      </a>
    </div>
  );
};

export default CallButton;
