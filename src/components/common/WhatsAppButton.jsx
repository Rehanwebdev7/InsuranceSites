import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../contexts/SettingsContext';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { settings } = useSettings();

  const brandName = settings?.brandName || 'Bharat Insurance';
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'd like to get a vehicle insurance quote from ${brandName}. Can you help?`
  )}`;

  return (
    <div className="floating-contact-button fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-2 no-print">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="relative mr-1 px-3.5 py-2 rounded-xl bg-ink-900 text-white text-xs font-semibold shadow-[0_12px_24px_-8px_rgba(11,18,32,0.3)] whitespace-nowrap"
          >
            Chat with a real human.
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-ink-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="relative group block"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" />
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/15" />

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(37,211,102,0.55)] hover:shadow-[0_20px_40px_-12px_rgba(37,211,102,0.6)] transition-shadow duration-300"
        >
          <FaWhatsapp className="text-white text-[1.35rem] sm:text-2xl" />
        </motion.div>
      </a>
    </div>
  );
};

export default WhatsAppButton;
