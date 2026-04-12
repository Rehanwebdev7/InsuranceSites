import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/firebase';
import { fromFirestoreLead } from '../services/firebase/firestore';
import * as leadService from '../services/leadService';

const LeadContext = createContext(undefined);

/**
 * LeadProvider - Provides lead state and CRUD operations to the entire app
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formTypeFilter, setFormTypeFilter] = useState('all');

  /**
   * Load leads via real-time onSnapshot (Firestore) or one-time fetch (fallback)
   */
  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await leadService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Real-time listener on Firestore leads collection
  useEffect(() => {
    if (!db) {
      // No Firestore — fall back to one-time fetch
      loadLeads();
      return;
    }

    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leadsData = snapshot.docs.map(fromFirestoreLead);
        setLeads(leadsData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Leads snapshot error:', err);
        setError('Failed to load leads');
        setIsLoading(false);
        // Fallback to one-time fetch
        loadLeads();
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Add a new lead
   */
  const addLead = useCallback(async (leadData) => {
    setError(null);
    try {
      const newLead = await leadService.addLead(leadData);
      setLeads((prev) => [newLead, ...prev]);
      return newLead;
    } catch (err) {
      console.error('Failed to add lead:', err);
      setError('Failed to add lead');
      throw err;
    }
  }, []);

  /**
   * Update an existing lead
   */
  const updateLead = useCallback(async (leadId, updates) => {
    setError(null);
    try {
      const updatedLead = await leadService.updateLead(leadId, updates);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, ...updatedLead } : lead))
      );
      return updatedLead;
    } catch (err) {
      console.error('Failed to update lead:', err);
      setError('Failed to update lead');
      throw err;
    }
  }, []);

  /**
   * Delete a lead
   */
  const deleteLead = useCallback(async (leadId) => {
    setError(null);
    try {
      await leadService.deleteLead(leadId);
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    } catch (err) {
      console.error('Failed to delete lead:', err);
      setError('Failed to delete lead');
      throw err;
    }
  }, []);

  /**
   * Bulk update lead status
   */
  const bulkUpdateStatus = useCallback(async (leadIds, status) => {
    setError(null);
    try {
      const updated = await leadService.bulkUpdateStatus(leadIds, status);
      setLeads((prev) =>
        prev.map((lead) => {
          const match = updated.find((u) => u.id === lead.id);
          return match ? { ...lead, ...match } : lead;
        })
      );
      return updated;
    } catch (err) {
      console.error('Failed to bulk update:', err);
      setError('Failed to bulk update leads');
      throw err;
    }
  }, []);

  /**
   * Bulk delete leads
   */
  const bulkDelete = useCallback(async (leadIds) => {
    setError(null);
    try {
      const count = await leadService.bulkDelete(leadIds);
      setLeads((prev) => prev.filter((lead) => !leadIds.includes(lead.id)));
      return count;
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      setError('Failed to bulk delete leads');
      throw err;
    }
  }, []);

  /**
   * Search leads
   */
  const searchLeads = useCallback((query) => {
    setSearchQuery(query);
    return leadService.searchLeads(leads, query);
  }, [leads]);

  /**
   * Get lead statistics
   */
  const getLeadStats = useCallback(() => {
    return leadService.getLeadStats(leads);
  }, [leads]);

  /**
   * Get a single lead by ID
   */
  const getLeadById = useCallback((leadId) => {
    return leads.find((l) => l.id === leadId) || null;
  }, [leads]);

  /**
   * Computed: filtered and searched leads based on current filters
   */
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    if (formTypeFilter && formTypeFilter !== 'all') {
      result = result.filter((lead) => lead.formType === formTypeFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      result = result.filter((lead) => {
        const fields = [
          lead.fullName, lead.email, lead.mobile,
          lead.vehicleNumber, lead.status, lead.formType,
          lead.source, lead.vehicleModel,
        ];
        return fields.some(
          (f) => f && String(f).toLowerCase().includes(term)
        );
      });
    }

    return result;
  }, [leads, statusFilter, formTypeFilter, searchQuery]);

  const contextValue = useMemo(
    () => ({
      leads,
      filteredLeads,
      isLoading,
      error,
      searchQuery,
      statusFilter,
      formTypeFilter,
      addLead,
      updateLead,
      deleteLead,
      bulkUpdateStatus,
      bulkDelete,
      loadLeads,
      searchLeads,
      getLeadStats,
      getLeadById,
      setSearchQuery,
      setStatusFilter,
      setFormTypeFilter,
      setError,
    }),
    [
      leads, filteredLeads, isLoading, error,
      searchQuery, statusFilter, formTypeFilter,
      addLead, updateLead, deleteLead, bulkUpdateStatus,
      bulkDelete, loadLeads, searchLeads, getLeadStats, getLeadById,
    ]
  );

  return (
    <LeadContext.Provider value={contextValue}>
      {children}
    </LeadContext.Provider>
  );
};

/**
 * Custom hook to consume LeadContext
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};

export default LeadContext;
