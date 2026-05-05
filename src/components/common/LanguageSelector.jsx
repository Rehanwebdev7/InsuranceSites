import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ur', name: 'اردو' },
];

const triggerGoogleTranslate = (langCode) => {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
  }
};

const LanguageSelector = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const dropdownRef = useRef(null);

  // Detect current Google Translate language on mount
  useEffect(() => {
    const checkLang = () => {
      const cookie = document.cookie.match(/googtrans=\/en\/(\w+)/);
      if (cookie && cookie[1]) {
        setSelectedLang(cookie[1]);
      }
    };
    checkLang();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    setIsOpen(false);
    if (langCode === 'en') {
      // Reset to English — remove googtrans cookie and reload
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      window.location.reload();
      return;
    }
    triggerGoogleTranslate(langCode);
  };

  const currentLang = languages.find((l) => l.code === selectedLang) || languages[0];

  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-2 notranslate" translate="no">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            translate="no"
            className={`notranslate px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              selectedLang === lang.code
                ? 'bg-noir-800 text-[#E5C770] border-[rgba(201,169,97,0.40)]'
                : 'bg-noir-800/60 text-ink-300 border-[rgba(201,169,97,0.20)] hover:bg-noir-800 hover:text-[#E5C770]'
            }`}
          >
            <span className="notranslate" translate="no">{lang.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative notranslate" translate="no" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        translate="no"
        className="notranslate flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-ink-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors"
      >
        <FiGlobe className="w-4 h-4" />
        <span className="notranslate" translate="no">{currentLang.name}</span>
        <FiChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            translate="no"
            className="notranslate absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                translate="no"
                className={`notranslate w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  selectedLang === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <span className="notranslate" translate="no">{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
