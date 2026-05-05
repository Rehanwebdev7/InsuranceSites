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
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { resolveServiceIllustration } from '../../data/illustrationGallery';

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
 * ServiceCard — quickinsure-inspired:
 * A large cream OVAL container holds the GIF/PNG/SVG illustration in its
 * center. Title and "Get quote" link sit below. No card border on the outside.
 *
 * Resolution priority for what goes inside the oval:
 *   1. service.illustrationUrl  — admin uploaded GIF/PNG (preferred, transparent bg ideal)
 *   2. service.illustrationKey  — picked from bundled SVG gallery
 *   3. service.icon             — auto-mapped to bundled SVG illustration
 *   4. fallback react-icon glyph
 */
const ServiceCard = ({ service, onGetQuote, index = 0 }) => {
  const { title, icon, description, featured } = service || {};
  const resolvedSrc = resolveServiceIllustration(service);
  const IconComponent = iconMap[icon] || FaShieldAlt;

  const handleClick = () => {
    if (onGetQuote) onGetQuote(service);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center text-center px-3 py-4 cursor-pointer bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A961] focus-visible:ring-offset-4 focus-visible:ring-offset-noir-950 rounded-2xl"
    >
      {/* Magazine number — tiny, top-right corner, decorative */}
      <span
        aria-hidden
        className="absolute top-1 right-3 font-display italic text-[0.65rem] font-semibold text-[#8B6F2C]/50 tracking-widest pointer-events-none z-10"
      >
        № {String(index + 1).padStart(2, '0')}
      </span>

      {/* Featured ribbon */}
      {featured && (
        <span
          aria-hidden
          className="absolute top-1 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-noir-900 text-[#E5C770] text-[0.55rem] font-bold uppercase tracking-[0.14em] border border-[#C9A961] pointer-events-none z-10"
        >
          <FiStar className="text-[0.7em] fill-current" />
          Popular
        </span>
      )}

      {/* OVAL container — cream blob, holds the GIF/illustration centered inside */}
      <div className="relative w-full max-w-[300px] aspect-[5/4] mt-5 mb-5">
        {/* Soft gold halo behind oval, blooms on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(212,175,55,0.45) 0%, rgba(201,169,97,0.20) 40%, transparent 70%)',
          }}
        />

        {/* The cream oval — CSS rendered, large, oval shape */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[50%] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          style={{
            background:
              'radial-gradient(ellipse at 40% 35%, #FFFCF7 0%, #FAF6EE 50%, #F5EBD3 100%)',
            boxShadow:
              '0 28px 56px -16px rgba(0,0,0,0.55), inset 0 -8px 20px rgba(201,169,97,0.18), inset 0 4px 10px rgba(255,252,247,0.8)',
          }}
        />

        {/* Subtle gold rim at bottom of oval (depth) */}
        <div
          aria-hidden
          className="absolute left-[10%] right-[10%] bottom-[-2px] h-[6px] rounded-[50%] blur-md opacity-50"
          style={{ background: 'rgba(201,169,97,0.55)' }}
        />

        {/* The GIF/PNG/SVG illustration sits CENTERED inside the oval */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-6"
          whileHover={{ scale: 1.06, y: -3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {resolvedSrc ? (
            <img
              src={resolvedSrc}
              alt={title || 'Insurance service'}
              loading="lazy"
              className="max-w-[78%] max-h-[78%] object-contain drop-shadow-[0_12px_24px_rgba(46,37,16,0.20)]"
            />
          ) : (
            <IconComponent
              className="text-[5rem] drop-shadow-[0_8px_16px_rgba(46,37,16,0.18)]"
              style={{ color: '#8B6F2C' }}
            />
          )}
        </motion.div>

        {/* Tiny twinkling sparkles around the oval (purely decorative) */}
        <span
          aria-hidden
          className="absolute -top-2 right-6 w-1.5 h-1.5 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ animation: 'pulseSoft 2s ease-in-out infinite', animationDelay: '0.2s' }}
        />
        <span
          aria-hidden
          className="absolute top-8 -right-2 w-1 h-1 rounded-full bg-[#E5C770] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ animation: 'pulseSoft 2.4s ease-in-out infinite', animationDelay: '0.6s' }}
        />
        <span
          aria-hidden
          className="absolute bottom-4 -left-2 w-1 h-1 rounded-full bg-[#C9A961] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ animation: 'pulseSoft 2.8s ease-in-out infinite', animationDelay: '1s' }}
        />
      </div>

      {/* Title */}
      <h3 className="font-display text-[1.15rem] md:text-[1.25rem] font-semibold text-white leading-[1.2] mb-1 tracking-tight transition-colors duration-300 group-hover:text-[#E5C770]">
        {title}
      </h3>

      {description && (
        <p className="text-[0.78rem] text-ink-400 leading-relaxed line-clamp-1 max-w-[260px] mb-3">
          {description}
        </p>
      )}

      {/* Get quote link with animated gold underline */}
      <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold tracking-wide text-[#C9A961] relative pb-1 mb-1">
        <span className="relative">
          Get quote
          <span
            aria-hidden
            className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#C9A961] origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </span>
        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </motion.button>
  );
};

export default ServiceCard;
