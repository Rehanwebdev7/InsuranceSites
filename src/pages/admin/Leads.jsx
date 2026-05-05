import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadContext';
import { motion } from 'framer-motion';
import {
  FiSearch, FiDownload, FiEye, FiCalendar, FiChevronLeft, FiChevronRight, FiX,
} from 'react-icons/fi';
import { exportToExcel, formatLeadsForExport } from '../../utils/exportHelpers';
import { toast } from 'react-toastify';
import useAdminTheme from '../../hooks/useAdminTheme';

const PAGE_SIZE = 15;

const buildStatusOptions = (isLight) => [
  { value: 'new',        label: 'New',
    cls: isLight
      ? 'bg-[rgba(201,169,97,0.18)] text-[#8B6F2C] border-[#C9A961]'
      : 'bg-[#C9A961]/15 text-[#E5C770] border-[rgba(201,169,97,0.40)]' },
  { value: 'contacted',  label: 'Contacted',
    cls: isLight
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { value: 'quoted',     label: 'Quoted',
    cls: isLight
      ? 'bg-purple-100 text-purple-800 border-purple-300'
      : 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  { value: 'followUp',   label: 'Follow Up',
    cls: isLight
      ? 'bg-orange-100 text-orange-800 border-orange-300'
      : 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  { value: 'converted',  label: 'Converted',
    cls: isLight
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  { value: 'closed',     label: 'Closed',
    cls: isLight
      ? 'bg-red-100 text-red-700 border-red-300'
      : 'bg-red-500/15 text-red-300 border-red-500/30' },
  { value: 'lost',       label: 'Lost',
    cls: isLight
      ? 'bg-ivory-200 text-ink-700 border-[#EBDCB1]'
      : 'bg-noir-700 text-ink-300 border-[rgba(201,169,97,0.20)]' },
];

const AdminLeads = () => {
  const { leads, updateLead } = useLeads();
  const theme = useAdminTheme();
  const isLight = theme === 'light';
  const STATUS_OPTIONS = buildStatusOptions(isLight);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesSearch =
            lead.fullName?.toLowerCase().includes(term) ||
            lead.email?.toLowerCase().includes(term) ||
            lead.mobile?.includes(searchTerm) ||
            lead.vehicleNumber?.toLowerCase().includes(term);
          if (!matchesSearch) return false;
        }
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
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

  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
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

  // Theme tokens
  const t = isLight
    ? {
        sectionLabel: 'text-[#8B6F2C]',
        sectionLabelMute: 'text-ink-500',
        h1Text: 'text-noir-950',
        subText: 'text-ink-500',
        countAccent: 'text-[#8B6F2C]',
        exportDisabled: 'bg-ivory-200 text-ink-400 border border-[#EBDCB1] cursor-not-allowed',
        filterCard: 'bg-white border-[#EBDCB1] shadow-[0_18px_36px_-16px_rgba(46,37,16,0.10)]',
        searchInput: 'bg-ivory-50 border border-[#EBDCB1] text-noir-950 placeholder:text-ink-400 focus:border-[#C9A961]',
        searchIcon: 'text-[#8B6F2C]',
        select: 'bg-ivory-50 border border-[#EBDCB1] text-noir-950 focus:border-[#C9A961]',
        clearBtn: 'text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300',
        tableCard: 'bg-white border-[#EBDCB1] shadow-[0_24px_48px_-16px_rgba(46,37,16,0.10)]',
        thead: 'bg-ivory-100 border-b border-[#EBDCB1]',
        thText: 'text-[#8B6F2C]',
        rowDivider: 'divide-[#EBDCB1]',
        rowHover: 'hover:bg-ivory-100',
        eyeBtn: 'text-[#8B6F2C] hover:bg-[rgba(201,169,97,0.18)] hover:text-noir-950',
        nameText: 'text-noir-900',
        contactText: 'text-noir-700',
        emailText: 'text-ink-500',
        vehicleText: 'text-noir-700',
        emptyVehicle: 'text-ink-400',
        typePill: 'bg-[rgba(201,169,97,0.12)] text-[#8B6F2C] border-[#C9A961]/40',
        dateText: 'text-ink-500',
        emptyText: 'text-ink-400',
        paginationBg: 'bg-ivory-100 border-t border-[#EBDCB1]',
        paginationBtn: 'text-[#8B6F2C] hover:bg-ivory-200',
        paginationActive: 'bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 border border-[#B8923A] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)]',
        paginationInactive: 'text-ink-700 hover:bg-ivory-200 hover:text-[#8B6F2C]',
        countLabel: 'text-ink-500',
        colorScheme: 'light',
      }
    : {
        sectionLabel: 'text-[#C9A961]',
        sectionLabelMute: 'text-ink-400',
        h1Text: 'text-white',
        subText: 'text-ink-400',
        countAccent: 'text-[#E5C770]',
        exportDisabled: 'bg-noir-800 text-ink-500 border border-[rgba(201,169,97,0.18)] cursor-not-allowed',
        filterCard: 'bg-noir-900 border-[rgba(201,169,97,0.22)] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.5)]',
        searchInput: 'bg-noir-800 border border-[rgba(201,169,97,0.25)] text-white placeholder:text-ink-500 focus:border-[#C9A961]',
        searchIcon: 'text-[#C9A961]',
        select: 'bg-noir-800 border border-[rgba(201,169,97,0.25)] text-white focus:border-[#C9A961]',
        clearBtn: 'text-red-300 hover:bg-red-500/10 border-red-500/25 hover:border-red-500/40',
        tableCard: 'bg-noir-900 border-[rgba(201,169,97,0.22)] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)]',
        thead: 'bg-noir-800 border-b border-[rgba(201,169,97,0.20)]',
        thText: 'text-[#C9A961]',
        rowDivider: 'divide-[rgba(201,169,97,0.14)]',
        rowHover: 'hover:bg-noir-800/60',
        eyeBtn: 'text-[#E5C770] hover:bg-[rgba(201,169,97,0.15)] hover:text-white',
        nameText: 'text-white',
        contactText: 'text-ink-200',
        emailText: 'text-ink-500',
        vehicleText: 'text-ink-200',
        emptyVehicle: 'text-ink-500',
        typePill: 'bg-[rgba(201,169,97,0.10)] text-[#E5C770] border-[rgba(201,169,97,0.25)]',
        dateText: 'text-ink-400',
        emptyText: 'text-ink-400',
        paginationBg: 'bg-noir-800/50 border-t border-[rgba(201,169,97,0.20)]',
        paginationBtn: 'text-[#E5C770] hover:bg-noir-700',
        paginationActive: 'bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 border border-[#B8923A] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)]',
        paginationInactive: 'text-ink-300 hover:bg-noir-700 hover:text-[#E5C770]',
        countLabel: 'text-ink-400',
        colorScheme: 'dark',
      };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`font-display italic text-[0.65rem] font-semibold ${t.sectionLabel} tracking-widest`}>Nº 02</span>
            <span className="w-5 h-px bg-[#C9A961]" />
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] ${t.sectionLabelMute}`}>Inbox</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-display font-semibold tracking-tight ${t.h1Text}`}>
            Leads.
          </h1>
          <p className={`text-sm mt-1 ${t.subText}`}>
            Manage your leads and follow-ups · <span className={`${t.countAccent} font-semibold`}>{filteredLeads.length}</span> results
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={!canExport}
          title={!canExport ? 'Select date range first to export' : ''}
          className={`inline-flex items-center gap-2 px-5 h-11 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            canExport
              ? 'bg-gradient-to-br from-[#C9A961] to-[#D4AF37] text-noir-950 border border-[#B8923A] shadow-[0_18px_36px_-12px_rgba(201,169,97,0.55)] hover:shadow-[0_28px_56px_-16px_rgba(201,169,97,0.65)] active:scale-[0.98]'
              : t.exportDisabled
          }`}
        >
          <FiDownload className="w-4 h-4 shrink-0" />
          {canExport ? 'Export Excel' : 'Select dates to export'}
        </button>
      </div>

      {/* Filters bar */}
      <div className={`${t.filterCard} border rounded-2xl p-4 mb-6`}>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.searchIcon}`} />
            <input
              type="text"
              placeholder="Search name, email, phone, vehicle…"
              className={`w-full pl-10 pr-4 h-11 ${t.searchInput} rounded-lg outline-none text-sm focus:shadow-[0_0_0_4px_rgba(201,169,97,0.18)] transition-all`}
              value={searchTerm}
              onChange={(e) => handleFilterChange(setSearchTerm)(e.target.value)}
            />
          </div>

          {/* Status */}
          <select
            className={`h-11 px-3 ${t.select} rounded-lg text-sm outline-none focus:shadow-[0_0_0_4px_rgba(201,169,97,0.18)] cursor-pointer min-w-[140px]`}
            value={statusFilter}
            onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
          >
            <option value="all">All status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiCalendar className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${t.searchIcon} w-3.5 h-3.5`} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleFilterChange(setDateFrom)(e.target.value)}
                className={`pl-8 pr-2 h-11 ${t.searchInput} rounded-lg text-sm outline-none focus:shadow-[0_0_0_4px_rgba(201,169,97,0.18)] w-[150px] transition-all`}
                style={{ colorScheme: t.colorScheme }}
              />
            </div>
            <span className={`text-sm ${t.subText}`}>to</span>
            <div className="relative">
              <FiCalendar className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${t.searchIcon} w-3.5 h-3.5`} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleFilterChange(setDateTo)(e.target.value)}
                className={`pl-8 pr-2 h-11 ${t.searchInput} rounded-lg text-sm outline-none focus:shadow-[0_0_0_4px_rgba(201,169,97,0.18)] w-[150px] transition-all`}
                style={{ colorScheme: t.colorScheme }}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFrom('');
                setDateTo('');
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 h-11 px-3 text-sm rounded-lg transition-colors whitespace-nowrap border ${t.clearBtn}`}
            >
              <FiX className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`${t.tableCard} border rounded-2xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={t.thead}>
              <tr>
                <th className={`px-4 py-3.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${t.thText}`}>Actions</th>
                <th className={`px-4 py-3.5 text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${t.thText}`}>Name</th>
                <th className={`px-4 py-3.5 text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${t.thText}`}>Contact</th>
                <th className={`px-4 py-3.5 text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${t.thText}`}>Vehicle</th>
                <th className={`px-4 py-3.5 text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${t.thText}`}>Type</th>
                <th className={`px-4 py-3.5 text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${t.thText}`}>Status</th>
                <th className={`px-4 py-3.5 text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${t.thText}`}>Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${t.rowDivider}`}>
              {paginatedLeads.map((lead, i) => {
                const status = STATUS_OPTIONS.find((s) => s.value === lead.status) || {
                  value: lead.status,
                  label: lead.status,
                  cls: isLight
                    ? 'bg-ivory-200 text-ink-700 border-[#EBDCB1]'
                    : 'bg-noir-700 text-ink-300 border-[rgba(201,169,97,0.20)]',
                };
                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className={`${t.rowHover} transition-colors group`}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <Link
                        to={`/admin/leads/${lead.id}`}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all ${t.eyeBtn}`}
                        title="View details"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className={`font-display font-semibold text-sm tracking-tight ${t.nameText}`}>{lead.fullName}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className={`text-sm font-medium ${t.contactText}`}>{lead.mobile}</p>
                      {lead.email && <p className={`text-[0.7rem] ${t.emailText}`}>{lead.email}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className={`text-sm font-mono uppercase tracking-wider ${t.vehicleText}`}>
                        {lead.vehicleNumber || <span className={t.emptyVehicle}>—</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 border rounded-full text-[0.7rem] font-semibold lowercase ${t.typePill}`}>
                        {lead.formType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                        className={`px-2.5 py-1 rounded-full text-[0.7rem] font-semibold border cursor-pointer outline-none transition-all hover:brightness-110 ${status.cls}`}
                        style={{ colorScheme: t.colorScheme }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option
                            key={s.value}
                            value={s.value}
                            className={isLight ? 'bg-white text-noir-900' : 'bg-noir-900 text-white'}
                          >
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={`px-4 py-3.5 text-[0.78rem] font-medium whitespace-nowrap ${t.dateText}`}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-16">
            <p className={`${t.emptyText} text-sm italic`}>No leads match your filters.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-4 py-3.5 ${t.paginationBg}`}>
            <p className={`text-xs ${t.countLabel}`}>
              Showing{' '}
              <span className={`${t.countAccent} font-semibold`}>
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredLeads.length)}
              </span>{' '}
              of <span className={`${t.countAccent} font-semibold`}>{filteredLeads.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${t.paginationBtn}`}
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page;
                if (totalPages <= 7) page = i + 1;
                else if (currentPage <= 4) page = i + 1;
                else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                else page = currentPage - 3 + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      currentPage === page ? t.paginationActive : t.paginationInactive
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${t.paginationBtn}`}
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
