import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Play,
  Search,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Complaint } from '../../types';

export const MaintenanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();
  const { complaints, startMaintenanceTask, resolveMaintenanceTask } = useData();
  const { showToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get('filter') as 'All' | 'Assigned' | 'In Progress' | 'Resolved' | null;
  const activeFilter = (currentFilter && ['All', 'Assigned', 'In Progress', 'Resolved'].includes(currentFilter))
    ? currentFilter
    : 'All';

  const setActiveFilter = (filter: 'All' | 'Assigned' | 'In Progress' | 'Resolved') => {
    setSearchParams(filter === 'All' ? {} : { filter });
  };
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution Modal State
  const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');

  const assignedTasks = complaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'Submitted'
  );
  const inProgressTasks = complaints.filter((c) => c.status === 'In Progress');
  const resolvedTasks = complaints.filter((c) => c.status === 'Resolved');
  const highPriorityTasks = complaints.filter(
    (c) => (c.priority === 'High' || c.priority === 'Urgent') && c.status !== 'Resolved'
  );

  const filteredTasks = complaints
    .filter((c) => {
      if (activeFilter === 'Assigned') return c.status === 'Assigned' || c.status === 'Submitted';
      if (activeFilter === 'In Progress') return c.status === 'In Progress';
      if (activeFilter === 'Resolved') return c.status === 'Resolved';
      return true;
    })
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleStartWork = (c: Complaint) => {
    startMaintenanceTask(c.id, 'Technician Rajesh Sharma arrived on site; diagnostic and component inspection initiated.');
    showToast(`Work started on ticket ${c.id}. Student has been notified.`, 'info', 'Maintenance Active');
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaint) return;

    const fullNote = partsReplaced.trim()
      ? `${resolutionNote.trim()} (Components replaced: ${partsReplaced.trim()})`
      : resolutionNote.trim() || 'Work verified functional and certified safe.';

    resolveMaintenanceTask(resolvingComplaint.id, fullNote);
    showToast(`Ticket ${resolvingComplaint.id} marked Resolved!`, 'success', 'Work Certified');

    setResolvingComplaint(null);
    setResolutionNote('');
    setPartsReplaced('');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-black">Facilities & Maintenance Portal</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
                Staff Operations
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1">
              Logged in as {user?.name || 'Rajesh Sharma'} (Senior Facilities Technician) • Rapid Dispatch Squad
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            switchRole('student');
            navigate('/dashboard');
          }}
          className="bg-white text-slate-900 hover:bg-slate-100"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Return to Student View
        </Button>
      </div>

      <PageHeader
        title="Active Work Orders & Maintenance Dispatch"
        subtitle="Perform physical repairs, log diagnostics, and update student resolution timelines"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Assigned Tasks</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{assignedTasks.length}</p>
            <p className="text-[11px] text-indigo-500 font-semibold">Queue waiting</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">High Priority</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{highPriorityTasks.length}</p>
            <p className="text-[11px] text-rose-600 font-semibold">Urgent attention</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">In Progress</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{inProgressTasks.length}</p>
            <p className="text-[11px] text-amber-600 font-semibold">Active repairs</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Resolved</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{resolvedTasks.length}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Certified functional</p>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['All', 'Assigned', 'In Progress', 'Resolved'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#0e1626] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, room, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Work Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTasks.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 bg-white dark:bg-[#0e1626] rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No work orders matching filter</p>
            <p className="text-xs text-slate-400 mt-1">Select &quot;All&quot; to inspect every logged ticket.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isResolved = task.status === 'Resolved';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {task.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Room {task.roomNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          task.priority === 'Urgent' || task.priority === 'High'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isResolved
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : isInProgress
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">{task.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Category: {task.category}</p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                    {task.description}
                  </p>

                  {/* Resolution Notes if Resolved */}
                  {task.resolutionNotes && (
                    <div className="mt-3 p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-xs">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolution Record:
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">{task.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Timeline steps peek */}
                  <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-500">Live Stage:</p>
                    {task.timeline.slice(-1).map((step, idx) => (
                      <p key={idx} className="text-slate-600 dark:text-slate-400 italic">
                        &ldquo;{step.note || step.status}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                {!isResolved && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    {!isInProgress ? (
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1 justify-center"
                        onClick={() => handleStartWork(task)}
                        leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                      >
                        Start Work
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => {
                          setResolvingComplaint(task);
                          setResolutionNote('');
                          setPartsReplaced('');
                        }}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* RESOLUTION MODAL */}
      <Modal
        isOpen={!!resolvingComplaint}
        onClose={() => setResolvingComplaint(null)}
        title={`Certify Resolution for Ticket ${resolvingComplaint?.id}`}
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <p className="font-bold text-slate-900 dark:text-white">{resolvingComplaint?.title}</p>
            <p className="text-slate-500">
              Room {resolvingComplaint?.roomNumber} • Category: {resolvingComplaint?.category}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Resolution Summary (Dispatched to Student)
            </label>
            <textarea
              rows={3}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="e.g. Capacitor replaced, tested at 230V, verified silent oscillation."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Parts or Consumables Replaced (Optional)
            </label>
            <input
              type="text"
              value={partsReplaced}
              onChange={(e) => setPartsReplaced(e.target.value)}
              placeholder="e.g. 2.5uF Fan Capacitor, 16A modular switch"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setResolvingComplaint(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Submit & Notify Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
