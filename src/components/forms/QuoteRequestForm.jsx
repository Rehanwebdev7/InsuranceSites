import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiUser, FiMail, FiTruck, FiFileText, FiCheck,
  FiArrowRight, FiLock, FiGrid, FiChevronDown,
} from 'react-icons/fi';
import {
  FaMotorcycle, FaCar, FaCarSide, FaCarCrash, FaTruck, FaTruckMoving,
  FaBus, FaBusAlt, FaTractor, FaShieldAlt, FaFileAlt, FaFileContract,
  FaFileSignature, FaSyncAlt, FaHeart, FaHeartbeat, FaHome, FaUmbrella,
  FaPlane, FaShip, FaAmbulance, FaBriefcaseMedical, FaStethoscope,
  FaFirstAid, FaBaby, FaDog, FaPaw, FaBuilding, FaBriefcase,
  FaFire, FaHandHoldingHeart, FaHandHoldingMedical, FaHandshake,
  FaUserShield, FaUsers, FaLeaf, FaSeedling, FaMoneyBillWave,
  FaWheelchair, FaHospital, FaClinicMedical, FaPills,
  FaCaravan, FaSuitcaseRolling, FaGlobeAsia, FaHorse,
} from 'react-icons/fa';
import { GiCow, GiBull, GiChargingBull, GiBuffaloHead, GiGoat, GiSheep } from 'react-icons/gi';

import { Input, Button } from '../ui';

const iconMap = {
  FaMotorcycle, FaCar, FaCarSide, FaCarCrash, FaTruck, FaTruckMoving,
  FaBus, FaBusAlt, FaTractor, FaShieldAlt, FaFileAlt, FaFileContract,
  FaFileSignature, FaSyncAlt, FaHeart, FaHeartbeat, FaHome, FaUmbrella,
  FaPlane, FaShip, FaAmbulance, FaBriefcaseMedical, FaStethoscope,
  FaFirstAid, FaBaby, FaDog, FaPaw, FaBuilding, FaBriefcase,
  FaFire, FaHandHoldingHeart, FaHandHoldingMedical, FaHandshake,
  FaUserShield, FaUsers, FaLeaf, FaSeedling, FaMoneyBillWave,
  FaWheelchair, FaHospital, FaClinicMedical, FaPills,
  FaCaravan, FaSuitcaseRolling, FaGlobeAsia, FaHorse,
  GiCow, GiBull, GiChargingBull, GiBuffaloHead, GiGoat, GiSheep,
};

const buildSchema = (isVehicle) => yup.object().shape({
  selectedServiceId: yup.string().required('Please select a service'),
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
    then: (field) => field.required('Current insurer is required'),
    otherwise: (field) => field.nullable(),
  }),
  policyExpiry: yup.string().when('hasActivePolicy', {
    is: true,
    then: (field) => field.required('Policy expiry date is required'),
    otherwise: (field) => field.nullable(),
  }),
});

