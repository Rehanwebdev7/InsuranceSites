import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

/**
 * Magazine-style 3-step scroll story. Replaces the generic "Four steps" process
 * grid with full-width alternating-side layouts — large serif chapter numbers,
 * editorial photography (uses bundled illustrations), gold rule lines.
 */
const CHAPTERS = [
  {
    num: '01',
    chapterLabel: 'Chapter One',
    headline: 'Tell us what to protect.',
    italic: 'health, ride, home, business — anything, really.',
    body:
      'No login. No 18-page form. Tap a card, share a few details, and we&rsquo;ll scout the market while you finish your chai.',
    illustration: '/illustrations/general-shield.svg',
    align: 'left',
  },
  {
    num: '02',
    chapterLabel: 'Chapter Two',
    headline: 'See the honest math.',
    italic: 'side-by-side quotes from 20+ insurers.',
    body:
      'Premiums, claim ratios, fine print, exclusions — laid out plainly. We rank by actual value, not commission.',
    illustration: '/illustrations/business.svg',
    align: 'right',
  },
  {
    num: '03',
    chapterLabel: 'Chapter Three',
    headline: 'Stay covered. Quietly.',
    italic: 'instant policy. zero paperwork.',
    body:
      'Policy delivered to your inbox in seconds. Renewal reminders before expiry. Claims handled by humans you can call.',
    illustration: '/illustrations/life.svg',
    align: 'left',
  },
];

const DecodedStory = () => (
  <section className="relative bg-noir-950 py-12 md:py-16 overflow-hidden">
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
      <div className="space-y-12 md:space-y-16">
        {CHAPTERS.map((c, i) => {
          const isRight = c.align === 'right';
          return (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center"
            >
              {/* Illustration column */}
              <div className={`lg:col-span-5 ${isRight ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative aspect-[5/4] max-w-sm mx-auto">
                  {/* Layered tear-sheet */}
                  <div
                    aria-hidden
                    className="absolute top-3 right-3 bottom-6 left-6 rounded-3xl bg-noir-800 border border-[rgba(201,169,97,0.20)] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)]"
                  />
                  <div className="absolute inset-0 rounded-3xl overflow-hidden border-2 border-[#C9A961] bg-gradient-to-br from-[#FDFAF1] via-[#FAF6EE] to-[#F5EBD3] shadow-[0_28px_56px_-16px_rgba(201,169,97,0.30)]">
                    <div className="absolute inset-0 flex items-center justify-center px-8">
                      <img
                        src={c.illustration}
                        alt={c.headline}
                        className="w-[78%] h-[78%] object-contain drop-shadow-[0_12px_24px_rgba(46,37,16,0.18)]"
                        loading="lazy"
                      />
                    </div>
                    {/* Chapter number — huge serif overlay */}
                    <div
                      aria-hidden
                      className={`absolute top-4 ${isRight ? 'right-5' : 'left-5'} font-display italic font-bold text-[5rem] leading-none text-[#C9A961]/15 select-none`}
                    >
                      {c.num}
                    </div>
                    {/* Gold corner accents */}
                    <div aria-hidden className="absolute top-3 left-3 w-10 h-10 pointer-events-none">
                      <div className="absolute top-0 left-0 w-[2px] h-7 bg-[#C9A961]" />
                      <div className="absolute top-0 left-0 h-[2px] w-7 bg-[#C9A961]" />
                    </div>
                    <div aria-hidden className="absolute bottom-3 right-3 w-10 h-10 pointer-events-none">
                      <div className="absolute bottom-0 right-0 w-[2px] h-7 bg-[#C9A961]" />
                      <div className="absolute bottom-0 right-0 h-[2px] w-7 bg-[#C9A961]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content column */}
              <div className={`lg:col-span-7 ${isRight ? 'lg:order-1 lg:pr-6' : 'lg:order-2 lg:pl-6'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display italic text-[3rem] md:text-[3.75rem] leading-none font-bold text-[#D4AF37]">
                    {c.num}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.18em] uppercase">
                      {c.chapterLabel}
                    </span>
                    <span className="w-12 h-px bg-[#C9A961] mt-1" />
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
