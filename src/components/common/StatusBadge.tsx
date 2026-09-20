import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertCircle, XCircle } from 'lucide-react';
import { ComplaintStatus, LeaveStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus | LeaveStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (status) {
    case 'Submitted':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 ${sizeClasses}`}
        >
          <Clock className={`${iconSize} text-slate-500`} />
          Submitted
        </span>
      );

    case 'Assigned':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 ${sizeClasses}`}
        >
          <Clock className={`${iconSize} text-blue-500`} />
          Assigned
        </span>
      );

    case 'In Progress':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 ${sizeClasses}`}
        >
          <PlayCircle className={`${iconSize} text-amber-500`} />
          In Progress
        </span>
      );

    case 'Resolved':
    case 'Approved':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 ${sizeClasses}`}
        >
          <CheckCircle2 className={`${iconSize} text-emerald-500`} />
          {status}
        </span>
      );

    case 'Pending':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 ${sizeClasses}`}
        >
          <Clock className={`${iconSize} text-amber-500`} />
          Pending
        </span>
      );

    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 ${sizeClasses}`}
        >
          <XCircle className={`${iconSize} text-rose-500`} />
          Rejected
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ${sizeClasses}`}
        >
          <AlertCircle className={`${iconSize} text-slate-400`} />
          {status}
        </span>
      );
  }
};
