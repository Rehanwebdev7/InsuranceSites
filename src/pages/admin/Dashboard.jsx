import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadContext';
import { useAuth } from '../../contexts/AuthRuntimeContext';
import { motion } from 'framer-motion';
import {
  FiFileText, FiTrendingUp, FiUsers, FiActivity, FiMail, FiPhone,
  FiShield, FiUser, FiBarChart2, FiArrowRight, FiImage, FiSettings,
  FiArrowUpRight, FiArrowDownRight,
} from 'react-icons/fi';
import useAdminTheme from '../../hooks/useAdminTheme';

const statusPillFor = (isLight) => ({
  new:       isLight
    ? 'bg-[rgba(201,169,97,0.15)] text-[#8B6F2C] border border-[#C9A961]'
    : 'bg-[#C9A961]/15 text-[#E5C770] border border-[rgba(201,169,97,0.35)]',
  contacted: isLight
    ? 'bg-amber-100 text-amber-800 border border-amber-300'
    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  converted: isLight
    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  closed:    isLight
    ? 'bg-red-100 text-red-700 border border-red-300'
    : 'bg-red-500/15 text-red-300 border border-red-500/30',
});

/* -----------------------------------------------------------
   Smooth-line gold chart — Catmull-Rom spline turned into bezier curves.
   Theme-aware: dark vs light tokens.
   ----------------------------------------------------------- */
