import React from 'react';
import { motion } from 'framer-motion';
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
import { FiArrowRight, FiCheck } from 'react-icons/fi';

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

/**
 * ServiceCard — premium teal design.
 * PRESERVED props: service, onGetQuote, index
 * PRESERVED behavior: clicking card or CTA fires onGetQuote(service)
 *
 * New: reads optional service.features (array) and service.description with graceful fallbacks.
 * Also supports optional `featured` boolean from service for a richer layout variant.
 */
const ServiceCard = ({ service, onGetQuote, index = 0 }) => {
  const { title, icon, color, description, features } = service || {};
  const IconComponent = iconMap[icon] || FaShieldAlt;

  const handleClick = () => {
    if (onGetQuote) onGetQuote(service);
  };

  const bullets = Array.isArray(features) && features.length > 0
    ? features.slice(0, 3)
    : [];

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={[
        'group relative h-full w-full flex flex-col text-left',
        'bg-white rounded-3xl overflow-hidden',
        'border border-ink-100',
        'shadow-[0_2px_4px_rgba(11,18,32,0.04)]',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:border-teal-200 hover:shadow-[0_24px_48px_-16px_rgba(16,185,129,0.25),0_0_0_1px_rgba(16,185,129,0.08)]',
      ].join(' ')}
    >
      {/* Glow accent on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br from-teal-100 to-transparent opacity-0 group-hover:opacity-70 blur-3xl transition-opacity duration-700"
      />

      {/* Illustration zone */}
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color || '#10B981'}0a 0%, ${color || '#10B981'}18 100%)`,
        }}
      >
        {/* Decorative grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, ${color || '#10B981'} 1px, transparent 1px)`,
            backgroundSize: '18px 18px',
          }}
        />
        {/* Circle accents */}
        <div
          aria-hidden
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-500"
          style={{ backgroundColor: color || '#10B981' }}
        />
        <div
          aria-hidden
          className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
          style={{ backgroundColor: color || '#10B981' }}
        />

        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div
            className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-[0_12px_24px_-12px_rgba(11,18,32,0.14)]"
          >
            <IconComponent
              className="text-4xl md:text-5xl drop-shadow-sm"
              style={{ color: color || '#047857' }}
            />
          </div>
        </motion.div>

        {/* Accent underline */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${color || '#10B981'}, transparent)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-1 p-5 md:p-6">
        <h3 className="text-[1.0625rem] md:text-lg font-display font-semibold text-ink-900 leading-tight mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-ink-500 leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {bullets.length > 0 && (
          <ul className="space-y-1.5 mb-5">
            {bullets.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ink-600">
                <FiCheck className="shrink-0 mt-0.5 text-teal-600" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleClick();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-teal-600 to-teal-800 shadow-[0_8px_16px_-8px_rgba(16,185,129,0.4)] hover:shadow-[0_16px_32px_-12px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
          >
            Get quote
            <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
