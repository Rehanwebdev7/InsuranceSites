import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart, FiAward, FiShield, FiZap, FiSmile, FiArrowRight, FiUsers, FiTarget,
} from 'react-icons/fi';
import { Section, Container, Eyebrow, Card, Stat, Button } from '../../components/ui';
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
      {/* Compact hero */}
      <section className="relative isolate overflow-hidden grad-hero text-white">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="aurora-blob w-[420px] h-[420px] -top-24 -left-20 bg-teal-500/30" />
          <div
            className="aurora-blob w-[360px] h-[360px] -bottom-24 -right-16 bg-teal-400/25"
            style={{ animationDelay: '3s' }}
          />
        </div>
        <Container className="relative py-12 md:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <Eyebrow tone="light">About us</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mt-3 mb-3 text-balance text-white max-w-3xl mx-auto"
          >
            Insurance, minus the headache.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm md:text-base text-teal-100/85 max-w-2xl mx-auto leading-relaxed"
          >
            We believe insurance should feel like a safety net, not a maze. So we built the version we
            always wished existed — honest, human, and embarrassingly easy to use.
          </motion.p>
        </Container>
      </section>

      {/* Stats strip (overlap card) */}
      <Container className="relative -mt-8 z-10">
        <Card variant="elevated" padding="lg" className="!p-5 md:!p-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: 50, suffix: 'K+', label: 'Happy customers' },
              { value: 20, suffix: '+', label: 'Insurance partners' },
              { value: 98, suffix: '%', label: 'Claims settled' },
              { value: 24, suffix: '/7', label: 'Human support' },
            ].map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <Stat value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </Card>
      </Container>

      {/* Manifesto */}
      <Section
        tone="default"
        size="md"
        eyebrow="What we believe"
        title="Insurance should be boring."
        subtitle="The exciting part is your life — the family trip, the new business, the big move. Insurance should quietly show up when you need it, and otherwise stay out of the way."
      />

      {/* Pillars — replaces 'Our Journey' timeline */}
      <Section
        tone="soft"
        size="md"
        eyebrow="What we stand on"
        title="The three things we refuse to compromise on."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <Card
                variant="elevated"
                padding="lg"
                className="h-full group hover:border-teal-200 hover:shadow-[0_20px_40px_-16px_rgba(16,185,129,0.2)] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center text-white shadow-[0_8px_16px_-8px_rgba(16,185,129,0.4)] mb-4">
                  <p.icon className="text-xl" />
                </div>
                <h3 className="text-[1.0625rem] font-display font-semibold text-ink-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed">{p.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section
        tone="default"
        size="md"
        eyebrow="How we work"
        title="Four values we take literally."
        subtitle="We put them on the wall. We actually mean them."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
            >
              <div className="group relative bg-white border border-ink-100 rounded-2xl p-6 hover:border-teal-200 hover:shadow-[0_20px_40px_-16px_rgba(16,185,129,0.2)] transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-100 transition-colors">
                    <v.icon className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-[1.0625rem] font-display font-semibold text-ink-900 mb-1.5">
                      {v.title}
                    </h3>
                    <p className="text-sm text-ink-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section tone="soft" size="sm">
        <div className="text-center">
          <Eyebrow>Get in touch</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-display font-semibold mt-3 mb-3 text-balance">
            Want to know more? Or just say hi?
          </h2>
          <p className="text-ink-500 mb-6 max-w-lg mx-auto text-sm md:text-base">
            We genuinely like hearing from people. Even if it&apos;s just to ask a silly question.
          </p>
          <Button as={Link} to="/contact" variant="primary" size="lg" rightIcon={<FiArrowRight />}>
            Say hello
          </Button>
        </div>
      </Section>
    </>
  );
};

export default About;
