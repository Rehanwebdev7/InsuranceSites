import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiShield, FiClock, FiLock,
} from 'react-icons/fi';
import { FaHeadset } from 'react-icons/fa';
import { toast } from 'react-toastify';

import HeroSlider from '../../components/common/HeroSlider';
import ServiceCard from '../../components/common/ServiceCard';
import QuoteRequestForm from '../../components/forms/QuoteRequestForm';
import CTASection from '../../components/common/CTASection';
import TestimonialsSection from '../../components/common/TestimonialsSection';
import DecodedStory from '../../components/common/DecodedStory';
import ComparisonStrip from '../../components/common/ComparisonStrip';
import { Section, Stat, SkeletonCard } from '../../components/ui';

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

// Single source of truth for trust stats — same values on Home & About.
const trustStats = [
  { value: 50, suffix: 'K+', label: 'Happy customers' },
  { value: 20, suffix: '+', label: 'Insurance partners' },
  { value: 98, suffix: '%', label: 'Claims settled' },
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

  // Auto-open quote form on landing — shows service picker (no preselected service)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedService(null);
      setIsQuoteOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Magazine-style hero with masthead, numbered features, image collage, gold seal, live ticker */}
      <HeroSlider />

      {/* Services — uniform grid with new illustration-dominant cards */}
      <Section
        id="services"
        tone="default"
        size="md"
        eyebrow="What we cover"
        title="Policies for everything you care about."
        subtitle="Health, life, vehicle, travel, business — whatever needs protecting, we've got an honest quote for it."
      >
        {servicesLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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

      {/* "Insurance, decoded" — magazine-style 3-chapter scroll story */}
      <DecodedStory />

      {/* "Us vs the rest" — premium comparison table */}
      <ComparisonStrip brandName={brandName} />

      {/* Why choose us */}
      <Section
        tone="default"
        size="md"
        eyebrow={`Why ${brandName}`}
        title="Why people actually stick with us."
        subtitle="Not just cheap rates — honest humans, fast claims, and the kind of service worth telling your cousin about."
      >
        {/* Stats strip — same dark cabinet card as About page (consistent across site) */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-noir-900 to-noir-800 border border-[rgba(201,169,97,0.30)] shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] p-6 md:p-10 text-white relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(201,169,97,0.18) 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustStats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <Stat value={s.value} suffix={s.suffix} label={s.label} tone="brand" />
              </div>
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
              className="group relative bg-noir-900 border border-[rgba(201,169,97,0.20)] rounded-2xl p-6 hover:border-[#C9A961] hover:shadow-[0_20px_40px_-16px_rgba(201,169,97,0.30)] transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-noir-800 border border-[rgba(201,169,97,0.30)] flex items-center justify-center text-[#E5C770] group-hover:bg-gradient-to-br group-hover:from-[#C9A961] group-hover:to-[#8B6F2C] group-hover:text-noir-950 transition-all">
                  <item.icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[1.0625rem] font-display font-semibold text-white mb-1.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-300 leading-relaxed">{item.desc}</p>
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
