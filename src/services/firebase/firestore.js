import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// ===== Collection Names =====
const COLLECTIONS = {
  LEADS: 'leads',
  SERVICES: 'services',
  SETTINGS: 'settings',
  SLIDER_IMAGES: 'sliderImages',
  CUSTOMER_FEEDBACK: 'customerFeedback',
  ADMINS: 'admins',
};

// =============================================
// ===== LEADS CRUD =====
// =============================================

/**
 * Transform flat form data → nested Firestore structure
 */
const toFirestoreLead = (data) => {
  // Build policyExpiry — handle Date objects from DatePicker
  let policyExpiry = data.policyExpiry || '';
  if (policyExpiry instanceof Date) {
    policyExpiry = policyExpiry.toISOString().split('T')[0];
  }

  return {
    personalInfo: {
      fullName: data.fullName || '',
      email: data.email || '',
      mobile: data.mobile || '',
      address: data.address || '',
    },
    vehicleDetails: {
      vehicleNumber: data.vehicleNumber || data.registrationNumber || '',
      model: data.vehicleModel || '',
      manufacturingYear: data.manufacturingYear || '',
      engineCC: data.engineCC || '',
    },
    policyDetails: {
      isActivePolicy: data.hasActivePolicy ? 'Yes' : (data.currentInsurer || data.policyExpiry ? 'Yes' : 'No'),
      policyExpiryDate: policyExpiry,
      currentInsurer: data.currentInsurer || '',
      ncbYears: data.ncbYears || '',
      insuranceType: data.insuranceType || '',
      previousClaims: data.previousClaims || '',
    },
    formType: data.formType || data.serviceType || '',
    serviceTitle: data.serviceTitle || '',
    source: data.source || 'website',
    status: data.status || 'new',
    preferredTime: data.preferredTime || '',
  };
};

/**
 * Transform nested Firestore doc → flat object for the UI
 */
export const fromFirestoreLead = (docSnap) => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    // Personal Info
    fullName: d.personalInfo?.fullName || '',
    email: d.personalInfo?.email || '',
    mobile: d.personalInfo?.mobile || '',
    // Vehicle Details
    vehicleNumber: d.vehicleDetails?.vehicleNumber || '',
    vehicleModel: d.vehicleDetails?.model || '',
    // Policy Details
    hasActivePolicy: d.policyDetails?.isActivePolicy === 'Yes',
    currentInsurer: d.policyDetails?.currentInsurer || '',
    policyExpiry: d.policyDetails?.policyExpiryDate || '',
    // Meta
    formType: d.formType || '',
    source: d.source || 'website',
    status: d.status || 'new',
    createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || new Date().toISOString(),
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt || new Date().toISOString(),
    // Keep any extra fields
    serviceTitle: d.serviceTitle || '',
    address: d.address || '',
    registrationNumber: d.vehicleDetails?.vehicleNumber || '',
    manufacturingYear: d.vehicleDetails?.manufacturingYear || '',
    engineCC: d.vehicleDetails?.engineCC || '',
    ncbYears: d.policyDetails?.ncbYears || '',
    insuranceType: d.policyDetails?.insuranceType || '',
    previousClaims: d.policyDetails?.previousClaims || '',
    preferredTime: d.preferredTime || '',
  };
};

/**
 * Add a new lead to Firestore
 */