const catmullRomToBezier = (points) => {
  if (points.length < 2) return '';
  const path = [`M ${points[0].x},${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
  }
  return path.join(' ');
};

const LeadsChart = ({ leads, isLight }) => {
  const chartData = useMemo(() => {
    const days = 7;
    const result = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = leads.filter((l) => new Date(l.createdAt).toDateString() === dateStr).length;
      result.push({
        label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        sub: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        count,
        isToday: i === 0,
      });
    }
    return result;
  }, [leads]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const total = chartData.reduce((s, d) => s + d.count, 0);
  const peakDay = chartData.reduce((acc, d) => (d.count > acc.count ? d : acc), chartData[0]);
  const avg = (total / chartData.length).toFixed(1);

  // SVG geometry
  const W = 720, H = 240, PX = 28, PY = 28;
  const innerW = W - PX * 2;
  const innerH = H - PY * 2;
  const points = chartData.map((d, i) => ({
    x: PX + (i / (chartData.length - 1 || 1)) * innerW,
    y: PY + innerH - (d.count / maxCount) * innerH,
    ...d,
  }));
  const linePath = catmullRomToBezier(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${PY + innerH} L ${points[0].x},${PY + innerH} Z`;
  const yTicks = [0, Math.ceil(maxCount / 2), maxCount];

  // Theme tokens
  const cardBg = isLight
    ? 'bg-gradient-to-br from-white to-ivory-100 border-[#EBDCB1]'
    : 'bg-gradient-to-br from-noir-900 to-noir-800 border-[rgba(201,169,97,0.25)]';
  const titleText = isLight ? 'text-noir-950' : 'text-white';
  const subText = isLight ? 'text-ink-500' : 'text-ink-400';
  const dividerBg = isLight ? 'bg-[#EBDCB1]' : 'bg-[rgba(201,169,97,0.25)]';
  const goldBig = isLight ? 'text-[#8B6F2C]' : 'text-[#E5C770]';
  const numText = isLight ? 'text-noir-900' : 'text-white';
  const peakText = isLight ? 'text-[#8B6F2C]' : 'text-[#C9A961]';
  const dotGridColor = isLight ? '#C9A961' : '#C9A961';
  const dotGridOpacity = isLight ? 0.06 : 0.07;
  const gridLineStroke = isLight ? 'rgba(201,169,97,0.30)' : 'rgba(201,169,97,0.18)';
  const tickLabel = isLight ? '#8B6F2C' : '#737373';
  const xLabel = (isToday) => (isToday ? (isLight ? '#8B6F2C' : '#E5C770') : (isLight ? '#475569' : '#CBD5E1'));
  const xSub   = (isToday) => (isToday ? (isLight ? '#C9A961' : '#C9A961') : (isLight ? '#94A3B8' : '#737373'));
  const lineGrad = ['#C9A961', '#D4AF37', '#E5C770'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`relative ${cardBg} border rounded-2xl p-5 md:p-7 mb-8 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.20)] overflow-hidden`}
    >
      {/* Dotted gold grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: dotGridOpacity,
          backgroundImage: `radial-gradient(circle, ${dotGridColor} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      {/* Warm halo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(212,175,55,0.10) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className={`w-11 h-11 rounded-xl ${isLight ? 'bg-ivory-100 border border-[#EBDCB1] text-[#8B6F2C]' : 'bg-noir-800 border border-[rgba(201,169,97,0.30)] text-[#E5C770]'} flex items-center justify-center`}>
            <FiBarChart2 className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display italic text-[0.65rem] font-semibold text-[#C9A961] tracking-widest">Nº 02</span>
              <span className="w-5 h-px bg-[#C9A961]" />
              <h2 className={`text-base md:text-lg font-display font-semibold tracking-tight ${titleText}`}>Leads · this week</h2>
            </div>
            <p className={`text-[0.75rem] mt-0.5 ${subText}`}>Daily inbound velocity, last 7 days</p>
          </div>
        </div>
        <div className="flex items-center gap-5 sm:gap-6">
          <div>
            <div className={`font-display text-2xl md:text-3xl font-semibold ${goldBig} leading-none`}>{total}</div>
            <div className={`text-[0.65rem] uppercase tracking-[0.14em] mt-1 ${subText}`}>total</div>
          </div>
          <div className={`hidden sm:block w-px h-8 ${dividerBg}`} />
          <div>
            <div className={`font-display text-2xl md:text-3xl font-semibold ${numText} leading-none`}>{avg}</div>
            <div className={`text-[0.65rem] uppercase tracking-[0.14em] mt-1 ${subText}`}>avg / day</div>
          </div>
          <div className={`hidden md:block w-px h-8 ${dividerBg}`} />
          <div className="hidden md:block">
            <div className={`font-display text-base font-semibold ${peakText} leading-tight`}>{peakDay.label}</div>
            <div className={`text-[0.65rem] uppercase tracking-[0.14em] mt-1 ${subText}`}>peak · {peakDay.count}</div>
          </div>
        </div>
      </div>

      {/* SVG smooth line chart */}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H + 44}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="dashLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor={lineGrad[0]} />
              <stop offset="50%" stopColor={lineGrad[2]} />
              <stop offset="100%" stopColor={lineGrad[1]} />
            </linearGradient>
            <linearGradient id="dashAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#D4AF37" stopOpacity={isLight ? 0.45 : 0.55} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
            <filter id="dashLineGlow">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Y-axis grid lines + tick labels */}
          {yTicks.map((tick) => {
            const y = PY + innerH - (tick / maxCount) * innerH;
            return (
              <g key={tick}>
                <line
                  x1={PX} y1={y} x2={W - PX} y2={y}
                  stroke={gridLineStroke}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text x={PX - 8} y={y + 4} textAnchor="end" fill={tickLabel} style={{ fontSize: '11px' }}>{tick}</text>
              </g>
            );
          })}

          {/* Area gradient under line */}
          <motion.path
            d={areaPath}
            fill="url(#dashAreaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />

          {/* Smooth line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#dashLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#dashLineGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Data points + labels */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Outer glow ring on today's dot */}
              {p.isToday && (
                <circle
                  cx={p.x} cy={p.y}
                  r="11"
                  fill="rgba(212,175,55,0.20)"
                  style={{ animation: 'pulseSoft 2s ease-in-out infinite' }}
                />
              )}
              <circle
                cx={p.x} cy={p.y}
                r={p.isToday ? 6 : 4.5}
                fill={p.isToday ? '#FFE9A8' : '#D4AF37'}
                stroke={isLight ? '#FFFFFF' : '#0F0F0F'}
                strokeWidth="2.5"
              />
              {p.count > 0 && (
                <text
                  x={p.x} y={p.y - 14}
                  textAnchor="middle"
                  fill={isLight ? '#8B6F2C' : '#E5C770'}
                  fontWeight="700"
                  fontFamily="'Playfair Display', Georgia, serif"
                  style={{ fontSize: '12px' }}
                >
                  {p.count}
                </text>
              )}
              {/* X-axis labels */}
              <text
                x={p.x} y={H + 18}
                textAnchor="middle"
                fill={xLabel(p.isToday)}
                fontWeight={p.isToday ? '700' : '600'}
                fontFamily="'Playfair Display', Georgia, serif"
                style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                {p.label}
              </text>
              <text
                x={p.x} y={H + 34}
                textAnchor="middle"
                fill={xSub(p.isToday)}
                style={{ fontSize: '10px' }}
              >
                {p.sub}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
};

