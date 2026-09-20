import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

interface StatCardProps {
  label: string;
  value: number | string;
  subValue?: string;
  numericValue?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  numericValue,
  decimals = 0,
  suffix = '',
  prefix = '',
  icon,
  iconBgColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  trend,
  onClick,
  className = '',
}) => {
  const animatedNumber = useCountUp(numericValue ?? 0, 1200, decimals);
  const displayValue = numericValue !== undefined ? animatedNumber : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { y: -3, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-[#131b2b] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBgColor}`}>{icon}</div>
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {prefix}
          {displayValue}
          {suffix}
        </h3>
        {subValue && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {subValue}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              trend.isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {trend.text}
          </span>
        </div>
      )}
    </motion.div>
  );
};
