import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShield, FiLock, FiHeart } from 'react-icons/fi';
import { useSettings } from '../contexts/SettingsContext';

const highlights = [
  { icon: FiShield, title: 'IRDAI-licensed partners', desc: 'Real policies, real protection.' },
  { icon: FiLock,   title: 'Bank-grade security',     desc: 'Your data is always encrypted.' },
  { icon: FiHeart,  title: 'Human support 24/7',      desc: 'Real people, real answers.' },
];

const AuthLayout = () => {
  const { settings } = useSettings();
  const brandName = settings?.brandName || 'Bharat Insurance';
  const issueDate = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="min-h-screen flex bg-noir-950">
      {/* Left — editorial brand panel (desktop only) */}
      <aside className="hidden lg:flex relative w-1/2 isolate overflow-hidden text-white flex-col">
        {/* Deep noir wash */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at top right, #2A2A2A 0%, #0F0F0F 50%, #0A0A0A 100%)' }}
        />
        {/* Gold aurora blobs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="aurora-blob w-[540px] h-[540px] -top-40 -left-20"
            style={{ backgroundColor: 'rgba(201,169,97,0.20)' }}
          />
          <div
            className="aurora-blob w-[460px] h-[460px] -bottom-32 -right-20"
            style={{ backgroundColor: 'rgba(212,175,55,0.14)', animationDelay: '3s' }}
          />
        </div>
        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Floating gold particles */}
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="float-particle"
              style={{
                left: `${(i * 9 + 5) % 100}%`,
                bottom: '0',
                '--float-dur': `${10 + (i % 5) * 1.6}s`,
                '--float-delay': `${i * 0.7}s`,
              }}
            />
          ))}
        </div>

        {/* Magazine masthead */}
        <div className="relative z-10 border-b border-[rgba(201,169,97,0.25)]">
          <div className="px-8 py-2.5 flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#C9A961]">
            <span>{brandName} · Admin desk</span>
            <span className="flex items-center gap-2">
              <span>{issueDate}</span>
              <span className="w-1 h-1 rounded-full bg-[#C9A961]" />
              <span>VOL. I</span>
            </span>
          </div>
        </div>

        {/* Top nav */}
        <div className="relative z-10 p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            {settings?.brandLogo ? (
              <img
                src={settings.brandLogo}
                alt={brandName}
                referrerPolicy="no-referrer"
                className="h-10 w-auto"
              />
            ) : (
              <>
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)] border border-[#E5C770]">
                  <span className="text-noir-950 text-lg font-bold font-display italic">
                    {brandName.charAt(0)}
                  </span>
                </div>
                <span className="text-lg font-display font-semibold text-white tracking-tight">{brandName}</span>
              </>
            )}
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#E5C770] hover:text-white transition-colors"
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
            <div className="inline-flex items-center gap-2.5 mb-6">
              <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-widest">
                Nº 01
              </span>
              <span className="w-8 h-px bg-[#C9A961]" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#E5C770]">
                Admin control room
              </span>
            </div>
            <h1
              className="font-display font-semibold text-white text-balance tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.06 }}
            >
              Run the show,{' '}
              <span className="font-script italic" style={{ color: '#E5C770', fontSize: '1.05em' }}>
                without
              </span>{' '}
              the paperwork.
            </h1>
            <p className="text-base text-ink-300 leading-relaxed max-w-md">
              Every lead, every policy, every claim — managed from one dark-and-gold dashboard.
              Sign in to get back to work.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-10 space-y-4 max-w-md"
          >
            {highlights.map((item, i) => (
              <li key={item.title} className="flex items-start gap-3 relative pl-3">
                <span aria-hidden className="absolute left-0 top-2 bottom-2 w-px bg-[#C9A961]" />
                <span className="w-10 h-10 rounded-xl bg-noir-800 border border-[rgba(201,169,97,0.30)] flex items-center justify-center shrink-0 text-[#E5C770]">
                  <item.icon />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display italic text-[0.65rem] font-semibold text-[#C9A961] tracking-widest">
                      0{i + 1}
                    </span>
                    <span className="text-[0.92rem] font-display font-semibold text-white">{item.title}</span>
                  </div>
                  <div className="text-[0.78rem] text-ink-400 mt-0.5">{item.desc}</div>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Footer strip */}
        <div className="relative z-10 px-8 py-5 border-t border-[rgba(201,169,97,0.22)] text-[0.7rem] text-ink-400 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} {brandName}</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#E5C770] transition-colors">Privacy</Link>
            <span className="w-1 h-1 rounded-full bg-[#C9A961]" />
            <Link to="/terms" className="hover:text-[#E5C770] transition-colors">Terms</Link>
          </div>
        </div>
      </aside>

      {/* Right — form */}
      <main className="flex-1 lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-10 bg-noir-950 relative">
        {/* Subtle dot grid (mobile gets it too) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Mobile back link */}
        <Link
          to="/"
          className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-[#E5C770] hover:text-white transition-colors z-10"
        >
          <FiArrowLeft /> Back
        </Link>
        <div className="relative z-10 w-full flex justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
