import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPhone, FiClock } from 'react-icons/fi';
import { useSettings } from '../../contexts/SettingsContext';

const CTASection = () => {
  const { settings } = useSettings();
  return (
    <section className="relative py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[2rem] md:rounded-[2.5rem] grad-hero shadow-[0_40px_80px_-24px_rgba(2,44,34,0.4)]"
        >
          {/* Aurora blobs */}
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="aurora-blob w-[520px] h-[520px] -top-32 -left-20 bg-teal-400/35" />
            <div
              className="aurora-blob w-[440px] h-[440px] -bottom-32 -right-16 bg-teal-500/30"
              style={{ animationDelay: '4s' }}
            />
          </div>

          {/* Concentric rings SVG */}
          <svg
            aria-hidden
            className="absolute -right-40 -top-40 w-[600px] h-[600px] opacity-20"
            viewBox="0 0 600 600"
          >
            <defs>
              <radialGradient id="ring" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0" />
                <stop offset="60%" stopColor="#6EE7B7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[120, 200, 280, 360, 440].map((r) => (
              <circle
                key={r}
                cx="300"
                cy="300"
                r={r}
                stroke="url(#ring)"
                strokeWidth="1.5"
                fill="none"
              />
            ))}
          </svg>

          {/* Noise */}
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-teal-100"
            >
              <FiClock className="text-teal-300" />
              30 seconds — that's all it takes
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-display-lg font-display text-white text-balance leading-[1.05] max-w-3xl mx-auto mb-4"
            >
              Still paying{' '}
              <span className="text-grad-hero">yesterday&apos;s premiums?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg text-teal-100/80 leading-relaxed max-w-2xl mx-auto mb-8"
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
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-teal-900 font-semibold text-[0.9375rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                See my fresh quotes
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-[0.9375rem] hover:bg-white/15 transition-all duration-300"
              >
                <FiPhone className="text-teal-300" />
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
