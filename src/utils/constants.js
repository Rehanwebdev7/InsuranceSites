// ===== Roles =====
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
};

// ===== Permissions =====
export const PERMISSIONS = {
  DASHBOARD: 'dashboard',
  LEADS: 'leads',
  SERVICES: 'services',
  SLIDER: 'slider',
  TESTIMONIALS: 'testimonials',
  SETTINGS: 'settings',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_LABELS = {
  dashboard: 'Dashboard',
  leads: 'Leads Management',
  services: 'Services Management',
  slider: 'Slider Management',
  testimonials: 'Testimonials',
  settings: 'Website Settings',
};

// ===== Application Name =====
export const APP_NAME = 'MH Insurance';

// ===== Contact Information =====
export const CONTACT_INFO = {
  phone: '+91 98765 43210',
  phoneRaw: '919876543210',
  altPhone: '+91 98765 43211',
  email: 'info@bharatinsurance.in',
  supportEmail: 'support@bharatinsurance.in',
  whatsapp: '919876543210',
  whatsappLink: 'https://wa.me/919876543210',
  address: {
    line1: 'Office No. 302, 3rd Floor',
    line2: 'Trade Centre, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    country: 'India',
    full: 'Office No. 302, 3rd Floor, Trade Centre, Bandra Kurla Complex, Mumbai, Maharashtra - 400051',
    mapUrl: 'https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai',
  },
  businessHours: {
    weekdays: '9:00 AM - 7:00 PM',
    saturday: '9:00 AM - 5:00 PM',
    sunday: 'Closed',
  },
};

// ===== Social Media Links =====
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/bharatinsurance',
  instagram: 'https://instagram.com/bharatinsurance',
  twitter: 'https://twitter.com/bharatinsurance',
  linkedin: 'https://linkedin.com/company/bharatinsurance',
  youtube: 'https://youtube.com/@bharatinsurance',
};

// ===== Form Types Mapping =====
export const FORM_TYPES = {
  twoWheeler: {
    id: 'twoWheeler',
    title: 'Two-Wheeler Insurance',
    shortTitle: '2W Insurance',
    icon: 'FaMotorcycle',
    color: '#2563eb',
    path: '/two-wheeler',
  },
  fourWheeler: {
    id: 'fourWheeler',
    title: 'Four-Wheeler Insurance',
    shortTitle: '4W Insurance',
    icon: 'FaCar',
    color: '#16a34a',
    path: '/four-wheeler',
  },
  commercial: {
    id: 'commercial',
    title: 'Commercial Vehicle Insurance',
    shortTitle: 'Commercial',
    icon: 'FaTruck',
    color: '#ea580c',
    path: '/commercial',
  },
  schoolBus: {
    id: 'schoolBus',
    title: 'School Bus Insurance',
    shortTitle: 'School Bus',
    icon: 'FaBus',
    color: '#ca8a04',
    path: '/school-bus',
  },
  newPolicy: {
    id: 'newPolicy',
    title: 'New Policy',
    shortTitle: 'New Policy',
    icon: 'FaFileAlt',
    color: '#7c3aed',
    path: '/new-policy',
  },
  renewal: {
    id: 'renewal',
    title: 'Policy Renewal',
    shortTitle: 'Renewal',
    icon: 'FaSyncAlt',
    color: '#0891b2',
    path: '/renewal',
  },
  thirdParty: {
    id: 'thirdParty',
    title: 'Third-Party Insurance',
    shortTitle: 'Third Party',
    icon: 'FaShieldAlt',
    color: '#dc2626',
    path: '/third-party',
  },
  miscellaneous: {
    id: 'miscellaneous',
    title: 'Miscellaneous Vehicle',
    shortTitle: 'Misc Vehicle',
    icon: 'FaTractor',
    color: '#b45309',
    path: '/miscellaneous-vehicle',
  },
};

// ===== Status Options =====
export const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: '#2563eb', bgColor: '#dbeafe' },
  { value: 'contacted', label: 'Contacted', color: '#92400e', bgColor: '#fef3c7' },
  { value: 'quoted', label: 'Quoted', color: '#6d28d9', bgColor: '#ede9fe' },
  { value: 'followUp', label: 'Follow Up', color: '#0369a1', bgColor: '#e0f2fe' },
  { value: 'converted', label: 'Converted', color: '#065f46', bgColor: '#d1fae5' },
  { value: 'closed', label: 'Closed', color: '#991b1b', bgColor: '#fee2e2' },
  { value: 'lost', label: 'Lost', color: '#6b7280', bgColor: '#f3f4f6' },
];

