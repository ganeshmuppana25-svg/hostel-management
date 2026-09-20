import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble,
  Wrench,
  Utensils,
  Plus,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RoomOverviewCard } from '../components/dashboard/RoomOverviewCard';
import { MessTodayWidget } from '../components/dashboard/MessTodayWidget';
import { AttendanceChart } from '../components/dashboard/AttendanceChart';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { RequestMaintenanceModal } from '../components/modals/RequestMaintenanceModal';
import { ApplyLeaveModal } from '../components/modals/ApplyLeaveModal';
import { RequestVisitorModal } from '../components/modals/RequestVisitorModal';
import { RequestRoomChangeModal } from '../components/modals/RequestRoomChangeModal';
import { useData } from '../context/DataContext';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, room, complaints, todayMeals } = useData();

  // Modals state
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [visitorModalOpen, setVisitorModalOpen] = useState(false);
  const [roomChangeModalOpen, setRoomChangeModalOpen] = useState(false);

  // Compute stats
  const openComplaints = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'In Progress' || c.status === 'Assigned'
  ).length;

  const averageMessRating = (
    todayMeals.reduce((acc, m) => acc + m.currentRating, 0) / (todayMeals.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Good Morning, {profile?.name ? profile.name.split(' ')[0] : 'Resident'} 👋
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Active Resident
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening in your hostel today.
          </p>
        </div>

        {/* Header Action */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setMaintenanceModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Report Issue
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLeaveModalOpen(true)}
            leftIcon={<CalendarCheck className="w-4 h-4" />}
          >
            Apply Leave
          </Button>
        </div>
      </div>

      {/* KPI Cards Row with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Room */}
        <StatCard
          label="Room"
          value={room?.roomNumber || 'B-204'}
          subValue={`${room?.occupiedBeds ?? 3}/${room?.totalBeds ?? 4} Occupied`}
          icon={<BedDouble className="w-5 h-5" />}
          iconBgColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          trend={{ text: `${room?.block || 'Block B'} • ${room?.floor || '2nd Floor'}`, isPositive: true }}
          onClick={() => navigate('/room')}
        />

        {/* KPI 2: Attendance */}
        <StatCard
          label="Attendance"
          value={profile?.attendancePercentage ?? 92}
          numericValue={profile?.attendancePercentage ?? 92}
          suffix="%"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          trend={{ text: 'Curfew & Bio-compliant', isPositive: true }}
        />

        {/* KPI 3: Open Complaints */}
        <StatCard
          label="Open Complaints"
          value={openComplaints}
          numericValue={openComplaints}
          icon={<Wrench className="w-5 h-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          trend={{
            text: openComplaints > 0 ? `${openComplaints} In Progress` : 'All Clear',
            isPositive: openComplaints === 0,
          }}
          onClick={() => navigate('/maintenance')}
        />

        {/* KPI 4: Mess Rating */}
        <StatCard
          label="Mess Rating"
          value={averageMessRating}
          numericValue={parseFloat(averageMessRating)}
          decimals={1}
          suffix=" / 5"
          icon={<Utensils className="w-5 h-5" />}
          iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          trend={{ text: 'Dinner Rated Highest', isPositive: true }}
          onClick={() => navigate('/mess')}
        />
      </div>

      {/* Quick Actions Component */}
      <QuickActions
        onOpenMaintenanceModal={() => setMaintenanceModalOpen(true)}
        onOpenLeaveModal={() => setLeaveModalOpen(true)}
        onOpenVisitorModal={() => setVisitorModalOpen(true)}
      />

      {/* Room Overview Card */}
      <RoomOverviewCard onRequestRoomChange={() => setRoomChangeModalOpen(true)} />

      {/* Today's Mess Highlights */}
      <MessTodayWidget />

      {/* Grid: Attendance Chart & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AttendanceChart />
        </div>
        <div className="lg:col-span-5">
          <ActivityFeed />
        </div>
      </div>

      {/* Modals */}
      <RequestMaintenanceModal
        isOpen={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
      />
      <ApplyLeaveModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
      />
      <RequestVisitorModal
        isOpen={visitorModalOpen}
        onClose={() => setVisitorModalOpen(false)}
      />
      <RequestRoomChangeModal
        isOpen={roomChangeModalOpen}
        onClose={() => setRoomChangeModalOpen(false)}
      />
    </div>
  );
};
