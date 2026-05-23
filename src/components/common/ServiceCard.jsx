import React from 'react';
import { motion } from 'framer-motion';
import LottiePlayer from 'react-lottie-player';
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
      <div className="flex flex-col">
        {/* Image Card — separate card with overflow-hidden and aspect ratio */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full rounded-xl overflow-hidden flex flex-col"
          style={{
            aspectRatio: '1 / 1',
            backgroundColor: 'var(--site-bg)',
            border: '1.5px solid color-mix(in srgb, var(--site-accent, #C9A961) 35%, transparent)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          {/* Top accent stripe */}
          <div
            className="absolute top-0 left-0 right-0 z-20"
            style={{
              height: '2px',
              background: 'var(--site-accent, #C9A961)',
            }}
          />

          {/* Popular badge */}
          {featured && (
            <span
              className="absolute top-2.5 left-2.5 z-30 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.45rem] sm:text-[0.52rem] font-bold uppercase tracking-widest border pointer-events-none"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 15%, white)',
                color: 'var(--site-accent, #C9A961)',
                borderColor: 'var(--site-accent, #C9A961)',
              }}
            >
              <FiStar className="fill-current" style={{ fontSize: '0.55em' }} />
              Popular
            </span>
          )}

          {/* Image / Icon area — full height */}
          <div
            className="flex flex-1 items-center justify-center"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--site-accent, #C9A961) 6%, #F8FAFC)',
            }}
          >
            {(service.isLottie && service.animationData) ? (
              <div
                className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                style={{
                  width: `${(80 * (service.lottieZoom || 100)) / 100}%`,
                  height: `${(80 * (service.lottieZoom || 100)) / 100}%`,
                }}
              >
                <LottiePlayer
                  animationData={JSON.parse(service.animationData)}
                  play
                  loop
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ) : resolvedSrc && !imgFailed ? (
              service.isLottie ? null : (
                <img
                  src={resolvedSrc}
                  alt={title || 'Insurance'}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setImgFailed(true)}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  style={{
                    width: '80%',
                    height: '80%',
                    objectFit: 'contain',
                  }}
                />
              )
            ) : (
              <IconComponent
                className="transition-transform duration-500 group-hover:scale-105"
                style={{
                  fontSize: 'clamp(2.8rem, 8vw, 4rem)',
                  color: 'var(--site-accent, #C9A961)',
                }}
              />
            )}
          </div>

          {/* Hover: inner accent border glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10"
            style={{ boxShadow: 'inset 0 0 0 2px color-mix(in srgb, var(--site-accent, #C9A961) 40%, transparent)' }}
          />
        </motion.div>

        {/* Name Section — outside the clipping card, always visible on zoom */}
        <div className="flex flex-col items-center justify-center py-3 px-3">
          {/* Separator line */}
          <div
            style={{
              height: '1px',
              width: '100%',
              background: 'linear-gradient(90deg, transparent, var(--site-accent, #C9A961), transparent)',
            }}
          />

          {/* Title */}
          <h3
            className="font-display font-semibold leading-tight transition-colors duration-300 text-center mt-2"
            style={{ fontSize: 'clamp(0.92rem, 2.8vw, 1.25rem)', color: 'var(--site-text)' }}
          >
            {title}
          </h3>

          {/* Get quote CTA */}
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
      </div>
    </motion.button>
  );
};

export default ServiceCard;
