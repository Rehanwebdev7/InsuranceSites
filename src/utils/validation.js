import * as yup from 'yup';

// ===== Common Regex Patterns =====
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const VEHICLE_NUMBER_REGEX = /^[A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,3}[-\s]?\d{1,4}$/i;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const NAME_REGEX = /^[a-zA-Z\s.'-]{2,60}$/;

// ===== Common Error Messages =====
const MESSAGES = {
  required: 'This field is required',
  fullName: 'Please enter a valid name (2-60 characters, letters only)',
  mobile: 'Please enter a valid 10-digit Indian mobile number',
  email: 'Please enter a valid email address',
  vehicleNumber: 'Please enter a valid vehicle registration number (e.g., MH-01-AB-1234)',
  pincode: 'Please enter a valid 6-digit pincode',
  manufacturingYear: 'Please select a manufacturing year',
  vehicleType: 'Please select a vehicle type',
  previousInsurer: 'Please select previous insurance company',
  policyExpiry: 'Please select policy expiry date',
  city: 'Please enter your city',
  state: 'Please select your state',
};

// ===== Common Field Schemas =====
const commonFields = {
  fullName: yup
    .string()
    .required(MESSAGES.required)
    .matches(NAME_REGEX, MESSAGES.fullName)
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must not exceed 60 characters')
    .trim(),

  mobile: yup
    .string()
    .required(MESSAGES.required)
    .matches(MOBILE_REGEX, MESSAGES.mobile)
    .length(10, 'Mobile number must be exactly 10 digits'),

  email: yup
    .string()
    .email(MESSAGES.email)
    .matches(EMAIL_REGEX, MESSAGES.email)
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  vehicleNumber: yup
    .string()
    .required(MESSAGES.required)
    .matches(VEHICLE_NUMBER_REGEX, MESSAGES.vehicleNumber)
    .trim()
    .uppercase(),

  vehicleType: yup
    .string()
    .required(MESSAGES.vehicleType),

  manufacturingYear: yup
    .string()
    .required(MESSAGES.manufacturingYear),

  previousInsurer: yup
    .string()
    .required(MESSAGES.previousInsurer),

  policyExpiry: yup
    .string()
    .required(MESSAGES.policyExpiry),

  city: yup
    .string()
    .required(MESSAGES.city)
    .min(2, 'City name must be at least 2 characters')
    .max(50, 'City name must not exceed 50 characters')
    .trim(),

  state: yup
    .string()
    .required(MESSAGES.state),

  pincode: yup
    .string()
    .matches(PINCODE_REGEX, MESSAGES.pincode)
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  remarks: yup
    .string()
    .max(500, 'Remarks must not exceed 500 characters')
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
};

// ===== Two-Wheeler Insurance Schema =====
export const twoWheelerSchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: commonFields.email,
  vehicleNumber: commonFields.vehicleNumber,
  vehicleType: yup
    .string()
    .required('Please select a two-wheeler type')
    .oneOf(['motorcycle', 'scooter', 'moped', 'electric_tw'], 'Invalid vehicle type'),
  manufacturingYear: commonFields.manufacturingYear,
  previousInsurer: commonFields.previousInsurer,
  policyExpiry: commonFields.policyExpiry,
  city: commonFields.city,
  state: commonFields.state,
  pincode: commonFields.pincode,
  remarks: commonFields.remarks,
});

// ===== Four-Wheeler Insurance Schema =====
export const fourWheelerSchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: commonFields.email,
  vehicleNumber: commonFields.vehicleNumber,
  vehicleType: yup
    .string()
    .required('Please select a car type')
    .oneOf(['hatchback', 'sedan', 'suv', 'muv', 'luxury', 'electric_car'], 'Invalid vehicle type'),
  manufacturingYear: commonFields.manufacturingYear,
  previousInsurer: commonFields.previousInsurer,
  policyExpiry: commonFields.policyExpiry,
  fuelType: yup
    .string()
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  city: commonFields.city,
  state: commonFields.state,
  pincode: commonFields.pincode,
  remarks: commonFields.remarks,
});

// ===== Commercial Vehicle Insurance Schema =====
export const commercialSchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: commonFields.email,
  vehicleNumber: commonFields.vehicleNumber,
  vehicleType: yup
    .string()
    .required('Please select a commercial vehicle type')
    .oneOf(
      ['truck', 'tempo', 'tanker', 'trailer', 'pickup', 'tipper', 'three_wheeler'],
      'Invalid vehicle type'
    ),
  manufacturingYear: commonFields.manufacturingYear,
  previousInsurer: commonFields.previousInsurer,
  policyExpiry: commonFields.policyExpiry,
  gvw: yup
    .string()
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  city: commonFields.city,
  state: commonFields.state,
  pincode: commonFields.pincode,
  remarks: commonFields.remarks,
});

