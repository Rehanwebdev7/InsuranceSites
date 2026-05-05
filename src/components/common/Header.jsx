import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import LanguageSelector from './LanguageSelector';
import { useSettings } from '../../contexts/SettingsContext';
import { openQuoteForm } from '../../utils/quoteEvents';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, whatsappLink } = useSettings();

  const handleGetQuotes = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/' || location.pathname === '/services') {
      openQuoteForm();
    } else {
      navigate('/');
      setTimeout(() => openQuoteForm(), 50);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.85)] backdrop-blur-xl border-b border-[rgba(201,169,97,0.22)] shadow-[0_1px_0_0_rgba(201,169,97,0.20)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0" aria-label="Home">
              {settings?.brandLogo ? (
                <img
                  src={settings.brandLogo}
                  alt={settings?.brandName || 'Insurance'}
                  referrerPolicy="no-referrer"
                  className="h-9 lg:h-10 w-auto transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(201,169,97,0.5)] border border-[#E5C770]">
                    <span className="text-noir-950 text-lg font-bold font-display italic">
                      {(settings?.brandName || 'B').charAt(0)}
                    </span>
                  </div>
                  <span className="font-display text-base lg:text-lg font-semibold tracking-tight text-white">
                    {settings?.brandName || 'Bharat Insurance'}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                      isActive ? 'text-[#E5C770]' : 'text-ink-300 hover:text-[#E5C770]'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#C9A961] to-[#D4AF37] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-1.5 lg:gap-2">
              {/* Phone pill */}
              <a
                href={`tel:${settings.phoneRaw}`}
                className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold bg-noir-800 text-[#E5C770] border border-[rgba(201,169,97,0.30)] hover:bg-noir-700 hover:border-[#C9A961] transition-colors"
              >
                <FiPhone className="text-[0.9em]" />
                {settings.phone}
              </a>

              {/* Language selector */}
              <div className="hidden md:block">
                <LanguageSelector />
              </div>

              {/* Primary CTA — gold pill (magnetic) */}
              <button
                type="button"
                onClick={handleGetQuotes}
                data-magnetic
                className="hidden md:inline-flex items-center gap-1.5 px-4 lg:px-5 py-2.5 bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 text-sm font-semibold rounded-full border border-[#B8923A] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.5)] hover:shadow-[0_16px_32px_-12px_rgba(201,169,97,0.6)] transition-shadow duration-300 active:scale-[0.98] whitespace-nowrap"
              >
                Get quotes
                <FiArrowRight />
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-noir-800 text-[#E5C770] border border-[rgba(201,169,97,0.30)] hover:bg-noir-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-noir-950/65 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-[86%] max-w-sm bg-noir-900 shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] border-l border-[rgba(201,169,97,0.25)] z-50 lg:hidden overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[rgba(201,169,97,0.25)]">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
                  {settings?.brandLogo ? (
                    <img
                      src={settings.brandLogo}
                      alt={settings?.brandName || 'Insurance'}
                      referrerPolicy="no-referrer"
                      className="h-8 w-auto"
                    />
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-noir-950 border border-[#C9A961] flex items-center justify-center">
                        <span className="text-[#E5C770] text-base font-bold font-display italic">
                          {(settings?.brandName || 'B').charAt(0)}
                        </span>
                      </div>
                      <span className="font-display text-base font-semibold text-white">
                        {settings?.brandName || 'Bharat Insurance'}
                      </span>
                    </>
                  )}
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-noir-800 hover:bg-noir-700 text-[#E5C770] border border-[rgba(201,169,97,0.30)] transition-colors"
                  aria-label="Close menu"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                          isActive
                            ? 'bg-noir-800 text-[#E5C770] border border-[rgba(201,169,97,0.40)]'
                            : 'text-ink-300 hover:bg-noir-800 hover:text-[#E5C770]'
                        }`}
                      >
                        {link.name}
                        <FiArrowRight className={isActive ? 'text-[#E5C770]' : 'text-ink-500'} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="px-4 py-3 border-t border-[rgba(201,169,97,0.20)]">
                <p className="text-[0.6875rem] font-semibold text-[#C9A961] uppercase tracking-[0.14em] mb-2">
                  Language
                </p>
                <LanguageSelector isMobile />
              </div>

              <div className="px-4 py-4 border-t border-[rgba(201,169,97,0.20)] space-y-2">
                <p className="text-[0.6875rem] font-semibold text-[#C9A961] uppercase tracking-[0.14em] mb-2">
                  Talk to us
                </p>
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-noir-800 text-[#E5C770] text-sm font-semibold border border-[rgba(201,169,97,0.30)] hover:bg-noir-700 hover:border-[#C9A961] transition-colors"
                >
                  <FiPhone /> Call {settings.phone}
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/15 text-[#7be0a4] text-sm font-semibold border border-[rgba(37,211,102,0.30)] hover:bg-[#25D366]/20 transition-colors"
                >
                  <FaWhatsapp /> WhatsApp chat
                </a>
              </div>

              <div className="mt-auto p-4 border-t border-[rgba(201,169,97,0.20)]">
                <button
                  type="button"
                  onClick={handleGetQuotes}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 font-semibold rounded-full border border-[#B8923A] shadow-[0_12px_24px_-12px_rgba(201,169,97,0.5)] transition-all whitespace-nowrap"
                >
                  Get free quotes <FiArrowRight />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
