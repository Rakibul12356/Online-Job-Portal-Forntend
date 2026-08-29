import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Award,
  Briefcase,
  AlertCircle,
  Info,
  BellOff,
  Calendar,
} from 'lucide-react';
import { apiClient } from '@/api';
import { useAuth } from '@/context';
import { formatTimeAgo } from '@/utils';

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await apiClient.get('/notifications');
      if (response.success && Array.isArray(response.data)) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Poll for notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Click outside detection to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // Mark specific notification as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Helper to render type-specific icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'shortlist':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Award className="h-4.5 w-4.5" />
          </div>
        );
      case 'application':
      case 'apply':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
        );
      case 'interview':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Calendar className="h-4.5 w-4.5" />
          </div>
        );
      case 'reject':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
            <AlertCircle className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-100">
            <Info className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={bellRef} className="relative flex items-center">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-slate-900 transition-colors focus:outline-none"
        aria-label="Toggle notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5.5 w-5.5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden animate-slide-down origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
            <span className="text-sm font-bold text-slate-900">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-100/50">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* List items */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="mb-2 rounded-full bg-slate-55/10 p-3 text-gray-400">
                  <BellOff className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  We will notify you when something important happens.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                  className={`flex gap-3 p-4 transition-colors ${
                    !notif.isRead
                      ? 'bg-blue-50/20 hover:bg-blue-50/40 cursor-pointer'
                      : 'hover:bg-gray-50/50'
                  }`}
                >
                  {getNotificationIcon(notif.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm leading-5 truncate ${
                          !notif.isRead
                            ? 'font-bold text-slate-900'
                            : 'font-medium text-gray-700'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 break-words leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] font-medium text-gray-400 mt-2 block">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
