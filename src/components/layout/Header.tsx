import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Check,
  ChevronDown,
  UserCheck,
  Shield,
  KeyRound,
  GraduationCap,
  Briefcase,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { user, switchRole, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead } =
    useData();
  const navigate = useNavigate();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; title: string; icon: any; desc: string }[] = [
    { role: 'student', title: 'Student', icon: GraduationCap, desc: 'Aravind Kumar (Room B-204)' },
    { role: 'warden', title: 'Warden', icon: UserCheck, desc: 'Dr. K. Ramanathan' },
    { role: 'security', title: 'Security', icon: Shield, desc: 'Officer S. Verma' },
    { role: 'maintenance', title: 'Maintenance Staff', icon: Briefcase, desc: 'Rajesh Sharma (Facilities)' },
    { role: 'admin', title: 'Hostel Admin', icon: KeyRound, desc: 'Prof. Meera Sen' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    if (role === 'student') {
      navigate('/dashboard');
    } else if (role === 'warden') {
      navigate('/warden');
    } else if (role === 'security') {
      navigate('/security');
    } else if (role === 'maintenance') {
      navigate('/maintenance-team');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-[#0e1626]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle + quick breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">HostelHub</span>
          <span>/</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {user?.role === 'warden'
              ? 'Warden Command Center'
              : user?.role === 'security'
              ? 'Security Command Post'
              : user?.role === 'maintenance'
              ? 'Maintenance Operations'
              : user?.role === 'admin'
              ? 'Directorate Administration'
              : 'Student Portal'}
          </span>
        </div>
      </div>

      {/* Center/Right utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700/80"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="capitalize font-semibold">{user?.role || 'student'}</span>
            <span className="hidden md:inline text-slate-400 text-[10px]">(Demo Switch)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Demo Persona
              </div>
              <div className="space-y-1">
                {roles.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = user?.role === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => handleRoleSelect(item.role)}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{item.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Notifications
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {unreadNotificationCount} unread update{unreadNotificationCount === 1 ? '' : 's'}
                  </p>
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) {
                          navigate(n.link);
                          setNotifDropdownOpen(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-3 ${
                        !n.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !n.isRead ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {formatRelativeTime(n.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">No notifications yet.</div>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <NavLink
                  to="/notifications"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View all notifications →
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || '/avatars/aravind_kumar.jpg'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Aravind Kumar'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  Preferences & Settings
                </button>
                <NavLink
                  to="/"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Public Landing Page <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </NavLink>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
