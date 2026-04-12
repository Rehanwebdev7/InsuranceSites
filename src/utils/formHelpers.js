import { FORM_TYPES, STATUS_OPTIONS } from './constants.js';

/**
 * Generate an array of year options for select dropdowns
 * @param {number} startYear - The earliest year to include
 * @param {number} endYear - The latest year to include (defaults to current year + 1)
 * @returns {Array<{value: string, label: string}>}
 */
export const generateYearOptions = (startYear = 2000, endYear = null) => {
  const end = endYear || new Date().getFullYear() + 1;
  const years = [];
  for (let year = end; year >= startYear; year--) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
};

/**
 * Format a number as Indian currency (INR)
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

/**
 * Format a date string or Date object to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The output format ('short', 'long', 'iso', 'input')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '-';

  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' },
    iso: null,
    input: null,
  };

  if (format === 'iso') {
    return dateObj.toISOString().split('T')[0];
  }

  if (format === 'input') {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return dateObj.toLocaleDateString('en-IN', options[format] || options.short);
};

/**
 * Generate a unique lead ID with date prefix
 * @param {string} prefix - Optional prefix (default: 'LD')
 * @returns {string} Unique lead ID like LD-20240115-A3F
 */
export const generateLeadId = (prefix = 'LD') => {
  const now = new Date();
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
  const timestamp = now.getTime().toString(36).slice(-3).toUpperCase();

  return `${prefix}-${dateStr}-${randomPart}${timestamp}`;
};

/**
 * Get the display title for a form type
 * @param {string} formType - The form type identifier
 * @returns {string} The display title
 */
export const getFormTitle = (formType) => {
  const formConfig = FORM_TYPES[formType];
  if (formConfig) {
    return formConfig.title;
  }

  // Fallback: convert camelCase to Title Case
  return formType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Get the short title for a form type
 * @param {string} formType - The form type identifier
 * @returns {string} The short display title
 */
export const getFormShortTitle = (formType) => {
  const formConfig = FORM_TYPES[formType];
  return formConfig ? formConfig.shortTitle : formType;
};

/**
 * Get the color associated with a status
 * @param {string} status - The status value
 * @returns {{ color: string, bgColor: string }} Color and background color
 */
export const getStatusColor = (status) => {
  const statusConfig = STATUS_OPTIONS.find(
    (opt) => opt.value === status?.toLowerCase()
  );

  if (statusConfig) {
    return { color: statusConfig.color, bgColor: statusConfig.bgColor };
  }

  // Default fallback colors
  return { color: '#6b7280', bgColor: '#f3f4f6' };
};

/**
 * Get a CSS class name for a status badge
 * @param {string} status - The status value
 * @returns {string} CSS class name
 */
export const getStatusBadge = (status) => {
  const statusMap = {
    new: 'badge-new',
    contacted: 'badge-contacted',
    quoted: 'badge-contacted',
    followUp: 'badge-new',
    converted: 'badge-converted',
    closed: 'badge-closed',
    lost: 'badge-closed',
  };

  return statusMap[status?.toLowerCase()] || 'badge-new';
};

/**
 * Get the label text for a status
 * @param {string} status - The status value
 * @returns {string} The display label
 */
export const getStatusLabel = (status) => {
  const statusConfig = STATUS_OPTIONS.find(
    (opt) => opt.value === status?.toLowerCase()
  );
  return statusConfig ? statusConfig.label : status || 'Unknown';
};

/**
 * Build default form values for a given form type
 * @param {string} formType - The form type identifier
 * @returns {Object} Default form values
 */
export const getDefaultFormValues = (formType) => {
  const commonDefaults = {
    fullName: '',
    mobile: '',
    email: '',
    vehicleNumber: '',
    vehicleType: '',
    manufacturingYear: '',
    city: '',
    state: '',
    pincode: '',
    remarks: '',
  };

  const formSpecificDefaults = {
    twoWheeler: {
      ...commonDefaults,
      previousInsurer: '',
      policyExpiry: '',
    },
    fourWheeler: {
      ...commonDefaults,
      previousInsurer: '',
      policyExpiry: '',
      fuelType: '',
    },
    commercial: {
      ...commonDefaults,
      previousInsurer: '',
      policyExpiry: '',
      gvw: '',
    },
    schoolBus: {
      ...commonDefaults,
      previousInsurer: '',
      policyExpiry: '',
      seatingCapacity: '',
      schoolName: '',
    },
    newPolicy: {
      ...commonDefaults,
      vehicleMake: '',
      vehicleModel: '',
    },
    renewal: {
      ...commonDefaults,
      previousInsurer: '',
      policyExpiry: '',
      policyNumber: '',
      ncb: '',
    },
    thirdParty: {
      ...commonDefaults,
      previousInsurer: '',
      policyExpiry: '',
    },
  };

  return formSpecificDefaults[formType] || commonDefaults;
};

/**
 * Format a phone number for display (Indian format)
 * @param {string} phone - The raw phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Get WhatsApp link for a phone number
 * @param {string} phone - The phone number
 * @param {string} message - Optional pre-filled message
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppLink = (phone, message = '') => {
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}${message ? `?text=${encodedMessage}` : ''}`;
};

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Convert form data to a flat object suitable for submission
 * @param {Object} formData - The raw form data
 * @param {string} formType - The form type
 * @returns {Object} Cleaned form data
 */
export const prepareFormData = (formData, formType) => {
  const cleaned = {};

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = typeof value === 'string' ? value.trim() : value;
    }
  });

  return {
    ...cleaned,
    formType,
    id: generateLeadId(),
    status: 'new',
    source: 'website',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
