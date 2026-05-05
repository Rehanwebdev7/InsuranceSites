import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthRuntimeContext';
import { useSettings } from '../contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiFileText, FiGrid,
  FiLogOut, FiMenu, FiX, FiImage, FiSettings,
  FiChevronsLeft, FiChevronsRight, FiStar, FiUsers, FiSun, FiMoon,
} from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationBell from '../components/admin/NotificationBell';
import ProfileDropdown from '../components/admin/ProfileDropdown';

const SIDEBAR_KEY = 'bharat_sidebar_collapsed';
const ADMIN_THEME_KEY = 'bharat_admin_theme';

const ALL_NAV_ITEMS = [
  { path: '/admin', icon: FiHome, label: 'Dashboard', permission: 'dashboard' },
  { path: '/admin/leads', icon: FiFileText, label: 'Leads', permission: 'leads' },
  { path: '/admin/services', icon: FiGrid, label: 'Services', permission: 'services' },
  { path: '/admin/slider', icon: FiImage, label: 'Slider', permission: 'slider' },
  { path: '/admin/testimonials', icon: FiStar, label: 'Testimonials', permission: 'testimonials' },
  { path: '/admin/admins', icon: FiUsers, label: 'Admin Management', superAdminOnly: true },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings', permission: 'settings' },
];

