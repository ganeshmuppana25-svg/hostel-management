import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  BedDouble,
  Sparkles,
  Users,
  Wrench,
  CalendarCheck,
  Megaphone,
  Search,
  Check,
  Building,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  BlockRoom,
  Complaint,
  LeaveRequest,
  ComplaintPriority,
  AnnouncementCategory,
  AnnouncementPriority,
  SmartRoomRecommendation,
} from '../../types';

type WardenTab = 'overview' | 'rooms' | 'students' | 'leaves' | 'complaints';

export const WardenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();
  const {
    leaves,
    complaints,
    blockRooms,
    visitors,
    assignComplaint,
    reviewLeave,
    createAnnouncement,
    allocateBed,
    vacateBed,
    toggleRoomMaintenance,
  } = useData();
  const { showToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') as WardenTab | null;
  const activeTab: WardenTab = (currentTab && ['overview', 'rooms', 'students', 'leaves', 'complaints'].includes(currentTab))
    ? currentTab
    : 'overview';

  const setActiveTab = (tab: WardenTab) => {
    setSearchParams(tab === 'overview' ? {} : { tab });
  };

  // Broadcast Notice Modal State
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<AnnouncementCategory>('General');
  const [noticePriority, setNoticePriority] = useState<AnnouncementPriority>('Normal');
  const [noticePinned, setNoticePinned] = useState(false);

  // Leave Review Modal State
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [leaveRemarks, setLeaveRemarks] = useState('');

  // Complaint Assignment Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assignedTechnician, setAssignedTechnician] = useState('Rajesh Sharma (Facilities & Electrical)');
  const [complaintPriorityOverride, setComplaintPriorityOverride] = useState<ComplaintPriority>('High');

  // Room Bed Assignment State
  const [selectedRoom, setSelectedRoom] = useState<BlockRoom | null>(null);
  const [selectedBedNumber, setSelectedBedNumber] = useState<number | null>(null);
  const [assignStudentName, setAssignStudentName] = useState('');
  const [assignStudentId, setAssignStudentId] = useState('');
  const [assignStudentCourse, setAssignStudentCourse] = useState('B.Tech AI & DS');
  const [assignStudentYear, setAssignStudentYear] = useState('3rd Year');
  const [assignStudentPhone, setAssignStudentPhone] = useState('+91 98450 00000');
  const [roomAssignModalOpen, setRoomAssignModalOpen] = useState(false);

  // Smart Room Recommendation Simulation State
  const [recCourse, setRecCourse] = useState('B.Tech AI & DS');
  const [recBlock, setRecBlock] = useState<'Block A' | 'Block B' | 'Block C' | 'Block D'>('Block B');
  const [recYear, setRecYear] = useState('3rd Year');
  const [recommendationResult, setRecommendationResult] = useState<SmartRoomRecommendation | null>(null);

  // Filters
  const [roomBlockFilter, setRoomBlockFilter] = useState<'All' | 'Block A' | 'Block B' | 'Block C' | 'Block D'>('All');
  const [studentSearch, setStudentSearch] = useState('');

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
  const openComplaints = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'In Progress' || c.status === 'Assigned'
  );

  // Calculate total beds and occupancy across blocks
  const totalHostelBeds = blockRooms.reduce((acc, r) => acc + r.totalBeds, 0);
  const totalOccupiedBeds = blockRooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
  const occupancyPercentage =
    totalHostelBeds > 0 ? Math.round((totalOccupiedBeds / totalHostelBeds) * 100) : 92;

  // Smart Priority Calculator (Deterministic Rules)
  const calculateSmartPriority = (title: string, category: string): { priority: ComplaintPriority; rationale: string } => {
    const text = `${title} ${category}`.toLowerCase();
    if (text.includes('spark') || text.includes('fire') || text.includes('water leak') || text.includes('shock') || text.includes('flood')) {
      return { priority: 'Urgent', rationale: 'Critical hazard risk (Electrical/Water Emergency)' };
    }
    if (text.includes('ac') || text.includes('fan') || text.includes('bathroom') || text.includes('flush') || text.includes('power')) {
      return { priority: 'High', rationale: 'Essential climate & sanitary utility failure' };
    }
    if (text.includes('wifi') || text.includes('desk') || text.includes('chair') || text.includes('window')) {
      return { priority: 'Medium', rationale: 'Non-emergency furniture / network service' };
    }
    return { priority: 'Low', rationale: 'General maintenance request' };
  };

  // Run Smart Room Recommendation Simulation
  const runSmartRoomRecommendation = () => {
    // Find room in preferred block or neighboring block with available beds
    const candidates = blockRooms.filter(
      (r) => !r.isUnderMaintenance && r.beds.some((b) => b.status === 'available')
    );

    const preferred = candidates.find((r) => r.block === recBlock) || candidates[0];

    if (preferred) {
      const availBed = preferred.beds.find((b) => b.status === 'available');
      setRecommendationResult({
        roomNumber: preferred.roomNumber,
        block: preferred.block,
        type: preferred.type,
        matchScore: 94,
        availableBed: availBed ? availBed.bedNumber : 1,
        reasons: [
          `Compatible course cohort (${recCourse})`,
          `Matches preferred ${preferred.block}`,
          `Bed #${availBed?.bedNumber || 1} vacant and sanitized`,
          `Optimal ${preferred.type} peer balance`,
        ],
      });
      showToast(
        `Recommendation generated for ${preferred.roomNumber} (Score: 94%)`,
        'info',
        'Smart Recommendation'
      );
    } else {
      showToast('No vacancies available matching criteria.', 'warning', 'Allocation Alert');
    }
  };

  // Handle Leave Approval
  const handleLeaveDecision = (decision: 'Approved' | 'Rejected') => {
    if (!selectedLeave) return;
    reviewLeave(selectedLeave.id, decision, leaveRemarks || (decision === 'Approved' ? 'Parental consent verified.' : 'Documentation insufficient.'));
    showToast(
      `Leave request ${selectedLeave.id} has been ${decision.toLowerCase()}.`,
      decision === 'Approved' ? 'success' : 'error',
      'Warden Authorization'
    );
    setSelectedLeave(null);
    setLeaveRemarks('');
  };

  // Handle Complaint Dispatch
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    assignComplaint(selectedComplaint.id, assignedTechnician, '+91 98230 45678', complaintPriorityOverride);
    showToast(
      `Ticket ${selectedComplaint.id} assigned to ${assignedTechnician}.`,
      'success',
      'Technician Dispatched'
    );
    setSelectedComplaint(null);
  };

  // Handle Bed Allocation
  const handleBedAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || selectedBedNumber === null) return;
    if (!assignStudentName.trim() || !assignStudentId.trim()) {
      showToast('Please fill student name and ID.', 'warning');
      return;
    }

    allocateBed(selectedRoom.roomNumber, selectedBedNumber, {
      name: assignStudentName,
      studentId: assignStudentId,
      course: assignStudentCourse,
      year: assignStudentYear,
      phone: assignStudentPhone,
    });

    showToast(
      `Student ${assignStudentName} assigned to ${selectedRoom.roomNumber} (Bed ${selectedBedNumber}).`,
      'success',
      'Bed Allocation'
    );

    setRoomAssignModalOpen(false);
    setAssignStudentName('');
    setAssignStudentId('');
  };

  // Handle Notice Broadcast
  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeDesc.trim()) {
      showToast('Please enter both title and description.', 'warning');
      return;
    }

    createAnnouncement({
      title: noticeTitle,
      description: noticeDesc,
      category: noticeCategory,
      priority: noticePriority,
      isPinned: noticePinned,
    });

    showToast('Official notice published to all resident dashboards.', 'success', 'Broadcast Dispatched');
    setNoticeModalOpen(false);
    setNoticeTitle('');
    setNoticeDesc('');
  };

  // Extract all students across blocks for directory
  const allStudents = blockRooms.flatMap((r) =>
    r.beds
      .filter((b) => b.status === 'occupied' && b.occupantName)
      .map((b) => ({
        name: b.occupantName || 'Unknown',
        studentId: b.studentId || 'N/A',
        roomNumber: r.roomNumber,
        block: r.block,
        course: b.course || 'B.Tech Engineering',
        year: b.year || '3rd Year',
        phone: b.phone || '+91 98000 11223',
        bedNumber: b.bedNumber,
      }))
  );

  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.roomNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.course.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredRooms = roomBlockFilter === 'All' ? blockRooms : blockRooms.filter((r) => r.block === roomBlockFilter);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Role Banner & Notice Trigger */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
            <UserCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-black">Chief Warden Command Center</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
                Phase 2 Operational
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1">
              Logged in as {user?.name || 'Dr. K. Ramanathan'} • Residential Blocks A, B, C & D
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setNoticeModalOpen(true)}
            leftIcon={<Megaphone className="w-4 h-4 text-indigo-600" />}
          >
            Broadcast Notice
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              switchRole('student');
              navigate('/dashboard');
            }}
            className="text-white hover:bg-white/10 border border-white/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Student View
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Command Overview', icon: Building, count: null },
          { id: 'rooms', label: 'Rooms & Bed Grid', icon: BedDouble, count: `${totalOccupiedBeds}/${totalHostelBeds}` },
          { id: 'students', label: 'Resident Directory', icon: Users, count: allStudents.length },
          { id: 'leaves', label: 'Leave Approvals', icon: CalendarCheck, count: pendingLeaves.length > 0 ? pendingLeaves.length : null },
          { id: 'complaints', label: 'Complaints Dispatch', icon: Wrench, count: openComplaints.length > 0 ? openComplaints.length : null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WardenTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-102'
                  : 'bg-white dark:bg-[#0e1626] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <BedDouble className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Hostel Occupancy</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {occupancyPercentage}%
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold">{totalOccupiedBeds} Beds Filled</p>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Leaves</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {pendingLeaves.length}
                </p>
                <p className="text-[11px] text-amber-600 font-semibold">Requires Approval</p>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Open Complaints</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {openComplaints.length}
                </p>
                <p className="text-[11px] text-rose-600 font-semibold">Maintenance Active</p>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Visitors</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {visitors.length}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold">Gate passes issued</p>
              </div>
            </Card>
          </div>

          {/* Quick Action Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Leave Authorizations */}
            <Card title="Pending Outstation Leave Authorizations" subtitle="Student passes waiting for parental verification & sign-off">
              {pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  No pending leave requests in queue. All clear!
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.slice(0, 3).map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {l.studentName} ({l.roomNumber})
                        </p>
                        <p className="text-slate-500">
                          {l.leaveType} • {l.destination} • {l.fromDate} to {l.toDate}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedLeave(l);
                          setActiveTab('leaves');
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Urgent Maintenance Dispatch */}
            <Card title="Open Maintenance Tickets" subtitle="Tickets needing staff allocation or priority classification">
              {openComplaints.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  All facility issues resolved. Zero open tickets!
                </div>
              ) : (
                <div className="space-y-3">
                  {openComplaints.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{c.title}</span>
                          <span className="font-mono text-[10px] text-slate-400">Room {c.roomNumber}</span>
                        </div>
                        <p className="text-slate-500">
                          {c.category} • Status: <strong className="text-indigo-500">{c.status}</strong>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedComplaint(c);
                          setActiveTab('complaints');
                        }}
                      >
                        Dispatch
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: ROOMS & BED MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          {/* Smart Room Recommendation Simulator Panel */}
          <Card
            title="Smart Room Recommendation (Frontend Simulation)"
            subtitle="Analyze course cohort, preferred block, and compatibility to discover the ideal bed allocation"
            className="border-indigo-500/30 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 dark:from-indigo-950/20 dark:via-[#0e1626] dark:to-purple-950/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Degree Course
                </label>
                <select
                  value={recCourse}
                  onChange={(e) => setRecCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <option value="B.Tech AI & DS">B.Tech AI & Data Science</option>
                  <option value="B.Tech CSE">B.Tech Computer Science</option>
                  <option value="B.Tech ECE">B.Tech Electronics (ECE)</option>
                  <option value="B.Tech Mechanical">B.Tech Mechanical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Residential Block
                </label>
                <select
                  value={recBlock}
                  onChange={(e) => setRecBlock(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Block A">Block A (Senior Wing)</option>
                  <option value="Block B">Block B (Tech Cohort)</option>
                  <option value="Block C">Block C (Quiet Wing)</option>
                  <option value="Block D">Block D (Freshers)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year
                </label>
                <select
                  value={recYear}
                  onChange={(e) => setRecYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={runSmartRoomRecommendation}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Find Recommended Room
                </Button>
              </div>
            </div>

            {/* Recommendation Result Card */}
            {recommendationResult && (
              <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-scaleIn">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      Recommendation Match Score
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                      {recommendationResult.matchScore}% MATCH
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Room {recommendationResult.roomNumber} ({recommendationResult.block}) — Bed #{recommendationResult.availableBed}
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {recommendationResult.reasons.map((r) => (
                      <span key={r} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    const targetRm = blockRooms.find((r) => r.roomNumber === recommendationResult.roomNumber);
                    if (targetRm) {
                      setSelectedRoom(targetRm);
                      setSelectedBedNumber(recommendationResult.availableBed);
                      setRoomAssignModalOpen(true);
                    }
                  }}
                >
                  Allocate This Bed
                </Button>
              </div>
            )}
          </Card>

          {/* Block Selection Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Block:</span>
              {(['All', 'Block A', 'Block B', 'Block C', 'Block D'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setRoomBlockFilter(b)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    roomBlockFilter === b
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Occupied
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Maintenance
              </span>
            </div>
          </div>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => (
              <div
                key={room.roomNumber}
                className={`p-5 rounded-3xl bg-white dark:bg-[#0e1626] border transition-all ${
                  room.isUnderMaintenance
                    ? 'border-amber-500/50 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200/80 dark:border-slate-800/80 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      Room {room.roomNumber}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {room.block} • Floor {room.floor} • {room.type}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleRoomMaintenance(room.roomNumber)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                      room.isUnderMaintenance
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Toggle maintenance lock"
                  >
                    {room.isUnderMaintenance ? 'In Maintenance' : 'Mark Maintenance'}
                  </button>
                </div>

                {/* Bed layout list */}
                <div className="space-y-2 mt-4">
                  {room.beds.map((bed) => (
                    <div
                      key={bed.bedNumber}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            bed.status === 'occupied'
                              ? 'bg-emerald-500'
                              : bed.status === 'maintenance'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Bed #{bed.bedNumber}
                        </span>
                        {bed.occupantName && (
                          <span className="text-slate-500 truncate max-w-[120px]">
                            {bed.occupantName}
                          </span>
                        )}
                      </div>

                      {bed.status === 'available' ? (
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setSelectedBedNumber(bed.bedNumber);
                            setRoomAssignModalOpen(true);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100"
                        >
                          + Assign
                        </button>
                      ) : bed.status === 'occupied' ? (
                        <button
                          onClick={() => vacateBed(room.roomNumber, bed.bedNumber)}
                          className="text-[10px] text-slate-400 hover:text-rose-500"
                          title="Vacate this bed"
                        >
                          Vacate
                        </button>
                      ) : (
                        <span className="text-[10px] text-amber-500 font-semibold">Locked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by student name, ID or room..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredStudents.length} Active Residents
            </span>
          </div>

          <div className="bg-white dark:bg-[#0e1626] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Resident</th>
                    <th className="py-3.5 px-4">Student ID</th>
                    <th className="py-3.5 px-4">Room & Block</th>
                    <th className="py-3.5 px-4">Course & Year</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudents.map((s) => (
                    <tr key={`${s.studentId}-${s.roomNumber}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                      <td className="py-3.5 px-4 font-mono">{s.studentId}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {s.roomNumber}
                        </span>{' '}
                        ({s.block} • Bed {s.bedNumber})
                      </td>
                      <td className="py-3.5 px-4">
                        {s.course} ({s.year})
                      </td>
                      <td className="py-3.5 px-4 font-mono">{s.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                          Active Resident
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE APPROVAL CENTER */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <PageHeader
            title="Leave & Outstation Authorizations"
            subtitle="Review pending student gate passes, verify destinations, and authorize digital QR codes"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{leave.id}</span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {leave.studentName} ({leave.roomNumber})
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      leave.status === 'Approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : leave.status === 'Rejected'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    <strong className="text-slate-400">Type:</strong> {leave.leaveType}
                  </p>
                  <p>
                    <strong className="text-slate-400">Destination:</strong> {leave.destination}
                  </p>
                  <p>
                    <strong className="text-slate-400">Dates:</strong> {leave.fromDate} → {leave.toDate}
                  </p>
                  <p>
                    <strong className="text-slate-400">Emergency:</strong> {leave.emergencyContact}
                  </p>
                </div>

                <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  &ldquo;{leave.reason}&rdquo;
                </p>

                {leave.wardenRemarks && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Warden Remarks: {leave.wardenRemarks}
                  </p>
                )}

                {leave.status === 'Pending' && (
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 justify-center"
                      onClick={() => {
                        setSelectedLeave(leave);
                      }}
                    >
                      Authorize Pass
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedLeave(leave);
                        handleLeaveDecision('Rejected');
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COMPLAINT DISPATCH & PRIORITY */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <PageHeader
            title="Hostel Complaints & Maintenance Dispatch"
            subtitle="Filter issues, review Smart Priority Recommendations, and dispatch technicians"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {complaints.map((complaint) => {
              const smartRec = calculateSmartPriority(complaint.title, complaint.category);
              return (
                <div
                  key={complaint.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{complaint.id}</span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {complaint.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Room {complaint.roomNumber} • Category: {complaint.category}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        complaint.status === 'Resolved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : complaint.status === 'In Progress'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {complaint.description}
                  </p>

                  {/* Smart Priority Recommendation Badge */}
                  <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Smart Priority Recommendation
                      </span>
                      <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase">
                        {smartRec.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{smartRec.rationale}</p>
                  </div>

                  {complaint.assignedTo ? (
                    <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <strong className="text-slate-400">Assigned Technician:</strong> {complaint.assignedTo} (
                      {complaint.technicianPhone})
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full justify-center"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      Dispatch Maintenance Worker
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST NOTICE */}
      <Modal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        title="Broadcast Hostel Announcement"
      >
        <form onSubmit={handleNoticeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notice Title
            </label>
            <input
              type="text"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="e.g., Scheduled Water Tank Maintenance - Block B"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={noticeCategory}
                onChange={(e) => setNoticeCategory(e.target.value as AnnouncementCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="General">General</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Mess">Mess / Dining</option>
                <option value="Emergency">Emergency Alert</option>
                <option value="Events">Campus Events</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={noticePriority}
                onChange={(e) => setNoticePriority(e.target.value as AnnouncementPriority)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="Normal">Normal</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent / Immediate Action</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notice Description
            </label>
            <textarea
              rows={4}
              value={noticeDesc}
              onChange={(e) => setNoticeDesc(e.target.value)}
              placeholder="Detailed instructions for residents..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinNotice"
              checked={noticePinned}
              onChange={(e) => setNoticePinned(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <label htmlFor="pinNotice" className="text-xs text-slate-600 dark:text-slate-400">
              Pin notice to top of student announcements
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setNoticeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ASSIGN TECHNICIAN */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Dispatch Maintenance Worker"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Assigning ticket: <strong>{selectedComplaint?.title}</strong> (Room {selectedComplaint?.roomNumber})
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assign Staff / Worker
            </label>
            <select
              value={assignedTechnician}
              onChange={(e) => setAssignedTechnician(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <option value="Rajesh Sharma (Senior Facilities & Electrical)">
                Rajesh Sharma (Senior Facilities & Electrical)
              </option>
              <option value="Campus Plumbing & Sanitation Squad">
                Campus Plumbing & Sanitation Squad
              </option>
              <option value="Network Infrastructure Team">
                Network Infrastructure Team
              </option>
              <option value="Rapid Civil Repair Unit">
                Rapid Civil Repair Unit
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Priority Classification
            </label>
            <select
              value={complaintPriorityOverride}
              onChange={(e) => setComplaintPriorityOverride(e.target.value as ComplaintPriority)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent Emergency</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setSelectedComplaint(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Confirm Dispatch
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ASSIGN BED */}
      <Modal
        isOpen={roomAssignModalOpen}
        onClose={() => setRoomAssignModalOpen(false)}
        title={`Allocate Bed #${selectedBedNumber} in Room ${selectedRoom?.roomNumber}`}
      >
        <form onSubmit={handleBedAssignSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              value={assignStudentName}
              onChange={(e) => setAssignStudentName(e.target.value)}
              placeholder="e.g. S. Siddharth"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={assignStudentId}
                onChange={(e) => setAssignStudentId(e.target.value)}
                placeholder="STU2026-0512"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={assignStudentYear}
                onChange={(e) => setAssignStudentYear(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Degree Course
            </label>
            <input
              type="text"
              value={assignStudentCourse}
              onChange={(e) => setAssignStudentCourse(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={assignStudentPhone}
              onChange={(e) => setAssignStudentPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setRoomAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Assign Bed
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: REVIEW LEAVE */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title="Authorize Student Outstation Leave"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <p>
              <strong>Student:</strong> {selectedLeave?.studentName} ({selectedLeave?.studentId})
            </p>
            <p>
              <strong>Room:</strong> {selectedLeave?.roomNumber}
            </p>
            <p>
              <strong>Leave Type:</strong> {selectedLeave?.leaveType}
            </p>
            <p>
              <strong>Destination:</strong> {selectedLeave?.destination}
            </p>
            <p>
              <strong>Duration:</strong> {selectedLeave?.fromDate} to {selectedLeave?.toDate}
            </p>
            <p>
              <strong>Reason:</strong> {selectedLeave?.reason}
            </p>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold">
              Emergency Contact: {selectedLeave?.emergencyContact}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Warden Remarks (Appears on Student Pass & Notification)
            </label>
            <input
              type="text"
              value={leaveRemarks}
              onChange={(e) => setLeaveRemarks(e.target.value)}
              placeholder="e.g. Parental verification confirmed by phone"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="danger" size="sm" onClick={() => handleLeaveDecision('Rejected')}>
              Reject Request
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleLeaveDecision('Approved')}>
              Approve & Issue Gate Pass
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
