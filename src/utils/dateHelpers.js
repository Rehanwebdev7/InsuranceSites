/**
 * Date utility functions for Bharat Insurance
 */

/**
 * Format a date to a localized string (DD/MM/YYYY for India)
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options override
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '-';

  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  };

  return dateObj.toLocaleDateString('en-IN', defaultOptions);
};

/**
 * Format a date with time (DD/MM/YYYY, HH:MM AM/PM)
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (date) => {
  if (!date) return '-';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '-';

  const dateStr = dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timeStr = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${dateStr}, ${timeStr}`;
};

/**
 * Format a date to a long readable format (15 January 2024)
 * @param {string|Date} date - The date to format
 * @returns {string} Long formatted date
 */
export const formatDateLong = (date) => {
  if (!date) return '-';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '-';

  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago", "just now")
 * @param {string|Date} date - The date to compute relative time from
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '-';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '-';

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // Future date
  if (diffInMs < 0) {
    const absDays = Math.abs(diffInDays);
    if (absDays === 0) return 'Today';
    if (absDays === 1) return 'Tomorrow';
    if (absDays < 7) return `In ${absDays} days`;
    if (absDays < 30) return `In ${Math.ceil(absDays / 7)} weeks`;
    if (absDays < 365) return `In ${Math.ceil(absDays / 30)} months`;
    return `In ${Math.ceil(absDays / 365)} years`;
  }

  // Past date
  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInWeeks === 1) return '1 week ago';
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  if (diffInMonths === 1) return '1 month ago';
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  if (diffInYears === 1) return '1 year ago';
  return `${diffInYears} years ago`;
};

/**
 * Check if a date/policy has expired
 * @param {string|Date} date - The expiry date to check
 * @returns {boolean} True if the date is in the past
 */
export const isExpired = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return false;

  const now = new Date();
  // Set to end of day for fair comparison
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  return dateObj.getTime() < now.getTime();
};

/**
 * Calculate number of days until a date (negative if past)
 * @param {string|Date} date - The target date
 * @returns {number} Number of days until expiry (negative if expired)
 */
export const daysUntilExpiry = (date) => {
  if (!date) return null;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  const diffInMs = dateObj.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

/**
 * Get a human-readable expiry status string
 * @param {string|Date} date - The expiry date
 * @returns {{ text: string, color: string, isExpired: boolean, isUrgent: boolean }}
 */
export const getExpiryStatus = (date) => {
  const days = daysUntilExpiry(date);

  if (days === null) {
    return { text: 'No date', color: '#6b7280', isExpired: false, isUrgent: false };
  }

  if (days < 0) {
    return {
      text: `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`,
      color: '#dc2626',
      isExpired: true,
      isUrgent: true,
    };
  }

  if (days === 0) {
    return { text: 'Expires today', color: '#dc2626', isExpired: false, isUrgent: true };
  }

  if (days === 1) {
    return { text: 'Expires tomorrow', color: '#ea580c', isExpired: false, isUrgent: true };
  }

  if (days <= 7) {
    return {
      text: `Expires in ${days} days`,
      color: '#ea580c',
      isExpired: false,
      isUrgent: true,
    };
  }

  if (days <= 30) {
    return {
      text: `Expires in ${days} days`,
      color: '#ca8a04',
      isExpired: false,
      isUrgent: false,
    };
  }

  if (days <= 90) {
    return {
      text: `Expires in ${Math.floor(days / 30)} month${Math.floor(days / 30) !== 1 ? 's' : ''}`,
      color: '#16a34a',
      isExpired: false,
      isUrgent: false,
    };
  }

  return {
    text: `Expires in ${Math.floor(days / 30)} months`,
    color: '#16a34a',
    isExpired: false,
    isUrgent: false,
  };
};

/**
 * Get the start and end of the current day
 * @returns {{ start: Date, end: Date }}
 */
export const getToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Get the start and end of the current week (Monday to Sunday)
 * @returns {{ start: Date, end: Date }}
 */
export const getCurrentWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Get the start and end of the current month
 * @returns {{ start: Date, end: Date }}
 */
export const getCurrentMonth = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Check if a date falls within a given range
 * @param {string|Date} date - The date to check
 * @param {Date} start - Range start
 * @param {Date} end - Range end
 * @returns {boolean}
 */
export const isWithinRange = (date, start, end) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return false;

  return dateObj >= start && dateObj <= end;
};

/**
 * Format date for input[type="date"] fields (YYYY-MM-DD)
 * @param {string|Date} date - The date to format
 * @returns {string} ISO date string for input value
 */
export const toInputDate = (date) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Parse an input date string (YYYY-MM-DD) to a Date object
 * @param {string} dateStr - The date string from an input field
 * @returns {Date|null} Parsed Date object or null
 */
export const fromInputDate = (dateStr) => {
  if (!dateStr) return null;

  const date = new Date(dateStr + 'T00:00:00');

  if (isNaN(date.getTime())) return null;

  return date;
};