// ===== School Bus Insurance Schema =====
export const schoolBusSchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: commonFields.email,
  vehicleNumber: commonFields.vehicleNumber,
  vehicleType: yup
    .string()
    .required('Please select a school bus type')
    .oneOf(['school_bus', 'mini_bus', 'school_van'], 'Invalid vehicle type'),
  manufacturingYear: commonFields.manufacturingYear,
  previousInsurer: commonFields.previousInsurer,
  policyExpiry: commonFields.policyExpiry,
  seatingCapacity: yup
    .string()
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  schoolName: yup
    .string()
    .max(100, 'School name must not exceed 100 characters')
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  city: commonFields.city,
  state: commonFields.state,
  pincode: commonFields.pincode,
  remarks: commonFields.remarks,
});

// ===== New Policy Schema =====
export const newPolicySchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: commonFields.email,
  vehicleNumber: yup
    .string()
    .matches(VEHICLE_NUMBER_REGEX, MESSAGES.vehicleNumber)
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  vehicleType: commonFields.vehicleType,
  manufacturingYear: commonFields.manufacturingYear,
  vehicleMake: yup
    .string()
    .notRequired()
    .nullable()
    .max(50, 'Vehicle make must not exceed 50 characters')
    .transform((value) => (value === '' ? null : value)),
  vehicleModel: yup
    .string()
    .notRequired()
    .nullable()
    .max(50, 'Vehicle model must not exceed 50 characters')
    .transform((value) => (value === '' ? null : value)),
  city: commonFields.city,
  state: commonFields.state,
  pincode: commonFields.pincode,
  remarks: commonFields.remarks,
});

// ===== Policy Renewal Schema =====
export const renewalSchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: commonFields.email,
  vehicleNumber: commonFields.vehicleNumber,
  vehicleType: commonFields.vehicleType,
  manufacturingYear: commonFields.manufacturingYear,
  previousInsurer: commonFields.previousInsurer,
  policyExpiry: commonFields.policyExpiry,
  policyNumber: yup
    .string()
    .notRequired()
    .nullable()
    .max(30, 'Policy number must not exceed 30 characters')
    .transform((value) => (value === '' ? null : value)),
  ncb: yup
    .string()
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  city: commonFields.city,
  state: commonFields.state,
  pincode: commonFields.pincode,
  remarks: commonFields.remarks,
});

// ===== Third-Party Insurance Schema =====
export const thirdPartySchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: commonFields.email,
  vehicleNumber: commonFields.vehicleNumber,
  vehicleType: commonFields.vehicleType,
  manufacturingYear: commonFields.manufacturingYear,
  previousInsurer: yup
    .string()
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  policyExpiry: yup
    .string()
    .notRequired()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  city: commonFields.city,
  state: commonFields.state,
  pincode: commonFields.pincode,
  remarks: commonFields.remarks,
});

// ===== Contact Form Schema =====
export const contactFormSchema = yup.object().shape({
  fullName: commonFields.fullName,
  mobile: commonFields.mobile,
  email: yup
    .string()
    .required('Email is required')
    .email(MESSAGES.email)
    .matches(EMAIL_REGEX, MESSAGES.email),
  subject: yup
    .string()
    .required('Please enter a subject')
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject must not exceed 100 characters')
    .trim(),
  message: yup
    .string()
    .required('Please enter your message')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .trim(),
});

// ===== Login Form Schema =====
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// ===== Schema Map (for dynamic usage) =====
export const validationSchemas = {
  twoWheeler: twoWheelerSchema,
  fourWheeler: fourWheelerSchema,
  commercial: commercialSchema,
  schoolBus: schoolBusSchema,
  newPolicy: newPolicySchema,
  renewal: renewalSchema,
  thirdParty: thirdPartySchema,
  contact: contactFormSchema,
  login: loginSchema,
};

/**
 * Get the appropriate validation schema for a given form type
 * @param {string} formType - The form type identifier
 * @returns {yup.ObjectSchema} The Yup validation schema
 */
export const getValidationSchema = (formType) => {
  const schema = validationSchemas[formType];
  if (!schema) {
    console.warn(`No validation schema found for form type: ${formType}`);
    return yup.object().shape({});
  }
  return schema;
};

/**
 * Validate a single field value against common patterns
 * @param {string} fieldName - The field to validate
 * @param {string} value - The value to validate
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateField = (fieldName, value) => {
  const validators = {
    mobile: { regex: MOBILE_REGEX, message: MESSAGES.mobile },
    email: { regex: EMAIL_REGEX, message: MESSAGES.email },
    vehicleNumber: { regex: VEHICLE_NUMBER_REGEX, message: MESSAGES.vehicleNumber },
    pincode: { regex: PINCODE_REGEX, message: MESSAGES.pincode },
  };

  const validator = validators[fieldName];
  if (!validator) {
    return { isValid: true, error: null };
  }

  const isValid = validator.regex.test(value);
  return {
    isValid,
    error: isValid ? null : validator.message,
  };
};

export default validationSchemas;
