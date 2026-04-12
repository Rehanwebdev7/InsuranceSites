import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiShield, FiZap, FiLock, FiStar, FiPhone, FiCheck } from 'react-icons/fi';
import { FaShieldAlt, FaHeart, FaCar, FaUmbrella } from 'react-icons/fa';
import { useCustomerData } from '../../contexts/CustomerDataContext';
import { useSettings } from '../../contexts/SettingsContext';

const trustChips = [
  { icon: FiStar, text: '4.8/5 rated' },
  { icon: FiShield, text: '50,000+ customers' },
  { icon: FiZap, text: '60-sec quotes' },
];

const miniBullets = ['Instant quotes', 'No spam calls', '100% secure'];

// Pre-computed shower drops and sparkles — static so they don't re-render
const SHOWER_DROPS = Array.from({ length: 28 }).map((_, i) => ({
  left: `${(i * 3.6 + Math.random() * 2) % 100}%`,
  duration: 3 + Math.random() * 3,
  delay: Math.random() * 4,
  height: 40 + Math.random() * 60,
}));
const SHOWER_SPARKLES = Array.from({ length: 18 }).map((_, i) => ({
  left: `${(i * 5.6 + Math.random() * 4) % 100}%`,
  top: `${Math.random() * 100}%`,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 3,
}));

const Shower = () => (
  <div className="shower" aria-hidden>
    {SHOWER_DROPS.map((d, i) => (
      <span
        key={`drop-${i}`}
        className="shower-drop"
        style={{
          left: d.left,
          height: `${d.height}px`,
          animationDuration: `${d.duration}s`,
          animationDelay: `${d.delay}s`,
        }}
      />
    ))}
    {SHOWER_SPARKLES.map((s, i) => (
      <span
        key={`spark-${i}`}
        className="shower-sparkle"
        style={{
          left: s.left,
          top: s.top,
          animationDelay: `${s.delay}s`,
          '--twinkle-dur': `${s.duration}s`,
        }}
      />
    ))}
  </div>
);

const HeroSlider = () => {
  const { sliderImages: allSliderData = [], isLoading: loading } = useCustomerData();
  const { settings } = useSettings();
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const sliderData = useMemo(
    () => (allSliderData || []).filter((s) => s.active !== false && s.imageUrl),
    [allSliderData]
  );
  const hasImageSlides = sliderData.length > 0;

  const paginate = useCallback(
    (newDirection) => {
      if (!sliderData.length) return;
      setSlide(([prev]) => {
        const next = (prev + newDirection + sliderData.length) % sliderData.length;
        return [next, newDirection];
      });
    },
    [sliderData.length]
  );

  const goToSlide = useCallback((index) => {
    setSlide(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (isPaused || !hasImageSlides || sliderData.length <= 1) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [isPaused, paginate, sliderData.length, hasImageSlides]);

  return (
    <section
      className="relative isolate overflow-hidden text-white flex items-center min-h-[calc(100svh-64px)] lg:min-h-[calc(100svh-72px)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient base */}
      <div aria-hidden className="absolute inset-0 grad-hero" />

      {/* Aurora blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora-blob w-[560px] h-[560px] -top-40 -left-32 bg-teal-500/35" />
        <div
          className="aurora-blob w-[480px] h-[480px] top-1/4 -right-32 bg-teal-400/25"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="aurora-blob w-[420px] h-[420px] -bottom-32 left-1/3 bg-teal-300/20"
          style={{ animationDelay: '6s' }}
        />
      </div>

      {/* Shower animation */}
      <Shower />

      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content grid */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left — content */}
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-slow" />
              Trusted by 50,000+ customers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.25rem] sm:text-5xl lg:text-[3.75rem] font-display font-semibold text-white text-balance mb-4 leading-[1.02]"
            >
              Insurance that{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-grad-hero">actually shows up</span>
                <svg
                  aria-hidden
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C60 2 140 2 298 6"
                    stroke="url(#heroUnderline)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="heroUnderline" x1="0" y1="0" x2="300" y2="0">
                      <stop offset="0%" stopColor="#34D399" stopOpacity="0" />
                      <stop offset="50%" stopColor="#6EE7B7" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{' '}
              when you need it.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base lg:text-lg text-teal-100/85 leading-relaxed max-w-2xl mb-6"
            >
              Health, life, vehicle, travel — compare honest quotes from 20+ IRDAI-licensed
              insurers in under 60 seconds. No call centers, no pushy agents.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
            >
              <Link
                to="/services"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-teal-900 font-semibold text-[0.9375rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] hover:shadow-[0_28px_48px_-16px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                See my fresh quotes
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-[0.9375rem] hover:bg-white/15 transition-all duration-300"
              >
                <FiPhone className="text-teal-200" />
                {settings.phone}
              </a>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {trustChips.map((chip) => (
                <div key={chip.text} className="flex items-center gap-1.5 text-sm text-teal-100/90">
                  <chip.icon className="text-teal-300 text-base" />
                  <span className="font-medium">{chip.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — visual */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur-sm shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                {hasImageSlides ? (
                  <div className="relative aspect-[4/3] md:aspect-[5/4] lg:aspect-[4/3]">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.img
                        key={currentSlide}
                        src={sliderData[currentSlide]?.imageUrl}
                        alt={sliderData[currentSlide]?.title || `Slide ${currentSlide + 1}`}
                        custom={direction}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                        referrerPolicy="no-referrer"
                      />
                    </AnimatePresence>
                    {sliderData.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {sliderData.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-400 ${
                              i === currentSlide
                                ? 'w-8 bg-white shadow'
                                : 'w-1.5 bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <FallbackVisual />
                )}
              </div>
            </motion.div>

            {/* Micro-trust row (moved from above, no floating cards) */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-teal-100/85 justify-center lg:justify-start"
            >
              {miniBullets.map((b) => (
                <li key={b} className="flex items-center gap-1.5">
                  <FiCheck className="text-teal-300 text-[0.95em]" />
                  {b}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const FallbackVisual = () => (
  <div className="relative aspect-[4/3] md:aspect-[5/4] lg:aspect-[4/3] flex items-center justify-center">
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-br from-teal-800/60 via-teal-900/40 to-teal-950/70"
    />
    <svg
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 w-[60%] max-w-xs drop-shadow-2xl"
      aria-hidden
    >
      <defs>
        <linearGradient id="shield-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="shield-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <path
        d="M160 20 C110 55 75 65 40 65 L40 175 C40 255 95 305 160 310 C225 305 280 255 280 175 L280 65 C245 65 210 55 160 20 Z"
        fill="url(#shield-a)"
        opacity="0.92"
      />
      <path
        d="M160 48 C118 78 89 88 65 90 L65 172 C65 232 107 278 160 292 C213 278 255 232 255 172 L255 90 C231 88 202 78 160 48 Z"
        fill="url(#shield-b)"
      />
      <path
        d="M110 170 L145 208 L215 130"
        stroke="#ECFDF5"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
    {[FaHeart, FaCar, FaUmbrella, FaShieldAlt].map((Icon, i) => (
      <motion.div
        key={i}
        className="absolute text-white/20"
        style={{
          top: `${15 + (i % 2) * 60}%`,
          left: `${10 + (i * 22) % 80}%`,
          fontSize: `${28 + (i % 2) * 10}px`,
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4 + i, repeat: Infinity }}
      >
        <Icon />
      </motion.div>
    ))}
  </div>
);

export default HeroSlider;
