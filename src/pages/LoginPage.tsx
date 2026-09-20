import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { getRoleHome } from '../components/common/RoleProtectedRoute';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, loginAsRole } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRoleHome(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [email, setEmail] = useState('student@hostelhub.demo');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const demoAccounts = [
    {
      role: 'student' as UserRole,
      title: 'Student Account',
      name: 'Aravind Kumar',
      email: 'student@hostelhub.demo',
      pass: 'student123',
      badge: 'Primary Role (Interactive)',
      color: 'border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300',
    },
    {
      role: 'warden' as UserRole,
      title: 'Warden Account',
      name: 'Dr. K. Ramanathan',
      email: 'warden@hostelhub.demo',
      pass: 'warden123',
      badge: 'Command Center',
      color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300',
    },
    {
      role: 'security' as UserRole,
      title: 'Security Account',
      name: 'Officer S. Verma',
      email: 'security@hostelhub.demo',
      pass: 'security123',
      badge: 'Security Post',
      color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300',
    },
    {
      role: 'maintenance' as UserRole,
      title: 'Maintenance Staff',
      name: 'Rajesh Sharma',
      email: 'maintenance@hostelhub.demo',
      pass: 'maint123',
      badge: 'Facilities Dispatch',
      color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300',
    },
    {
      role: 'admin' as UserRole,
      title: 'Admin Account',
      name: 'Prof. Meera Sen',
      email: 'admin@hostelhub.demo',
      pass: 'admin123',
      badge: 'Executive Suite',
      color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300',
    },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email or Student ID.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    const res = await login(email, password, rememberMe);
    setIsLoading(false);

    if (res.success && res.role) {
      showToast('Logged in successfully. Welcome back!', 'success', 'Session Authenticated');
      navigate(getRoleHome(res.role));
    } else {
      setError(res.message || 'Invalid credentials.');
    }
  };

  const handleQuickDemoFill = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  const handleInstantDemoLogin = (role: UserRole) => {
    loginAsRole(role, rememberMe);
    showToast(`Logged in as ${role.toUpperCase()} (Demo Persona).`, 'success');
    navigate(getRoleHome(role));
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      showToast(
        `A password recovery link has been simulated for ${forgotEmail || email}.`,
        'info',
        'Password Reset'
      );
      setForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0b0f17] transition-colors duration-200">
      {/* Top logo & back to landing */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center text-center">
        <NavLink
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
          className="inline-block mb-6 hover:opacity-90 transition-opacity"
        >
          <Logo size="lg" />
        </NavLink>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back to HostelHub
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sign in to access room management, mess services, leaves & complaints
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-[#131b2b] py-8 px-5 sm:px-10 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <Input
              label="Email or Student ID"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@hostelhub.demo or STU2026-0142"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Demo Login Option & Role Selector */}
          <div className="relative pt-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#131b2b] px-3 text-slate-400 font-semibold tracking-wider">
                1-Click Demo Accounts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {demoAccounts.map((acc) => (
              <div
                key={acc.role}
                className={`p-3 rounded-xl border ${acc.color} transition-all duration-150 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{acc.title}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/70 dark:bg-black/30">
                      {acc.role}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5 font-medium">{acc.name}</p>
                  <p className="text-[10px] opacity-60 font-mono mt-0.5">{acc.email}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill(acc)}
                    className="text-[11px] font-semibold hover:underline"
                  >
                    Fill Form
                  </button>
                  <Button
                    type="button"
                    variant={acc.role === 'student' ? 'primary' : 'outline'}
                    size="sm"
                    className="text-xs py-1 px-2.5 h-7"
                    onClick={() => handleInstantDemoLogin(acc.role)}
                  >
                    Login Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to public landing */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Want to explore feature overview first?{' '}
          <NavLink
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Return to Public Landing Page
          </NavLink>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        subtitle="We will generate a simulated verification link to reset your credentials"
        maxWidth="sm"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <Input
            label="Official Student or Staff Email"
            type="email"
            placeholder="e.g. student@hostelhub.demo"
            value={forgotEmail || email}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500">
            For demo testing purposes, the standard password for Student is <code>student123</code>.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={forgotSent}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
