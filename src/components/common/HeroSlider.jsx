import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPhone, FiCheck, FiArrowDownRight } from 'react-icons/fi';
import { FaShieldAlt, FaHeart, FaCar } from 'react-icons/fa';
import { useCustomerData } from '../../contexts/CustomerDataContext';
import { useSettings } from '../../contexts/SettingsContext';

const numberedFeatures = [
  { num: '01', title: 'IRDAI-licensed', desc: 'Only insurers regulated by India’s authority.' },
  { num: '02', title: '60-second quotes', desc: 'No forms. No call centres. No nonsense.' },
  { num: '03', title: 'Humans, not bots', desc: 'When you need someone, a real person picks up.' },
];

// Live activity strip — anonymized social proof
const liveActivity = [
  'Priya in Mumbai — health cover, 2 mins ago',
  'Rahul, Pune — bike renewal, 4 mins ago',
  'Aisha, Delhi — family floater, 7 mins ago',
  'Arjun, Bangalore — car insurance, 11 mins ago',
  'Meera, Hyderabad — travel insurance, 13 mins ago',
  'Vikram, Chennai — commercial fleet, 16 mins ago',
  'Sneha, Kolkata — life cover ₹50L, 19 mins ago',
  'Kabir, Ahmedabad — home insurance, 22 mins ago',
];

