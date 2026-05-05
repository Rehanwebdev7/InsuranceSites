import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiMinus } from 'react-icons/fi';

/**
 * Editorial comparison: us vs typical insurance aggregators / agents.
 * Premium table with gold checks for "us" and muted dashes for "rest of market".
 */
const ROWS = [
  { trait: 'Transparent premium math', us: true, them: false },
  { trait: 'Quote in under 60 seconds', us: true, them: false },
  { trait: 'Real human picks up at 2 a.m.', us: true, them: false },
  { trait: 'Actual policy wording before you pay', us: true, them: false },
  { trait: 'Zero cross-selling, zero upsell calls', us: true, them: false },
  { trait: 'Compares 20+ IRDAI-licensed insurers', us: true, them: true },
  { trait: 'Cashless claim at 8,000+ partner garages', us: true, them: true },
];

const ComparisonStrip = ({ brandName = 'Bharat' }) => (
  <section className="relative bg-noir-900 py-16 md:py-24 overflow-hidden">
    {/* Soft warm wash */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(201,169,97,0.14) 0%, transparent 70%)',
      }}
    />
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.06] pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />

    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-10 h-px bg-[#C9A961]" />
          <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.22em] uppercase">
            How we compare
          </span>
          <span className="w-10 h-px bg-[#C9A961]" />
        </div>
        <h2
          className="font-display font-semibold text-white text-balance tracking-tight"
          style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', lineHeight: 1.08 }}
        >
          The difference is{' '}
          <span className="italic text-[#E5C770]">painfully obvious.</span>
        </h2>
        <p className="mt-3 text-base text-ink-300 max-w-xl mx-auto">
          Side-by-side, no fine print. This is what most aggregators hope you don&rsquo;t notice.
        </p>
      </motion.div>

      {/* Comparison table — dark cabinet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative rounded-3xl overflow-hidden bg-noir-800 border border-[rgba(201,169,97,0.30)] shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7),0_0_0_1px_rgba(201,169,97,0.10)]"
      >
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_180px_180px] border-b border-[rgba(201,169,97,0.20)] bg-noir-950">
          <div className="px-5 py-5 md:px-8 md:py-6">
            <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.18em] uppercase">
              The trait
            </span>
          </div>
          <div className="px-3 py-5 md:px-6 md:py-6 text-center border-l border-[rgba(201,169,97,0.20)] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] relative">
            <div className="font-display italic text-[#E5C770] text-base md:text-lg font-semibold">
              {brandName}
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.16em] text-[#C9A961] mt-0.5">Us</div>
            {/* Spotlight ribbon */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961]"
            />
          </div>
          <div className="px-3 py-5 md:px-6 md:py-6 text-center border-l border-[rgba(201,169,97,0.20)]">
            <div className="font-display italic text-ink-400 text-base md:text-lg">
              Typical
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-500 mt-0.5">aggregator</div>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[rgba(201,169,97,0.10)]">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_180px_180px] hover:bg-noir-900 transition-colors"
            >
              <div className="px-5 py-4 md:px-8 md:py-5 text-sm md:text-[0.9375rem] text-white">
                {row.trait}
              </div>
              <div className="px-3 py-4 md:px-6 md:py-5 flex items-center justify-center border-l border-[rgba(201,169,97,0.10)] bg-noir-950/60">
                {row.us ? (
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] border border-[#E5C770] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(201,169,97,0.5)]">
                    <FiCheck className="text-noir-950" strokeWidth={3} />
                  </span>
                ) : (
                  <FiMinus className="text-ink-500" />
                )}
              </div>
              <div className="px-3 py-4 md:px-6 md:py-5 flex items-center justify-center border-l border-[rgba(201,169,97,0.10)]">
                {row.them ? (
                  <FiCheck className="text-ink-500" strokeWidth={2.5} />
                ) : (
                  <FiMinus className="text-ink-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="px-5 py-4 md:px-8 md:py-5 bg-noir-950/60 border-t border-[rgba(201,169,97,0.20)] text-xs text-ink-400 italic font-display">
          &mdash; Comparison based on industry-standard practices. Not a knock on the rest, just a different choice.
        </div>
      </motion.div>
    </div>
  </section>
);

export default ComparisonStrip;
