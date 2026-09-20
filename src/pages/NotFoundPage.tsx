import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 text-center">
      <div className="mb-6">
        <Logo size="lg" />
      </div>

      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-xl border border-indigo-100 dark:border-indigo-900/50">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        The hostel room, circular, or page URL you requested does not exist or has been moved to another corridor.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <NavLink to="/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </NavLink>
        <NavLink to="/">
          <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Public Landing Page
          </Button>
        </NavLink>
      </div>
    </div>
  );
};
