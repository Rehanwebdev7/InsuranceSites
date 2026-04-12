import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiShield, FiClock, FiMousePointer, FiEdit3, FiCheckCircle, FiHeart, FiLock, FiZap,
} from 'react-icons/fi';
import { FaHeadset } from 'react-icons/fa';
import { toast } from 'react-toastify';

import HeroShowcase from '../../components/common/HeroShowcase';
import ServiceCard from '../../components/common/ServiceCard';
import QuoteRequestForm from '../../components/forms/QuoteRequestForm';
import CTASection from '../../components/common/CTASection';
import TestimonialsSection from '../../components/common/TestimonialsSection';
import { Section, Eyebrow, Stat, SkeletonCard } from '../../components/ui';

import { addLead } from '../../services/leadService';
import { useCustomerData } from '../../contexts/CustomerDataContext';
import { useSettings } from '../../contexts/SettingsContext';
import { toLeadPayload } from '../../utils/leadHelpers';
import { subscribeToQuoteForm } from '../../utils/quoteEvents';

const whyChooseUs = [
  {
    icon: FiShield,
    title: 'Real coverage, not fine print.',
    desc: 'We partner with 20+ IRDAI-licensed insurers and show you the actual policy wording before you pay.',
  },
  {
    icon: FiClock,
    title: 'Quotes in seconds. Humans on call.',
    desc: 'Speed of a form, judgment of a person who has done this for 15 years.',
  },
  {
    icon: FaHeadset,
    title: 'We pick up the phone at 2 a.m.',
    desc: 'Round-the-clock support that actually answers — not a maze of menus.',
  },
  {
    icon: FiLock,
    title: 'Your data stays yours.',
    desc: 'Bank-grade encryption, zero third-party sharing, ever.',
  },
];

const processSteps = [
  { step: '01', title: 'Pick what you’re insuring', desc: 'Health, life, vehicle, travel — tap and go.', icon: FiMousePointer },
  { step: '02', title: 'Tell us the basics', desc: 'Takes about as long as a text message.', icon: FiEdit3 },
  { step: '03', title: 'See your best options', desc: 'Side-by-side quotes from 20+ insurers.', icon: FiCheckCircle },
  { step: '04', title: 'Stay covered', desc: 'Instant policy delivery, zero paperwork.', icon: FiShield },
];

const trustStats = [
  { value: 47382, suffix: '+', label: 'Happy customers' },
  { value: 23, suffix: '+', label: 'Insurance partners' },
  { value: '8.6Cr+', suffix: '', label: 'Claims settled' },
  { value: 24, suffix: '/7', label: 'Human support' },
];

const Home = () => {
  const { services, isLoading: servicesLoading } = useCustomerData();
  const { settings } = useSettings();
  const brandName = settings?.brandName || 'us';
  const [selectedService, setSelectedService] = useState(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const handleGetQuote = useCallback((service) => {
    setSelectedService(service || null);
    setIsQuoteOpen(true);
  }, []);

  useEffect(() => {
    return subscribeToQuoteForm((service) => handleGetQuote(service));
  }, [handleGetQuote]);

  const handleCloseForm = useCallback(() => {
    setSelectedService(null);
    setIsQuoteOpen(false);
  }, []);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      await addLead(toLeadPayload(data));
      toast.success('Got it! A human from our team will call you within the hour.', {
        position: 'top-right',
        autoClose: 4000,
      });
      setTimeout(() => {
        setSelectedService(null);
        setIsQuoteOpen(false);
      }, 900);
    } catch (error) {
      console.error('Failed to submit lead:', error);
      toast.error('Something went wrong. Please try again.');
    }
  }, []);

  const activeServices = (services || [])
    .filter((s) => s.active)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      <HeroShowcase onOpenQuote={() => handleGetQuote(null)} />

      {/* Services — uniform grid, no featured variant */}
      <Section
        id="services"
        tone="default"
        size="md"
        eyebrow="What we cover"
        title="Policies for everything you care about."
        subtitle="Health, life, vehicle, travel, business — whatever needs protecting, we’ve got an honest quote for it."
      >
        {servicesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onGetQuote={handleGetQuote}
              />
            ))}
          </div>
        )}
      </Section>

      {/* How it works */}
      <Section
        tone="soft"
        size="md"
        eyebrow="Simple process"
        title="Four steps. About two cups of chai."
        subtitle="No jargon, no nested menus, no ‘please hold while we transfer you.’"
      >
        <div className="relative">
          <div aria-hidden className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5">
            <svg width="100%" height="2" className="text-teal-300">
              <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
            </svg>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 relative">
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative text-center group"
              >
                <div className="relative z-10 mx-auto mb-4 w-20 h-20 rounded-2xl bg-white border border-ink-100 shadow-[0_12px_24px_-12px_rgba(11,18,32,0.1)] flex items-center justify-center group-hover:border-teal-200 group-hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.25)] transition-all duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-50 to-transparent" />
                  <item.icon className="relative z-10 text-2xl text-teal-700" />
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(16,185,129,0.4)]">
                    <span className="text-[0.625rem] font-display font-bold text-white">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-base font-display font-semibold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500 max-w-[240px] mx-auto leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why choose us — new symmetric layout */}
      <Section
        tone="default"
        size="md"
        eyebrow={`Why ${brandName}`}
        title="Why people actually stick with us."
        subtitle="Not just cheap rates — honest humans, fast claims, and the kind of service worth telling your cousin about."
      >
        {/* Stats strip — horizontal, compact */}
        <div className="mb-10 rounded-3xl grad-hero text-white p-6 md:p-8 relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="aurora-blob w-[360px] h-[360px] -top-20 -left-20 bg-teal-500/30" />
            <div
              className="aurora-blob w-[300px] h-[300px] -bottom-20 -right-10 bg-teal-400/20"
              style={{ animationDelay: '3s' }}
            />
          </div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {trustStats.map((s) => (
              <Stat
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                tone="brand"
              />
            ))}
          </div>
        </div>

        {/* Reason grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white border border-ink-100 rounded-2xl p-6 hover:border-teal-200 hover:shadow-[0_20px_40px_-16px_rgba(16,185,129,0.2)] transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-100 transition-colors">
                  <item.icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[1.0625rem] font-display font-semibold text-ink-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Customer Feedback */}
      <TestimonialsSection />

      {/* CTA */}
      <CTASection />

      {/* Quote Modal */}
      <QuoteRequestForm
        isOpen={isQuoteOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        service={selectedService}
        services={activeServices}
      />
    </>
  );
};

export default Home;
