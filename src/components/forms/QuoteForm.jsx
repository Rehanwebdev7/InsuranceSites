import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiUser, FiPhone, FiMail, FiTruck, FiFileText, FiCalendar,
  FiCheck, FiArrowLeft, FiArrowRight, FiShield, FiLock, FiZap, FiStar,
} from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  FaMotorcycle, FaCar, FaTruck, FaBus, FaFileAlt,
  FaSyncAlt, FaShieldAlt, FaTractor,
} from 'react-icons/fa';

import { Input, Button } from '../ui';

const iconMap = {
  FaMotorcycle, FaCar, FaTruck, FaBus, FaFileAlt,
  FaSyncAlt, FaShieldAlt, FaTractor,
};

const buildSchema = (isVehicle) => yup.object().shape({
  fullName: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: yup.string().email('Enter a valid email').nullable().transform((v) => (v === '' ? null : v)),
  vehicleNumber: isVehicle
    ? yup.string().required('Vehicle number is required')
    : yup.string().nullable().transform(() => ''),
  vehicleModel: isVehicle
    ? yup.string().required('Model with company name is required')
    : yup.string().nullable().transform(() => ''),
  hasActivePolicy: yup.boolean(),
  currentInsurer: yup.string().when('hasActivePolicy', {
    is: true,
    then: (s) => s.required('Current insurer is required'),
    otherwise: (s) => s.nullable(),
  }),
  policyExpiry: yup.string().when('hasActivePolicy', {
    is: true,
    then: (s) => s.required('Policy expiry date is required'),
    otherwise: (s) => s.nullable(),
  }),
});

const trustItems = [
  { icon: FiZap, text: 'Instant quotes, no wait' },
  { icon: FiLock, text: 'Bank-grade encryption' },
  { icon: FiShield, text: '20+ IRDAI-licensed partners' },
  { icon: FiStar, text: '4.8/5 from 12,000+ reviews' },
];

