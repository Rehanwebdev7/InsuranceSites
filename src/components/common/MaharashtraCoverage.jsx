import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';

const MAHARASHTRA_PATH =
  'M 95 110 C 140 88, 200 78, 270 84 S 410 92, 490 102 C 560 112, 630 130, 690 152 ' +
  'C 712 178, 720 220, 712 270 C 706 310, 690 348, 658 378 ' +
  'C 612 402, 540 412, 460 414 C 380 416, 300 410, 230 396 ' +
  'C 175 384, 130 364, 100 340 C 88 312, 96 286, 116 268 ' +
  'C 138 250, 150 230, 132 208 C 110 188, 92 168, 88 142 C 86 128, 90 118, 95 110 Z';

const CITIES = [
  { id: 'mumbai',     name: 'Mumbai',          stat: '12,400+ covered', cx: 132, cy: 282, delay: '0s'   },
  { id: 'thane',      name: 'Thane',           stat: '3,800+ covered',  cx: 152, cy: 264, delay: '0.4s' },
  { id: 'pune',       name: 'Pune',            stat: '8,900+ covered',  cx: 215, cy: 312, delay: '0.8s' },
  { id: 'nashik',     name: 'Nashik',          stat: '4,300+ covered',  cx: 196, cy: 208, delay: '1.2s' },
  { id: 'aurangabad', name: 'Chh. Sambhajinagar', stat: '3,100+ covered', cx: 318, cy: 232, delay: '1.6s' },
  { id: 'solapur',    name: 'Solapur',         stat: '2,700+ covered',  cx: 348, cy: 358, delay: '2.0s' },
  { id: 'kolhapur',   name: 'Kolhapur',        stat: '2,200+ covered',  cx: 198, cy: 392, delay: '2.4s' },
  { id: 'nagpur',     name: 'Nagpur',          stat: '5,600+ covered',  cx: 568, cy: 220, delay: '2.8s' },
];

const COVERAGE_STATS = [
  { num: '47,000+', label: 'Policies issued' },
  { num: '8',       label: 'Districts active' },
  { num: '8.6Cr+',  label: 'Claims settled (₹)' },
  { num: '24/7',    label: 'Local human support' },
];

/**
 * MaharashtraCoverage — premium dark+gold service-area showcase.
 *
 * Renders a stylised SVG outline of Maharashtra with pulsing gold city dots,
 * inline labels, and a coverage-stats sidebar. Boundary draws on viewport
 * entry via stroke-dashoffset animation; dots breathe via the pulseSoft
 * keyframe already defined in index.css.
 *
 * Pass `compact` to drop the stats sidebar + tighter padding (used on
 * Contact page above the office iframe).
 */
