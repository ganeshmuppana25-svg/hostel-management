import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BedDouble,
  Wrench,
  CalendarDays,
  UtensilsCrossed,
  Megaphone,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  MoreHorizontal,
  UserCheck,
  Shield,
  Briefcase,
  Building,
  Building2,
  Users,
  CalendarCheck,
  QrCode,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface MobileNavProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isDrawerOpen,
  onCloseDrawer,
  onOpenDrawer,
}) => {
  const { user, logout } = useAuth();
  const { unreadNotificationCount, complaints, leaves, visitors } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const openComplaintsCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'In Progress' || c.status === 'Assigned'
  ).length;

  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;
  const assignedTasksCount = complaints.filter((c) => c.status === 'Assigned' || c.status === 'Submitted').length;
  const inProgressTasksCount = complaints.filter((c) => c.status === 'In Progress').length;
  const activeVisitorsCount = visitors.filter((v) => v.status === 'Approved' || v.status === 'Inside').length;

  // Role-specific bottom sticky items (4 high-frequency items)
  let bottomItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Room', path: '/room', icon: BedDouble },
    {
      name: 'Issues',
      path: '/maintenance',
      icon: Wrench,
      badge: openComplaintsCount > 0 ? openComplaintsCount : null,
    },
    { name: 'Mess', path: '/mess', icon: UtensilsCrossed },
  ];

  // Role-specific full drawer items
  let drawerItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Room', path: '/room', icon: BedDouble },
    {
      name: 'Maintenance',
      path: '/maintenance',
      icon: Wrench,
      badge: openComplaintsCount > 0 ? openComplaintsCount : null,
    },
    { name: 'Leave Requests', path: '/leaves', icon: CalendarDays },
    { name: 'Mess', path: '/mess', icon: UtensilsCrossed },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
    },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user?.role === 'warden') {
    bottomItems = [
      { name: 'Command', path: '/warden', icon: UserCheck },
      { name: 'Rooms', path: '/warden?tab=rooms', icon: BedDouble },
      {
        name: 'Leaves',
        path: '/warden?tab=leaves',
        icon: CalendarCheck,
        badge: pendingLeavesCount > 0 ? pendingLeavesCount : null,
      },
      {
        name: 'Issues',
        path: '/warden?tab=complaints',
        icon: Wrench,
        badge: openComplaintsCount > 0 ? openComplaintsCount : null,
      },
    ];

    drawerItems = [
      { name: 'Command Center', path: '/warden', icon: UserCheck },
      { name: 'Rooms & Beds', path: '/warden?tab=rooms', icon: BedDouble },
      { name: 'Residents', path: '/warden?tab=students', icon: Users },
      {
        name: 'Leave Approvals',
        path: '/warden?tab=leaves',
        icon: CalendarCheck,
        badge: pendingLeavesCount > 0 ? pendingLeavesCount : null,
      },
      {
        name: 'Complaints',
        path: '/warden?tab=complaints',
        icon: Wrench,
        badge: openComplaintsCount > 0 ? openComplaintsCount : null,
      },
      {
        name: 'Visitors',
        path: '/warden?tab=overview#visitors',
        icon: QrCode,
        badge: activeVisitorsCount > 0 ? activeVisitorsCount : null,
      },
      { name: 'Announcements', path: '/announcements', icon: Megaphone },
      { name: 'Reports', path: '/warden?tab=overview#reports', icon: FileText },
      {
        name: 'Notifications',
        path: '/notifications',
        icon: Bell,
        badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
      },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (user?.role === 'security') {
    bottomItems = [
      { name: 'Security', path: '/security', icon: Shield },
      {
        name: 'Passes',
        path: '/security?tab=visitors',
        icon: QrCode,
        badge: activeVisitorsCount > 0 ? activeVisitorsCount : null,
      },
      { name: 'Movement', path: '/security?tab=students', icon: Users },
      { name: 'Gate Log', path: '/security?tab=timeline', icon: Clock },
    ];

    drawerItems = [
      { name: 'Security Command Center', path: '/security', icon: Shield },
      {
        name: 'Visitor Passes',
        path: '/security?tab=visitors',
        icon: QrCode,
        badge: activeVisitorsCount > 0 ? activeVisitorsCount : null,
      },
      { name: 'Student Movement', path: '/security?tab=students', icon: Users },
      { name: 'Gate Log', path: '/security?tab=timeline', icon: Clock },
      {
        name: 'Notifications',
        path: '/notifications',
        icon: Bell,
        badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
      },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (user?.role === 'maintenance') {
    bottomItems = [
      { name: 'Work Orders', path: '/maintenance-team', icon: Wrench },
      {
        name: 'Assigned',
        path: '/maintenance-team?filter=Assigned',
        icon: Briefcase,
        badge: assignedTasksCount > 0 ? assignedTasksCount : null,
      },
      {
        name: 'In Progress',
        path: '/maintenance-team?filter=In Progress',
        icon: Clock,
        badge: inProgressTasksCount > 0 ? inProgressTasksCount : null,
      },
      { name: 'Completed', path: '/maintenance-team?filter=Resolved', icon: CheckCircle2 },
    ];

    drawerItems = [
      { name: 'Maintenance Dashboard', path: '/maintenance-team', icon: Wrench },
      {
        name: 'Assigned Tasks',
        path: '/maintenance-team?filter=Assigned',
        icon: Briefcase,
        badge: assignedTasksCount > 0 ? assignedTasksCount : null,
      },
      {
        name: 'In Progress',
        path: '/maintenance-team?filter=In Progress',
        icon: Clock,
        badge: inProgressTasksCount > 0 ? inProgressTasksCount : null,
      },
      { name: 'Completed', path: '/maintenance-team?filter=Resolved', icon: CheckCircle2 },
      {
        name: 'Notifications',
        path: '/notifications',
        icon: Bell,
        badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
      },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (user?.role === 'admin') {
    bottomItems = [
      { name: 'Admin', path: '/admin', icon: Building },
      { name: 'Analytics', path: '/admin#analytics', icon: TrendingUp },
      { name: 'Dining', path: '/mess', icon: UtensilsCrossed },
      { name: 'Notices', path: '/announcements', icon: Megaphone },
    ];

    drawerItems = [
      { name: 'Administration', path: '/admin', icon: Building },
      { name: 'Analytics', path: '/admin#analytics', icon: TrendingUp },
      { name: 'Hostel Overview', path: '/admin#overview', icon: Building2 },
      { name: 'Users', path: '/admin#users', icon: Users },
      { name: 'Reports', path: '/admin#reports', icon: FileText },
      { name: 'System Activity', path: '/admin#activity', icon: Clock },
      {
        name: 'Notifications',
        path: '/notifications',
        icon: Bell,
        badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
      },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  }

  const isItemActive = (itemPath: string) => {
    const currentFull = location.pathname + location.search + location.hash;
    if (itemPath.includes('?') || itemPath.includes('#')) {
      return currentFull === itemPath || (itemPath.includes('?') && (location.pathname + location.search) === itemPath);
    }
    return location.pathname === itemPath && !location.search;
  };

  const handleLogout = () => {
    onCloseDrawer();
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Bottom Sticky Navigation Bar for Phone Screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0e1626]/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'scale-110 text-indigo-600 dark:text-indigo-400' : ''} transition-transform`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.name}</span>
            </NavLink>
          );
        })}

        {/* More button to toggle drawer */}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </div>
          <span className="text-[10px] mt-1">More</span>
        </button>
      </nav>

      {/* Slide-out Full Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseDrawer}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Drawer Sheet */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-4/5 max-w-xs bg-white dark:bg-[#0e1626] h-full shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Logo size="sm" />
                <button
                  onClick={onCloseDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Menu Links */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {drawerItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path);
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={onCloseDrawer}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{item.name}</span>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user?.avatar || '/avatars/aravind_kumar.jpg'}
                    alt={user?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Student'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user?.roomNumber ? `Room ${user.roomNumber}` : user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
