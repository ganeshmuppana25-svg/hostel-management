import React from 'react';
import { Building2 } from 'lucide-react';

interface LogoProps {
  variant?: 'full' | 'icon-only' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isLightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  isLightText = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const innerIconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Visual Logo Emblem */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/25 flex items-center justify-center shrink-0`}
      >
        <div className="w-full h-full bg-slate-900/15 backdrop-blur-sm rounded-[10px] flex items-center justify-center">
          <Building2 className={`${innerIconSizes[size]} text-white drop-shadow-sm`} />
        </div>
      </div>

      {/* Wordmark and Subtitle */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-bold ${textSizes[size]} ${
                isLightText ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
            >
              Hostel<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </span>
          </div>
          {variant === 'full' && (
            <span
              className={`${subtitleSizes[size]} tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400`}
            >
              Smart Hostel System
            </span>
          )}
        </div>
      )}
    </div>
  );
};