export const addLead = async (leadData) => {
  if (!db) throw new Error('Firebase not configured');

  const firestoreData = toFirestoreLead(leadData);
  const docRef = await addDoc(collection(db, COLLECTIONS.LEADS), {
    ...firestoreData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...leadData,
    status: firestoreData.status,
    source: firestoreData.source,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Get all leads from Firestore
 */
export const getLeads = async () => {
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, COLLECTIONS.LEADS), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromFirestoreLead);
};

/**
 * Update an existing lead
 */
export const updateLead = async (leadId, updates) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, COLLECTIONS.LEADS, leadId);

  // Build the update object — only update nested fields that are provided
  const updateData = { updatedAt: serverTimestamp() };

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.source !== undefined) updateData.source = updates.source;
  if (updates.formType !== undefined) updateData.formType = updates.formType;

  // Personal info updates
  if (updates.fullName !== undefined) updateData['personalInfo.fullName'] = updates.fullName;
  if (updates.email !== undefined) updateData['personalInfo.email'] = updates.email;
  if (updates.mobile !== undefined) updateData['personalInfo.mobile'] = updates.mobile;

  // Vehicle details updates
  if (updates.vehicleNumber !== undefined) updateData['vehicleDetails.vehicleNumber'] = updates.vehicleNumber;
  if (updates.vehicleModel !== undefined) updateData['vehicleDetails.model'] = updates.vehicleModel;

  // Policy details updates
  if (updates.hasActivePolicy !== undefined) updateData['policyDetails.isActivePolicy'] = updates.hasActivePolicy ? 'Yes' : 'No';
  if (updates.policyExpiry !== undefined) updateData['policyDetails.policyExpiryDate'] = updates.policyExpiry;

  await updateDoc(docRef, updateData);
  return { id: leadId, ...updates, updatedAt: new Date().toISOString() };
};

/**
 * Delete a lead
 */
export const deleteLead = async (leadId) => {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, COLLECTIONS.LEADS, leadId));
  return true;
};

// =============================================
// ===== SERVICES CRUD =====
// =============================================

/**
 * Transform Firestore service doc → UI format
 */
const fromFirestoreService = (docSnap) => {
  const d = docSnap.data();
  // Derive a readable title from serviceName, title, or slug
  const rawTitle = d.serviceName || d.title || '';
  const derivedTitle = rawTitle || (d.slug ? d.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '');
  // Derive slug from title if not present
  const rawSlug = d.slug || '';
  const derivedSlug = rawSlug || (rawTitle ? rawTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') : '');
  return {
    id: docSnap.id,
    title: derivedTitle,
    serviceName: derivedTitle,
    description: d.description || '',
    icon: d.icon || 'FaShieldAlt',
    iconLibrary: d.iconLibrary || 'fa',
    color: d.color || '#2563eb',
    bgColor: d.bgColor || (d.color ? d.color + '15' : '#eff6ff'),
    active: d.active !== undefined ? d.active : true,
    order: d.order || 0,
    slug: derivedSlug,
    features: d.features || [],
    featured: d.featured !== undefined ? d.featured : true,
    createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || '',
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt || '',
  };
};

/**
 * Get all services from Firestore
 */
export const getServices = async () => {
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, COLLECTIONS.SERVICES), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromFirestoreService);
};

/**
 * Add a new service to Firestore
 */
export const addService = async (serviceData) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), {
    serviceName: serviceData.title || serviceData.serviceName || '',
    description: serviceData.description || '',
    icon: serviceData.icon || 'FaShieldAlt',
    iconLibrary: serviceData.iconLibrary || 'fa',
    color: serviceData.color || '#2563eb',
    active: serviceData.active !== undefined ? serviceData.active : true,
    order: serviceData.order || 0,
    slug: serviceData.slug || '',
    bgColor: serviceData.bgColor || '',
    features: serviceData.features || [],
    featured: serviceData.featured || false,
    isVehicleInsurance: serviceData.isVehicleInsurance !== false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...serviceData,
    title: serviceData.title || serviceData.serviceName || '',
  };
};

/**
 * Update a service
 */
export const updateService = async (serviceId, updates) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, COLLECTIONS.SERVICES, serviceId);
  const updateData = { updatedAt: serverTimestamp() };

  if (updates.title !== undefined) updateData.serviceName = updates.title;
  if (updates.serviceName !== undefined) updateData.serviceName = updates.serviceName;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.icon !== undefined) updateData.icon = updates.icon;
  if (updates.iconLibrary !== undefined) updateData.iconLibrary = updates.iconLibrary;
  if (updates.color !== undefined) updateData.color = updates.color;
  if (updates.bgColor !== undefined) updateData.bgColor = updates.bgColor;
  if (updates.active !== undefined) updateData.active = updates.active;
  if (updates.order !== undefined) updateData.order = updates.order;
  if (updates.slug !== undefined) updateData.slug = updates.slug;
  if (updates.features !== undefined) updateData.features = updates.features;
  if (updates.featured !== undefined) updateData.featured = updates.featured;
  if (updates.isVehicleInsurance !== undefined) updateData.isVehicleInsurance = updates.isVehicleInsurance;

  await updateDoc(docRef, updateData);
  return { id: serviceId, ...updates };
};

