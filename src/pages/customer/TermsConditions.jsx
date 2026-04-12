import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';

import { Container, Eyebrow, Card } from '../../components/ui';
import { APP_NAME } from '../../utils/constants';
import { useSettings } from '../../contexts/SettingsContext';

const TermsConditions = () => {
  const { settings } = useSettings();

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of terms',
      body: (
        <p>
          By accessing and using the {APP_NAME} website and services, you agree to be bound by these Terms &amp;
          Conditions. If you do not agree with any part of these terms, please do not use our services.
        </p>
      ),
    },
    {
      id: 'services',
      title: '2. Services',
      body: (
        <p>
          {APP_NAME} acts as an insurance intermediary that helps customers compare and purchase insurance policies.
          We facilitate the connection between customers and insurance companies. The actual insurance contract is
          between the customer and the respective insurance company.
        </p>
      ),
    },
    {
      id: 'user-responsibilities',
      title: '3. User responsibilities',
      body: (
        <ul>
          <li>Provide accurate and complete information when requesting quotes</li>
          <li>Review all policy documents carefully before purchase</li>
          <li>Inform us of any changes in your vehicle or personal information</li>
          <li>Not misuse the platform for any unlawful purpose</li>
        </ul>
      ),
    },
    {
      id: 'insurance-quotes',
      title: '4. Insurance quotes',
      body: (
        <p>
          The insurance quotes provided through our platform are indicative and subject to verification by the
          respective insurance company. Final premium amounts may vary based on the insurer&apos;s assessment and
          applicable terms and conditions.
        </p>
      ),
    },
    {
      id: 'disclaimer',
      title: '5. Disclaimer',
      body: (
        <p>
          {APP_NAME} does not guarantee the accuracy, completeness, or reliability of any insurance quotes or
          information provided. We are not liable for any decisions made based on the information available on our
          platform. Insurance policies are subject to the terms and conditions of the respective insurance companies.
        </p>
      ),
    },
    {
      id: 'intellectual-property',
      title: '6. Intellectual property',
      body: (
        <p>
          All content on this website, including text, graphics, logos, and images, is the property of {APP_NAME}
          and is protected by applicable intellectual property laws. Unauthorized reproduction or distribution is
          strictly prohibited.
        </p>
      ),
    },
    {
      id: 'liability',
      title: '7. Limitation of liability',
      body: (
        <p>
          To the maximum extent permitted by law, {APP_NAME} shall not be liable for any indirect, incidental,
          special, or consequential damages arising out of or in connection with the use of our services.
        </p>
      ),
    },
    {
      id: 'governing-law',
      title: '8. Governing law',
      body: (
        <p>
          These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any
          disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
        </p>
      ),
    },
  ];

  return (
    <>
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
            <Eyebrow tone="light" icon={<FiFileText />}>Legal</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-display-lg font-display mt-5 mb-4 text-balance text-white"
          >
            Terms &amp; Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-teal-100/85 max-w-2xl mx-auto leading-relaxed"
          >
            Please read these carefully. We&apos;ve tried to keep it short and jargon-free.
          </motion.p>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
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

                <section id="contact" className="scroll-mt-32">
                  <h2 className="text-xl md:text-2xl font-display font-semibold text-ink-900 mb-3">
                    9. Contact
                  </h2>
                  <p className="text-ink-600 leading-relaxed">
                    For any questions regarding these Terms &amp; Conditions, please contact us at{' '}
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-teal-700 hover:text-teal-800 font-semibold underline-offset-4 hover:underline"
                    >
                      {settings.email}
                    </a>
                    {settings.phone && (
                      <>
                        {' '}or call us at{' '}
                        <a
                          href={`tel:${settings.phoneRaw}`}
                          className="text-teal-700 hover:text-teal-800 font-semibold underline-offset-4 hover:underline"
                        >
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

export default TermsConditions;
