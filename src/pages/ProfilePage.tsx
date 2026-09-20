import React, { useState } from 'react';
import {
  Mail,
  Phone,
  GraduationCap,
  BedDouble,
  Heart,
  Shield,
  Edit,
  Camera,
  Building2,
  ShieldCheck,
  Award,
  KeyRound,
  Wrench,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { profile } = useData();
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Role detection
  const role = user?.role || 'student';

  // 1. WARDEN PROFILE VIEW
  if (role === 'warden') {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Warden Profile & Official Credentials"
          subtitle="Administrative supervisory records, assigned residential blocks, and official campus communications"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          }
        />

        {/* Hero Profile Overview Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
            <div className="relative group shrink-0">
              <img
                src={user?.avatar || '/avatars/dr_ramanathan.jpg'}
                alt={user?.name || 'Warden'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
              />
              <button
                onClick={() => setEditModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition-colors"
                title="Edit Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Dr. K. Ramanathan'}
                </h2>
                <Badge variant="success" size="sm" dot>
                  Chief Warden (Active Duty)
                </Badge>
                <Badge variant="primary" size="sm">
                  {user?.staffId || 'WRD-2026-004'}
                </Badge>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user?.designation || 'Chief Hostel Warden & Associate Professor'} • {user?.department || 'Campus Residential Welfare'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  Jurisdiction: <strong>{user?.block || 'Block B & Block C'}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  {user?.phone || '+91 94441 87654'}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  {user?.email || 'warden@hostelhub.demo'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid: Administrative Specs & Emergency Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Administrative Jurisdiction & Oversight
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                Senior Warden Council
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assigned Residential Blocks</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {user?.block || 'Block B & Block C'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Supervised Student Capacity</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  640 Beds (94% Allocated)
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Office Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.officeLocation || 'Warden Secretariat, Ground Floor, Room W-101'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Official Duty Hours</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.dutyHours || '09:00 AM – 06:30 PM (24/7 Emergency On-Call)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Statutory Authorities</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  Leave Approvals, Disciplinary Redressal, Room Audits
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" /> Emergency Hotlines & Deputy Contacts
              </h3>
              <button
                onClick={() => setEditModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Update Contacts
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Deputy Warden (Boys Hostels)
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {user?.emergencyContact?.name || 'Prof. S. Natarajan'} ({user?.emergencyContact?.relation || 'Deputy Warden'})
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{user?.emergencyContact?.phone || '+91 94441 22334'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Campus Main Gate Vigilance & Security
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Central Control Room Desk (Main Gate 1)
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>+91 80000 11223</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <EditProfileModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
      </div>
    );
  }

  // 2. SECURITY OFFICER PROFILE VIEW
  if (role === 'security') {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Security Officer Profile & Gate Checkpoint"
          subtitle="Campus safety vigilance credentials, gate checkpoint assignment, and turnstile access control"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          }
        />

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-emerald-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
            <div className="relative group shrink-0">
              <img
                src={user?.avatar || '/avatars/officer_verma.jpg'}
                alt={user?.name || 'Security Officer'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
              <button
                onClick={() => setEditModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-500 transition-colors"
                title="Edit Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Officer S. Verma'}
                </h2>
                <Badge variant="success" size="sm" dot>
                  Security Supervisor (Active Shift)
                </Badge>
                <Badge variant="primary" size="sm">
                  {user?.staffId || 'SEC-G1-089'}
                </Badge>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user?.designation || 'Chief Security Supervisor'} • {user?.department || 'Campus Safety & Vigilance Command'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Checkpoint: <strong>{user?.checkpoint || 'Main Campus Gate 1 & Turnstiles'}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {user?.phone || '+91 98765 43210'}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  {user?.email || 'security@hostelhub.demo'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-500" /> Vigilance Jurisdiction & Access Clearance
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                Authorized Post
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assigned Post</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {user?.checkpoint || 'Main Campus Gate 1 & Turnstile Post'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Duty Shift Timings</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {user?.shift || 'General Day Shift (07:00 AM – 07:00 PM)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Verification Authority</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Digital QR Pass Scans, Visitor Registry, Curfew Log
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Equipment Deployed</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Biometric Handheld Scanner BHS-402, Radio Channel 4
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Security Clearance Level</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  SEC-LEVEL-3-CAMPUS-POLICE
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" /> Emergency Communications & HQ Dispatch
              </h3>
              <button
                onClick={() => setEditModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Update Contacts
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Central Campus Vigilance HQ Dispatch
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {user?.emergencyContact?.name || 'Control Room Dispatch Desk'}
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{user?.emergencyContact?.phone || '+91 80000 11223'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Campus Health Centre Ambulance Desk
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Emergency Medical Bay Hotline
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+91 80000 99911</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <EditProfileModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
      </div>
    );
  }

  // 3. ADMIN PROFILE VIEW
  if (role === 'admin') {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Administrator Profile & Executive Credentials"
          subtitle="Institutional governance directory, residential system oversight, and administration secretariat"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          }
        />

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-purple-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
            <div className="relative group shrink-0">
              <img
                src={user?.avatar || '/avatars/prof_meera_sen.jpg'}
                alt={user?.name || 'Administrator'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-purple-500/20 shadow-md"
              />
              <button
                onClick={() => setEditModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-purple-600 text-white shadow-md hover:bg-purple-500 transition-colors"
                title="Edit Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Prof. Meera Sen'}
                </h2>
                <Badge variant="success" size="sm" dot>
                  Institutional Executive
                </Badge>
                <Badge variant="primary" size="sm">
                  {user?.staffId || 'ADM-DIR-001'}
                </Badge>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user?.designation || 'Director of Student Welfare & Campus Administration'} • {user?.department || 'Directorate of Student Affairs'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-500" />
                  Office: <strong>{user?.officeLocation || 'Administrative Central Block, Room A-202'}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-4 h-4 text-purple-500" />
                  {user?.phone || '+91 99887 76655'}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-4 h-4 text-purple-500" />
                  {user?.email || 'admin@hostelhub.demo'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" /> System Governance & Institutional Scope
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
                Executive Clearance
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Facilities Under Purview</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Hostel Blocks A, B, C, D & Central Dining Facilities
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Administrative Office Hours</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {user?.dutyHours || '09:30 AM – 05:30 PM (Mon – Sat)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Institutional Role</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Director of Student Welfare, Hostel Executive Committee Chair
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Policy Scope</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Fee Allocations, Infrastructure ERP, Staffing Decisions
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Digital Executive Token</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  EXEC-DSW-ADM-2026-CERTIFIED
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" /> Secretariat Contacts & Institutional Council
              </h3>
              <button
                onClick={() => setEditModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Update Contacts
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  University Registrar Secretariat
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {user?.emergencyContact?.name || 'Registrar Secretariat Desk'}
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-purple-500" />
                  <span>{user?.emergencyContact?.phone || '+91 99887 11000'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Chief Hostel Warden Secretariat
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Dr. K. Ramanathan (Warden Office)
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-purple-500" />
                  <span>+91 94441 87654</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <EditProfileModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
      </div>
    );
  }

  // 4. MAINTENANCE STAFF PROFILE VIEW
  if (role === 'maintenance') {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Facilities Technician Profile & Credentials"
          subtitle="Campus infrastructure maintenance records, workshop station assignment, and work order dispatch records"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          }
        />

        {/* Hero Profile Overview Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
            <div className="relative group shrink-0">
              <img
                src={user?.avatar || '/avatars/rajesh_sharma.jpg'}
                alt={user?.name || 'Maintenance Staff'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-amber-500/20 shadow-md"
              />
              <button
                onClick={() => setEditModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-amber-600 text-white shadow-md hover:bg-amber-500 transition-colors"
                title="Edit Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Rajesh Sharma'}
                </h2>
                <Badge variant="success" size="sm" dot>
                  Senior Technician (Active On-Duty)
                </Badge>
                <Badge variant="warning" size="sm">
                  {user?.staffId || 'MNT-CIV-042'}
                </Badge>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user?.designation || 'Senior Facilities Technician & Electrician'} • {user?.department || 'Campus Infrastructure & Rapid Maintenance Squad'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  Workshop Base: <strong>{user?.officeLocation || 'Workshop Block C, Ground Floor'}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-4 h-4 text-amber-500" />
                  {user?.phone || '+91 98230 45678'}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-4 h-4 text-amber-500" />
                  {user?.email || 'maintenance@hostelhub.demo'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid: Trade Specialization & Dispatch Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" /> Technical Trade & Service Jurisdiction
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                Authorized Specialist
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assigned Workshop Base</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {user?.officeLocation || 'Workshop Block C, Ground Floor'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Core Trade Specialization</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  Electrical Infrastructure, Plumbing & Rapid HVAC
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Official Shift Hours</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.dutyHours || '08:30 AM – 06:00 PM (Emergency Rapid Response)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Service Coverage Purview</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Hostel Blocks A, B, C, D & Central Dining Hall
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Rapid Dispatch Token</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  MNT-CIV-RAPID-DISPATCH-2026
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" /> Estate Engineering & Dispatch Hotlines
              </h3>
              <button
                onClick={() => setEditModalOpen(true)}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Update Contacts
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Central Estate Engineering Office
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {user?.emergencyContact?.name || 'Engineering Helpdesk'} ({user?.emergencyContact?.relation || 'Central Estate Office'})
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>{user?.emergencyContact?.phone || '+91 80000 44556'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Campus Electrical Substation Desk
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  33kV Substation Bay 2 Control Desk
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>+91 80000 77889</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <EditProfileModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
      </div>
    );
  }

  // 5. STUDENT PROFILE VIEW (DEFAULT)
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Student Profile & ID"
        subtitle="Manage resident student credentials, room allocation details, and verified guardian emergency contacts"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditModalOpen(true)}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        }
      />

      {/* Hero Profile Overview Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          {/* Avatar with status indicator */}
          <div className="relative group shrink-0">
            <img
              src={
                profile.avatar && !profile.avatar.includes('unsplash.com')
                  ? profile.avatar
                  : (user?.avatar && !user.avatar.includes('unsplash.com')
                    ? user.avatar
                    : '/avatars/aravind_kumar.jpg')
              }
              alt={profile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
            />
            <button
              onClick={() => setEditModalOpen(true)}
              className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition-colors"
              title="Edit Profile"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Student Core Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <Badge variant="success" size="sm" dot>
                Active Resident
              </Badge>
              <Badge variant="primary" size="sm">
                {profile.studentId || 'STU2026-0142'}
              </Badge>
            </div>

            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {profile.course} • {profile.year}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-indigo-500" />
                Room {profile.roomNumber} ({profile.block}, {profile.floor})
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-4 h-4 text-indigo-500" />
                {profile.phone}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Mail className="w-4 h-4 text-indigo-500" />
                {profile.email}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: Academic & Room Info, Guardian & Emergency Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic & Hostel Allocation Specs */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" /> Academic & Residency Records
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              92% Curfew Attendance
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Hostel Allocation</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {profile.block}, {profile.floor}, Room {profile.roomNumber}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Allocated Bed</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {profile.bedNumber} (Window Study Corner)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Department / Major</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {profile.course}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-bold text-rose-600 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> {profile.bloodGroup}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Biometric RFID Badge</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                RFID-8812-OK
              </span>
            </div>
          </div>
        </Card>

        {/* Verified Guardian & Emergency Contacts */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Guardian & Emergency Contacts
            </h3>
            <button
              onClick={() => setEditModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Update Contacts
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Guardian */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Primary Parent / Guardian
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {profile.guardian?.name} ({profile.guardian?.relation})
              </p>
              <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>{profile.guardian?.phone}</span>
              </div>
            </div>

            {/* Local Emergency Contact */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Local Guardian / Medical Emergency
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {profile.emergencyContact?.name} ({profile.emergencyContact?.relation})
              </p>
              <div className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>{profile.emergencyContact?.phone}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
    </div>
  );
};
