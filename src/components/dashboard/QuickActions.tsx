import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, CalendarPlus, Users, Utensils, Megaphone, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionsProps {
  onOpenMaintenanceModal: () => void;
  onOpenLeaveModal: () => void;
  onOpenVisitorModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenMaintenanceModal,
  onOpenLeaveModal,
  onOpenVisitorModal,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Report Maintenance',
      subtitle: 'Log room or facility issue',
      icon: Wrench,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
      textColor: 'text-amber-600 dark:text-amber-400',
      onClick: onOpenMaintenanceModal,
    },
    {
      title: 'Apply Leave',
      subtitle: 'Outstation gate pass',
      icon: CalendarPlus,
      gradient: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      onClick: onOpenLeaveModal,
    },
    {
      title: 'Request Visitor',
      subtitle: 'Gate entry pass for parents',
      icon: Users,
      gradient: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-500/10 dark:bg-purple-500/15',
      textColor: 'text-purple-600 dark:text-purple-400',
      onClick: onOpenVisitorModal,
    },
    {
      title: 'View Mess Menu',
      subtitle: "Check today's specials",
      icon: Utensils,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      onClick: () => navigate('/mess'),
    },
    {
      title: 'Announcements',
      subtitle: 'Notice board updates',
      icon: Megaphone,
      gradient: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/15',
      textColor: 'text-rose-600 dark:text-rose-400',
      onClick: () => navigate('/announcements'),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Actions
        </h2>
        <span className="text-xs text-slate-400">1-Click Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <motion.div
              key={act.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              onClick={act.onClick}
              className="group p-4 rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${act.bgColor} ${act.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                  {act.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
