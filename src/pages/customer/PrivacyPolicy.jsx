import React from 'react';
import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';

import { Container, Eyebrow, Card } from '../../components/ui';
import { APP_NAME } from '../../utils/constants';
import { useSettings } from '../../contexts/SettingsContext';

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information we collect',
    body: (
      <>
        <p>When you use our services, we may collect the following:</p>
        <ul>
          <li>Full name and contact details (phone number, email address)</li>
          <li>Vehicle information (registration number, model, manufacturing year)</li>
          <li>Existing insurance policy details (insurer, policy expiry, NCB)</li>
          <li>Address and location information</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How we use your information',
    body: (
      <>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide insurance quotes and policy recommendations</li>
          <li>Contact you regarding your insurance inquiry</li>
          <li>Process insurance applications and renewals</li>
          <li>Send important policy updates and reminders</li>
          <li>Improve our services and customer experience</li>
        </ul>
      </>
    ),
  },
  {
    id: 'information-sharing',
    title: '3. Information sharing',
    body: (
      <p>
        We do not sell, trade, or rent your personal information to third parties. We may share your information
        with insurance companies only for the purpose of generating quotes and processing your insurance
        applications, with your consent.
      </p>
    ),
  },
  {
    id: 'data-security',
    title: '4. Data security',
    body: (
      <p>
        We implement appropriate security measures to protect your personal information against unauthorized access,
        alteration, disclosure, or destruction. All data is stored securely using industry-standard encryption.
      </p>
    ),
  },
  {
    id: 'cookies-analytics',
    title: '5. Cookies &amp; analytics',
    body: (
      <p>
        Our website may use cookies and similar technologies to enhance your browsing experience. These help us
        understand how visitors use our website, enabling us to improve our services.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: '6. Your rights',
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access and review your personal information</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of marketing communications</li>
        </ul>
      </>
    ),
  },
];

const PrivacyPolicy = () => {
  const { settings } = useSettings();

  return (
    <>
      {/* Hero strip */}
      <section className="relative isolate overflow-hidden grad-hero text-white">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="aurora-blob w-[500px] h-[500px] -top-32 -left-20 bg-teal-500/30" />
          <div
            className="aurora-blob w-[420px] h-[420px] -bottom-28 -right-16 bg-teal-400/25"
            style={{ animationDelay: '3s' }}
          />
        </div>
        <Container className="relative pt-14 pb-20 md:pt-20 md:pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex"
          >
            <Eyebrow tone="light" icon={<FiShield />}>Legal</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-display-lg font-display mt-5 mb-4 text-balance text-white"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-teal-100/85 max-w-2xl mx-auto leading-relaxed"
          >
            Plain-English version: we only collect what we need, we never sell your data, and you can ask us to
            delete it at any time.
          </motion.p>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sticky TOC */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              <div className="text-[0.6875rem] font-semibold text-ink-400 uppercase tracking-[0.14em] mb-3">
                On this page
              </div>
              <ul className="space-y-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block text-sm text-ink-500 hover:text-teal-700 transition-colors py-1"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <article className="lg:col-span-9 max-w-content">
            <Card variant="elevated" padding="lg" className="md:!p-10 lg:!p-12">
              <div className="legal-prose space-y-10">
                {sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-32">
                    <h2 className="text-xl md:text-2xl font-display font-semibold text-ink-900 mb-3">
                      {s.title}
                    </h2>
                    <div className="text-ink-600 leading-relaxed">{s.body}</div>
                  </section>
                ))}

                <section id="contact-us" className="scroll-mt-32">
                  <h2 className="text-xl md:text-2xl font-display font-semibold text-ink-900 mb-3">
                    7. Contact us
                  </h2>
                  <p className="text-ink-600 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a href={`mailto:${settings.email}`} className="text-teal-700 hover:text-teal-800 font-semibold underline-offset-4 hover:underline">
                      {settings.email}
                    </a>
                    {settings.phone && (
                      <>
                        {' '}or call us at{' '}
                        <a href={`tel:${settings.phoneRaw}`} className="text-teal-700 hover:text-teal-800 font-semibold underline-offset-4 hover:underline">
                          {settings.phone}
                        </a>
                      </>
                    )}.
                  </p>
                </section>

                <div className="pt-6 mt-6 border-t border-ink-100 text-sm text-ink-400">
                  Last updated: March 2026 &nbsp;·&nbsp; {APP_NAME}
                </div>
              </div>
            </Card>
          </article>
        </div>
      </Container>

      {/* Prose style block */}
      <style>{`
        .legal-prose ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-top: 0.75rem;
        }
        .legal-prose li {
          margin-bottom: 0.4rem;
          color: var(--ink-500);
        }
        .legal-prose p {
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default PrivacyPolicy;
