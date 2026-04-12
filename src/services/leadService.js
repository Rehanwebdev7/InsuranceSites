import { FORM_TYPES } from '../utils/constants';
import * as firestoreService from './firebase/firestore';
import { db } from './firebase/firebase';

const LS_KEY = 'bharat_insurance_leads';

// ===== localStorage Helpers (fallback only) =====
const getFromStorage = () => {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (leads) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error('Failed to save leads to localStorage:', error);
  }
};

// =============================================
// ===== Core CRUD Operations =====
// =============================================

/**
 * Get all leads — Firestore primary, localStorage fallback
 */
export const getLeads = async () => {
  if (db) {
    try {
      const leads = await firestoreService.getLeads();
      return leads;
    } catch (error) {
      console.error('Firestore getLeads failed, using localStorage:', error);
    }
  }
  return getFromStorage();
};

/**
 * Add a new lead — Firestore primary, localStorage fallback
 */
export const addLead = async (leadData) => {
  const lead = {
    ...leadData,
    status: leadData.status || 'new',
    source: leadData.source || 'website',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const result = await firestoreService.addLead(lead);
      return result;
    } catch (error) {
      console.error('Firestore addLead failed, saving to localStorage:', error);
    }
  }

  // localStorage fallback
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const localLead = { id, ...lead };
  const leads = getFromStorage();
  leads.unshift(localLead);
  saveToStorage(leads);
  return localLead;
};

/**
 * Update an existing lead
 */
export const updateLead = async (leadId, updates) => {
  if (db) {
    try {
      const result = await firestoreService.updateLead(leadId, updates);
      return result;
    } catch (error) {
      console.error('Firestore updateLead failed, updating localStorage:', error);
    }
  }

  // localStorage fallback
  const leads = getFromStorage();
  const index = leads.findIndex((l) => l.id === leadId);
  if (index === -1) throw new Error(`Lead with ID ${leadId} not found`);

  const updatedLead = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
  leads[index] = updatedLead;
  saveToStorage(leads);
  return updatedLead;
};

/**
 * Delete a lead
 */
export const deleteLead = async (leadId) => {
  if (db) {
    try {
      await firestoreService.deleteLead(leadId);
      return true;
    } catch (error) {
      console.error('Firestore deleteLead failed, deleting from localStorage:', error);
    }
  }

  // localStorage fallback
  const leads = getFromStorage();
  const filtered = leads.filter((l) => l.id !== leadId);
  if (filtered.length === leads.length) throw new Error(`Lead with ID ${leadId} not found`);
  saveToStorage(filtered);
  return true;
};

// =============================================
// ===== Query & Filter Functions =====
// =============================================

/**
 * Search leads by query string across multiple fields
 */
export const searchLeads = (allLeads, queryStr) => {
  if (!queryStr || !queryStr.trim()) return allLeads;

  const searchTerm = queryStr.toLowerCase().trim();
  return allLeads.filter((lead) => {
    const searchableFields = [
      lead.fullName, lead.email, lead.mobile,
      lead.vehicleNumber, lead.vehicleModel,
      lead.registrationNumber, lead.formType,
      lead.status, lead.source,
      FORM_TYPES[lead.formType]?.title,
    ];
    return searchableFields.some(
      (field) => field && String(field).toLowerCase().includes(searchTerm)
    );
  });
};

/**
 * Get lead statistics from an array of leads
 */
export const getLeadStats = (leads) => {
  const stats = {
    total: leads.length,
    new: 0,
    contacted: 0,
    quoted: 0,
    followUp: 0,
    converted: 0,
    closed: 0,
    lost: 0,
  };

  leads.forEach((lead) => {
    if (stats.hasOwnProperty(lead.status)) {
      stats[lead.status]++;
    }
  });

  stats.active = stats.new + stats.contacted + stats.quoted + stats.followUp;
  stats.conversionRate = stats.total > 0
    ? ((stats.converted / stats.total) * 100).toFixed(1)
    : '0.0';

  stats.byFormType = {};
  Object.keys(FORM_TYPES).forEach((type) => {
    stats.byFormType[type] = leads.filter((l) => l.formType === type).length;
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  stats.recentCount = leads.filter((l) => new Date(l.createdAt) >= sevenDaysAgo).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  stats.todayCount = leads.filter((l) => new Date(l.createdAt) >= today).length;

  return stats;
};

/**
 * Get a single lead by ID from an array
 */
export const getLeadById = (leads, leadId) => {
  return leads.find((l) => l.id === leadId) || null;
};

/**
 * Bulk update lead status
 */
export const bulkUpdateStatus = async (leadIds, status) => {
  const results = [];
  for (const id of leadIds) {
    try {
      const result = await updateLead(id, { status });
      results.push(result);
    } catch (error) {
      console.error(`Failed to update lead ${id}:`, error);
    }
  }
  return results;
};

/**
 * Bulk delete leads
 */
export const bulkDelete = async (leadIds) => {
  let count = 0;
  for (const id of leadIds) {
    try {
      await deleteLead(id);
      count++;
    } catch (error) {
      console.error(`Failed to delete lead ${id}:`, error);
    }
  }
  return count;
};
