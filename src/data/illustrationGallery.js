/**
 * Bundled illustration gallery for service cards.
 * Files live in /public/illustrations/{key}.svg and are served as static assets.
 *
 * Admin Services page exposes this list as a "Pick from gallery" picker so the
 * client doesn't need to upload anything to Google Drive for common categories.
 *
 * For services that don't fit any of these, admin can either upload a custom
 * illustration via Google Drive (illustrationUrl) or fall back to a react-icon.
 */

export const ILLUSTRATION_GALLERY = [
  { key: 'car',             label: 'Car / Four Wheeler',  category: 'Vehicle' },
  { key: 'bike',            label: 'Bike / Two Wheeler',  category: 'Vehicle' },
  { key: 'truck',           label: 'Truck / Goods Carrier', category: 'Vehicle' },
  { key: 'bus',             label: 'Bus / School Bus',    category: 'Vehicle' },
  { key: 'tractor',         label: 'Tractor',             category: 'Vehicle' },
  { key: 'caravan',         label: 'Caravan / Camper',    category: 'Vehicle' },
  { key: 'health',          label: 'Health / Medical',    category: 'Personal' },
  { key: 'life',            label: 'Life / Family',       category: 'Personal' },
  { key: 'travel',          label: 'Travel / International', category: 'Personal' },
  { key: 'home',            label: 'Home / Property',     category: 'Property' },
  { key: 'fire',            label: 'Fire / Building',     category: 'Property' },
  { key: 'business',        label: 'Business / Commercial', category: 'Business' },
  { key: 'pet',             label: 'Pet Insurance',       category: 'Personal' },
  { key: 'agriculture',     label: 'Agriculture / Crop',  category: 'Business' },
  { key: 'marine',          label: 'Marine / Cargo',      category: 'Business' },
  { key: 'general-shield',  label: 'General Protection',  category: 'Other' },
];

const VALID_KEYS = new Set(ILLUSTRATION_GALLERY.map((g) => g.key));

export const getIllustrationSrc = (key) => {
  if (!key || !VALID_KEYS.has(key)) return null;
  return `/illustrations/${key}.svg`;
};

export const isValidIllustrationKey = (key) => VALID_KEYS.has(key);

/**
 * Auto-map react-icons names → bundled illustration keys, so existing
 * Firestore services (which only have an icon set) automatically render
 * a richer illustration without admin needing to re-edit every entry.
 *
 * Used as the second-tier fallback in ServiceCard:
 *   illustrationUrl → illustrationKey → ICON_TO_ILLUSTRATION[icon] → react-icon
 */
export const ICON_TO_ILLUSTRATION = {
  // Vehicle
  FaMotorcycle: 'bike',
  FaCar: 'car',
  FaCarSide: 'car',
  FaCarCrash: 'car',
  FaTruck: 'truck',
  FaTruckMoving: 'truck',
  FaBus: 'bus',
  FaBusAlt: 'bus',
  FaTractor: 'tractor',
  FaCaravan: 'caravan',
  FaShip: 'marine',
  FaPlane: 'travel',
  FaSuitcaseRolling: 'travel',
  FaGlobeAsia: 'travel',

  // Health & Life
  FaHeartbeat: 'health',
  FaStethoscope: 'health',
  FaHospital: 'health',
  FaClinicMedical: 'health',
  FaAmbulance: 'health',
  FaBriefcaseMedical: 'health',
  FaFirstAid: 'health',
  FaPills: 'health',
  FaWheelchair: 'health',
  FaBaby: 'life',
  FaUserShield: 'life',
  FaUsers: 'life',
  FaHeart: 'life',
  FaHandHoldingHeart: 'life',
  FaHandHoldingMedical: 'health',

  // Property & Business
  FaHome: 'home',
  FaBuilding: 'business',
  FaBriefcase: 'business',
  FaFire: 'fire',
  FaHandshake: 'business',
  FaMoneyBillWave: 'business',

  // Pets & Agriculture
  FaDog: 'pet',
  FaPaw: 'pet',
  GiCow: 'agriculture',
  GiBull: 'agriculture',
  GiChargingBull: 'agriculture',
  GiBuffaloHead: 'agriculture',
  GiGoat: 'agriculture',
  GiSheep: 'agriculture',
  FaHorse: 'agriculture',
  FaLeaf: 'agriculture',
  FaSeedling: 'agriculture',

  // General / docs
  FaShieldAlt: 'general-shield',
  FaUmbrella: 'general-shield',
  FaFileAlt: 'general-shield',
  FaFileContract: 'general-shield',
  FaFileSignature: 'general-shield',
  FaSyncAlt: 'general-shield',
};

/**
 * Resolve the best illustration src for a service, in priority order:
 *   1. illustrationUrl (admin uploaded)
 *   2. illustrationKey (admin picked from gallery)
 *   3. icon → auto-mapped bundled illustration
 *   4. null (caller falls back to react-icon)
 */
export const resolveServiceIllustration = ({ illustrationUrl, illustrationKey, icon } = {}) => {
  if (illustrationUrl) return illustrationUrl;
  if (illustrationKey) return getIllustrationSrc(illustrationKey);
  if (icon && ICON_TO_ILLUSTRATION[icon]) return getIllustrationSrc(ICON_TO_ILLUSTRATION[icon]);
  return null;
};
