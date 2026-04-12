import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadContext';
import { useAuth } from '../../contexts/AuthRuntimeContext';
import { motion } from 'framer-motion';
import { FiFileText, FiTrendingUp, FiUsers, FiActivity, FiMail, FiPhone, FiShield, FiUser, FiBarChart2 } from 'react-icons/fi';

const LeadsChart = ({ leads }) => {
  const chartData = useMemo(() => {
    const days = 7;
    const result = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = leads.filter(
        (l) => new Date(l.createdAt).toDateString() === dateStr
      ).length;
      result.push({
        label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        count,
        isToday: i === 0,
      });
    }
    return result;
  }, [leads]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const total = chartData.reduce((s, d) => s + d.count, 0);

  // SVG line chart coordinates
  const W = 600, H = 200, PX = 40, PY = 20;
  const innerW = W - PX * 2, innerH = H - PY * 2;
  const points = chartData.map((d, i) => ({
    x: PX + (i / (chartData.length - 1 || 1)) * innerW,
    y: PY + innerH - (d.count / maxCount) * innerH,
    ...d,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${PY + innerH} L${points[0].x},${PY + innerH} Z`;

  // Y-axis ticks
  const yTicks = [0, Math.ceil(maxCount / 2), maxCount];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Leads This Week</h2>
        </div>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = PY + innerH - (tick / maxCount) * innerH;
          return (
            <g key={tick}>
              <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <text x={PX - 8} y={y + 4} textAnchor="end" className="fill-gray-400" style={{ fontSize: '11px' }}>{tick}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#chartGrad)" opacity="0.3" />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Dots + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.isToday ? 5 : 3.5} fill={p.isToday ? '#2563eb' : '#3b82f6'} stroke="white" strokeWidth="2" />
            {p.count > 0 && (
              <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-gray-700 font-semibold" style={{ fontSize: '11px' }}>{p.count}</text>
            )}
            <text x={p.x} y={H + 20} textAnchor="middle" className={p.isToday ? 'fill-blue-600 font-bold' : 'fill-gray-400'} style={{ fontSize: '11px' }}>{p.label}</text>
          </g>
        ))}

        {/* Gradient def */}
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const { leads, isLoading } = useLeads();
  const [stats, setStats] = useState({
    totalLeads: 0,
    todayLeads: 0,
    pending: 0,
    converted: 0,
  });

  useEffect(() => {
    const today = new Date().toDateString();
    setStats({
      totalLeads: leads.length,
      todayLeads: leads.filter(l => new Date(l.createdAt).toDateString() === today).length,
      pending: leads.filter(l => l.status === 'new' || l.status === 'contacted').length,
      converted: leads.filter(l => l.status === 'converted').length,
    });
  }, [leads]);

  const statCards = [
    { title: 'Total Leads', value: stats.totalLeads, icon: FiFileText, color: 'blue' },
    { title: 'Today\'s Leads', value: stats.todayLeads, icon: FiActivity, color: 'green' },
    { title: 'Pending', value: stats.pending, icon: FiTrendingUp, color: 'yellow' },
    { title: 'Converted', value: stats.converted, icon: FiUsers, color: 'purple' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div>
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-5 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 text-white font-bold text-xl shrink-0 shadow-lg shadow-blue-500/20">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            ) : (
              (user?.name || '?').charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-800 truncate">
                Welcome back, {user?.name || 'Admin'}!
              </h1>
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  <FiShield className="w-3 h-3" /> Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  <FiUser className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500 flex-wrap">
              {user?.email && (
                <span className="flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5 text-gray-400" /> {user.email}
                </span>
              )}
              {user?.mobile && (
                <span className="flex items-center gap-1.5">
                  <FiPhone className="w-3.5 h-3.5 text-gray-400" /> +91 {user.mobile}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Leads per Day Chart */}
      <LeadsChart leads={leads} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Leads</h2>
            <Link to="/admin/leads" className="text-blue-600 hover:underline text-sm">View All</Link>
          </div>
          <div className="space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{lead.fullName}</p>
                  <p className="text-sm text-gray-500">{lead.formType}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                  lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="text-gray-500 text-center py-4">No leads yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/leads" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <FiFileText className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-800">View Leads</p>
            </Link>
            <Link to="/admin/services" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <FiActivity className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-800">Manage Services</p>
            </Link>
            <Link to="/admin/slider" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <FiTrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-800">Manage Slider</p>
            </Link>
            <Link to="/admin/settings" className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <FiUsers className="w-6 h-6 text-yellow-600 mb-2" />
              <p className="font-medium text-gray-800">Settings</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;