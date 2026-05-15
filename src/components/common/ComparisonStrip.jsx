import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiMinus } from 'react-icons/fi';

/**
 * Editorial comparison: us vs typical insurance aggregators / agents.
 * Premium table with accent checks for "us" and muted dashes for "rest of market".
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
  <section className="relative py-10 md:py-14 overflow-hidden" style={{ backgroundColor: 'var(--site-bg)' }}>
    {/* Soft accent wash */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at center, color-mix(in srgb, var(--site-accent, #C9A961) 10%, transparent) 0%, transparent 70%)',
      }}
    />
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--site-accent, #C9A961) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />

    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-10 h-px" style={{ backgroundColor: 'var(--site-accent, #C9A961)' }} />
          <span className="font-display italic text-[0.7rem] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--site-accent, #C9A961)' }}>
            How we compare
          </span>
          <span className="w-10 h-px" style={{ backgroundColor: 'var(--site-accent, #C9A961)' }} />
        </div>
        <h2
          className="font-display font-semibold text-balance tracking-tight"
          style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', lineHeight: 1.08, color: 'var(--site-text)' }}
        >
          The difference is{' '}
          <span className="italic" style={{ color: 'var(--site-accent, #C9A961)' }}>painfully obvious.</span>
        </h2>
        <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: 'var(--site-text-muted)' }}>
          Side-by-side, no fine print. This is what most aggregators hope you don&rsquo;t notice.
        </p>
      </motion.div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 4%, var(--site-bg, #FFFFFF))',
          border: '1.5px solid color-mix(in srgb, var(--site-accent, #C9A961) 30%, transparent)',
          boxShadow: '0 20px 48px -16px color-mix(in srgb, var(--site-accent, #C9A961) 15%, rgba(0,0,0,0.12))',
        }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_96px_96px] md:grid-cols-[1fr_180px_180px]"
          style={{ borderBottom: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 20%, transparent)' }}
        >
          <div className="px-5 py-5 md:px-8 md:py-6">
            <span className="font-display italic text-[0.7rem] font-semibold tracking-[0.18em] uppercase" style={{ color: 'var(--site-accent, #C9A961)' }}>
              The trait
            </span>
          </div>
          {/* "Us" column — accent-highlighted */}
          <div
            className="px-3 py-5 md:px-6 md:py-6 text-center relative"
            style={{
              borderLeft: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 20%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 12%, var(--site-bg, #FFFFFF))',
            }}
          >
            <div className="font-display italic text-base md:text-lg font-semibold" style={{ color: 'var(--site-accent, #C9A961)' }}>
              {brandName}
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.16em] mt-0.5" style={{ color: 'var(--site-accent, #C9A961)' }}>Us</div>
            {/* Spotlight ribbon */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: 'linear-gradient(90deg, var(--site-accent, #C9A961), color-mix(in srgb, var(--site-accent, #C9A961) 60%, white), var(--site-accent, #C9A961))' }}
            />
          </div>
          <div
            className="px-3 py-5 md:px-6 md:py-6 text-center"
            style={{ borderLeft: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 20%, transparent)' }}
          >
            <div className="font-display italic text-base md:text-lg" style={{ color: 'var(--site-text-muted)' }}>
              Typical
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.16em] mt-0.5" style={{ color: 'var(--site-text-subtle)' }}>aggregator</div>
          </div>
        </div>

        {/* Rows */}
        <div style={{ borderTop: 'none' }}>
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_96px_96px] md:grid-cols-[1fr_180px_180px] transition-colors"
              style={{
                borderTop: i > 0 ? '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 10%, transparent)' : undefined,
              }}
            >
              <div className="px-5 py-4 md:px-8 md:py-5 text-sm md:text-[0.9375rem]" style={{ color: 'var(--site-text)' }}>
                {row.trait}
              </div>
              <div
                className="px-3 py-4 md:px-6 md:py-5 flex items-center justify-center"
                style={{
                  borderLeft: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 10%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 6%, var(--site-bg, #FFFFFF))',
                }}
              >
                {row.us ? (
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--site-accent, #C9A961)',
                      border: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 60%, white)',
                      boxShadow: '0 4px 12px -2px color-mix(in srgb, var(--site-accent, #C9A961) 40%, transparent)',
                    }}
                  >
                    <FiCheck style={{ color: 'var(--site-bg, #FFFFFF)', strokeWidth: 3 }} />
                  </span>
                ) : (
                  <FiMinus style={{ color: 'var(--site-text-subtle)' }} />
                )}
              </div>
              <div
                className="px-3 py-4 md:px-6 md:py-5 flex items-center justify-center"
                style={{ borderLeft: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 10%, transparent)' }}
              >
                {row.them ? (
                  <FiCheck style={{ color: 'var(--site-text-muted)', strokeWidth: 2.5 }} />
                ) : (
                  <FiMinus style={{ color: 'var(--site-text-subtle)' }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div
          className="px-5 py-4 md:px-8 md:py-5 text-xs italic font-display"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 4%, var(--site-bg, #FFFFFF))',
            borderTop: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 15%, transparent)',
            color: 'var(--site-text-muted)',
          }}
        >
          &mdash; Comparison based on industry-standard practices. Not a knock on the rest, just a different choice.
        </div>
      </motion.div>
    </div>
  </section>
);

export default ComparisonStrip;