const MaharashtraCoverage = ({ compact = false }) => {
  return (
    <section
      className={`relative bg-noir-900 overflow-hidden ${compact ? 'py-10 md:py-12' : 'py-12 md:py-16'} border-y border-[rgba(201,169,97,0.20)]`}
    >
      {/* Dotted gold grid */}
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
            'radial-gradient(ellipse at 30% 40%, rgba(201,169,97,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-px bg-[#C9A961]" />
              <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.22em] uppercase">
                Where we cover
              </span>
              <span className="w-10 h-px bg-[#C9A961]" />
            </div>
            <h2
              className="font-display font-semibold text-white text-balance tracking-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)', lineHeight: 1.1 }}
            >
              Trusted across{' '}
              <span className="italic text-[#E5C770]">Maharashtra</span> —
              <br className="hidden md:block" />
              <span className="italic font-medium"> from Mumbai's high-rises to Nashik's vineyards.</span>
            </h2>
          </motion.div>
        )}

        {compact && (
          <div className="flex items-center gap-3 mb-5 justify-center">
            <span className="w-8 h-px bg-[#C9A961]" />
            <span className="font-display italic text-[0.7rem] font-semibold text-[#E5C770] tracking-[0.22em] uppercase">
              Statewide coverage
            </span>
            <span className="w-8 h-px bg-[#C9A961]" />
          </div>
        )}

        <div className={`grid gap-8 lg:gap-12 items-center ${compact ? '' : 'lg:grid-cols-12'}`}>
          {/* Map */}
          <div className={compact ? 'col-span-1' : 'lg:col-span-7'}>
            <div className="relative aspect-[8/5] max-w-3xl mx-auto">
              {/* Soft warm halo behind map */}
              <div
                aria-hidden
                className="absolute -inset-6 pointer-events-none blur-3xl opacity-60"
                style={{
                  background:
                    'radial-gradient(ellipse at 35% 50%, rgba(212,175,55,0.20) 0%, transparent 70%)',
                }}
              />

              <svg
                viewBox="0 0 800 500"
                xmlns="http://www.w3.org/2000/svg"
                className="relative w-full h-full"
                aria-label="Map of Maharashtra showing service coverage"
              >
                <defs>
                  <linearGradient id="mh-fill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(201,169,97,0.10)" />
                    <stop offset="100%" stopColor="rgba(201,169,97,0.03)" />
                  </linearGradient>
                  <radialGradient id="mh-dot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE9A8" />
                    <stop offset="40%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8B6F2C" />
                  </radialGradient>
                  <filter id="mh-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer fill */}
                <path d={MAHARASHTRA_PATH} fill="url(#mh-fill)" stroke="none" />

                {/* Inner subtle grid lines (decorative, geographic feel) */}
                <g stroke="rgba(201,169,97,0.10)" strokeWidth="0.5" fill="none">
                  <line x1="80" y1="260" x2="720" y2="260" />
                  <line x1="400" y1="80" x2="400" y2="420" />
                </g>

                {/* Animated boundary stroke — draws on view */}
                <motion.path
                  d={MAHARASHTRA_PATH}
                  fill="none"
                  stroke="#C9A961"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#mh-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Cities */}
                {CITIES.map((c) => (
                  <g key={c.id}>
                    {/* Outer pulsing halo */}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r="9"
                      fill="rgba(212,175,55,0.20)"
                      style={{ animation: `pulseSoft 2.6s ease-in-out infinite`, animationDelay: c.delay }}
                    />
                    {/* Mid ring */}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r="5"
                      fill="rgba(229,199,112,0.55)"
                      style={{ animation: `pulseSoft 2.6s ease-in-out infinite`, animationDelay: c.delay }}
                    />
                    {/* Solid gold dot */}
                    <circle cx={c.cx} cy={c.cy} r="2.6" fill="url(#mh-dot)" />
                    {/* Label — only visible on lg+ for readability */}
                    <text
                      x={c.cx + 9}
                      y={c.cy + 4}
                      fill="#E5C770"
                      fontSize="11"
                      fontFamily="'Playfair Display', Georgia, serif"
                      fontStyle="italic"
                      className="hidden md:block"
                    >
                      {c.name}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Decorative compass — tiny gold corner stamp */}
              <div
                aria-hidden
                className="absolute top-2 right-2 w-12 h-12 hidden md:flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full border border-[rgba(201,169,97,0.35)] flex items-center justify-center">
                  <span className="font-display italic text-[#C9A961] text-xs">N</span>
                </div>
              </div>
            </div>

            {/* Mobile city legend (since SVG labels are hidden on mobile) */}
            <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-2 md:hidden">
              {CITIES.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 text-[0.7rem] text-ink-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats sidebar — only in full mode */}
          {!compact && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="rounded-3xl bg-noir-800 border border-[rgba(201,169,97,0.25)] p-6 md:p-8 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-3 mb-5">
                  <FiMapPin className="text-[#E5C770]" />
                  <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.18em] uppercase">
                    Coverage at a glance
                  </span>
                </div>

                <ul className="divide-y divide-[rgba(201,169,97,0.18)]">
                  {COVERAGE_STATS.map((s, i) => (
                    <li key={s.label} className="py-4 flex items-baseline justify-between gap-4 first:pt-0 last:pb-0">
                      <span className="text-[0.85rem] text-ink-300 font-medium">{s.label}</span>
                      <span className="font-display text-[1.6rem] md:text-[1.85rem] font-semibold text-[#E5C770] leading-none">
                        {s.num}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-5 border-t border-[rgba(201,169,97,0.20)]">
                  <p className="text-[0.78rem] text-ink-400 leading-relaxed italic">
                    From the Konkan coast to Vidarbha&apos;s heartland — quietly keeping families,
                    fleets and small businesses covered for over a decade.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MaharashtraCoverage;
