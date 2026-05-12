import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

import ServiceCard from '../../components/common/ServiceCard';
import QuoteRequestForm from '../../components/forms/QuoteRequestForm';
import { Container, Eyebrow, Button, SkeletonCard } from '../../components/ui';

import { addLead } from '../../services/leadService';
import { useCustomerData } from '../../contexts/CustomerDataContext';
import { toLeadPayload } from '../../utils/leadHelpers';
import { subscribeToQuoteForm } from '../../utils/quoteEvents';

const Services = () => {
  const { services, isLoading: servicesLoading } = useCustomerData();
  const [selectedService, setSelectedService] = useState(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleGetQuote = useCallback((service) => {
    setSelectedService(service || null);
    setIsQuoteOpen(true);
  }, []);
  const handleCloseForm = useCallback(() => {
    setSelectedService(null);
    setIsQuoteOpen(false);
  }, []);

  useEffect(() => {
    return subscribeToQuoteForm((service) => handleGetQuote(service));
  }, [handleGetQuote]);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      await addLead(toLeadPayload(data));
      toast.success('Got it! A human will call you within the hour.', {
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

  const activeServices = useMemo(
    () => (services || []).filter((s) => s.active).sort((a, b) => (a.order || 0) - (b.order || 0)),
    [services]
  );

  const categories = useMemo(() => {
    const set = new Set();
    activeServices.forEach((s) => s.category && set.add(s.category));
    return set.size > 0 ? ['all', ...Array.from(set)] : [];
  }, [activeServices]);

  const filteredServices = useMemo(() => {
    return activeServices.filter((s) => {
      const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        (s.title || s.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeServices, activeCategory, searchTerm]);

  return (
    <>
      {/* Compact hero strip — noir + gold */}
      <section className="relative isolate overflow-hidden bg-noir-950 text-white">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="aurora-blob w-[420px] h-[420px] -top-24 -left-20"
            style={{ backgroundColor: 'rgba(229,199,112,0.30)' }}
          />
          <div
            className="aurora-blob w-[360px] h-[360px] -bottom-24 -right-16"
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
        <Container className="relative py-10 md:py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <Eyebrow tone="brand">Our catalogue</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-3 mb-3 text-balance text-white tracking-tight"
          >
            Every kind of cover,{' '}
            <span className="italic relative inline-block">
              under one roof.
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-2 pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 10' preserveAspectRatio='none'><path d='M3 7 C 50 2, 110 9, 170 4 S 230 8, 237 3' stroke='%23C9A961' stroke-width='3' fill='none' stroke-linecap='round'/></svg>\")",
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
            className="text-sm md:text-base text-ink-300 max-w-xl mx-auto leading-relaxed mb-5"
          >
            Tap any card to get instant quotes from 20+ IRDAI-licensed insurers.
          </motion.p>

          {/* Inline search — compact */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A961]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search policies…"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-noir-800 border border-[rgba(201,169,97,0.30)] text-white placeholder:text-ink-400 outline-none focus:ring-4 focus:ring-[#C9A961]/20 focus:border-[#C9A961] transition-all"
              />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Services grid — tight top spacing so first row is above fold */}
      <section className="py-10 md:py-14 bg-noir-900">
        <Container>
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] text-noir-950 border-[#E5C770] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)]'
                        : 'bg-noir-800 text-ink-300 border-[rgba(201,169,97,0.20)] hover:border-[#C9A961] hover:text-[#E5C770]'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                );
              })}
            </div>
          )}

          {servicesLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink-500">No policies match your search. Try a different keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onGetQuote={handleGetQuote}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Contact nudge */}
      <section className="py-10 md:py-14 bg-noir-950">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Eyebrow tone="light">Can&apos;t find what you need?</Eyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mt-3 mb-3 text-balance text-white tracking-tight">
              We cover the <span className="italic text-[#E5C770]">unusual stuff</span> too.
            </h2>
            <p className="text-ink-300 mb-6 leading-relaxed text-sm md:text-base">
              Specialised policies, corporate plans, niche risks — tell us what you have in mind
              and we&apos;ll get back within the hour.
            </p>
            <Button as={Link} to="/contact" variant="primary" size="lg" rightIcon={<FiArrowRight />}>
              Talk to a real human
            </Button>
          </motion.div>
        </Container>
      </section>

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

export default Services;
