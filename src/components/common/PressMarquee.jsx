import React from 'react';
import { motion } from 'framer-motion';

/**
 * Editorial "As featured in" marquee — placeholder press/award labels in
 * elegant serif type. Conveys credibility instantly without needing logo SVGs.
 * Replace these labels with actual brand logos when client provides assets.
 */
const PRESS_ITEMS = [
  { name: 'Times of India', meta: 'Daily' },
  { name: 'Economic Times', meta: 'Finance' },
  { name: 'Business Standard', meta: 'Editorial' },
  { name: 'IRDAI', meta: 'Regulator' },
  { name: 'Forbes India', meta: 'Magazine' },
  { name: 'Mint', meta: 'Daily' },
  { name: 'BW Businessworld', meta: 'Weekly' },
  { name: 'YourStory', meta: 'Tech' },
];

const PressMarquee = () => (
  <section className="relative bg-noir-950 text-white overflow-hidden border-y border-[rgba(201,169,97,0.18)]">
    {/* Subtle warm aurora */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(201,169,97,0.10) 0%, transparent 65%)',
      }}
    />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-5 justify-center"
      >
        <span className="w-8 h-px bg-[#C9A961]" />
        <span className="font-display italic text-[0.7rem] font-semibold text-[#E5C770] tracking-[0.22em] uppercase">
          As featured in
        </span>
        <span className="w-8 h-px bg-[#C9A961]" />
      </motion.div>
    </div>

    {/* Marquee strip */}
    <div className="relative overflow-hidden pb-8 md:pb-10">
      <div className="flex gap-12 md:gap-16 whitespace-nowrap animate-[press-marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {[...PRESS_ITEMS, ...PRESS_ITEMS].map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="shrink-0 inline-flex items-center gap-3 group"
          >
            <span
              aria-hidden
              className="w-1.5 h-1.5 rotate-45 bg-[#C9A961] group-hover:bg-[#D4AF37] transition-colors"
            />
            <span className="font-display text-xl md:text-2xl text-ink-300 group-hover:text-[#E5C770] transition-colors tracking-tight italic">
              {p.name}
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-500 group-hover:text-[#C9A961] transition-colors">
              {p.meta}
            </span>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @keyframes press-marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </section>
);

export default PressMarquee;
