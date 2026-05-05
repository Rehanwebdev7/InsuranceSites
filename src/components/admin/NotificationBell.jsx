import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiVolume2, FiVolumeX, FiCheck, FiTrash2, FiUser } from 'react-icons/fi';
import { useNotifications } from '../../contexts/NotificationContext';
import useAdminTheme from '../../hooks/useAdminTheme';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const theme = useAdminTheme();
  const isLight = theme === 'light';

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    soundEnabled,
    setSoundEnabled,
    timeAgo,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    navigate(`/admin/leads/${notification.leadId}`);
  };

  // Dark variant tokens
  const tokens = isLight
    ? {
        triggerBg: 'hover:bg-ivory-200',
        triggerIcon: 'text-[#8B6F2C]',
        panelBg: 'bg-white',
        panelBorder: 'border-[#EBDCB1]',
        headerBg: 'bg-ivory-100',
        headerBorder: 'border-[#EBDCB1]',
        headerText: 'text-noir-900',
        soundActive: 'text-[#8B6F2C] bg-[rgba(201,169,97,0.15)]',
        soundIdle: 'text-ink-500 hover:bg-ivory-200',
        actionBtn: 'text-ink-500 hover:bg-ivory-200',
        actionBtnDanger: 'text-ink-500 hover:bg-red-50 hover:text-red-600',
        rowBorder: 'border-[#EBDCB1]',
        rowHover: 'hover:bg-ivory-100',
        rowUnread: 'bg-[rgba(201,169,97,0.06)]',
        nameText: 'text-noir-900',
        subText: 'text-ink-500',
        timeText: 'text-ink-400',
        unreadDot: 'bg-[#C9A961]',
        emptyText: 'text-ink-400',
        footerBg: 'bg-ivory-100',
        footerBorder: 'border-[#EBDCB1]',
        footerText: 'text-[#8B6F2C] hover:text-noir-900',
      }
    : {
        triggerBg: 'hover:bg-noir-800',
        triggerIcon: 'text-[#E5C770]',
        panelBg: 'bg-noir-900',
        panelBorder: 'border-[rgba(201,169,97,0.30)]',
        headerBg: 'bg-noir-800',
        headerBorder: 'border-[rgba(201,169,97,0.20)]',
        headerText: 'text-white',
        soundActive: 'text-[#E5C770] bg-[rgba(201,169,97,0.15)]',
        soundIdle: 'text-ink-400 hover:bg-noir-700',
        actionBtn: 'text-ink-400 hover:bg-noir-700 hover:text-[#E5C770]',
        actionBtnDanger: 'text-ink-400 hover:bg-red-500/15 hover:text-red-300',
        rowBorder: 'border-[rgba(201,169,97,0.14)]',
        rowHover: 'hover:bg-noir-800',
        rowUnread: 'bg-[rgba(201,169,97,0.08)]',
        nameText: 'text-white',
        subText: 'text-ink-400',
        timeText: 'text-ink-500',
        unreadDot: 'bg-[#D4AF37]',
        emptyText: 'text-ink-500',
        footerBg: 'bg-noir-800',
        footerBorder: 'border-[rgba(201,169,97,0.20)]',
        footerText: 'text-[#E5C770] hover:text-white',
      };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${tokens.triggerBg}`}
        aria-label="Notifications"
      >
        <FiBell className={`w-5 h-5 ${tokens.triggerIcon}`} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
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
            className={`absolute right-0 top-full mt-2 w-80 sm:w-96 ${tokens.panelBg} rounded-2xl shadow-[0_36px_72px_-24px_rgba(0,0,0,0.7)] border ${tokens.panelBorder} z-50 overflow-hidden`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 ${tokens.headerBg} border-b ${tokens.headerBorder}`}>
              <div className="flex items-center gap-2">
                <span className="font-display italic text-[0.6rem] font-semibold text-[#C9A961] tracking-widest">Nº</span>
                <h3 className={`font-display font-semibold text-sm tracking-tight ${tokens.headerText}`}>
                  Notifications {unreadCount > 0 && (
                    <span className="text-[#E5C770] font-semibold">({unreadCount})</span>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-md transition-colors ${
                    soundEnabled ? tokens.soundActive : tokens.soundIdle
                  }`}
                  title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                >
                  {soundEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />}
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={`p-1.5 rounded-md transition-colors ${tokens.actionBtn}`}
                    title="Mark all as read"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className={`p-1.5 rounded-md transition-colors ${tokens.actionBtnDanger}`}
                    title="Clear all"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className={`py-12 text-center ${tokens.emptyText}`}>
                  <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm italic">No notifications yet — quietly waiting.</p>
                </div>
              ) : (
                notifications.slice(0, 50).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 border-b ${tokens.rowBorder} ${tokens.rowHover} transition-colors ${
                      !notification.read ? tokens.rowUnread : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          isLight
                            ? 'bg-ivory-100 border-[#EBDCB1] text-[#8B6F2C]'
                            : 'bg-noir-800 border-[rgba(201,169,97,0.30)] text-[#E5C770]'
                        }`}
                      >
                        <FiUser className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-display font-semibold truncate tracking-tight ${tokens.nameText}`}>
                            {notification.fullName}
                          </p>
                          {!notification.read && (
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${tokens.unreadDot}`} />
                          )}
                        </div>
                        <p className={`text-xs truncate ${tokens.subText}`}>
                          {notification.serviceTitle}
                          {notification.mobile && ` · ${notification.mobile}`}
                        </p>
                        <p className={`text-[0.7rem] mt-0.5 ${tokens.timeText}`}>
                          {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`px-4 py-2.5 ${tokens.footerBg} border-t ${tokens.footerBorder} text-center`}>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin/leads');
                  }}
                  className={`text-xs font-display italic font-semibold tracking-wider ${tokens.footerText} transition-colors`}
                >
                  View all leads →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