/**
 * Delete a service
 */
export const deleteService = async (serviceId) => {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, COLLECTIONS.SERVICES, serviceId));
  return true;
};

// =============================================
// ===== SETTINGS CRUD =====
// =============================================

/**
 * Transform Firestore settings doc → flat UI format
 */
const fromFirestoreSettings = (docSnap) => {
  const d = docSnap.data();
  // Handle trailing-space field names from Firebase ("address " and "footerDescription ")
  const address = d.address || d['address '] || {};
  const footerDesc = d.footerDescription || d['footerDescription '] || '';
  return {
    id: docSnap.id,
    // Brand identity
    brandName: d.brandName || '',
    siteTitle: d.siteTitle || '',
    // Brand assets
    brandLogo: d.brandLogo || '',
    brandFavicon: d.brandFavicon || '',
    // Phone numbers
    phone10: d.phoneNumbers?.support?.replace(/\D/g, '').slice(-10) || '',
    altPhone10: d.phoneNumbers?.alternate?.replace(/\D/g, '').slice(-10) || '',
    whatsapp10: d.phoneNumbers?.whatsapp?.replace(/\D/g, '').slice(-10) || '',
    call10: d.phoneNumbers?.call?.replace(/\D/g, '').slice(-10) || '',
    // Contact
    email: d.contact?.primaryEmail || '',
    supportEmail: d.contact?.supportEmail || '',
    businessHours: d.contact?.businessHours || '',
    // Address
    addressLine1: address.line1 || '',
    addressLine2: address.line2 || '',
    city: address.city || '',
    state: address.state || '',
    pincode: address.pincode || '',
    mapUrl: address.googleMapsUrl || '',
    // Footer
    footerDescription: footerDesc,
    // Social media — convert from Firebase format (active) to UI format (enabled)
    socialMedia: {
      facebook: { url: d.socialMedia?.facebook?.url || '', enabled: d.socialMedia?.facebook?.active ?? false },
      instagram: { url: d.socialMedia?.instagram?.url || '', enabled: d.socialMedia?.instagram?.active ?? false },
      twitter: { url: d.socialMedia?.twitter?.url || '', enabled: d.socialMedia?.twitter?.active ?? false },
      linkedin: { url: d.socialMedia?.linkedin?.url || '', enabled: d.socialMedia?.linkedin?.active ?? false },
      youtube: { url: d.socialMedia?.youtube?.url || '', enabled: d.socialMedia?.youtube?.active ?? false },
    },
    hero: {
      badgeText: d.hero?.badgeText || 'Trusted by 50,000+ customers',
      titlePrefix: d.hero?.titlePrefix || 'Insurance that',
      titleHighlight: d.hero?.titleHighlight || 'actually shows up',
      titleSuffix: d.hero?.titleSuffix || 'when you need it.',
      description:
        d.hero?.description ||
        'Health, life, vehicle, travel — compare honest quotes from 20+ IRDAI-licensed insurers in under 60 seconds. No call centers, no pushy agents.',
      autoplayMs: d.hero?.autoplayMs ?? 6500,
      iconShowerSpeed: d.hero?.iconShowerSpeed ?? 0.7,
      showIconShower: d.hero?.showIconShower ?? true,
    },
    // Colors
    colors: {
      primary: d.colors?.primary || '#2563eb',
      secondary: d.colors?.secondary || '#f97316',
      accent: d.colors?.accent || '#059669',
    },
  };
};

/**
 * Transform flat UI settings → nested Firestore structure
 */