/* -----------------------------------------------------------
   Dashboard
   ----------------------------------------------------------- */
const Dashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const { leads } = useLeads();
  const theme = useAdminTheme();
  const isLight = theme === 'light';
  const STATUS_PILL = statusPillFor(isLight);

  const [stats, setStats] = useState({ totalLeads: 0, todayLeads: 0, pending: 0, converted: 0 });

  useEffect(() => {
    const today = new Date().toDateString();
    setStats({
      totalLeads: leads.length,
      todayLeads: leads.filter((l) => new Date(l.createdAt).toDateString() === today).length,
      pending: leads.filter((l) => l.status === 'new' || l.status === 'contacted').length,
      converted: leads.filter((l) => l.status === 'converted').length,
    });
  }, [leads]);

  const conversionRate = stats.totalLeads > 0
    ? ((stats.converted / stats.totalLeads) * 100).toFixed(1)
    : '0.0';

  const statCards = [
    { title: 'Total leads',   value: stats.totalLeads,  icon: FiFileText,   hint: 'All-time inbound',
      trend: stats.totalLeads > 0 ? 'up' : 'flat', trendLabel: 'tracked' },
    { title: "Today's leads", value: stats.todayLeads,  icon: FiActivity,   hint: 'Last 24 hours',
      trend: stats.todayLeads > 0 ? 'up' : 'down', trendLabel: stats.todayLeads > 0 ? 'live' : 'quiet day' },
    { title: 'In follow-up',  value: stats.pending,     icon: FiTrendingUp, hint: 'Needs attention',
      trend: stats.pending > 0 ? 'up' : 'flat', trendLabel: stats.pending > 0 ? 'pending' : 'clear' },
    { title: 'Conversion',    value: `${conversionRate}%`, icon: FiUsers,   hint: `${stats.converted} closed-won`,
      trend: parseFloat(conversionRate) >= 30 ? 'up' : parseFloat(conversionRate) >= 10 ? 'flat' : 'down', trendLabel: 'rate' },
  ];

  const quickActions = [
    { to: '/admin/leads',    icon: FiFileText, title: 'View leads',     hint: 'Inbox + statuses' },
    { to: '/admin/services', icon: FiActivity, title: 'Manage services', hint: 'Edit, reorder, toggle' },
    { to: '/admin/slider',   icon: FiImage,    title: 'Manage slider',   hint: 'Hero images' },
    { to: '/admin/settings', icon: FiSettings, title: 'Settings',        hint: 'Brand, contact, hero' },
  ];

  // Theme tokens
  const t = isLight
    ? {
        rootText: 'text-noir-950',
        profileCard: 'bg-gradient-to-br from-white to-ivory-100 border-[#EBDCB1]',
        cardText: 'text-noir-950',
        cardSubText: 'text-ink-600',
        cardMuted: 'text-ink-500',
        cabinetCard: 'bg-white border-[#EBDCB1]',
        cabinetCardSm: 'bg-ivory-100 border-[#EBDCB1]',
        kpiCard: 'bg-gradient-to-br from-white to-ivory-100 border-[#EBDCB1]',
        kpiHover: 'hover:border-[#C9A961] hover:shadow-[0_20px_40px_-16px_rgba(201,169,97,0.30)]',
        kpiIconWrap: 'bg-ivory-100 border-[#EBDCB1] text-[#8B6F2C]',
        kpiNum: 'text-[#8B6F2C]',
        kpiTitle: 'text-noir-900',
        kpiHint: 'text-ink-500',
        watermark: 'text-[#C9A961]/[0.08]',
        actionTile: 'bg-ivory-100 border-[#EBDCB1] hover:border-[#C9A961] hover:bg-ivory-200',
        actionIconWrap: 'bg-white border-[#EBDCB1] text-[#8B6F2C]',
        actionTitle: 'text-noir-900',
        actionHint: 'text-ink-500',
        rowName: 'text-noir-900',
        rowSub: 'text-ink-500',
        leadsLink: 'text-[#8B6F2C] hover:text-noir-950',
        emptyText: 'text-ink-500',
        divider: 'divide-[#EBDCB1]',
        sectionLabel: 'text-[#8B6F2C]',
      }
    : {
        rootText: 'text-white',
        profileCard: 'bg-gradient-to-br from-noir-800 to-noir-900 border-[rgba(201,169,97,0.30)]',
        cardText: 'text-white',
        cardSubText: 'text-ink-300',
        cardMuted: 'text-ink-400',
        cabinetCard: 'bg-noir-900 border-[rgba(201,169,97,0.22)]',
        cabinetCardSm: 'bg-noir-800 border-[rgba(201,169,97,0.20)]',
        kpiCard: 'bg-gradient-to-br from-noir-900 to-noir-800 border-[rgba(201,169,97,0.22)]',
        kpiHover: 'hover:border-[#C9A961] hover:shadow-[0_20px_40px_-16px_rgba(201,169,97,0.40)]',
        kpiIconWrap: 'bg-noir-950 border-[rgba(201,169,97,0.30)] text-[#E5C770]',
        kpiNum: 'text-[#E5C770]',
        kpiTitle: 'text-white',
        kpiHint: 'text-ink-400',
        watermark: 'text-[#C9A961]/[0.06]',
        actionTile: 'bg-noir-800 border-[rgba(201,169,97,0.20)] hover:border-[#C9A961] hover:bg-noir-700',
        actionIconWrap: 'bg-noir-900 border-[rgba(201,169,97,0.30)] text-[#E5C770]',
        actionTitle: 'text-white',
        actionHint: 'text-ink-400',
        rowName: 'text-white',
        rowSub: 'text-ink-400',
        leadsLink: 'text-[#E5C770] hover:text-white',
        emptyText: 'text-ink-400',
        divider: 'divide-[rgba(201,169,97,0.18)]',
        sectionLabel: 'text-[#C9A961]',
      };

  return (
    <div className={t.rootText}>
      {/* Profile cabinet card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative ${t.profileCard} border rounded-2xl p-5 md:p-6 mb-8 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.20)] overflow-hidden`}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(201,169,97,0.18) 0%, transparent 60%)',
          }}
        />
        {/* Gold corner accents */}
        <div aria-hidden className="absolute top-3 right-3 w-10 h-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[2px] h-7 bg-[#C9A961]" />
          <div className="absolute top-0 right-0 h-[2px] w-7 bg-[#C9A961]" />
        </div>

        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-[#E5C770] bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] flex items-center justify-center text-noir-950 font-display italic font-bold text-2xl shrink-0 shadow-[0_12px_24px_-8px_rgba(201,169,97,0.55)]">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              (user?.name || '?').charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display italic text-[0.65rem] font-semibold text-[#C9A961] tracking-widest">Nº 01</span>
              <span className="w-5 h-px bg-[#C9A961]" />
              <h1 className={`text-lg md:text-xl font-display font-semibold tracking-tight truncate ${t.cardText}`}>
                Welcome back, {user?.name || 'Admin'}.
              </h1>
              {isSuperAdmin ? (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${
                  isLight
                    ? 'bg-[rgba(201,169,97,0.20)] text-[#8B6F2C] border border-[#C9A961]'
                    : 'bg-[#C9A961]/15 text-[#E5C770] border border-[rgba(201,169,97,0.40)]'
                }`}>
                  <FiShield className="w-3 h-3" /> Super admin
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${
                  isLight
                    ? 'bg-ivory-200 text-ink-700 border border-[#EBDCB1]'
                    : 'bg-noir-800 text-ink-300 border border-[rgba(201,169,97,0.25)]'
                }`}>
                  <FiUser className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <div className={`flex items-center gap-4 mt-1.5 text-sm flex-wrap ${t.cardSubText}`}>
              {user?.email && (
                <span className="flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5 text-[#C9A961]" /> {user.email}
                </span>
              )}
              {user?.mobile && (
                <span className="flex items-center gap-1.5">
                  <FiPhone className="w-3.5 h-3.5 text-[#C9A961]" /> +91 {user.mobile}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? FiArrowUpRight : stat.trend === 'down' ? FiArrowDownRight : FiActivity;
          const trendCls =
            stat.trend === 'up'
              ? isLight
                ? 'text-emerald-700 bg-emerald-100 border-emerald-300'
                : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
              : stat.trend === 'down'
                ? isLight
                  ? 'text-red-700 bg-red-100 border-red-300'
                  : 'text-red-300 bg-red-500/10 border-red-500/30'
                : isLight
                  ? 'text-[#8B6F2C] bg-[rgba(201,169,97,0.15)] border-[#C9A961]'
                  : 'text-[#E5C770] bg-[rgba(201,169,97,0.10)] border-[rgba(201,169,97,0.30)]';
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative ${t.kpiCard} border rounded-2xl p-5 md:p-6 ${t.kpiHover} hover:-translate-y-0.5 transition-all duration-500 overflow-hidden`}
            >
              {/* Hover halo */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background:
                    'radial-gradient(ellipse at top right, rgba(212,175,55,0.18) 0%, transparent 60%)',
                }}
              />
              {/* № watermark */}
              <span
                aria-hidden
                className={`absolute -top-2 -right-1 font-display italic font-bold text-[5rem] leading-none ${t.watermark} select-none pointer-events-none`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${t.kpiIconWrap} border flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#C9A961] group-hover:to-[#8B6F2C] group-hover:text-noir-950 group-hover:border-[#B8923A] transition-all`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold border ${trendCls}`}>
                  <TrendIcon className="w-3 h-3" />
                  {stat.trendLabel}
                </span>
              </div>
              <div className="relative">
                <h3 className={`font-display text-3xl md:text-4xl font-semibold ${t.kpiNum} tracking-tight mb-1 leading-none`}>
                  {stat.value}
                </h3>
                <p className={`text-sm font-medium mt-2 ${t.kpiTitle}`}>{stat.title}</p>
                <p className={`text-[0.7rem] mt-0.5 ${t.kpiHint}`}>{stat.hint}</p>
              </div>

              <span
                aria-hidden
                className="absolute left-0 bottom-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-[#C9A961] to-[#D4AF37] transition-all duration-700"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Smooth-line chart */}
      <LeadsChart leads={leads} isLight={isLight} />

      {/* Two-column: Recent leads + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`relative ${t.cabinetCard} border rounded-2xl p-5 md:p-6 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.20)]`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className={`font-display italic text-[0.65rem] font-semibold ${t.sectionLabel} tracking-widest`}>Nº 03</span>
              <span className="w-5 h-px bg-[#C9A961]" />
              <h2 className={`text-base font-display font-semibold tracking-tight ${t.kpiTitle}`}>Recent leads</h2>
            </div>
            <Link
              to="/admin/leads"
              className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${t.leadsLink}`}
            >
              View all <FiArrowRight />
            </Link>
          </div>
          <div className={`divide-y ${t.divider}`}>
            {leads.slice(0, 5).map((lead) => {
              const status = STATUS_PILL[lead.status] || (isLight
                ? 'bg-ivory-200 text-ink-700 border border-[#EBDCB1]'
                : 'bg-noir-800 text-ink-300 border border-[rgba(201,169,97,0.20)]');
              return (
                <div key={lead.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className={`text-[0.92rem] font-display font-semibold truncate ${t.rowName}`}>
                      {lead.fullName}
                    </p>
                    <p className={`text-[0.78rem] truncate ${t.rowSub}`}>{lead.formType || 'enquiry'}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${status}`}>
                    {lead.status}
                  </span>
                </div>
              );
            })}
            {leads.length === 0 && (
              <p className={`text-sm text-center py-6 italic ${t.emptyText}`}>No leads yet — quietly waiting.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${t.cabinetCard} border rounded-2xl p-5 md:p-6 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.20)]`}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className={`font-display italic text-[0.65rem] font-semibold ${t.sectionLabel} tracking-widest`}>Nº 04</span>
            <span className="w-5 h-px bg-[#C9A961]" />
            <h2 className={`text-base font-display font-semibold tracking-tight ${t.kpiTitle}`}>Quick actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className={`group relative p-4 rounded-xl border transition-all ${t.actionTile}`}
              >
                <div className={`w-9 h-9 rounded-lg ${t.actionIconWrap} border flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#C9A961] group-hover:to-[#8B6F2C] group-hover:text-noir-950 group-hover:border-[#B8923A] transition-all mb-3`}>
                  <q.icon className="w-4 h-4" />
                </div>
                <p className={`text-[0.92rem] font-display font-semibold tracking-tight leading-tight ${t.actionTitle}`}>
                  {q.title}
                </p>
                <p className={`text-[0.7rem] mt-0.5 ${t.actionHint}`}>{q.hint}</p>
                <FiArrowRight className="absolute top-4 right-4 text-[#C9A961] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
