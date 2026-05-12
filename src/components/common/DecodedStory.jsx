import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEdit3, FiBarChart2, FiCheckCircle } from 'react-icons/fi';

/**
 * Magazine-style 3-step scroll story. Alternating-side layouts on desktop,
 * stacked on mobile. Replaced bundled illustration files with crisp react-icon
 * chapter glyphs (smaller, theme-aware, doesn't clash with dark/gold palette).
 */
const CHAPTERS = [
  {
    num: '01',
    chapterLabel: 'Chapter One',
    headline: 'Tell us what to protect.',
    italic: 'health, ride, home, business — anything, really.',
    body:
      'No login. No 18-page form. Tap a card, share a few details, and we&rsquo;ll scout the market while you finish your chai.',
    Icon: FiEdit3,
    align: 'left',
  },
  {
    num: '02',
    chapterLabel: 'Chapter Two',
    headline: 'See the honest math.',
    italic: 'side-by-side quotes from 20+ insurers.',
    body:
      'Premiums, claim ratios, fine print, exclusions — laid out plainly. We rank by actual value, not commission.',
    Icon: FiBarChart2,
    align: 'right',
  },
  {
    num: '03',
    chapterLabel: 'Chapter Three',
    headline: 'Stay covered. Quietly.',
    italic: 'instant policy. zero paperwork.',
    body:
      'Policy delivered to your inbox in seconds. Renewal reminders before expiry. Claims handled by humans you can call.',
    Icon: FiCheckCircle,
    align: 'left',
  },
];

const DecodedStory = () => (
  <section className="relative bg-noir-950 py-8 md:py-12 overflow-hidden">
    {/* Background dot grid */}
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.10] pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
    {/* Warm halo */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at center top, rgba(201,169,97,0.10) 0%, transparent 60%)',
      }}
    />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section masthead */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-10 h-px bg-[#C9A961]" />
          <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.22em] uppercase">
            Insurance, decoded
          </span>
          <span className="w-10 h-px bg-[#C9A961]" />
        </div>
        <h2
          className="font-display font-semibold text-white text-balance tracking-tight"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.08 }}
        >
          Three chapters.{' '}
          <span className="italic text-[#E5C770]">One straight line</span>
          <br />
          from <em>confused</em> to <em className="text-[#E5C770]">covered.</em>
        </h2>
      </motion.div>

      {/* Chapters */}
      <div className="space-y-8 md:space-y-12">
        {CHAPTERS.map((c, i) => {
          const isRight = c.align === 'right';
          const Icon = c.Icon;
          return (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-12 gap-5 lg:gap-8 items-center"
            >
              {/* Icon column — compact thumbnail on mobile (tiny pill beside the chapter number),
                  expanded card on desktop on alternating sides. */}
              <div className={`lg:col-span-4 ${isRight ? 'lg:order-2' : 'lg:order-1'} hidden lg:block`}>
                <div className="relative aspect-[5/4] max-w-[220px] sm:max-w-[240px] mx-auto">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-noir-900 to-noir-800 border border-[rgba(201,169,97,0.30)] shadow-[0_20px_44px_-18px_rgba(0,0,0,0.65)]">
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, rgba(201,169,97,0.18) 0%, transparent 65%)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="text-[3.25rem] text-[#D4AF37] drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]" />
                    </div>
                    <div
                      aria-hidden
                      className={`absolute top-2 ${isRight ? 'right-3' : 'left-3'} font-display italic font-bold text-[2.25rem] leading-none text-[#C9A961]/30 select-none`}
                    >
                      {c.num}
                    </div>
                    <div aria-hidden className="absolute top-2 left-2 w-7 h-7 pointer-events-none">
                      <div className="absolute top-0 left-0 w-[1.5px] h-5 bg-[#C9A961]" />
                      <div className="absolute top-0 left-0 h-[1.5px] w-5 bg-[#C9A961]" />
                    </div>
                    <div aria-hidden className="absolute bottom-2 right-2 w-7 h-7 pointer-events-none">
                      <div className="absolute bottom-0 right-0 w-[1.5px] h-5 bg-[#C9A961]" />
                      <div className="absolute bottom-0 right-0 h-[1.5px] w-5 bg-[#C9A961]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content column */}
              <div className={`lg:col-span-8 ${isRight ? 'lg:order-1 lg:pr-4' : 'lg:order-2 lg:pl-4'}`}>
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span className="font-display italic text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] leading-none font-bold text-[#D4AF37]">
                    {c.num}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.18em] uppercase">
                      {c.chapterLabel}
                    </span>
                    <span className="w-12 h-px bg-[#C9A961] mt-1" />
                  </div>
                  {/* Mobile-only icon thumbnail — keeps editorial feel without dominating the screen */}
                  <div className="lg:hidden ml-auto shrink-0">
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-noir-900 to-noir-800 border border-[rgba(201,169,97,0.30)] flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(0,0,0,0.55)]">
                      <Icon className="text-[1.5rem] text-[#D4AF37]" />
                    </div>
                  </div>
                </div>

                <h3
                  className="font-display font-semibold text-white text-balance leading-[1.08] tracking-tight mb-3"
                  style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)' }}
                >
                  {c.headline}
                </h3>

                <p className="font-display italic text-lg md:text-xl text-[#E5C770] mb-4 leading-snug">
                  &mdash; {c.italic}
                </p>

                <p className="text-base text-ink-300 leading-relaxed max-w-xl"
                   dangerouslySetInnerHTML={{ __html: c.body }}
                />

                {i === CHAPTERS.length - 1 && (
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    <span>That&rsquo;s really it</span>
                    <FiArrowRight className="text-[#C9A961]" />
                    <span className="text-[#C9A961]">No catch, no upsell.</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default DecodedStory;
