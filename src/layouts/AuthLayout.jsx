import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShield, FiLock, FiHeart } from 'react-icons/fi';
import { useSettings } from '../contexts/SettingsContext';

const highlights = [
  { icon: FiShield, title: 'IRDAI-licensed partners', desc: 'Real policies, real protection.' },
  { icon: FiLock, title: 'Bank-grade security', desc: 'Your data is always encrypted.' },
  { icon: FiHeart, title: 'Human support 24/7', desc: 'Real people, real answers.' },
];

const AuthLayout = () => {
  const { settings } = useSettings();
  const brandName = settings?.brandName || 'Bharat Insurance';

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — brand panel (desktop only) */}
      <aside className="hidden lg:flex relative w-1/2 isolate overflow-hidden grad-hero text-white flex-col">
        {/* Aurora blobs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="aurora-blob w-[540px] h-[540px] -top-40 -left-20 bg-teal-500/35" />
          <div
            className="aurora-blob w-[460px] h-[460px] -bottom-32 -right-20 bg-teal-400/25"
            style={{ animationDelay: '3s' }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        {/* Top nav */}
        <div className="relative z-10 p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            {settings?.brandLogo ? (
              <img
                src={settings.brandLogo}
                alt={brandName}
                referrerPolicy="no-referrer"
                className="h-10 w-auto brightness-0 invert"
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 backdrop-blur flex items-center justify-center">
                  <span className="text-white text-lg font-bold font-display">
                    {brandName.charAt(0)}
                  </span>
                </div>
                <span className="text-lg font-display font-semibold text-white">{brandName}</span>
              </>
            )}
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-teal-100/80 hover:text-white transition-colors"
          >
            <FiArrowLeft /> Back to site
          </Link>
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-teal-100">
              Admin control room
            </div>
            <h1 className="text-display-lg font-display text-white text-balance leading-[1.05] mb-5">
              Run the show, without the paperwork.
            </h1>
            <p className="text-base text-teal-100/80 leading-relaxed max-w-md">
              Every lead, every policy, every claim — managed from one clean dashboard. Sign in to
              get back to work.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-10 space-y-4"
          >
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shrink-0">
                  <item.icon className="text-teal-200" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-teal-100/70 mt-0.5">{item.desc}</div>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Footer strip */}
        <div className="relative z-10 p-8 text-xs text-teal-100/60 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} {brandName}</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-teal-100 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-teal-100 transition-colors">Terms</Link>
          </div>
        </div>
      </aside>

      {/* Right — form */}
      <main className="flex-1 lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-10 bg-[var(--surface-2)] relative">
        {/* Mobile back link */}
        <Link
          to="/"
          className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-700 transition-colors"
        >
          <FiArrowLeft /> Back
        </Link>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
