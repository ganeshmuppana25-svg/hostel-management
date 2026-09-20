import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
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

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
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

  let navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Room', path: '/room', icon: BedDouble },
    {
      name: 'Maintenance',
      path: '/maintenance',
      icon: Wrench,
      badge: openComplaintsCount > 0 ? openComplaintsCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    },
    { name: 'Leave Requests', path: '/leaves', icon: CalendarDays },
    { name: 'Mess', path: '/mess', icon: UtensilsCrossed },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user?.role === 'warden') {
    navItems = [
      { name: 'Command Center', path: '/warden', icon: UserCheck },
      { name: 'Rooms & Beds', path: '/warden?tab=rooms', icon: BedDouble },
      { name: 'Residents', path: '/warden?tab=students', icon: Users },
      {
        name: 'Leave Approvals',
        path: '/warden?tab=leaves',
        icon: CalendarCheck,
        badge: pendingLeavesCount > 0 ? pendingLeavesCount : null,
        badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
      },
      {
        name: 'Complaints',
        path: '/warden?tab=complaints',
        icon: Wrench,
        badge: openComplaintsCount > 0 ? openComplaintsCount : null,
        badgeColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-400',
      },
      {
        name: 'Visitors',
        path: '/warden?tab=overview#visitors',
        icon: QrCode,
        badge: activeVisitorsCount > 0 ? activeVisitorsCount : null,
        badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      },
      { name: 'Announcements', path: '/announcements', icon: Megaphone },
      { name: 'Reports', path: '/warden?tab=overview#reports', icon: FileText },
      {
        name: 'Notifications',
        path: '/notifications',
        icon: Bell,
        badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
        badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (user?.role === 'security') {
    navItems = [
      { name: 'Security Command Center', path: '/security', icon: Shield },
      {
        name: 'Visitor Passes',
        path: '/security?tab=visitors',
        icon: QrCode,
        badge: activeVisitorsCount > 0 ? activeVisitorsCount : null,
        badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      },
      { name: 'Student Movement', path: '/security?tab=students', icon: Users },
      { name: 'Gate Log', path: '/security?tab=timeline', icon: Clock },
      {
        name: 'Notifications',
        path: '/notifications',
        icon: Bell,
        badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
        badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (user?.role === 'maintenance') {
    navItems = [
      { name: 'Maintenance Dashboard', path: '/maintenance-team', icon: Wrench },
      {
        name: 'Assigned Tasks',
        path: '/maintenance-team?filter=Assigned',
        icon: Briefcase,
        badge: assignedTasksCount > 0 ? assignedTasksCount : null,
        badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
      },
      {
        name: 'In Progress',
        path: '/maintenance-team?filter=In Progress',
        icon: Clock,
        badge: inProgressTasksCount > 0 ? inProgressTasksCount : null,
        badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      },
      { name: 'Completed', path: '/maintenance-team?filter=Resolved', icon: CheckCircle2 },
      {
        name: 'Notifications',
        path: '/notifications',
        icon: Bell,
        badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
        badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (user?.role === 'admin') {
    navItems = [
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
        badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
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
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0e1626] transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      } shrink-0 min-h-screen sticky top-0`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {!collapsed ? (
          <>
            <NavLink to={user?.role === 'warden' ? '/warden' : user?.role === 'security' ? '/security' : user?.role === 'maintenance' ? '/maintenance-team' : user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center">
              <Logo size="md" />
            </NavLink>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="mx-auto flex items-center">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative ${
                active
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-200 ${
                  active ? 'text-indigo-600 dark:text-indigo-400' : ''
                }`}
              />
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}

              {!collapsed && item.badge !== null && item.badge !== undefined && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge !== null && item.badge !== undefined && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Role Connectivity Card (when not collapsed) */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>HostelHub Connected</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Role: <strong className="capitalize text-slate-700 dark:text-slate-200">{user?.role || 'Student'}</strong> (Active Session)
          </p>
        </div>
      )}

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            title="View Profile"
          >
            <img
              src={user?.avatar || '/avatars/aravind_kumar.jpg'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {user?.name || 'Student Resident'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.roomNumber ? `Room ${user.roomNumber}` : user?.email}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