const toFirestoreSettings = (settings) => {
  return {
    settingType: 'website',
    brandName: settings.brandName || '',
    siteTitle: settings.siteTitle || '',
    brandLogo: settings.brandLogo || '',
    brandFavicon: settings.brandFavicon || '',
    phoneNumbers: {
      support: '+91 ' + (settings.phone10 || ''),
      alternate: '+91 ' + (settings.altPhone10 || ''),
      whatsapp: '91' + (settings.whatsapp10 || ''),
      call: '91' + (settings.call10 || ''),
    },
    contact: {
      primaryEmail: settings.email || '',
      supportEmail: settings.supportEmail || '',
      businessHours: settings.businessHours || '',
    },
    address: {
      line1: settings.addressLine1 || '',
      line2: settings.addressLine2 || '',
      city: settings.city || '',
      state: settings.state || '',
      pincode: settings.pincode || '',
      googleMapsUrl: settings.mapUrl || '',
    },
    footerDescription: settings.footerDescription || '',
    socialMedia: {
      facebook: { url: settings.socialMedia?.facebook?.url || '', active: settings.socialMedia?.facebook?.enabled ?? false },
      instagram: { url: settings.socialMedia?.instagram?.url || '', active: settings.socialMedia?.instagram?.enabled ?? false },
      twitter: { url: settings.socialMedia?.twitter?.url || '', active: settings.socialMedia?.twitter?.enabled ?? false },
      linkedin: { url: settings.socialMedia?.linkedin?.url || '', active: settings.socialMedia?.linkedin?.enabled ?? false },
      youtube: { url: settings.socialMedia?.youtube?.url || '', active: settings.socialMedia?.youtube?.enabled ?? false },
    },
    hero: {
      badgeText: settings.hero?.badgeText || '',
      titlePrefix: settings.hero?.titlePrefix || '',
      titleHighlight: settings.hero?.titleHighlight || '',
      titleSuffix: settings.hero?.titleSuffix || '',
      description: settings.hero?.description || '',
      autoplayMs: Number(settings.hero?.autoplayMs) || 6500,
      iconShowerSpeed: Number(settings.hero?.iconShowerSpeed) || 0.7,
      showIconShower: settings.hero?.showIconShower ?? true,
    },
    colors: {
      primary: settings.colors?.primary || '#2563eb',
      secondary: settings.colors?.secondary || '#f97316',
      accent: settings.colors?.accent || '#059669',
    },
    updatedBy: 'admin',
    updatedAt: serverTimestamp(),
  };
};

/**
 * Get settings from Firestore (first document in settings collection)
 */
export const getSettings = async () => {
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, COLLECTIONS.SETTINGS), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  return fromFirestoreSettings(snapshot.docs[0]);
};

/**
 * Save/update settings to Firestore
 * If settings doc exists (has id), update it. Otherwise create a new one.
 */
export const saveSettings = async (settings, existingDocId = null) => {
  if (!db) throw new Error('Firebase not configured');

  const firestoreData = toFirestoreSettings(settings);

  if (existingDocId) {
    const docRef = doc(db, COLLECTIONS.SETTINGS, existingDocId);
    await updateDoc(docRef, firestoreData);
    return { id: existingDocId, ...settings };
  } else {
    const docRef = await addDoc(collection(db, COLLECTIONS.SETTINGS), firestoreData);
    return { id: docRef.id, ...settings };
  }
};

// =============================================
// ===== SLIDER IMAGES CRUD =====
// =============================================

/**
 * Add a new slider image document to Firestore
 * @param {{ title: string, imageUrl: string, driveFileId: string, order: number }} data
 */
export const addSliderImage = async (data) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = await addDoc(collection(db, COLLECTIONS.SLIDER_IMAGES), {
    title: data.title || '',
    imageUrl: data.imageUrl || '',
    driveFileId: data.driveFileId || '',
    order: data.order ?? 0,
    active: data.active !== undefined ? data.active : true,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...data,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Get all slider images ordered by `order` field
 */
export const getSliderImages = async () => {
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, COLLECTIONS.SLIDER_IMAGES),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      title: d.title || '',
      imageUrl: d.imageUrl || '',
      driveFileId: d.driveFileId || '',
      order: d.order ?? 0,
      active: d.active !== undefined ? d.active : true,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || '',
    };
  });
};

/**
 * Update a slider image document (title, order, etc.)
 */
