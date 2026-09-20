import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  CheckCircle2,
  GraduationCap,
  UserCheck,
  Briefcase,
  Shield,
  Building,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';

interface WatchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WatchDemoModal: React.FC<WatchDemoModalProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { loginAsRole } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const demoTourSteps = [
    {
      title: '1. Instant Student Requests',
      role: 'Student Portal',
      icon: GraduationCap,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50',
      description:
        'Residents file maintenance tickets, request emergency outstation gate passes, rate dining meals, and access their roommate directories in one centralized mobile-first interface.',
      metric: 'Under 15 Seconds',
      metricLabel: 'Average request submission time',
      highlights: ['Photo attachments', 'Parent emergency contact auto-fill', 'Digital leave QR codes'],
    },
    {
      title: '2. Warden Command & Approvals',
      role: 'Chief Warden',
      icon: UserCheck,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50',
      description:
        'Wardens manage 4 blocks, allocate beds using smart recommendation scores, review student leaves with one-click approval, and dispatch maintenance technicians based on smart severity tags.',
      metric: '100% Real-Time',
      metricLabel: 'Synchronized cross-role state',
      highlights: ['Interactive 4-block bed map', 'Deterministic smart priority', 'Broadcast notice push'],
    },
    {
      title: '3. Rapid Maintenance Dispatch',
      role: 'Facilities Staff',
      icon: Briefcase,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50',
      description:
        'Technicians receive assigned work orders on their mobile dashboard, start work with one tap, log on-site diagnosis notes, and mark tickets resolved with automated student notifications.',
      metric: '95% Faster',
      metricLabel: 'Mean time to issue resolution',
      highlights: ['Step-by-step 4-phase timeline', 'Parts replacement notes', 'Resident feedback loop'],
    },
    {
      title: '4. Security Gate Turnstile Control',
      role: 'Campus Vigilance',
      icon: Shield,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50',
      description:
        'Gate officers scan digital visitor passes, log student departures and biometric turnstile returns, and monitor campus headcount with live entry/exit audit trails.',
      metric: 'Zero Paperwork',
      metricLabel: 'Digital gate pass & guest logs',
      highlights: ['Simulated QR pass scanner', 'Live campus occupancy headcount', 'Time-stamped audit logs'],
    },
    {
      title: '5. Executive Administration & Analytics',
      role: 'Campus Director',
      icon: Building,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50',
      description:
        'Campus executives view interactive Recharts visualizations of block-by-block occupancy, maintenance category breakdown, mess satisfaction trends, and student movement peak hours.',
      metric: 'Multi-Block Analytics',
      metricLabel: 'Recharts visual analytics',
      highlights: ['Occupancy comparison charts', 'Complaint turnaround graphs', 'Mess dining ratings'],
    },
  ];

  const handleLaunchRole = (role: UserRole) => {
    loginAsRole(role);
    onClose();
    if (role === 'student') navigate('/dashboard');
    else if (role === 'warden') navigate('/warden');
    else if (role === 'security') navigate('/security');
    else if (role === 'maintenance') navigate('/maintenance-team');
    else if (role === 'admin') navigate('/admin');
  };

  const currentStep = demoTourSteps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-white dark:bg-[#0e1626] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">HostelHub Operations Tour</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive walkthrough of connected multi-role workflows
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-3">
          {demoTourSteps.map((step, idx) => (
            <button
              key={step.title}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeStep === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{step.role}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Description */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                <StepIcon className="w-4 h-4" />
                <span>{currentStep.role}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentStep.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStep.description}
              </p>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Capabilities</p>
                <div className="grid grid-cols-1 gap-2">
                  {currentStep.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Metric Card */}
            <div className="md:col-span-5">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 border border-indigo-200/80 dark:border-indigo-800/60 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <StepIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                    {currentStep.metric}
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {currentStep.metricLabel}
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => {
                      const roleMap: Record<number, UserRole> = {
                        0: 'student',
                        1: 'warden',
                        2: 'maintenance',
                        3: 'security',
                        4: 'admin',
                      };
                      handleLaunchRole(roleMap[activeStep] || 'student');
                    }}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Launch {currentStep.role} Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Quick Launch Role:</span>
            <button
              onClick={() => handleLaunchRole('student')}
              className="px-2 py-1 rounded-md text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:scale-105 transition-transform"
            >
              Student
            </button>
            <button
              onClick={() => handleLaunchRole('warden')}
              className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform"
            >
              Warden
            </button>
            <button
              onClick={() => handleLaunchRole('security')}
              className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform"
            >
              Security
            </button>
            <button
              onClick={() => handleLaunchRole('maintenance')}
              className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform"
            >
              Maintenance
            </button>
            <button
              onClick={() => handleLaunchRole('admin')}
              className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform"
            >
              Admin
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (activeStep < demoTourSteps.length - 1) {
                  setActiveStep((prev) => prev + 1);
                } else {
                  handleLaunchRole('student');
                }
              }}
            >
              {activeStep === demoTourSteps.length - 1 ? 'Start Experience' : 'Next Step'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
