import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const { resetDemoData } = useData();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<AppSettings>(() =>
    getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      notifications: {
        maintenance: true,
        leaves: true,
        announcements: true,
        mess: true,
      },
    })
  );

  // Change password form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');

  // Reset demo modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleNotificationToggle = (key: keyof AppSettings['notifications']) => {
    const updated: AppSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    setSettings(updated);
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
    showToast(`Notification preferences updated.`, 'info');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    const updated: AppSettings = { ...settings, theme: newTheme };
    setSettings(updated);
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
    showToast(`Theme updated to ${newTheme.toUpperCase()}.`, 'info');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!currentPass) {
      setPassError('Please enter your existing password');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match');
      return;
    }

    showToast('Password updated successfully for demo session.', 'success', 'Security Updated');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setResetModalOpen(false);
    showToast('All data has been restored to default initial seed datasets.', 'success', 'Demo Reset Complete');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      <PageHeader
        title="Settings & System Preferences"
        subtitle="Manage appearance themes, notification delivery channels, security credentials, and mock data"
      />

      {/* Section 1: Appearance Theme */}
      <Card>
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <Sun className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interface Appearance
            </h3>
            <p className="text-xs text-slate-400">Select your preferred visual style</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Mode */}
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Light Mode</p>
              <p className="text-[10px] text-slate-400">Crisp clean surfaces</p>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Dark Mode</p>
              <p className="text-[10px] text-slate-400">Deep slate SaaS palette</p>
            </div>
          </button>

          {/* System Preference */}
          <button
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
              theme === 'system'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-500/10 text-slate-500">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">System Default</p>
              <p className="text-[10px] text-slate-400">Sync with OS setting</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Section 2: Notification Preferences */}
      <Card>
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <Bell className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-400">Toggle alerts for hostel events and status updates</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Maintenance & Repair Alerts
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Technician assignment, progress milestones, and ticket completion
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.maintenance ?? true}
              onChange={() => handleNotificationToggle('maintenance')}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Leave & Out-Pass Approvals
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Chief warden approvals, verification status, and gate pass issue
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.leaves ?? true}
              onChange={() => handleNotificationToggle('leaves')}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Hostel Announcements & Emergency Notices
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Water shutdown, power maintenance, cultural events, and security circulars
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.announcements ?? true}
              onChange={() => handleNotificationToggle('announcements')}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Daily Mess & Dining Menu Updates
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Today's special course additions and weekend feast announcements
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.mess ?? true}
              onChange={() => handleNotificationToggle('mess')}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Section 3: Account & Security */}
      <Card>
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <Lock className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Security & Credentials
            </h3>
            <p className="text-xs text-slate-400">Update your account login password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          {passError && (
            <p className="text-xs text-rose-500 font-medium">{passError}</p>
          )}

          <Input
            label="Current Password"
            type={showPass ? 'text' : 'password'}
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            placeholder="Enter current password"
            required
          />

          <Input
            label="New Password"
            type={showPass ? 'text' : 'password'}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="At least 6 characters"
            required
          />

          <Input
            label="Confirm New Password"
            type={showPass ? 'text' : 'password'}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Re-enter new password"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm">
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Section 4: Data Management & Reset */}
      <Card className="border-rose-200/80 dark:border-rose-900/40">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950/60 mb-4">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold">Demo Data Management</h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Reset all mock complaints, leave applications, mess ratings, and profile edits back to the default seed datasets.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setResetModalOpen(true)}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset to Default Seed Data
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out of HostelHub
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Confirm Reset Demo Data"
        subtitle="This will restore all default mock values across the app"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All newly added complaints, leave requests, ratings, and profile edits will be replaced with initial default values. Are you sure you want to proceed?
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
