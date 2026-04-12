import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthRuntimeContext';
import { useSettings } from '../contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiFileText, FiGrid,
  FiLogOut, FiMenu, FiX, FiImage, FiSettings,
  FiChevronsLeft, FiChevronsRight, FiStar, FiUsers,
} from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationBell from '../components/admin/NotificationBell';
import ProfileDropdown from '../components/admin/ProfileDropdown';

const SIDEBAR_KEY = 'bharat_sidebar_collapsed';

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

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed); } catch {}
  }, [collapsed]);

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
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FiMenu className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center">
          {logoSrc ? (
            <img src={logoSrc} alt={brandName} className="h-8 w-auto" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{brandName}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full ${sidebarWidth} bg-white shadow-lg transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center p-3' : 'justify-center p-4'} border-b border-gray-200 min-h-[65px] relative`}>
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
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white text-sm font-extrabold"
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
                  <motion.span
                    key="logo-text"
                    className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {brandName}
                  </motion.span>
                )
              )}
            </AnimatePresence>
          </Link>
          {/* Close - mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  collapsed ? 'justify-center' : ''
                } ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                {active && !collapsed && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-2 h-2 rounded-full bg-blue-600"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200">
          <button
            onClick={logout}
            className={`flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm ${collapsed ? 'px-2' : ''}`}
            title={collapsed ? 'Logout' : ''}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${mainMargin} transition-all duration-300`}>
        {/* Desktop Top Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FiChevronsRight className="w-5 h-5" /> : <FiChevronsLeft className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
