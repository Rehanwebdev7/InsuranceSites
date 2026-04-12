import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadContext';
import { motion } from 'framer-motion';
import { FiSearch, FiDownload, FiEye, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { exportToExcel, formatLeadsForExport } from '../../utils/exportHelpers';
import { toast } from 'react-toastify';

const PAGE_SIZE = 15;

const AdminLeads = () => {
  const { leads, updateLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Apply all filters: search + status + date range
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        // Search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesSearch = lead.fullName?.toLowerCase().includes(term) ||
            lead.email?.toLowerCase().includes(term) ||
            lead.mobile?.includes(searchTerm) ||
            lead.vehicleNumber?.toLowerCase().includes(term);
          if (!matchesSearch) return false;
        }
        // Status filter
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
        // Date range filter
        if (dateFrom || dateTo) {
          const leadDate = new Date(lead.createdAt);
          if (dateFrom) {
            const from = new Date(dateFrom);
            from.setHours(0, 0, 0, 0);
            if (leadDate < from) return false;
          }
          if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            if (leadDate > to) return false;
          }
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [leads, searchTerm, statusFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'quoted': return 'bg-purple-100 text-purple-700';
      case 'followUp': return 'bg-orange-100 text-orange-700';
      case 'converted': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-red-100 text-red-700';
      case 'lost': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const canExport = dateFrom && dateTo;

  const handleExport = () => {
    if (!dateFrom || !dateTo) {
      toast.warning('Please select both From and To dates to export');
      return;
    }
    if (filteredLeads.length === 0) {
      toast.warning('No leads found for selected filters');
      return;
    }
    const data = formatLeadsForExport(filteredLeads);
    const exportName = `bharat-leads-${dateFrom}-to-${dateTo}`;
    exportToExcel(data, exportName, 'Leads');
    toast.success(`Exported ${filteredLeads.length} leads to Excel`);
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFrom || dateTo;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
          <p className="text-gray-500">Manage your leads and follow-ups ({filteredLeads.length} results)</p>
        </div>
        <button
          onClick={handleExport}
          disabled={!canExport}
          title={!canExport ? 'Select date range first to export' : ''}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
            canExport
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiDownload className="w-4 h-4" />
          {canExport ? 'Export Excel' : 'Select dates to export'}
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone, vehicle..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => handleFilterChange(setSearchTerm)(e.target.value)}
            />
          </div>

          {/* Status */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            value={statusFilter}
            onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="followUp">Follow Up</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>

          {/* Date Range inline */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleFilterChange(setDateFrom)(e.target.value)}
                className="pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-[150px]"
                placeholder="From"
              />
            </div>
            <span className="text-gray-400 text-sm">to</span>
            <div className="relative">
              <FiCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleFilterChange(setDateTo)(e.target.value)}
                className="pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-[150px]"
                placeholder="To"
              />
            </div>
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFrom('');
                setDateTo('');
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">
                    <Link to={`/admin/leads/${lead.id}`} className="inline-flex text-blue-600 hover:text-blue-800">
                      <FiEye className="w-5 h-5" />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm">{lead.fullName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{lead.mobile}</p>
                    {lead.email && <p className="text-xs text-gray-400">{lead.email}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 font-mono uppercase">{lead.vehicleNumber || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {lead.formType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border-0 cursor-pointer ${getStatusColor(lead.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="followUp">Follow Up</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No leads found
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
