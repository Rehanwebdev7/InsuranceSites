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

const ServiceCard = ({ service, onGetQuote, index = 0 }) => {
  const { title, icon, featured } = service || {};
  const resolvedSrc = resolveServiceIllustration(service);
  const IconComponent = iconMap[icon] || FaShieldAlt;
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => onGetQuote?.(service)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group w-full cursor-pointer bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-[--site-accent] focus-visible:ring-offset-2"
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          aspectRatio: '1 / 1',
          background: 'linear-gradient(160deg, color-mix(in srgb, var(--site-accent, #C9A961) 18%, #0D0C09) 0%, #060606 100%)',
          border: '1px solid color-mix(in srgb, var(--site-accent, #C9A961) 40%, transparent)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
        }}
      >
        {/* Gold top stripe */}
        <div
          className="absolute top-0 left-0 right-0 z-20"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--site-accent, #C9A961), color-mix(in srgb, var(--site-accent, #C9A961) 70%, white), var(--site-accent, #C9A961), transparent)',
          }}
        />

        {/* Popular badge */}
        {featured && (
          <span className="absolute top-2.5 left-2.5 z-30 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/80 text-[#E5C770] text-[0.45rem] sm:text-[0.52rem] font-bold uppercase tracking-widest border border-[#C9A961]/60 pointer-events-none">
            <FiStar className="fill-current" style={{ fontSize: '0.55em' }} />
            Popular
          </span>
        )}

        {/* Image / Icon — fills the whole card */}
        <div className="absolute inset-0 flex items-center justify-center">
          {resolvedSrc && !imgFailed ? (
            <img
              src={resolvedSrc}
              alt={title || 'Insurance'}
              loading="lazy"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => setImgFailed(true)}
              className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              style={{
                width: '75%',
                height: '65%',
                objectFit: 'contain',
                marginBottom: '22%',
                filter: 'drop-shadow(0 8px 20px rgba(201,169,97,0.45))',
              }}
            />
          ) : (
            <IconComponent
              className="transition-transform duration-500 group-hover:scale-110"
              style={{
                fontSize: 'clamp(2.4rem, 7vw, 3.8rem)',
                color: '#C9A961',
                marginBottom: '22%',
                filter: 'drop-shadow(0 8px 20px rgba(201,169,97,0.60))',
              }}
            />
          )}
        </div>

        {/* Dark gradient overlay at the bottom — text sits on top of this */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            height: '42%',
            background: 'linear-gradient(to top, rgba(8,7,5,0.97) 0%, rgba(8,7,5,0.80) 55%, transparent 100%)',
          }}
        />

        {/* Title + Get quote — overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-end pb-3 px-2" style={{ height: '42%' }}>
          <h3
            className="font-display font-semibold leading-tight text-white transition-colors duration-300 text-center"
            style={{ fontSize: 'clamp(0.92rem, 2.8vw, 1.25rem)' }}
          >
            {title}
          </h3>
          <span
            className="inline-flex items-center gap-0.5 font-semibold mt-1"
            style={{ fontSize: 'clamp(0.68rem, 1.9vw, 0.85rem)', color: 'var(--site-accent, #C9A961)' }}
          >
            Get quote
            <FiArrowRight
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ fontSize: '0.85em' }}
            />
          </span>
        </div>

        {/* Hover: inner gold border glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10"
          style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--site-accent, #C9A961) 55%, transparent)' }}
        />
      </motion.div>
    </motion.button>
  );
};

export default ServiceCard;
