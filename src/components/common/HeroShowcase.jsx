import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerData } from '../../contexts/CustomerDataContext';
import { useSettings } from '../../contexts/SettingsContext';

/**
 * Simple full-width image slider.
 * Admin uploads advertisement/banner images from the dashboard.
 * Images are displayed directly — no text overlays, no floating cards.
 * Clean, professional, direct.
 */
const HeroShowcase = ({ onOpenQuote }) => {
  const { sliderImages: allSliderData = [] } = useCustomerData();
  const { settings } = useSettings();
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const hero = settings?.hero || {};
  const autoplayMs = Math.max(Number(hero.autoplayMs) || 5000, 3000);

  const sliderData = useMemo(
    () => (allSliderData || []).filter((item) => item.active !== false && item.imageUrl),
    [allSliderData]
  );
  const hasImages = sliderData.length > 0;
  const multiSlide = sliderData.length > 1;

  useEffect(() => {
    if (isPaused || !hasImages || !multiSlide) return undefined;
    const timer = window.setInterval(() => {
      setSlide(([prev]) => [(prev + 1) % sliderData.length, 1]);
    }, autoplayMs);
    return () => window.clearInterval(timer);
  }, [autoplayMs, hasImages, isPaused, multiSlide, sliderData.length]);

  const goToSlide = (index) => {
    setSlide(([prev]) => [index, index > prev ? 1 : -1]);
  };

  // If no slider images at all, show a minimal branded hero
  if (!hasImages) {
    return (
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-balance mb-4">
            {settings?.brandName || 'Insurance'}
          </h1>
          <p className="text-base md:text-lg text-teal-100/80 max-w-2xl mx-auto mb-8">
            Compare honest quotes from 20+ IRDAI-licensed insurers in under 60 seconds.
          </p>
          <button
            type="button"
            onClick={onOpenQuote}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-teal-900 font-semibold text-[0.9375rem] shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            Get quotes
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-ink-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider container — responsive aspect ratio */}
      <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5.5] lg:aspect-[16/5]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={currentSlide}
            src={sliderData[currentSlide]?.imageUrl}
            alt={sliderData[currentSlide]?.title || `Banner ${currentSlide + 1}`}
            custom={direction}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Dot navigation */}
        {multiSlide && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {sliderData.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 h-2 bg-white shadow-lg'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroShowcase;
