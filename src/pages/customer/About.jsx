import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart, FiAward, FiShield, FiZap, FiSmile, FiArrowRight, FiUsers, FiTarget,
} from 'react-icons/fi';
import { Section, Container, Eyebrow, Card, Stat, Button } from '../../components/ui';
import MaharashtraCoverage from '../../components/common/MaharashtraCoverage';
import { useSettings } from '../../contexts/SettingsContext';

const values = [
  {
    icon: FiHeart,
    title: 'Customers first, always.',
    desc: 'Every decision starts with: what would we want if this were our claim, our family, our money?',
  },
  {
    icon: FiShield,
    title: 'Transparent by default.',
    desc: 'We show you the actual policy wording before you pay — not the fluffy marketing version.',
  },
  {
    icon: FiZap,
    title: 'Fast — but not rushed.',
    desc: 'Quotes in 60 seconds, yes. But we\'ll never hurry you into a policy that doesn\'t fit.',
  },
  {
    icon: FiSmile,
    title: 'Humans, not scripts.',
    desc: 'Our support team has real authority to solve real problems. No "let me transfer you" loops.',
  },
];

const pillars = [
  {
    icon: FiAward,
    title: 'IRDAI-licensed partners',
    desc: 'We only work with insurers regulated by the Insurance Regulatory and Development Authority of India.',
  },
  {
    icon: FiUsers,
    title: 'Thousands of happy policies',
    desc: 'Across health, life, vehicle, travel and business — we\'ve quietly kept people covered for years.',
  },
  {
    icon: FiTarget,
    title: '98% claim settlement',
    desc: 'Our partners maintain industry-leading settlement ratios — because insurance should pay out when it matters.',
  },
];