const AdminLayout = () => {
  const { logout, hasPermission, isSuperAdmin } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === 'true'; } catch { return false; }
  });
  const [adminTheme, setAdminTheme] = useState(() => {
    try { return localStorage.getItem(ADMIN_THEME_KEY) || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed); } catch {}
  }, [collapsed]);

  useEffect(() => {
    try { localStorage.setItem(ADMIN_THEME_KEY, adminTheme); } catch {}
  }, [adminTheme]);

  const toggleAdminTheme = () => {
    const next = adminTheme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(ADMIN_THEME_KEY, next); } catch {}
    try { window.dispatchEvent(new CustomEvent('admin-theme-change', { detail: next })); } catch {}
    setAdminTheme(next);
  };
  const isLight = adminTheme === 'light';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = useMemo(() => {
    return ALL_NAV_ITEMS.filter((item) => {
      if (item.superAdminOnly) return isSuperAdmin;
      if (isSuperAdmin) return true;
      if (item.permission === 'dashboard') return true;
      return hasPermission(item.permission);
    });
  }, [isSuperAdmin, hasPermission]);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const logoSrc = settings?.brandLogo;
  const faviconSrc = settings?.brandFavicon;
  const brandName = settings?.brandName || 'XYZ Insurance';
  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-64';
  const mainMargin = collapsed ? 'lg:ml-[72px]' : 'lg:ml-64';

  return (
    <div data-admin-theme={adminTheme} className={`admin-shell min-h-screen ${isLight ? 'bg-ivory-50' : 'bg-noir-950'}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden ${isLight ? 'bg-ivory-100 border-b border-[#EBDCB1]' : 'bg-noir-900 border-b border-[rgba(201,169,97,0.22)]'} h-16 px-4 flex items-center justify-between sticky top-0 z-30`}>
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg ${isLight ? 'text-[#8B6F2C] hover:bg-ivory-200' : 'text-[#E5C770] hover:bg-noir-800'} transition-colors`}
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          {logoSrc ? (
            <img src={logoSrc} alt={brandName} className="h-8 w-auto" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] border border-[#E5C770] flex items-center justify-center">
                <span className="text-noir-950 text-sm font-bold font-display italic">
                  {brandName.charAt(0)}
                </span>
              </div>
              <span className={`text-base font-display font-semibold tracking-tight ${isLight ? 'text-noir-950' : 'text-white'}`}>{brandName}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAdminTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className={`p-2 rounded-lg transition-colors ${isLight ? 'text-[#8B6F2C] hover:bg-ivory-200' : 'text-[#E5C770] hover:bg-noir-800'}`}
          >
            {isLight ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
          </button>
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className={`lg:hidden fixed inset-0 ${isLight ? 'bg-noir-950/35' : 'bg-noir-950/65'} backdrop-blur-sm z-40`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full ${sidebarWidth} ${isLight ? 'bg-ivory-100 border-r border-[#EBDCB1]' : 'bg-noir-900 border-r border-[rgba(201,169,97,0.22)]'} shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo — height locked to h-16 to match topbar */}
        <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'justify-center px-4'} ${isLight ? 'border-b border-[#EBDCB1]' : 'border-b border-[rgba(201,169,97,0.22)]'} h-16 relative`}>
          <Link to="/admin" className="flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {collapsed ? (
                faviconSrc ? (
                  <motion.img
                    key="favicon"
                    src={faviconSrc}
                    alt={brandName}
                    className="h-8 w-8 object-contain flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <motion.span
                    key="favicon-text"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] border border-[#E5C770] text-noir-950 text-sm font-bold font-display italic shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)]"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {brandName.charAt(0)}
                  </motion.span>
                )
              ) : (
                logoSrc ? (
                  <motion.img
                    key="logo"
                    src={logoSrc}
                    alt={brandName}
                    className="h-10 w-auto"
                    initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <motion.div
                    key="logo-text"
                    className="flex items-center gap-2.5"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] border border-[#E5C770] flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)]">
                      <span className="text-noir-950 text-sm font-bold font-display italic">
                        {brandName.charAt(0)}
                      </span>
                    </div>
                    <span className={`text-base font-display font-semibold tracking-tight ${isLight ? 'text-noir-950' : 'text-white'}`}>
                      {brandName}
                    </span>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </Link>
          {/* Close - mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${isLight ? 'text-[#8B6F2C] hover:bg-ivory-200' : 'text-[#E5C770] hover:bg-noir-800'}`}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <span className="font-display italic text-[0.6rem] font-semibold text-[#C9A961] tracking-widest">Nº 01</span>
            <span className="w-5 h-px bg-[#C9A961]" />
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] ${isLight ? 'text-[#8B6F2C]' : 'text-ink-400'}`}>Workspace</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.label : ''}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  active
                    ? isLight
                      ? 'bg-ivory-200 text-[#8B6F2C] border border-[#C9A961] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.30)]'
                      : 'bg-noir-800 text-[#E5C770] border border-[rgba(201,169,97,0.40)] shadow-[0_8px_16px_-8px_rgba(201,169,97,0.30)]'
                    : isLight
                      ? 'text-noir-700 border border-transparent hover:bg-ivory-200 hover:text-[#8B6F2C]'
                      : 'text-ink-300 border border-transparent hover:bg-noir-800 hover:text-[#E5C770]'
                }`}
              >
                {/* Gold left stripe for active */}
                {active && !collapsed && (
                  <motion.span
                    layoutId="activeNavStripe"
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-[#E5C770] to-[#C9A961]"
                  />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                {active && !collapsed && (
                  <motion.div
                    layoutId="activeNavDot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`absolute bottom-0 left-0 right-0 p-2 ${isLight ? 'bg-ivory-100 border-t border-[#EBDCB1]' : 'bg-noir-900 border-t border-[rgba(201,169,97,0.22)]'}`}>
          <button
            onClick={logout}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg transition-all font-medium text-sm ${collapsed ? 'px-2' : ''} ${
              isLight
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300'
                : 'bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/15 hover:text-red-200 hover:border-red-500/50'
            }`}
            title={collapsed ? 'Logout' : ''}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${mainMargin} transition-all duration-300`}>
        {/* Desktop Top Bar — sticky */}
        <div className={`hidden lg:flex sticky top-0 z-30 items-center justify-between px-8 h-16 ${isLight ? 'bg-ivory-100 border-b border-[#EBDCB1]' : 'bg-noir-900 border-b border-[rgba(201,169,97,0.22)]'} backdrop-blur-md`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg transition-colors ${isLight ? 'text-[#8B6F2C] hover:bg-ivory-200 hover:text-noir-950' : 'text-[#E5C770] hover:bg-noir-800 hover:text-white'}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FiChevronsRight className="w-5 h-5" /> : <FiChevronsLeft className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAdminTheme}
              aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-ivory-200 text-[#8B6F2C] border-[#C9A961] hover:bg-ivory-300'
                  : 'bg-noir-800 text-[#E5C770] border-[rgba(201,169,97,0.40)] hover:bg-noir-700'
              }`}
            >
              {isLight ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
              {isLight ? 'Dark' : 'Light'}
            </button>
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </div>
        <div className={`admin-content p-6 lg:p-8 min-h-[calc(100vh-64px)] ${isLight ? 'bg-ivory-50' : 'bg-noir-950'}`}>
          <Outlet />
        </div>
      </div>

      <ToastContainer
        theme={isLight ? 'light' : 'dark'}
        toastClassName={isLight
          ? '!bg-ivory-100 !text-noir-900 !border !border-[#EBDCB1]'
          : '!bg-noir-900 !text-white !border !border-[rgba(201,169,97,0.30)]'}
      />
    </div>
  );
};

export default AdminLayout;