// Pre-computed gold-dust drops + sparkles (static so they don't re-render)
const SHOWER_DROPS = Array.from({ length: 18 }).map((_, i) => ({
  left: `${(i * 5.5 + Math.random() * 2) % 100}%`,
  duration: 4 + Math.random() * 3,
  delay: Math.random() * 4,
  height: 28 + Math.random() * 50,
}));
const SHOWER_SPARKLES = Array.from({ length: 12 }).map((_, i) => ({
  left: `${(i * 8 + Math.random() * 4) % 100}%`,
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
  const { sliderImages: allSliderData = [] } = useCustomerData();
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
    const timer = setInterval(() => paginate(1), 5500);
    return () => clearInterval(timer);
  }, [isPaused, paginate, sliderData.length, hasImageSlides]);

  const issueDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase(),
    []
  );

  return (
    <section
      className="relative isolate overflow-hidden text-white bg-noir-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Deep noir gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at top right, #2A2A2A 0%, #0F0F0F 50%, #0A0A0A 100%)' }}
      />

      {/* Gold aurora blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="aurora-blob w-[560px] h-[560px] -top-40 -left-32"
          style={{ backgroundColor: 'rgba(201, 169, 97, 0.18)' }}
        />
        <div
          className="aurora-blob w-[480px] h-[480px] top-1/4 -right-32"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.14)', animationDelay: '3s' }}
        />
        <div
          className="aurora-blob w-[420px] h-[420px] -bottom-32 left-1/3"
          style={{ backgroundColor: 'rgba(229, 199, 112, 0.10)', animationDelay: '6s' }}
        />
      </div>

      {/* Floating gold particles */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="float-particle"
            style={{
              left: `${(i * 7 + 5) % 100}%`,
              bottom: '0',
              '--float-dur': `${10 + (i % 6) * 1.4}s`,
              '--float-delay': `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* Gold dust shower */}
      <Shower />

      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Magazine masthead — top strip */}
      <div className="relative z-10 border-b border-[rgba(201,169,97,0.25)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#C9A961]">
          <span className="hidden sm:inline">{settings?.brandName || 'Bharat Insurance'} · The Coverage Quarterly</span>
          <span className="sm:hidden">{settings?.brandName || 'Bharat'}</span>
          <span className="flex items-center gap-3">
            <span className="hidden md:inline">Edition 2026</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-[#C9A961]" />
            <span>{issueDate}</span>
            <span className="w-1 h-1 rounded-full bg-[#C9A961]" />
            <span>VOL. I</span>
          </span>
        </div>
      </div>

      {/* Content grid */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-12 gap-3 sm:gap-5 lg:gap-10 items-center">
          {/* Left — magazine-style content */}
          <div className="col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3"
            >
              <span className="font-display italic text-[0.6rem] sm:text-[0.7rem] font-semibold text-[#C9A961] tracking-widest">
                Nº 01
              </span>
              <span className="w-5 sm:w-8 h-px bg-[#C9A961]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-ink-300">
                {settings?.hero?.badgeText || 'A new way to insure'}
              </span>
            </motion.div>

            <h1
              className="font-display font-semibold text-white text-balance mb-2 tracking-tight"
              style={{ fontSize: 'clamp(1.25rem, 4.4vw, 3.5rem)', lineHeight: 1.06 }}
            >
              <span className="word-reveal" style={{ '--word-delay': '0.05s' }}>
                <span>Insurance,</span>
              </span>
              <br />
              <span className="word-reveal italic font-medium" style={{ '--word-delay': '0.18s' }}>
                <span>delivered like</span>
              </span>{' '}
              <span className="word-reveal relative inline-block" style={{ '--word-delay': '0.32s' }}>
                <span className="font-script not-italic relative" style={{ fontSize: '1.05em', color: '#E5C770' }}>
                  luxury.
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 right-0 h-3 pointer-events-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 14' preserveAspectRatio='none'><path d='M3 9 C 35 2, 80 13, 130 5 S 190 11, 197 4' stroke='%23D4AF37' stroke-width='3' fill='none' stroke-linecap='round'/></svg>\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '100% 100%',
                    }}
                  />
                </span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-[0.78rem] sm:text-sm lg:text-base text-ink-300 leading-relaxed max-w-xl mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none"
            >
              {settings?.hero?.description ||
                'Compare honest quotes from 20+ IRDAI-licensed insurers in under 60 seconds. No call centres. No spam. Just cover that quietly shows up when it matters.'}
            </motion.p>

            {/* Numbered features — magazine sidebar style */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="hidden sm:grid grid-cols-3 gap-x-3 gap-y-2 mb-4 max-w-2xl"
            >
              {numberedFeatures.map((f, i) => (
                <div key={f.num} className="relative pl-3">
                  <span
                    aria-hidden
                    className="absolute left-0 top-1 bottom-1 w-px bg-[#C9A961]"
                  />
                  <div className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-widest mb-0.5">
                    {f.num}
                  </div>
                  <div className="font-display text-[0.95rem] font-semibold text-white leading-tight mb-0.5">
                    {f.title}
                  </div>
                  <div className="text-[0.78rem] text-ink-400 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3"
            >
              <Link
                to="/services"
                data-magnetic
                className="group inline-flex items-center justify-center gap-2 px-4 sm:px-7 h-11 sm:h-12 rounded-full bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 font-semibold text-[0.8125rem] sm:text-[0.9375rem] tracking-wide border border-[#B8923A] shadow-[0_18px_36px_-12px_rgba(201,169,97,0.55)] hover:shadow-[0_28px_56px_-16px_rgba(201,169,97,0.65)] active:scale-[0.98] transition-shadow duration-300 whitespace-nowrap"
              >
                <span className="sm:hidden">Get quote</span>
                <span className="hidden sm:inline">Get my fresh quote</span>
                <FiArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 h-11 sm:h-12 rounded-full bg-noir-950 text-[#E5C770] border border-[#C9A961] font-semibold text-[0.8125rem] sm:text-[0.9375rem] hover:bg-noir-800 hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                <FiPhone className="shrink-0 text-[#C9A961]" />
                {settings.phone}
              </a>
            </motion.div>
          </div>

          {/* Right — image collage with magazine framing */}
          <div className="col-span-5 relative w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Soft warm halo */}
              <div
                aria-hidden
                className="absolute -inset-8 rounded-[2.5rem] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(229,199,112,0.30) 0%, transparent 70%)',
                  filter: 'blur(24px)',
                }}
              />

              {/* Floating "tear-sheet" stack — main carousel + 2 offset accents */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[5/6] lg:aspect-[5/4]">
                {/* Back accent */}
                <div
                  aria-hidden
                  className="absolute top-2 right-2 bottom-6 left-6 rounded-3xl bg-[#FAF6EE] border border-[#EBDCB1] shadow-[0_12px_32px_-12px_rgba(46,37,16,0.10)]"
                />
                {/* Mid accent */}
                <div
                  aria-hidden
                  className="absolute top-1 right-1 bottom-4 left-4 rounded-3xl bg-white border border-[#E8DEC4] shadow-[0_18px_36px_-14px_rgba(46,37,16,0.14)]"
                />

                {/* Main framed image carousel */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden border-2 border-[#C9A961] bg-white shadow-[0_36px_72px_-20px_rgba(46,37,16,0.25)]">
                  {hasImageSlides ? (
                    <div className="relative w-full h-full">
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
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          {sliderData.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => goToSlide(i)}
                              aria-label={`Go to slide ${i + 1}`}
                              className={`h-1.5 rounded-full transition-all duration-400 ${
                                i === currentSlide
                                  ? 'w-8 bg-[#C9A961] shadow'
                                  : 'w-1.5 bg-white/80 hover:bg-white border border-[#E8DEC4]'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <FallbackVisual />
                  )}

                  {/* Editorial gold corner accents */}
                  <div aria-hidden className="absolute top-3 left-3 w-12 h-12 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#C9A961]" />
                    <div className="absolute top-0 left-0 h-[2px] w-8 bg-[#C9A961]" />
                  </div>
                  <div aria-hidden className="absolute bottom-3 right-3 w-12 h-12 pointer-events-none">
                    <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#C9A961]" />
                    <div className="absolute bottom-0 right-0 h-[2px] w-8 bg-[#C9A961]" />
                  </div>
                </div>

                {/* Floating gold seal/stamp — top-right overlay */}
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 12 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -top-2 -right-2 w-14 h-14 md:-top-3 md:-right-3 md:w-20 md:h-20 z-10"
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full bg-noir-950 border-2 border-[#C9A961] shadow-[0_16px_32px_-8px_rgba(10,10,10,0.45)]" />
                    <div className="absolute inset-2 rounded-full border border-[#C9A961]/50" />
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#C9A961]" fill="none">
                      <path id="seal-circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                      <text fontSize="9" fontFamily="serif" fill="#E5C770" letterSpacing="0.16em">
                        <textPath href="#seal-circle" startOffset="0">
                          ★ IRDAI LICENSED ★ SINCE 2010 ★
                        </textPath>
                      </text>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display italic text-[#E5C770] text-2xl font-bold">15+</span>
                      <span className="text-[0.55rem] uppercase tracking-widest text-[#E5C770] mt-0.5">years</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating mini-stat card — bottom-left overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 z-10 px-3 py-2 md:px-4 md:py-3 rounded-2xl bg-noir-950 border border-[#C9A961] shadow-[0_18px_36px_-12px_rgba(10,10,10,0.5)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['P', 'R', 'A'].map((letter, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] border-2 border-noir-950 flex items-center justify-center text-[0.65rem] font-display italic font-bold text-noir-950"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[0.7rem] font-semibold text-[#E5C770]">50,000+</div>
                      <div className="text-[0.6rem] text-ink-300">covered today</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Live activity ticker — marquee */}
      <div className="relative z-10 border-t border-b border-[rgba(201,169,97,0.20)] bg-noir-900/60 backdrop-blur-sm py-2 overflow-hidden">
        <div className="flex items-center gap-3 max-w-7xl mx-auto px-4">
          <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-noir-950 text-[#E5C770] border border-[#C9A961] text-[0.6rem] font-bold uppercase tracking-[0.14em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse-slow" />
            Live
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="flex gap-6 md:gap-10 whitespace-nowrap animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused]">
              {[...liveActivity, ...liveActivity].map((item, i) => (
                <span key={i} className="text-xs text-ink-300 shrink-0">
                  <span className="text-[#C9A961] mr-2">◆</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

const FallbackVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FDFAF1] via-[#FAF6EE] to-[#F5EBD3]">
    <svg
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 w-[44%] max-w-[180px]"
      aria-hidden
    >
      <defs>
        <linearGradient id="shield-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDFAF1" />
          <stop offset="100%" stopColor="#E5C770" />
        </linearGradient>
        <linearGradient id="shield-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B6F2C" />
          <stop offset="100%" stopColor="#C9A961" />
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
        stroke="#0A0A0A"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
    {[FaHeart, FaCar, FaShieldAlt].map((Icon, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          color: 'rgba(139, 111, 44, 0.22)',
          top: `${15 + (i % 2) * 60}%`,
          left: `${10 + (i * 28) % 80}%`,
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
