import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Shield,
  QrCode,
  ArrowRight,
  LogIn,
  LogOut,
  Search,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { VisitorRequest } from '../../types';

export const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();
  const {
    leaves,
    visitors,
    gateLogs,
    checkInVisitor,
    checkOutVisitor,
    recordStudentExit,
    recordStudentEntry,
  } = useData();
  const { showToast } = useToast();

  const [scanCode, setScanCode] = useState('');
  const [selectedPass, setSelectedPass] = useState<VisitorRequest | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') as 'visitors' | 'students' | 'timeline' | null;
  const activeTab = (currentTab && ['visitors', 'students', 'timeline'].includes(currentTab))
    ? currentTab
    : 'visitors';

  const setActiveTab = (tab: 'visitors' | 'students' | 'timeline') => {
    setSearchParams(tab === 'visitors' ? {} : { tab });
  };

  // KPI calculations
  const approvedLeaves = leaves.filter((l) => l.status === 'Approved');
  const visitorsToday = visitors.length;
  const currentlyInsideVisitors = visitors.filter((v) => v.status === 'Inside').length;
  const expectedVisitors = visitors.filter((v) => v.status === 'Approved').length;
  const studentExits = gateLogs.filter((g) => g.type === 'student_exit').length;
  const studentEntries = gateLogs.filter((g) => g.type === 'student_entry').length;

  const handleSimulatedScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    const trimmed = scanCode.trim().toUpperCase();

    // Check visitor pass
    const matchedVis = visitors.find((v) => v.passCode.toUpperCase() === trimmed || v.id.toUpperCase() === trimmed);
    if (matchedVis) {
      setSelectedPass(matchedVis);
      showToast(`Visitor pass ${matchedVis.passCode} verified for ${matchedVis.visitorName}.`, 'success', 'Pass Validated');
      setScanCode('');
      return;
    }

    // Check student outstation pass
    const matchedLeave = leaves.find((l) => l.passCode?.toUpperCase() === trimmed || l.id.toUpperCase() === trimmed);
    if (matchedLeave) {
      showToast(`Outstation pass ${matchedLeave.passCode} verified for ${matchedLeave.studentName}.`, 'info', 'Outstation Authorized');
      setScanCode('');
      return;
    }

    showToast(`Pass Code ${trimmed} scanned. Clearance logged.`, 'info', 'Scanner Result');
    setScanCode('');
  };

  const handleCheckIn = (v: VisitorRequest) => {
    checkInVisitor(v.id);
    showToast(`Visitor ${v.visitorName} checked in. Pass active.`, 'success', 'Gate Check-In');
  };

  const handleCheckOut = (v: VisitorRequest) => {
    checkOutVisitor(v.id);
    showToast(`Visitor ${v.visitorName} checked out. Pass closed.`, 'info', 'Gate Check-Out');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-black">Campus Security Command Center</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
                Gate Terminal 01
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1">
              Logged in as {user?.name || 'Officer S. Verma'} (Chief Security Supervisor) • Main Gate & Turnstile Post
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
        title="Gate Security & Entry Telemetry"
        subtitle="Digital QR pass scanner, in/out turnstile logging, and visitor pre-authorizations"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Visitors Today</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{visitorsToday}</p>
          <span className="text-[10px] text-slate-400">Total requests</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Currently Inside</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {currentlyInsideVisitors}
          </p>
          <span className="text-[10px] text-indigo-500 font-bold">● Active Guests</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Expected</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{expectedVisitors}</p>
          <span className="text-[10px] text-amber-500">Pass approved</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Student Exits</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{studentExits}</p>
          <span className="text-[10px] text-slate-400">Outstation/Day</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Student Entries</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{studentEntries}</p>
          <span className="text-[10px] text-emerald-500">Biometric logged</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Security Alerts</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0</p>
          <span className="text-[10px] text-emerald-500 font-bold">● Normal Status</span>
        </Card>
      </div>

      {/* Simulated Scanner Form */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Digital QR Pass Scanner Simulator
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Gate 1 Terminal Active
          </span>
        </div>

        <form onSubmit={handleSimulatedScan} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              placeholder="Scan or enter Pass Code (e.g. VP-9102, VP-4821, LV-2026-001)..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <Button variant="primary" size="sm" type="submit" leftIcon={<QrCode className="w-4 h-4" />}>
            Verify Code
          </Button>
        </form>
      </Card>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'visitors', label: 'Visitor Pass Management', count: visitors.length },
          { id: 'students', label: 'Student Outstation Movement', count: approvedLeaves.length },
          { id: 'timeline', label: 'Live Gate Movement Log', count: gateLogs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#0e1626] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: VISITOR MANAGEMENT */}
      {activeTab === 'visitors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visitors.map((vis) => {
            const isInside = vis.status === 'Inside';
            const isCompleted = vis.status === 'Completed';

            return (
              <div
                key={vis.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {vis.passCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isInside
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                          : isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {vis.status}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {vis.visitorName}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {vis.relation} • Visiting: <strong className="text-slate-700 dark:text-slate-200">{vis.studentName}</strong> (Room {vis.roomNumber})
                  </p>

                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-1">
                    <p>
                      <strong>Date & Time:</strong> {vis.visitDate} @ {vis.visitTime}
                    </p>
                    <p>
                      <strong>Purpose:</strong> {vis.purpose}
                    </p>
                    {vis.phone && (
                      <p className="font-mono">
                        <strong>Phone:</strong> {vis.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 justify-center"
                    onClick={() => setSelectedPass(vis)}
                    leftIcon={<QrCode className="w-3.5 h-3.5" />}
                  >
                    View Pass
                  </Button>

                  {!isCompleted && !isInside && (
                    <Button size="sm" variant="primary" onClick={() => handleCheckIn(vis)}>
                      Check-In
                    </Button>
                  )}

                  {isInside && (
                    <Button size="sm" variant="danger" onClick={() => handleCheckOut(vis)}>
                      Check-Out
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STUDENT OUTSTATION MOVEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {approvedLeaves.map((leave) => (
              <div
                key={leave.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-500">
                      Pass: {leave.passCode || 'VERIFIED'}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {leave.studentName} ({leave.roomNumber})
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                    Warden Approved
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    <strong>Destination:</strong> {leave.destination} ({leave.leaveType})
                  </p>
                  <p>
                    <strong>Valid Dates:</strong> {leave.fromDate} to {leave.toDate}
                  </p>
                  <p>
                    <strong>Emergency Guardian:</strong> {leave.emergencyContact}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 justify-center"
                    onClick={() => {
                      recordStudentExit(leave.studentId, leave.studentName, leave.roomNumber, leave.passCode);
                      showToast(`Recorded exit for ${leave.studentName}. Departure logged.`, 'info', 'Turnstile Exit');
                    }}
                    leftIcon={<LogOut className="w-3.5 h-3.5" />}
                  >
                    Record Exit
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      recordStudentEntry(leave.studentId, leave.studentName, leave.roomNumber);
                      showToast(`Recorded entry for ${leave.studentName}. Biometric return verified.`, 'success', 'Turnstile Entry');
                    }}
                    leftIcon={<LogIn className="w-3.5 h-3.5" />}
                  >
                    Record Return
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE GATE TIMELINE */}
      {activeTab === 'timeline' && (
        <Card title="Chronological Turnstile Movement Log" subtitle="Gate 1 biometric scanner and QR pass records">
          <div className="space-y-3">
            {gateLogs.map((log) => {
              const isExit = log.type === 'student_exit' || log.type === 'visitor_exit';
              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                        isExit ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                      }`}
                    >
                      {isExit ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {log.personName} ({log.identifier})
                      </p>
                      <p className="text-slate-400 text-[11px]">{log.remarks}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className="text-[10px] text-slate-400">{log.guardName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* VISITOR PASS MODAL WITH DEMO QR VISUAL */}
      <Modal
        isOpen={!!selectedPass}
        onClose={() => setSelectedPass(null)}
        title="Simulated Digital Visitor Gate Pass"
      >
        <div className="space-y-4 text-center">
          {/* Simulated QR Code Visual Frame */}
          <div className="w-44 h-44 mx-auto p-3 rounded-3xl bg-white border-4 border-indigo-600 shadow-xl flex flex-col items-center justify-center">
            {/* SVG simulated QR pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              <rect x="10" y="10" width="25" height="25" fill="black" />
              <rect x="15" y="15" width="15" height="15" fill="white" />
              <rect x="18" y="18" width="9" height="9" fill="black" />
              <rect x="65" y="10" width="25" height="25" fill="black" />
              <rect x="70" y="15" width="15" height="15" fill="white" />
              <rect x="73" y="18" width="9" height="9" fill="black" />
              <rect x="10" y="65" width="25" height="25" fill="black" />
              <rect x="15" y="70" width="15" height="15" fill="white" />
              <rect x="18" y="73" width="9" height="9" fill="black" />
              <rect x="45" y="15" width="10" height="10" fill="black" />
              <rect x="45" y="35" width="10" height="10" fill="black" />
              <rect x="45" y="55" width="10" height="10" fill="black" />
              <rect x="45" y="75" width="10" height="10" fill="black" />
              <rect x="65" y="45" width="10" height="10" fill="black" />
              <rect x="75" y="65" width="15" height="10" fill="black" />
            </svg>
          </div>

          <div>
            <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400">
              {selectedPass?.passCode}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {selectedPass?.visitorName}
            </h3>
            <p className="text-xs text-slate-400">
              {selectedPass?.relation} to student {selectedPass?.studentName} (Room {selectedPass?.roomNumber})
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-1">
            <p>
              <strong>Scheduled Date:</strong> {selectedPass?.visitDate}
            </p>
            <p>
              <strong>Slot Window:</strong> {selectedPass?.visitTime}
            </p>
            <p>
              <strong>Purpose:</strong> {selectedPass?.purpose}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedPass?.status}</span>
            </p>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            Simulated demonstration pass with digital QR verification visual.
          </p>

          <div className="pt-2">
            <Button variant="primary" size="sm" className="w-full justify-center" onClick={() => setSelectedPass(null)}>
              Close Pass
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
