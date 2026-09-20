import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Wrench,
  Calendar,
  Utensils,
  Megaphone,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useData } from '../context/DataContext';
import { formatRelativeTime } from '../utils/formatters';
import { NotificationType } from '../types';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    clearAllNotifications,
  } = useData();

  const [filter, setFilter] = useState<'all' | 'unread' | 'maintenance' | 'leave' | 'mess'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'maintenance') return n.type === 'maintenance';
    if (filter === 'leave') return n.type === 'leave';
    if (filter === 'mess') return n.type === 'mess';
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'leave':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'mess':
        return <Utensils className="w-4 h-4 text-emerald-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case 'maintenance':
        return 'bg-amber-500/10';
      case 'leave':
        return 'bg-indigo-500/10';
      case 'mess':
        return 'bg-emerald-500/10';
      case 'announcement':
        return 'bg-rose-500/10';
      default:
        return 'bg-purple-500/10';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Notification Center"
        subtitle={`Stay updated with real-time room, leave, maintenance and mess alerts (${unreadNotificationCount} unread)`}
        action={
          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllNotificationsRead}
                leftIcon={<CheckCheck className="w-4 h-4" />}
              >
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Clear All
              </Button>
            )}
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'unread'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Unread ({unreadNotificationCount})
        </button>
        <button
          onClick={() => setFilter('maintenance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'maintenance'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Maintenance
        </button>
        <button
          onClick={() => setFilter('leave')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'leave'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Leave Passes
        </button>
        <button
          onClick={() => setFilter('mess')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'mess'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Mess Updates
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length > 0 ? (
        <Card padded={false} className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-start gap-4 transition-colors ${
                !item.isRead
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
              }`}
            >
              {/* Type icon */}
              <div className={`p-2.5 rounded-xl shrink-0 ${getBgColor(item.type)} mt-0.5`}>
                {getIcon(item.type)}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  )}
                  <span className="text-[11px] text-slate-400 ml-auto">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.message}
                </p>

                {item.link && (
                  <button
                    onClick={() => {
                      markNotificationRead(item.id);
                      navigate(item.link!);
                    }}
                    className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    View Related Page <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => markNotificationRead(item.id)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => clearNotification(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Remove notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState
          icon={<Bell className="w-7 h-7" />}
          title="You're all caught up 🎉"
          description="No unread hostel alerts or pending status notifications right now."
        />
      )}
    </div>
  );
};