export const updateSliderImage = async (id, updates) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, COLLECTIONS.SLIDER_IMAGES, id);
  const updateData = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.order !== undefined) updateData.order = updates.order;
  if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
  if (updates.driveFileId !== undefined) updateData.driveFileId = updates.driveFileId;
  if (updates.active !== undefined) updateData.active = updates.active;

  await updateDoc(docRef, updateData);
  return { id, ...updates };
};

/**
 * Delete a slider image document from Firestore
 */
export const deleteSliderImage = async (id) => {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, COLLECTIONS.SLIDER_IMAGES, id));
  return true;
};

// =============================================
// ===== CUSTOMER FEEDBACK CRUD =====
// =============================================

/**
 * Map Firestore feedback doc → UI format.
 * Schema: { name, role, message, rating, avatar, active, order, createdAt, updatedAt }
 */
const fromFirestoreFeedback = (docSnap) => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    name: d.name || '',
    role: d.role || '',
    message: d.message || '',
    rating: typeof d.rating === 'number' ? d.rating : parseInt(d.rating, 10) || 5,
    avatar: d.avatar || '',
    active: d.active !== undefined ? d.active : true,
    order: d.order ?? 0,
    createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || '',
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt || '',
  };
};

/**
 * Get all customer feedback, ordered by `order` ascending then createdAt desc.
 */
export const getCustomerFeedback = async () => {
  if (!db) throw new Error('Firebase not configured');
  const q = query(collection(db, COLLECTIONS.CUSTOMER_FEEDBACK), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromFirestoreFeedback);
};

/**
 * Add a new customer feedback entry.
 */
export const addCustomerFeedback = async (data) => {
  if (!db) throw new Error('Firebase not configured');
  const docRef = await addDoc(collection(db, COLLECTIONS.CUSTOMER_FEEDBACK), {
    name: data.name || '',
    role: data.role || '',
    message: data.message || '',
    rating: typeof data.rating === 'number' ? data.rating : parseInt(data.rating, 10) || 5,
    avatar: data.avatar || '',
    active: data.active !== undefined ? data.active : true,
    order: data.order ?? 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

/**
 * Update an existing customer feedback entry.
 */
export const updateCustomerFeedback = async (id, updates) => {
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(db, COLLECTIONS.CUSTOMER_FEEDBACK, id);
  const updateData = { updatedAt: serverTimestamp() };
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.message !== undefined) updateData.message = updates.message;
  if (updates.rating !== undefined) updateData.rating = parseInt(updates.rating, 10) || 5;
  if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
  if (updates.active !== undefined) updateData.active = updates.active;
  if (updates.order !== undefined) updateData.order = updates.order;
  await updateDoc(docRef, updateData);
  return { id, ...updates };
};

/**
 * Delete a customer feedback entry.
 */
export const deleteCustomerFeedback = async (id) => {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, COLLECTIONS.CUSTOMER_FEEDBACK, id));
  return true;
};

// =============================================
// ===== ADMINS CRUD =====
// =============================================

/**
 * Get all admin documents.
 */
export const getAdmins = async () => {
  if (!db) throw new Error('Firebase not configured');
  const snapshot = await getDocs(collection(db, COLLECTIONS.ADMINS));
  return snapshot.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      uid: docSnap.id,
      email: d.email || '',
      mobile: d.mobile || '',
      name: d.name || '',
      role: d.role || 'admin',
      permissions: d.permissions || [],
      companyName: d.companyName || '',
      isActive: d.isActive !== undefined ? d.isActive : true,
      avatar: d.avatar || null,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || '',
      updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt || '',
    };
  });
};

/**
 * Update an admin document (mobile, permissions, isActive, name, companyName).
 * Email changes require Cloud Function (updateAdminEmail).
 */
export const updateAdmin = async (adminId, updates) => {
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(db, COLLECTIONS.ADMINS, adminId);
  const updateData = { updatedAt: serverTimestamp() };
  if (updates.mobile !== undefined) updateData.mobile = updates.mobile;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.permissions !== undefined) updateData.permissions = updates.permissions;
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
  if (updates.companyName !== undefined) updateData.companyName = updates.companyName;
  if (updates.role !== undefined) updateData.role = updates.role;
  await updateDoc(docRef, updateData);
  return { id: adminId, ...updates };
};
