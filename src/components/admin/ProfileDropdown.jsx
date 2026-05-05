import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiShield, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthRuntimeContext';
import useAdminTheme from '../../hooks/useAdminTheme';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isSuperAdmin, logout } = useAuth();
  const theme = useAdminTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tokens = isLight
    ? {
        avatarBtn: 'border border-[#C9A961]',
        panelBg: 'bg-white',
        panelBorder: 'border-[#EBDCB1]',
        headerBg: 'bg-gradient-to-br from-ivory-100 to-ivory-200',
        headerBorder: 'border-[#EBDCB1]',
        nameText: 'text-noir-950',
        subBadgeSuper: 'bg-[rgba(201,169,97,0.20)] text-[#8B6F2C] border border-[#C9A961]',
        subBadgeAdmin: 'bg-ivory-200 text-ink-700 border border-[#EBDCB1]',
        infoText: 'text-ink-700',
        infoIcon: 'text-[#8B6F2C]',
        logoutBg: 'bg-ivory-100',
        logoutBorder: 'border-[#EBDCB1]',
        logoutText: 'text-red-600 hover:bg-red-50',
      }
    : {
        avatarBtn: 'border border-[#E5C770]',
        panelBg: 'bg-noir-900',
        panelBorder: 'border-[rgba(201,169,97,0.30)]',
        headerBg: 'bg-gradient-to-br from-noir-800 to-noir-900',
        headerBorder: 'border-[rgba(201,169,97,0.22)]',
        nameText: 'text-white',
        subBadgeSuper: 'bg-[rgba(201,169,97,0.15)] text-[#E5C770] border border-[rgba(201,169,97,0.40)]',
        subBadgeAdmin: 'bg-noir-800 text-ink-300 border border-[rgba(201,169,97,0.25)]',
        infoText: 'text-ink-300',
        infoIcon: 'text-[#C9A961]',
        logoutBg: 'bg-noir-800',
        logoutBorder: 'border-[rgba(201,169,97,0.22)]',
        logoutText: 'text-red-300 hover:bg-red-500/15 hover:text-red-200',
      };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button — gold-rim circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] text-noir-950 font-display italic font-bold text-sm shadow-[0_8px_16px_-8px_rgba(201,169,97,0.55)] hover:shadow-[0_16px_32px_-12px_rgba(201,169,97,0.65)] transition-all cursor-pointer ${tokens.avatarBtn}`}
        title={user?.name || 'Profile'}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user?.name}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
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
            transition={{ duration: 0.18 }}
            className={`absolute right-0 top-full mt-2 w-72 ${tokens.panelBg} rounded-2xl shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] border ${tokens.panelBorder} z-50 overflow-hidden`}
          >
            {/* Header — profile lockup */}
            <div className={`relative px-4 py-4 ${tokens.headerBg} border-b ${tokens.headerBorder} overflow-hidden`}>
              {/* Soft gold halo */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at top right, rgba(201,169,97,0.12) 0%, transparent 60%)',
                }}
              />
              {/* Gold corner accents (top-left) */}
              <div aria-hidden className="absolute top-2 left-2 w-7 h-7 pointer-events-none">
                <div className="absolute top-0 left-0 w-[2px] h-5 bg-[#C9A961]" />
                <div className="absolute top-0 left-0 h-[2px] w-5 bg-[#C9A961]" />
              </div>

              <div className="relative flex items-center gap-3 ml-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#C9A961] to-[#8B6F2C] border border-[#E5C770] text-noir-950 font-display italic font-bold text-lg shrink-0 shadow-[0_12px_24px_-8px_rgba(201,169,97,0.55)]">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name}
                      className="w-full h-full object-cover rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    (user?.name || '?').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-display font-semibold tracking-tight truncate ${tokens.nameText}`}>
                    {user?.name || 'Admin'}
                  </div>
                  {isSuperAdmin ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold mt-1 ${tokens.subBadgeSuper}`}>
                      <FiShield className="w-2.5 h-2.5" /> Super admin
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold mt-1 ${tokens.subBadgeAdmin}`}>
                      <FiUser className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="px-4 py-3 space-y-2.5">
              {user?.email && (
                <div className={`flex items-center gap-2.5 text-sm ${tokens.infoText}`}>
                  <FiMail className={`w-4 h-4 shrink-0 ${tokens.infoIcon}`} />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user?.mobile && (
                <div className={`flex items-center gap-2.5 text-sm ${tokens.infoText}`}>
                  <FiPhone className={`w-4 h-4 shrink-0 ${tokens.infoIcon}`} />
                  <span>+91 {user.mobile}</span>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className={`px-3 py-2.5 border-t ${tokens.logoutBorder} ${tokens.logoutBg}`}>
              <button
                onClick={() => { setIsOpen(false); logout(); }}
                className={`flex items-center gap-2 w-full px-2 py-2 text-sm font-medium rounded-lg transition-colors ${tokens.logoutText}`}
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
