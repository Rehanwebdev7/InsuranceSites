import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPhone, FiClock } from 'react-icons/fi';
import { useSettings } from '../../contexts/SettingsContext';

const CTASection = () => {
  const { settings } = useSettings();
  return (
    <section className="relative py-12 md:py-16 bg-ivory-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA panel — noir bg with gold detailing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[2rem] md:rounded-[2.5rem] grad-hero shadow-[0_40px_80px_-24px_rgba(10,10,10,0.45)] border border-[rgba(201,169,97,0.25)]"
        >
          {/* Warm aurora blobs */}
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="aurora-blob w-[520px] h-[520px] -top-32 -left-20"
              style={{ backgroundColor: 'rgba(201, 169, 97, 0.30)' }}
            />
            <div
              className="aurora-blob w-[440px] h-[440px] -bottom-32 -right-16"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.20)', animationDelay: '4s' }}
            />
          </div>

          {/* Concentric gold rings */}
          <svg
            aria-hidden
            className="absolute -right-40 -top-40 w-[600px] h-[600px] opacity-25"
            viewBox="0 0 600 600"
          >
            <defs>
              <radialGradient id="goldRing" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E5C770" stopOpacity="0" />
                <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#C9A961" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[120, 200, 280, 360, 440].map((r) => (
              <circle
                key={r}
                cx="300"
                cy="300"
                r={r}
                stroke="url(#goldRing)"
                strokeWidth="1.5"
                fill="none"
              />
            ))}
          </svg>

          {/* Subtle noise */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            }}
          />

          <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-14 md:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-[rgba(229,199,112,0.10)] backdrop-blur-md border border-[rgba(201,169,97,0.30)] text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#E5C770]"
            >
              <FiClock className="text-[#D4AF37]" />
              30 seconds — that&apos;s all it takes
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-display-lg font-display text-white text-balance leading-[1.05] max-w-3xl mx-auto mb-4 tracking-tight"
            >
              Still paying{' '}
              <span className="italic text-grad-hero">yesterday&apos;s premiums?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg text-ink-300 leading-relaxed max-w-2xl mx-auto mb-8"
            >
              The policy you bought three years ago might be quietly costing you 30% extra.
              Thirty seconds to find out — no email, no pushy follow-ups.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                to="/services"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 font-semibold text-[0.9375rem] tracking-wide border border-[#E5C770] shadow-[0_20px_40px_-12px_rgba(201,169,97,0.55)] hover:shadow-[0_28px_56px_-16px_rgba(201,169,97,0.7)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                See my fresh quotes
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(229,199,112,0.30)] text-white font-semibold text-[0.9375rem] hover:bg-[rgba(229,199,112,0.10)] hover:border-[#C9A961] transition-all duration-300"
              >
                <FiPhone className="text-[#E5C770]" />
                or just call us
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
