import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wrench, Calendar, Bell } from 'lucide-react';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';
import { formatRelativeTime } from '../../utils/formatters';

export const ActivityFeed: React.FC = () => {
  const { complaints, leaves, announcements } = useData();

  // Combine recent items
  const items = [
    ...complaints.slice(0, 2).map((c) => ({
      id: c.id,
      title: `Maintenance: ${c.title}`,
      sub: `${c.id} • Status: ${c.status}`,
      date: c.updatedAt,
      type: 'maintenance',
      icon: Wrench,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      link: '/maintenance',
    })),
    ...leaves.slice(0, 2).map((l) => ({
      id: l.id,
      title: `Leave: ${l.leaveType} (${l.destination})`,
      sub: `${l.id} • Status: ${l.status}`,
      date: l.appliedAt,
      type: 'leave',
      icon: Calendar,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      link: '/leaves',
    })),
    ...announcements.slice(0, 1).map((a) => ({
      id: a.id,
      title: `Notice: ${a.title}`,
      sub: `By ${a.author}`,
      date: a.date,
      type: 'notice',
      icon: Bell,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      link: '/announcements',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Timeline
          </h3>
          <p className="text-xs text-slate-400">Live operational events</p>
        </div>
        <span className="text-xs font-semibold text-slate-400">Real-time</span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.link}
              className="py-3 flex items-start gap-3 group hover:bg-slate-50 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className={`p-2 rounded-xl shrink-0 ${item.color} mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.sub}</p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
                {formatRelativeTime(item.date)}
              </span>
            </NavLink>
          );
        })}
      </div>
    </Card>
  );
};
