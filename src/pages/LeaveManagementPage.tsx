import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  Calendar,
  Phone,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { ApplyLeaveModal } from '../components/modals/ApplyLeaveModal';
import { useData } from '../context/DataContext';
import { LeaveRequest } from '../types';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export const LeaveManagementPage: React.FC = () => {
  const { leaves, profile } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeavePass, setSelectedLeavePass] = useState<LeaveRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const totalCount = leaves.length;
  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'pending'
          ? l.status === 'Pending'
          : statusFilter === 'approved'
          ? l.status === 'Approved'
          : l.status === 'Rejected';

      const matchesSearch =
        searchQuery.trim() === '' ||
        l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.reason.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [leaves, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Leave Management & Gate Pass"
        subtitle="Apply for hostel outstation clearance, check approvals, and generate digital gate passes"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Apply for Leave
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={totalCount}
          numericValue={totalCount}
          icon={<CalendarDays className="w-5 h-5" />}
          iconBgColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          onClick={() => setStatusFilter('all')}
        />
        <StatCard
          label="Pending Review"
          value={pendingCount}
          numericValue={pendingCount}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          trend={{ text: 'Warden Queue', isPositive: false }}
          onClick={() => setStatusFilter('pending')}
        />
        <StatCard
          label="Approved Passes"
          value={approvedCount}
          numericValue={approvedCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          trend={{ text: 'Gate Ready', isPositive: true }}
          onClick={() => setStatusFilter('approved')}
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          numericValue={rejectedCount}
          icon={<XCircle className="w-5 h-5" />}
          iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          onClick={() => setStatusFilter('rejected')}
        />
      </div>

      {/* Search and Filters */}
      <Card padded={false} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by pass ID (LH-2026), destination, leave type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Leaves List */}
      {filteredLeaves.length > 0 ? (
        <div className="space-y-4">
          {filteredLeaves.map((leave) => (
            <Card key={leave.id} hoverEffect className="cursor-pointer">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      {leave.id}
                    </span>
                    <StatusBadge status={leave.status} />
                    <Badge variant="purple" size="sm">
                      {leave.leaveType}
                    </Badge>
                    <span className="text-xs text-slate-400 ml-auto lg:ml-0">
                      Applied {formatRelativeTime(leave.appliedAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {leave.destination}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {leave.reason}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {formatDate(leave.fromDate)} → {formatDate(leave.toDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Emergency: {leave.emergencyContact}
                    </span>
                  </div>
                </div>

                {/* Right Gate Pass Button */}
                <div className="shrink-0 flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  {leave.status === 'Approved' ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setSelectedLeavePass(leave)}
                      leftIcon={<QrCode className="w-4 h-4" />}
                    >
                      View Digital Pass
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLeavePass(leave)}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDays className="w-7 h-7" />}
          title="No leave requests found"
          description="You do not have any active or previous leave records matching this filter."
          actionText="Apply for Leave"
          onAction={() => setModalOpen(true)}
        />
      )}

      {/* Digital Gate Pass & Details Modal */}
      {selectedLeavePass && (
        <Modal
          isOpen={!!selectedLeavePass}
          onClose={() => setSelectedLeavePass(null)}
          title={
            selectedLeavePass.status === 'Approved'
              ? 'Hostel Security Out-Pass (QR Verified)'
              : `Leave Application — ${selectedLeavePass.id}`
          }
          subtitle={`Pass Code: ${selectedLeavePass.passCode || selectedLeavePass.id}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Simulated QR Code for Security Gate Terminal */}
            {selectedLeavePass.status === 'Approved' && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-50 to-white dark:from-[#0e1626] dark:to-[#131b2b] border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center text-center shadow-inner">
                {/* Visual SVG QR Code Mockup */}
                <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M10 10h30v30h-30z M16 16v18h18v-18z M22 22h6v6h-6z M60 10h30v30h-30z M66 16v18h18v-18z M72 22h6v6h-6z M10 60h30v30h-30z M16 66v18h18v-18z M22 72h6v6h-6z M50 10h6v6h-6z M50 22h6v12h-6z M60 50h6v6h-6z M70 50h10v6h-10z M50 60h6v10h-6z M60 60h10v6h-10z M80 60h10v10h-10z M50 80h10v10h-10z M70 80h10v10h-10z M80 80h10v10h-10z" />
                  </svg>
                </div>
                <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 mt-2">
                  {selectedLeavePass.passCode}
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Warden Digital Authorization Active
                </span>
              </div>
            )}

            {/* Student & Leave Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Student Name
                </span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {profile.name}
                </span>
                <span className="text-slate-400 text-[11px]">Room {profile.roomNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Leave Type
                </span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {selectedLeavePass.leaveType}
                </span>
                <StatusBadge status={selectedLeavePass.status} size="sm" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Valid Duration
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(selectedLeavePass.fromDate)} until{' '}
                  {formatDate(selectedLeavePass.toDate)}
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Destination Address
                </span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                  {selectedLeavePass.destination}
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Reason for Travel
                </span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                  {selectedLeavePass.reason}
                </p>
              </div>

              {selectedLeavePass.wardenRemarks && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Warden Verification Remarks
                  </span>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    "{selectedLeavePass.wardenRemarks}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Pass
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedLeavePass(null)}
              >
                Close Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Leave Modal */}
      <ApplyLeaveModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