const QuoteRequestForm = ({ isOpen, onClose, onSubmit, service, services = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);

  const activeServices = useMemo(
    () => (services || []).filter((item) => item?.active !== false),
    [services]
  );

  // Start with default schema, will be updated dynamically
  const [isVehicle, setIsVehicle] = useState(() => service?.isVehicleInsurance !== false);
  const schema = useMemo(() => buildSchema(isVehicle), [isVehicle]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedServiceId: service?.id || service?.slug || '',
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
    if (!isOpen) return;
    reset({
      selectedServiceId: service?.id || service?.slug || '',
      fullName: '',
      mobile: '',
      email: '',
      vehicleNumber: '',
      vehicleModel: '',
      hasActivePolicy: false,
      currentInsurer: '',
      policyExpiry: '',
    });
    setJustSubmitted(false);
    setIsServicePickerOpen(false);
  }, [isOpen, service, reset]);

  useEffect(() => {
    document.body.classList.toggle('quote-modal-open', isOpen);
    return () => document.body.classList.remove('quote-modal-open');
  }, [isOpen]);

  const hasActivePolicy = watch('hasActivePolicy');
  const selectedServiceId = watch('selectedServiceId');
  const resolvedService = useMemo(() => {
    if (service) return service;
    return activeServices.find(
      (item) => item.id === selectedServiceId || item.slug === selectedServiceId
    ) || null;
  }, [service, activeServices, selectedServiceId]);

  // Update isVehicle when selected service changes
  useEffect(() => {
    setIsVehicle(resolvedService?.isVehicleInsurance !== false);
  }, [resolvedService]);

  const IconComponent = resolvedService?.icon ? iconMap[resolvedService.icon] || FaShieldAlt : FaShieldAlt;
  const serviceColor = resolvedService?.color || '#10B981';
  const selectedService = activeServices.find(
    (item) => item.id === selectedServiceId || item.slug === selectedServiceId
  );

  const handleServiceSelect = (value) => {
    setValue('selectedServiceId', value, { shouldValidate: true });
    setIsServicePickerOpen(false);
  };

  const onFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formService = service || activeServices.find(
        (item) => item.id === data.selectedServiceId || item.slug === data.selectedServiceId
      );
      await onSubmit({
        ...data,
        serviceType: formService?.slug || formService?.title || formService?.serviceName || '',
        serviceTitle: formService?.title || formService?.serviceName || '',
      });
      setJustSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal — fixed flex column layout ensures footer buttons always visible */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
          className="relative z-10 w-full max-w-lg bg-white rounded-2xl md:rounded-3xl shadow-[0_40px_80px_-16px_rgba(11,18,32,0.4)] flex flex-col overflow-hidden"
          style={{ maxHeight: 'min(92vh, 820px)' }}
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        >
          {/* Header — fixed */}
          <div className="shrink-0 px-5 pt-5 pb-3 border-b border-ink-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${serviceColor}15`, color: serviceColor }}
                >
                  <IconComponent className="text-lg" />
                </div>
                <div>
                  <h2 id="quote-modal-title" className="text-xl font-display font-semibold text-ink-900">
                    Get Quote
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {resolvedService?.title || 'Choose your insurance service'}
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
          </div>

          {/* Body — scrollable middle */}
          {justSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F5EBD3] text-[#8B6F2C] border border-[#C9A961] flex items-center justify-center mb-4">
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
            <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 min-h-0">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">

                {/* Service picker */}
                {!service && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FiGrid className="text-[#8B6F2C]" />
                      <h3 className="text-sm font-semibold text-ink-900">Choose your service</h3>
                    </div>
                    <input type="hidden" {...register('selectedServiceId')} />
                    <label className="block text-[0.8125rem] font-semibold text-ink-700 mb-1.5">
                      Insurance service <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsServicePickerOpen((p) => !p)}
                        className={`w-full rounded-xl border-[1.5px] bg-white px-4 py-3 text-left flex items-center justify-between transition-all ${
                          errors.selectedServiceId
                            ? 'border-red-300 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
                            : 'border-ink-100 hover:border-ink-200'
                        }`}
                      >
                        <span className={selectedService ? 'text-ink-900' : 'text-ink-400'}>
                          {selectedService?.title || selectedService?.serviceName || 'Select a service'}
                        </span>
                        <FiChevronDown className={`text-ink-400 transition-transform ${isServicePickerOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {errors.selectedServiceId?.message && (
                        <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.selectedServiceId.message}</p>
                      )}
                      {isServicePickerOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 z-20 rounded-xl border border-ink-100 bg-white shadow-[0_24px_48px_-16px_rgba(11,18,32,0.16)] overflow-hidden">
                          <div className="max-h-52 overflow-y-auto py-1">
                            {activeServices.map((item) => {
                              const itemValue = item.id || item.slug;
                              const isSelected = itemValue === selectedServiceId;
                              return (
                                <button
                                  key={itemValue}
                                  type="button"
                                  onClick={() => handleServiceSelect(itemValue)}
                                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                    isSelected
                                      ? 'bg-[#FDFAF1] text-[#5C4A1D] font-semibold'
                                      : 'text-ink-700 hover:bg-ink-50'
                                  }`}
                                >
                                  {item.title || item.serviceName}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Personal info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-[#8B6F2C]" />
                    <h3 className="text-sm font-semibold text-ink-900">Personal Information</h3>
                  </div>
                  <div className="space-y-3">
                    <Input
                      label="Full Name"
                      placeholder="Your name"
                      leftIcon={<FiUser />}
                      error={errors.fullName?.message}
                      required
                      {...register('fullName')}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Mobile Number"
                        placeholder="9876543210"
                        type="tel"
                        maxLength={10}
                        prefix="+91"
                        error={errors.mobile?.message}
                        required
                        {...register('mobile')}
                      />
                      <Input
                        label="Email (optional)"
                        placeholder="email@example.com"
                        type="email"
                        leftIcon={<FiMail />}
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-ink-100" />

                {/* Vehicle details — only for vehicle insurance */}
                {isVehicle && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiTruck className="text-[#8B6F2C]" />
                        <h3 className="text-sm font-semibold text-ink-900">Vehicle Details</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Vehicle Number"
                          placeholder="MH 01 AB 1234"
                          error={errors.vehicleNumber?.message}
                          required
                          {...register('vehicleNumber')}
                          onChange={(event) => {
                            event.target.value = event.target.value.toUpperCase();
                            register('vehicleNumber').onChange(event);
                          }}
                        />
                        <Input
                          label="Model (with Company)"
                          placeholder="Honda Activa 6G"
                          error={errors.vehicleModel?.message}
                          required
                          {...register('vehicleModel')}
                        />
                      </div>
                    </div>
                    <div className="h-px bg-ink-100" />
                  </>
                )}

                {!isVehicle && <div className="h-px bg-ink-100" />}

                {/* Policy details */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiFileText className="text-[#8B6F2C]" />
                    <h3 className="text-sm font-semibold text-ink-900">Policy Details</h3>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-ink-50 rounded-xl mb-3">
                    <span className="text-sm font-semibold text-ink-900">Is Active Policy?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register('hasActivePolicy')} className="sr-only peer" />
                      <div className="w-12 h-6 bg-ink-200 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-[#C9A961]" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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

                <p className="text-xs text-ink-600 bg-[#FDFAF1] border border-[#EBDCB1] rounded-xl px-4 py-3 leading-relaxed flex items-start gap-2">
                  <FiLock className="text-[#8B6F2C] mt-0.5 shrink-0" />
                  Your information is encrypted and never shared with third parties. We will only use it to share your quotes.
                </p>
              </div>

              {/* Footer buttons — ALWAYS visible, never cut off */}
              <div className="shrink-0 px-5 py-4 border-t border-ink-100 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    rightIcon={!isLoading ? <FiArrowRight /> : undefined}
                  >
                    {isLoading ? 'Submitting...' : 'Get Free Quote'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuoteRequestForm;
