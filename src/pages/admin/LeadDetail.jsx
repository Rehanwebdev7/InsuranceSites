import { useParams, Link } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadContext';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPhone, FiMail, FiUser, FiTruck, FiFileText, FiClock } from 'react-icons/fi';

const STATUS_LIST = [
  { value: 'new', label: 'New', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 ring-blue-200' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500', light: 'bg-yellow-50 text-yellow-700 ring-yellow-200' },
  { value: 'quoted', label: 'Quoted', color: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 ring-purple-200' },
  { value: 'followUp', label: 'Follow Up', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700 ring-orange-200' },
  { value: 'converted', label: 'Converted', color: 'bg-green-500', light: 'bg-green-50 text-green-700 ring-green-200' },
  { value: 'closed', label: 'Closed', color: 'bg-red-500', light: 'bg-red-50 text-red-700 ring-red-200' },
  { value: 'lost', label: 'Lost', color: 'bg-gray-500', light: 'bg-gray-100 text-gray-700 ring-gray-300' },
];

const InfoItem = ({ label, value }) => {
  if (!value && value !== false && value !== 0) return null;
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  if (!display || display === '-') return null;
  return (
    <div className="px-3 py-2 bg-gray-50 rounded-lg">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="font-medium text-gray-800 text-sm">{display}</p>
    </div>
  );
};

const LeadDetail = () => {
  const { id } = useParams();
  const { leads, updateLead } = useLeads();
  const lead = leads.find(l => l.id === id);

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Lead not found</h2>
        <Link to="/admin/leads" className="text-blue-600 hover:underline">Back to Leads</Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    if (newStatus !== lead.status) {
      updateLead(lead.id, { status: newStatus });
    }
  };

  return (
    <div>
      <Link to="/admin/leads" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 mb-4 text-sm">
        <FiArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 mb-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{lead.fullName || 'Unknown'}</h1>
            <div className="flex items-center gap-2 mt-1">
              {lead.formType && (
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {lead.formType}
                </span>
              )}
              <span className="text-[10px] text-gray-400">ID: {lead.id}</span>
            </div>
          </div>
          {/* Quick Contact Buttons */}
          <div className="flex items-center gap-2">
            {lead.mobile && (
              <a
                href={`tel:+91${lead.mobile}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
              >
                <FiPhone className="w-3.5 h-3.5" /> +91 {lead.mobile}
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <FiMail className="w-3.5 h-3.5" /> {lead.email}
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Status Bar - Horizontal Clickable Pills */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-xl shadow-sm p-4 mb-4"
      >
        <p className="text-xs font-medium text-gray-500 mb-2.5 uppercase tracking-wider">Lead Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_LIST.map((status) => {
            const isSelected = lead.status === status.value;
            return (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? `${status.light} ring-2 shadow-sm scale-105`
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? status.color : 'bg-gray-300'}`} />
                  {status.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Compact Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <FiUser className="w-4 h-4 text-blue-600" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <InfoItem label="Full Name" value={lead.fullName} />
              <InfoItem label="Mobile" value={lead.mobile} />
              <InfoItem label="Email" value={lead.email} />
              <InfoItem label="Address" value={lead.address} />
            </div>
          </motion.div>

          {/* Vehicle Details */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <FiTruck className="w-4 h-4 text-blue-600" /> Vehicle Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <InfoItem label="Vehicle Number" value={lead.vehicleNumber} />
              <InfoItem label="Vehicle Model" value={lead.vehicleModel} />
              <InfoItem label="Manufacturing Year" value={lead.manufacturingYear} />
              <InfoItem label="Engine CC" value={lead.engineCC} />
            </div>
          </motion.div>

          {/* Policy Details */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <FiFileText className="w-4 h-4 text-blue-600" /> Policy Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <InfoItem label="Active Policy" value={lead.hasActivePolicy} />
              <InfoItem label="Current Insurer" value={lead.currentInsurer} />
              <InfoItem label="Policy Expiry" value={lead.policyExpiry} />
              <InfoItem label="Insurance Type" value={lead.insuranceType} />
              <InfoItem label="NCB Years" value={lead.ncbYears} />
              <InfoItem label="Previous Claims" value={lead.previousClaims} />
            </div>
          </motion.div>
        </div>

        {/* Right Column - Lead Meta */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 h-fit"
        >
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
            <FiClock className="w-4 h-4 text-blue-600" /> Lead Information
          </h3>
          <div className="space-y-2">
            <InfoItem label="Form Type" value={lead.formType} />
            <InfoItem label="Service Title" value={lead.serviceTitle} />
            <InfoItem label="Source" value={lead.source} />
            <InfoItem label="Preferred Time" value={lead.preferredTime} />
            <InfoItem label="Created" value={lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '-'} />
            <InfoItem label="Updated" value={lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '-'} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadDetail;
