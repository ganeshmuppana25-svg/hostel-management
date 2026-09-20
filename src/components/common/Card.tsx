import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  isGlass?: boolean;
  hoverEffect?: boolean;
  padded?: boolean;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  isGlass = false,
  hoverEffect = false,
  padded = true,
  title,
  subtitle,
  action,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`rounded-2xl border transition-all duration-200 ${
        isGlass
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white dark:bg-[#131b2b] border-slate-200/90 dark:border-slate-800'
      } ${
        hoverEffect
          ? 'shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700/80'
          : 'shadow-sm'
      } ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
};
