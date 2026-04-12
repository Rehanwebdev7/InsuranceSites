import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiShield, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthRuntimeContext';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isSuperAdmin, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer"
        title={user?.name || 'Profile'}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
        ) : (
          (user?.name || '?').charAt(0).toUpperCase()
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Profile Header */}
            <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 text-white font-bold text-base shrink-0 shadow-md">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    (user?.name || '?').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Admin'}</div>
                  {isSuperAdmin ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 mt-0.5">
                      <FiShield className="w-2.5 h-2.5" /> Super Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 mt-0.5">
                      <FiUser className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="px-4 py-3 space-y-2.5">
              {user?.email && (
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <FiMail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user?.mobile && (
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <FiPhone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>+91 {user.mobile}</span>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="px-3 py-2.5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => { setIsOpen(false); logout(); }}
                className="flex items-center gap-2 w-full px-2 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