const QuoteForm = ({ isOpen, onClose, onSubmit, service }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isVehicle = service?.isVehicleInsurance !== false;
  const [step, setStep] = useState(isVehicle ? 1 : 2);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const schema = useMemo(() => buildSchema(isVehicle), [isVehicle]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      vehicleNumber: '',
      vehicleModel: '',
      hasActivePolicy: false,
      currentInsurer: '',
      policyExpiry: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setStep(isVehicle ? 1 : 2);
      setJustSubmitted(false);
    }
  }, [isOpen, service, reset, isVehicle]);

  const hasActivePolicy = watch('hasActivePolicy');
  const IconComponent = service?.icon ? iconMap[service.icon] || FaShieldAlt : FaShieldAlt;
  const serviceColor = service?.color || '#10B981';

  const handleNext = async () => {
    const vehicleFields = isVehicle ? ['vehicleNumber', 'vehicleModel'] : [];
    const policyFields = hasActivePolicy ? ['currentInsurer', 'policyExpiry'] : [];
    const valid = await trigger([...vehicleFields, ...policyFields]);
    if (valid) setStep(2);
  };

  const onFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit({
        ...data,
        serviceType: service?.title || service?.serviceName || service?.slug || '',
        serviceTitle: service?.title || service?.serviceName || '',
      });
      setJustSubmitted(true);
      setTimeout(() => {
        reset();
      }, 200);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            className="relative z-10 w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-[0_40px_80px_-16px_rgba(11,18,32,0.4)] overflow-hidden grid md:grid-cols-[1fr,260px]"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            {/* Form column */}
            <div className="relative flex flex-col max-h-[92vh] overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-ink-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${serviceColor}15`,
                        color: serviceColor,
                      }}
                    >
                      <IconComponent className="text-xl" />
                    </div>
                    <div>
                      <h2 id="quote-modal-title" className="text-lg md:text-xl font-display font-semibold text-ink-900 leading-tight">
                        Get your quote
                      </h2>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {service?.title || 'Vehicle insurance'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                {/* Progress — only for vehicle insurance (2 steps) */}
                {isVehicle && (
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-ink-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full grad-cta"
                        initial={{ width: '50%' }}
                        animate={{ width: step === 1 ? '50%' : '100%' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-400">
                      Step {step} of 2
                    </span>
                  </div>
                )}
              </div>

              {/* Form body */}
              {justSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                    <FiCheck className="text-2xl" strokeWidth={3} />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-ink-900 mb-1.5">
                    Request received!
                  </h3>
                  <p className="text-sm text-ink-500 max-w-xs">
                    A human from our team will call you within the hour with your quotes.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    <AnimatePresence mode="wait">
                      {step === 1 && isVehicle ? (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <FiTruck className="text-teal-600" />
                              <h3 className="text-sm font-semibold text-ink-900">Vehicle details</h3>
                            </div>
                            <div className="space-y-4">
                              <Input
                                label="Vehicle number"
                                placeholder="MH 01 AB 1234"
                                error={errors.vehicleNumber?.message}
                                required
                                {...register('vehicleNumber')}
                                onChange={(e) => {
                                  e.target.value = e.target.value.toUpperCase();
                                  register('vehicleNumber').onChange(e);
                                }}
                              />
                              <Input
                                label="Model (with company)"
                                placeholder="Honda Activa 6G"
                                error={errors.vehicleModel?.message}
                                required
                                {...register('vehicleModel')}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <FiFileText className="text-teal-600" />
                              <h3 className="text-sm font-semibold text-ink-900">Policy details</h3>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-ink-50 rounded-xl mb-3">
                              <div>
                                <div className="text-sm font-semibold text-ink-900">Active policy?</div>
                                <div className="text-xs text-ink-500 mt-0.5">Tell us if you already have one</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" {...register('hasActivePolicy')} className="sr-only peer" />
                                <div className="w-12 h-6 bg-ink-200 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-teal-600" />
                              </label>
                            </div>
                            <AnimatePresence>
                              {hasActivePolicy && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <Input
                                      label="Current insurer"
                                      placeholder="e.g., ICICI Lombard"
                                      error={errors.currentInsurer?.message}
                                      required
                                      {...register('currentInsurer')}
                                    />
                                    <Input
                                      label="Policy expiry date"
                                      type="date"
                                      error={errors.policyExpiry?.message}
                                      required
                                      {...register('policyExpiry')}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FiUser className="text-teal-600" />
                            <h3 className="text-sm font-semibold text-ink-900">How should we reach you?</h3>
                          </div>
                          <Input
                            label="Full name"
                            placeholder="Your name"
                            leftIcon={<FiUser />}
                            error={errors.fullName?.message}
                            required
                            {...register('fullName')}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                              label="Mobile number"
                              placeholder="9876543210"
                              type="tel"
                              maxLength={10}
                              prefix="+91"
                              error={errors.mobile?.message}
                              required
                              {...register('mobile')}
                            />
                            <Input
                              label="Email"
                              placeholder="email@example.com"
                              type="email"
                              leftIcon={<FiMail />}
                              error={errors.email?.message}
                              helperText="Optional"
                              {...register('email')}
                            />
                          </div>
                          <p className="text-xs text-ink-500 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 leading-relaxed flex items-start gap-2">
                            <FiLock className="text-teal-600 mt-0.5 shrink-0" />
                            Your information is encrypted and never shared with third parties. We will only use it to
                            share your quotes.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-3 px-6 py-4 border-t border-ink-100 bg-ink-50/40">
                    {step === 2 && isVehicle && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(1)}
                        leftIcon={<FiArrowLeft />}
                      >
                        Back
                      </Button>
                    )}
                    {step === 1 && isVehicle ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleNext}
                        fullWidth
                        rightIcon={<FiArrowRight />}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        className="flex-1"
                        rightIcon={!isLoading ? <FiCheck /> : undefined}
                      >
                        {isLoading ? 'Submitting…' : 'See my quotes'}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Trust column (desktop) */}
            <aside className="hidden md:flex relative flex-col p-6 grad-hero text-white overflow-hidden">
              <div aria-hidden className="absolute inset-0 pointer-events-none">
                <div className="aurora-blob w-64 h-64 -top-20 -right-12 bg-teal-400/40" />
                <div className="aurora-blob w-52 h-52 -bottom-12 -left-10 bg-teal-300/30" style={{ animationDelay: '3s' }} />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-teal-200 mb-2">
                  Why us
                </div>
                <h4 className="text-lg font-display font-semibold leading-tight mb-5 text-white">
                  You&apos;ll feel the difference in 60 seconds.
                </h4>
                <ul className="space-y-3.5 mb-auto">
                  {trustItems.map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5 text-xs text-teal-100/90">
                      <span className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                        <item.icon className="text-teal-200 text-xs" />
                      </span>
                      <span className="pt-1 leading-snug">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <blockquote className="mt-6 pt-5 border-t border-white/10 text-xs italic text-teal-100/70 leading-relaxed">
                  &ldquo;Settled my claim in 4 days. Actually couldn&apos;t believe it.&rdquo;
                  <div className="mt-2 not-italic font-semibold text-teal-200">— Rahul K., Mumbai</div>
                </blockquote>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteForm;
