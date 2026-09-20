import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  PlayCircle,
  Phone,
  User,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { RequestMaintenanceModal } from '../components/modals/RequestMaintenanceModal';
import { useData } from '../context/DataContext';
import { Complaint, ComplaintStatus } from '../types';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export const MaintenancePage: React.FC = () => {
  const { complaints } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const totalCount = complaints.length;
  const openCount = complaints.filter((c) => c.status === 'Submitted').length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Assigned'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'open'
          ? c.status === 'Submitted'
          : statusFilter === 'in_progress'
          ? c.status === 'In Progress' || c.status === 'Assigned'
          : c.status === 'Resolved';

      const matchesCategory =
        categoryFilter === 'all' ? true : c.category === categoryFilter;

      const matchesSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [complaints, statusFilter, categoryFilter, searchQuery]);

  const categories = [
    'All Categories',
    'Fan / AC',
    'Electrical',
    'Plumbing',
    'Wi-Fi',
    'Furniture',
    'Cleaning',
    'Other',
  ];

  const timelineSteps: ComplaintStatus[] = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 0;
      case 'Assigned':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Maintenance & Facilities"
        subtitle="Track issue tickets, technician dispatch, and resolution timelines"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Report New Issue
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={totalCount}
          numericValue={totalCount}
          icon={<Wrench className="w-5 h-5" />}
          iconBgColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          onClick={() => setStatusFilter('all')}
        />
        <StatCard
          label="Open / Pending"
          value={openCount}
          numericValue={openCount}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-slate-500/10 text-slate-600 dark:text-slate-400"
          onClick={() => setStatusFilter('open')}
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          numericValue={inProgressCount}
          icon={<PlayCircle className="w-5 h-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          trend={{ text: 'Dispatched to staff', isPositive: true }}
          onClick={() => setStatusFilter('in_progress')}
        />
        <StatCard
          label="Resolved"
          value={resolvedCount}
          numericValue={resolvedCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          trend={{ text: 'Completed', isPositive: true }}
          onClick={() => setStatusFilter('resolved')}
        />
      </div>

      {/* Filter and Search Bar */}
      <Card padded={false} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ticket ID (MH-1024), title, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer shrink-0"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'open'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Open ({openCount})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'resolved'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Complaints List with Visual Timelines */}
      {filteredComplaints.length > 0 ? (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => {
            const currentStepIdx = getStepIndex(complaint.status);

            return (
              <Card
                key={complaint.id}
                hoverEffect
                className="cursor-pointer"
                onClick={() => setSelectedComplaint(complaint)}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Ticket Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                        {complaint.id}
                      </span>
                      <StatusBadge status={complaint.status} />
                      <Badge variant="default" size="sm">
                        {complaint.category}
                      </Badge>
                      <Badge
                        variant={
                          complaint.priority === 'Urgent'
                            ? 'danger'
                            : complaint.priority === 'High'
                            ? 'warning'
                            : 'default'
                        }
                        size="sm"
                      >
                        {complaint.priority} Priority
                      </Badge>
                      <span className="text-xs text-slate-400 ml-auto lg:ml-0">
                        {formatDate(complaint.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {complaint.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {complaint.description}
                    </p>

                    {complaint.assignedTo && (
                      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          Technician: <strong>{complaint.assignedTo}</strong>
                        </span>
                        {complaint.technicianPhone && (
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" /> {complaint.technicianPhone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Visual 4-Stage Mini Timeline */}
                  <div className="lg:w-80 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between relative">
                      {/* Connecting Line */}
                      <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />

                      {timelineSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={step}
                            className="flex flex-col items-center z-10 text-center flex-1"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isDone
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-950/50'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                              } ${isCurrent ? 'scale-110' : ''}`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1.5 font-medium leading-tight ${
                                isDone
                                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Wrench className="w-7 h-7" />}
          title="No maintenance requests found"
          description="There are currently no maintenance tickets matching your search criteria or active filters."
          actionText="Report New Maintenance Issue"
          onAction={() => setModalOpen(true)}
        />
      )}

      {/* Ticket Details & Comprehensive Timeline Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Complaint Details — ${selectedComplaint.id}`}
          subtitle={`Reported for Room ${selectedComplaint.roomNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selectedComplaint.status} />
              <Badge variant="primary">{selectedComplaint.category}</Badge>
              <Badge
                variant={selectedComplaint.priority === 'Urgent' ? 'danger' : 'warning'}
              >
                {selectedComplaint.priority} Priority
              </Badge>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedComplaint.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.imageUrl && (
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Attached Photo:
                </span>
                <img
                  src={selectedComplaint.imageUrl}
                  alt="Complaint attachment"
                  className="rounded-xl max-h-48 w-full object-cover border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}

            {/* Detailed Timeline Steps */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Lifecycle Timeline
              </h5>
              <div className="space-y-3 pl-2 border-l-2 border-indigo-500/30">
                {selectedComplaint.timeline.map((step, i) => (
                  <div key={i} className="relative pl-4">
                    <div className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {step.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(step.timestamp)}
                      </span>
                    </div>
                    {step.note && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {step.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedComplaint.assignedTo && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Assigned Maintenance Technician
                </p>
                <div className="flex items-center justify-between">
                  <span>{selectedComplaint.assignedTo}</span>
                  {selectedComplaint.technicianPhone && (
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      {selectedComplaint.technicianPhone}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Maintenance Modal */}
      <RequestMaintenanceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