const About = () => {
  const { settings } = useSettings();
  const brandName = settings?.brandName || 'us';

  return (
    <>
      {/* Compact hero — light + gold */}
      <section className="relative isolate overflow-hidden bg-noir-950 text-white">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="aurora-blob w-[420px] h-[420px] -top-24 -left-20"
            style={{ backgroundColor: 'rgba(229,199,112,0.32)' }}
          />
          <div
            className="aurora-blob w-[360px] h-[360px] -bottom-24 -right-16"
            style={{ backgroundColor: 'rgba(212,175,55,0.22)', animationDelay: '3s' }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <Container className="relative py-12 md:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <Eyebrow tone="brand">About us</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-3 mb-3 text-balance text-white max-w-3xl mx-auto tracking-tight"
          >
            Insurance,{' '}
            <span className="italic relative inline-block">
              minus the headache.
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-2 pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 10' preserveAspectRatio='none'><path d='M3 7 C 50 2, 130 9, 200 4 S 270 8, 277 3' stroke='%23C9A961' stroke-width='3' fill='none' stroke-linecap='round'/></svg>\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                }}
              />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm md:text-base text-ink-300 max-w-2xl mx-auto leading-relaxed"
          >
            We believe insurance should feel like a safety net, not a maze. So we built the version we
            always wished existed — honest, human, and embarrassingly easy to use.
          </motion.p>
        </Container>
      </section>

      {/* Stats strip — noir cabinet card overlapping hero */}
      <Container className="relative -mt-10 z-10">
        <div className="rounded-3xl bg-gradient-to-br from-noir-900 to-noir-800 border border-[rgba(201,169,97,0.30)] shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] p-6 md:p-10 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(201,169,97,0.18) 0%, transparent 60%)',
            }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: 50, suffix: 'K+', label: 'Happy customers' },
              { value: 20, suffix: '+', label: 'Insurance partners' },
              { value: 98, suffix: '%', label: 'Claims settled' },
              { value: 24, suffix: '/7', label: 'Human support' },
            ].map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <Stat value={s.value} suffix={s.suffix} label={s.label} tone="brand" />
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Manifesto — large editorial pull-quote */}
      <section className="relative py-12 md:py-16 bg-noir-950 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-12 h-px bg-[#C9A961]" />
              <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.22em] uppercase">
                Our Manifesto
              </span>
              <span className="w-12 h-px bg-[#C9A961]" />
            </div>
            <span className="font-display italic text-[5rem] md:text-[7rem] leading-none text-[#C9A961]/30 select-none block mb-2">
              &ldquo;
            </span>
            <h2
              className="font-display font-semibold text-white text-balance leading-[1.1] tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)' }}
            >
              Insurance should be{' '}
              <span className="italic text-[#E5C770]">boring.</span>{' '}
              The exciting part is{' '}
              <span className="italic text-[#E5C770]">your life</span> —
              the family trip, the new business, the big move.
            </h2>
            <p className="text-base md:text-lg text-ink-300 leading-relaxed max-w-2xl mx-auto italic font-display">
              We just quietly show up when it matters, and otherwise stay out of the way.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Pillars — magazine three-column with editorial typography */}
      <section className="relative py-12 md:py-16 bg-noir-900 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,169,97,0.12) 0%, transparent 70%)',
          }}
        />
        <Container className="relative">
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
                What we stand on
              </span>
              <span className="w-10 h-px bg-[#C9A961]" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white text-balance tracking-tight">
              The three things we{' '}
              <span className="italic text-[#E5C770]">refuse to compromise on.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(201,169,97,0.20)] rounded-3xl overflow-hidden border border-[rgba(201,169,97,0.20)]">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="relative bg-noir-950 p-8 md:p-10 group hover:bg-noir-900 transition-colors"
              >
                <div className="font-display italic text-[3.5rem] leading-none font-bold text-[#C9A961]/30 select-none mb-4">
                  0{i + 1}
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] flex items-center justify-center text-noir-950 shadow-[0_8px_16px_-8px_rgba(201,169,97,0.5)] mb-5">
                  <p.icon className="text-lg" />
                </div>
                <h3 className="text-[1.125rem] font-display font-semibold text-white mb-2 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-ink-300 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Maharashtra coverage — service-area showcase */}
      <MaharashtraCoverage />

      {/* Values — left rail with gold rule */}
      <section className="relative py-12 md:py-16 bg-noir-950 overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-px bg-[#C9A961]" />
              <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.22em] uppercase">
                How we work
              </span>
              <span className="w-10 h-px bg-[#C9A961]" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white text-balance tracking-tight">
              Four values we{' '}
              <span className="italic text-[#E5C770]">take literally.</span>
            </h2>
            <p className="text-base text-ink-300 mt-3">We put them on the wall. We actually mean them.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="group relative pl-6 border-l border-[rgba(201,169,97,0.30)] hover:border-[#C9A961] transition-colors"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-display italic text-[#C9A961] text-2xl font-bold">0{i + 1}</span>
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-noir-800 border border-[rgba(201,169,97,0.30)] flex items-center justify-center text-[#E5C770] group-hover:bg-[#C9A961] group-hover:text-noir-950 transition-all">
                    <v.icon className="text-base" />
                  </div>
                </div>
                <h3 className="text-[1.125rem] font-display font-semibold text-white mb-2 tracking-tight">
                  {v.title}
                </h3>
                <p className="text-sm text-ink-300 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder note callout */}
      <section className="relative py-10 md:py-14 bg-noir-900 border-y border-[rgba(201,169,97,0.20)] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at left, rgba(201,169,97,0.10) 0%, transparent 60%)',
          }}
        />
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-[rgba(201,169,97,0.10)] border border-[rgba(201,169,97,0.30)] text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#E5C770]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              From the desk of the founder
            </div>
            <p className="font-display italic text-xl md:text-2xl text-white leading-snug mb-5 text-balance">
              &ldquo;After fifteen years of watching honest families get the runaround at claim time, I built the
              version of insurance I'd want for my own mother.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] flex items-center justify-center text-noir-950 font-display italic font-bold text-base border border-[#E5C770]">
                R
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-[#E5C770]">Rehan Sheikh</div>
                <div className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-400">Founder &amp; CEO</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative py-12 md:py-16 bg-noir-950">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow tone="light">Get in touch</Eyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mt-3 mb-3 text-balance text-white tracking-tight">
              Want to know more? Or just <span className="italic text-[#E5C770]">say hi?</span>
            </h2>
            <p className="text-ink-300 mb-6 max-w-lg mx-auto text-sm md:text-base">
              We genuinely like hearing from people. Even if it&apos;s just to ask a silly question.
            </p>
            <Button as={Link} to="/contact" variant="primary" size="lg" rightIcon={<FiArrowRight />}>
              Say hello
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
};

export default About;