// ===== Insurance Companies List =====
export const INSURANCE_COMPANIES = [
  { value: 'icici_lombard', label: 'ICICI Lombard' },
  { value: 'bajaj_allianz', label: 'Bajaj Allianz' },
  { value: 'hdfc_ergo', label: 'HDFC Ergo' },
  { value: 'tata_aig', label: 'Tata AIG' },
  { value: 'reliance_general', label: 'Reliance General' },
  { value: 'sbi_general', label: 'SBI General' },
  { value: 'new_india', label: 'New India Assurance' },
  { value: 'united_india', label: 'United India Insurance' },
  { value: 'oriental', label: 'Oriental Insurance' },
  { value: 'national', label: 'National Insurance' },
  { value: 'iffco_tokio', label: 'IFFCO Tokio' },
  { value: 'kotak_general', label: 'Kotak Mahindra General' },
  { value: 'future_generali', label: 'Future Generali' },
  { value: 'cholamandalam', label: 'Cholamandalam MS' },
  { value: 'magma_hdi', label: 'Magma HDI' },
  { value: 'liberty_general', label: 'Liberty General' },
  { value: 'digit', label: 'Go Digit' },
  { value: 'acko', label: 'Acko General' },
  { value: 'royal_sundaram', label: 'Royal Sundaram' },
  { value: 'shriram_general', label: 'Shriram General' },
  { value: 'raheja_qbe', label: 'Raheja QBE' },
  { value: 'navi_general', label: 'Navi General' },
  { value: 'zuno', label: 'Zuno (formerly Edelweiss)' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'No Previous Insurance' },
];

// ===== Vehicle Types =====
export const VEHICLE_TYPES = {
  twoWheeler: [
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'moped', label: 'Moped' },
    { value: 'electric_tw', label: 'Electric Two-Wheeler' },
  ],
  fourWheeler: [
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'muv', label: 'MUV' },
    { value: 'luxury', label: 'Luxury Car' },
    { value: 'electric_car', label: 'Electric Car' },
  ],
  commercial: [
    { value: 'truck', label: 'Truck' },
    { value: 'tempo', label: 'Tempo' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'pickup', label: 'Pickup Van' },
    { value: 'tipper', label: 'Tipper' },
    { value: 'three_wheeler', label: 'Three-Wheeler (Goods)' },
  ],
  schoolBus: [
    { value: 'school_bus', label: 'School Bus' },
    { value: 'mini_bus', label: 'Mini Bus' },
    { value: 'school_van', label: 'School Van' },
  ],
};

// ===== Year Options Generator =====
export const generateYearOptions = (startYear = 2000) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 1; year >= startYear; year--) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
};

export const YEAR_OPTIONS = generateYearOptions(2000);

// ===== Indian States =====
export const INDIAN_STATES = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DD', label: 'Dadra & Nagar Haveli and Daman & Diu' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'LA', label: 'Ladakh' },
  { value: 'LD', label: 'Lakshadweep' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OD', label: 'Odisha' },
  { value: 'PY', label: 'Puducherry' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UK', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' },
];

// ===== Default Theme Colors =====
export const DEFAULT_THEME = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  secondary: '#f97316',
  secondaryLight: '#fb923c',
  secondaryDark: '#ea580c',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#06b6d4',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  bgDark: '#0f172a',
};

// ===== Source Options =====
export const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'referral', label: 'Referral' },
  { value: 'walkin', label: 'Walk-in' },
  { value: 'social', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

// ===== NCB (No Claim Bonus) Options =====
export const NCB_OPTIONS = [
  { value: '0', label: '0% (No NCB)' },
  { value: '20', label: '20%' },
  { value: '25', label: '25%' },
  { value: '35', label: '35%' },
  { value: '45', label: '45%' },
  { value: '50', label: '50%' },
];

// ===== Policy Type Options =====
export const POLICY_TYPE_OPTIONS = [
  { value: 'comprehensive', label: 'Comprehensive (OD + TP)' },
  { value: 'thirdParty', label: 'Third Party Only' },
  { value: 'ownDamage', label: 'Own Damage Only' },
  { value: 'bundled', label: 'Bundled (1yr OD + 3yr TP)' },
];

// ===== Fuel Type Options =====
export const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG' },
  { value: 'lpg', label: 'LPG' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

// ===== Pagination =====
export const ITEMS_PER_PAGE = 10;
export const PAGINATION_OPTIONS = [10, 25, 50, 100];

// ===== API Endpoints (placeholder) =====
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// ===== Local Storage Keys =====
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'bharat_insurance_auth_token',
  USER_DATA: 'bharat_insurance_user_data',
  LANGUAGE: 'bharat_insurance_language',
  THEME: 'bharat_insurance_theme',
  SIDEBAR_STATE: 'bharat_insurance_sidebar',
};
