import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FiMapPin, FiPhone, FiMail, FiClock, FiUser, FiMessageSquare, FiSend, FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Section, Container, Eyebrow, Card, Button, Input } from '../../components/ui';
import MaharashtraCoverage from '../../components/common/MaharashtraCoverage';
import { useSettings } from '../../contexts/SettingsContext';
import { addLead } from '../../services/leadService';
import { queueSupportEmail, buildContactEmail } from '../../services/emailService';

const contactSchema = yup.object({
  fullName: yup.string().required('Name is required').min(2, 'At least 2 characters'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: yup.string().email('Enter a valid email').nullable().transform((v) => (v === '' ? null : v)),
  message: yup.string().required('Please tell us what you need').min(5, 'A bit more detail please'),
});

const Contact = () => {
  const { settings, fullAddress, whatsappLink } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(contactSchema) });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await addLead({
        fullName: data.fullName,
        mobile: data.mobile,
        email: data.email || '',
        vehicleNumber: '',
        vehicleModel: '',
        hasActivePolicy: false,
        currentInsurer: '',
        policyExpiry: '',
        formType: 'contact',
        serviceTitle: 'Contact form',
        source: 'website',
        notes: data.message,
      });

      // Send email to support (queued via Firestore Trigger Email extension)
      const supportEmail = settings?.supportEmail || settings?.email;
      if (supportEmail) {
        const emailContent = buildContactEmail({
          fullName: data.fullName,
          mobile: data.mobile,
          email: data.email,
          message: data.message,
          brandName: settings?.brandName,
        });
        await queueSupportEmail({
          to: supportEmail,
          replyTo: data.email || undefined,
          ...emailContent,
        });
      }

      toast.success('Got it! Someone from our team will reply within the hour.', {
        autoClose: 4000,
      });
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Contact form failed:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: FiPhone,
      label: 'Call us',
      value: settings.phone,
      href: `tel:${settings.phoneRaw}`,
      hint: 'We\'ll pick up in under 3 rings.',
    },
    {
      icon: FiMail,
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
      hint: 'Replies within the hour, 9am–9pm.',
    },
    {
      icon: FiMapPin,
      label: 'Visit us',
      value: fullAddress,
      href: settings.mapUrl,
      hint: 'Chai\'s on us if you\'re in the neighbourhood.',
    },
    {
      icon: FiClock,
      label: 'Business hours',
      value: settings.businessHours,
      hint: 'Emergency claims? Call anytime.',
    },
  ];

  return (
    <>
      {/* Hero — light + gold */}
      <section className="relative isolate overflow-hidden bg-noir-950 text-white">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="aurora-blob w-[520px] h-[520px] -top-32 -left-20"
            style={{ backgroundColor: 'rgba(229,199,112,0.30)' }}
          />
          <div
            className="aurora-blob w-[440px] h-[440px] -bottom-28 -right-16"
            style={{ backgroundColor: 'rgba(212,175,55,0.20)', animationDelay: '3s' }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, #C9A961 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <Container className="relative py-8 md:py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <Eyebrow tone="brand">Say hello</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-3 mb-3 text-balance text-white tracking-tight"
          >
            Let&apos;s talk.{' '}
            <span className="italic">Real humans, right here.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm md:text-base text-ink-300 max-w-2xl mx-auto leading-relaxed"
          >
            Questions about policies, claims, or just wondering if we cover your cousin&apos;s tractor?
            Drop a line — we love a good chat.
          </motion.p>
        </Container>
      </section>

      {/* Main grid */}
      <section className="bg-noir-900 py-8 md:py-12 border-y border-[rgba(201,169,97,0.18)]">
      <Container>
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl bg-noir-800 border border-[rgba(201,169,97,0.25)] shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] p-6 md:p-10 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at top right, rgba(201,169,97,0.10) 0%, transparent 60%)',
                }}
              />
              <div className="relative">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] text-noir-950 border border-[#E5C770] flex items-center justify-center">
                    <FiCheck className="text-2xl" strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white mb-2 tracking-tight">
                    Message received.
                  </h3>
                  <p className="text-sm text-ink-300 mb-6">
                    A real person from our team will reply within the hour. Promise.
                  </p>
                  <Button variant="secondary" onClick={() => setSubmitted(false)}>
                    Send another
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.18em] uppercase">Drop a line</span>
                    <span className="w-12 h-px bg-[#C9A961]" />
                  </div>
                  <h2 className="font-display text-display-md text-white mb-2 tracking-tight">
                    Write to us.
                  </h2>
                  <p className="text-sm text-ink-300 mb-8">
                    We read everything. No bots, no auto-replies.
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                      tone="dark"
                      label="Your name"
                      placeholder="e.g., Priya Sharma"
                      leftIcon={<FiUser />}
                      error={errors.fullName?.message}
                      required
                      {...register('fullName')}
                    />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Input
                        tone="dark"
                        label="Mobile number"
                        placeholder="10-digit mobile"
                        type="tel"
                        maxLength={10}
                        leftIcon={<FiPhone />}
                        prefix="+91"
                        error={errors.mobile?.message}
                        required
                        {...register('mobile')}
                      />
                      <Input
                        tone="dark"
                        label="Email"
                        placeholder="email@example.com"
                        type="email"
                        leftIcon={<FiMail />}
                        error={errors.email?.message}
                        helperText="Optional, but handy for attachments"
                        {...register('email')}
                      />
                    </div>
                    <div>
                      <label className="block text-[0.8125rem] font-semibold text-ink-200 mb-1.5 tracking-[0.01em]">
                        What can we help with? <span className="text-red-400">*</span>
                      </label>
                      <div
                        className={[
                          'relative rounded-xl border-[1.5px] bg-noir-900 transition-all duration-200',
                          errors.message
                            ? 'border-red-500/60 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]'
                            : 'border-[rgba(201,169,97,0.30)] focus-within:border-[#C9A961] focus-within:shadow-[0_0_0_4px_rgba(201,169,97,0.18)]',
                        ].join(' ')}
                      >
                        <div className="flex gap-3 px-4 pt-3">
                          <FiMessageSquare className="text-[#E5C770] mt-0.5" />
                          <textarea
                            rows={5}
                            placeholder="Tell us a bit about what you need…"
                            className="w-full bg-transparent outline-none resize-none pr-3 pb-3 text-[0.9375rem] text-white placeholder:text-ink-500"
                            {...register('message')}
                          />
                        </div>
                      </div>
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.message.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={submitting}
                      rightIcon={<FiSend />}
                    >
                      {submitting ? 'Sending…' : 'Send message'}
                    </Button>
                  </form>
                </>
              )}
              </div>
            </div>
          </motion.div>

          {/* Info sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="rounded-3xl bg-noir-800 border border-[rgba(201,169,97,0.25)] p-6 md:p-8 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display italic text-[0.7rem] font-semibold text-[#C9A961] tracking-[0.18em] uppercase">Direct lines</span>
                <span className="w-12 h-px bg-[#C9A961]" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-semibold text-white mt-1 mb-5 tracking-tight">
                Prefer a <span className="italic text-[#E5C770]">quicker route?</span>
              </h3>
              <ul className="space-y-5">
                {contactItems.map((item) => {
                  const content = (
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-10 h-10 rounded-xl bg-noir-900 text-[#E5C770] border border-[rgba(201,169,97,0.30)] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#C9A961] group-hover:to-[#8B6F2C] group-hover:text-noir-950 transition-all">
                        <item.icon className="text-base" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.6875rem] font-semibold text-[#C9A961] uppercase tracking-[0.14em] mb-0.5">
                          {item.label}
                        </div>
                        <div className="text-sm text-white font-medium break-words">
                          {item.value}
                        </div>
                        {item.hint && (
                          <div className="text-xs text-ink-400 mt-0.5">{item.hint}</div>
                        )}
                      </div>
                    </div>
                  );
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href?.startsWith('http') ? '_blank' : undefined}
                          rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="group block -m-2 p-2 rounded-xl hover:bg-noir-900 transition-colors"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="group">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 pt-5 border-t border-[rgba(201,169,97,0.20)]">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold text-sm shadow-[0_12px_24px_-12px_rgba(37,211,102,0.5)] border border-[#C9A961] transition-all active:scale-[0.98]"
                >
                  <FaWhatsapp className="text-lg" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Statewide coverage — Maharashtra map */}
            <div className="rounded-3xl overflow-hidden border border-[rgba(201,169,97,0.25)] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
              <MaharashtraCoverage compact />
            </div>

            {/* Map embed (iframe — no API key needed) */}
            <div className="rounded-3xl overflow-hidden border-2 border-[rgba(201,169,97,0.30)] bg-noir-800 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
              <div className="aspect-[4/3] w-full">
                <iframe
                  title="Office location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress || 'India')}&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  style={{ filter: 'invert(0.85) hue-rotate(180deg)' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
      </section>
    </>
  );
};

export default Contact;
