import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPhone } from 'react-icons/fi';
import { FaShieldAlt, FaHeart, FaCar } from 'react-icons/fa';
import { useCustomerData } from '../../contexts/CustomerDataContext';
import { useSettings } from '../../contexts/SettingsContext';

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

// Reusable highlight word (script gold + curve underline) so admin and default
// slides share the exact same visual treatment.
const ScriptAccent = ({ children }) => (
  <span className="relative inline-block">
    <span className="font-script not-italic relative" style={{ fontSize: '1.05em', color: '#E5C770' }}>
      {children}
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
);

// Parse an admin headline. A single `|` splits the text into a normal lead and
// a script-styled accent (rendered with the gold curve underline). Without a
// `|` the headline is rendered plainly in the display font.
const renderAdminHeadline = (raw) => {
  if (!raw) return null;
  const idx = raw.indexOf('|');
  if (idx === -1) return raw;
  const lead = raw.slice(0, idx).trim();
  const accent = raw.slice(idx + 1).trim();
  return (
    <>
      {lead && <>{lead} </>}
      {accent && <ScriptAccent>{accent}</ScriptAccent>}
    </>
  );
};

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

  // Per-slide editable copy — admin manages headline + subHeadline from Slider page
  const currentSlideData = sliderData[currentSlide] || null;
  const slideHeadline = currentSlideData?.headline?.trim();
  const slideSubHeadline = currentSlideData?.subHeadline?.trim();
  const defaultDescription =
    settings?.hero?.description ||
    'Compare honest quotes from 20+ IRDAI-licensed insurers in under 60 seconds. No call centres. No spam. Just cover that quietly shows up when it matters.';

  return (
    <section
      className="relative isolate overflow-hidden text-white bg-noir-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Deep noir gradient wash — uses theme variables for light/dark */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at top right, var(--site-surface-2) 0%, var(--site-bg-soft) 50%, var(--site-bg) 100%)' }}
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

      {/* Content grid — mobile-first stack, side-by-side at lg+ (≥1024px) */}
      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-10 items-center">
          {/* Left — content (full-width on mobile/tablet, 5/12 on desktop) */}
          <div className="lg:col-span-5 relative z-10">
            {/* Crossfading text block — opacity-only fade with mode='wait' so no overlap → no overflow even if description grows */}
            <div className="mb-6 sm:mb-7 lg:mb-8 min-h-[160px] sm:min-h-[180px] lg:min-h-[220px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`text-${currentSlide}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {slideHeadline ? (
                    <h1 className="font-display font-semibold text-white text-balance mb-3 tracking-tight text-[2rem] sm:text-[2.5rem] lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.08]">
                      {renderAdminHeadline(slideHeadline)}
                    </h1>
                  ) : (
                    <h1 className="font-display font-semibold text-white text-balance mb-3 tracking-tight text-[2rem] sm:text-[2.5rem] lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.08]">
                      Insurance,
                      <br />
                      <span className="italic font-medium">delivered like</span>{' '}
                      <ScriptAccent>luxury.</ScriptAccent>
                    </h1>
                  )}

                  <p className="text-[0.95rem] sm:text-base lg:text-[0.95rem] xl:text-base text-ink-300 leading-relaxed max-w-xl">
                    {slideSubHeadline || defaultDescription}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTAs — mobile-app feel: full-width stacked on phones, side-by-side on sm+, taller touch targets */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link
                to="/services"
                data-magnetic
                className="group inline-flex items-center justify-center gap-2 flex-nowrap px-6 sm:px-7 h-12 sm:h-12 rounded-full bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 font-semibold text-sm sm:text-[0.9375rem] tracking-wide border border-[#B8923A] shadow-[0_10px_24px_-10px_rgba(201,169,97,0.45)] hover:shadow-[0_14px_30px_-10px_rgba(201,169,97,0.55)] active:scale-[0.98] transition-shadow duration-300 whitespace-nowrap"
              >
                <span>Get my fresh quote</span>
                <FiArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 flex-nowrap px-6 h-12 rounded-full bg-noir-950 text-[#E5C770] border border-[#C9A961] font-semibold text-sm sm:text-[0.9375rem] hover:bg-noir-800 hover:text-white transition-colors duration-300 whitespace-nowrap"
              >
                <FiPhone className="shrink-0 text-[#C9A961]" />
                <span>{settings.phone}</span>
              </a>
            </motion.div>
          </div>

          {/* Right — image (full-width on mobile, 7/12 on desktop). No gold border so PNG transparency blends. */}
          <div className="lg:col-span-7 relative w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Soft warm halo */}
              <div
                aria-hidden
                className="absolute -inset-6 sm:-inset-8 rounded-[2.5rem] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(229,199,112,0.30) 0%, transparent 70%)',
                  filter: 'blur(24px)',
                }}
              />

              {/* Image container — slightly tall landscape on mobile, wider landscape on desktop */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/9]">
                {/* Main image carousel — NO border so transparent PNGs blend cleanly into the section */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent shadow-[0_24px_56px_-16px_rgba(46,37,16,0.45)] sm:shadow-[0_36px_72px_-20px_rgba(46,37,16,0.45)]">
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
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
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

                  {/* Editorial gold corner accents — hidden on mobile (less visual noise on small screens) */}
                  <div aria-hidden className="hidden sm:block absolute top-3 left-3 w-12 h-12 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#C9A961]" />
                    <div className="absolute top-0 left-0 h-[2px] w-8 bg-[#C9A961]" />
                  </div>
                  <div aria-hidden className="hidden sm:block absolute bottom-3 right-3 w-12 h-12 pointer-events-none">
                    <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#C9A961]" />
                    <div className="absolute bottom-0 right-0 h-[2px] w-8 bg-[#C9A961]" />
                  </div>
                </div>
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
