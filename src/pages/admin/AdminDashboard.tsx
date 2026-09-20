import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  KeyRound,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  UtensilsCrossed,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();
  const { complaints, todayMeals } = useData();

  const handleSwitchToStudent = () => {
    switchRole('student');
    navigate('/dashboard');
  };

  // 1. Occupancy Data by Block
  const blockOccupancyData = [
    { block: 'Block A', total: 120, occupied: 114, vacancy: 6 },
    { block: 'Block B', total: 130, occupied: 121, vacancy: 9 },
    { block: 'Block C', total: 120, occupied: 106, vacancy: 14 },
    { block: 'Block D', total: 110, occupied: 102, vacancy: 8 },
  ];

  // 2. Complaint Trends & Turnaround (6-Month History)
  const complaintTrendsData = [
    { month: 'Apr', reported: 45, resolved: 42, avgHours: 3.1 },
    { month: 'May', reported: 38, resolved: 36, avgHours: 2.8 },
    { month: 'Jun', reported: 52, resolved: 50, avgHours: 2.5 },
    { month: 'Jul', reported: 41, resolved: 39, avgHours: 2.2 },
    { month: 'Aug', reported: 35, resolved: 34, avgHours: 2.1 },
    { month: 'Sep', reported: complaints.length + 20, resolved: 28, avgHours: 1.9 },
  ];

  // 3. Leave Request Patterns
  const leavePatternData = [
    { type: 'Home Visit', count: 68, color: '#6366f1' },
    { type: 'Family Event', count: 32, color: '#8b5cf6' },
    { type: 'Medical Leave', count: 14, color: '#f43f5e' },
    { type: 'Academic / Lab', count: 24, color: '#06b6d4' },
  ];

  // 4. Dining Satisfaction Scores
  const messRatingData = todayMeals.map((m) => ({
    name: m.name,
    rating: m.currentRating,
    totalReviews: m.totalRatings,
  }));

  // 5. Gate Throughput Hourly Peak Traffic
  const gateThroughputData = [
    { hour: '06:00', students: 12, visitors: 0 },
    { hour: '08:00', students: 84, visitors: 4 },
    { hour: '10:00', students: 38, visitors: 18 },
    { hour: '12:00', students: 56, visitors: 14 },
    { hour: '14:00', students: 42, visitors: 11 },
    { hour: '16:00', students: 95, visitors: 8 },
    { hour: '18:00', students: 110, visitors: 15 },
    { hour: '20:00', students: 78, visitors: 6 },
    { hour: '22:00', students: 25, visitors: 0 },
  ];

  const totalBeds = 480;
  const occupiedBeds = 443;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Directorate Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-black">Campus Administration Directorate</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
                HostelHub Intelligence
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1">
              Logged in as {user?.name || 'Prof. Meera Sen'} (Director of Student Welfare) • Campus Governance Suite
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSwitchToStudent}
          className="bg-white text-slate-900 hover:bg-slate-100"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Return to Student View
        </Button>
      </div>

      <PageHeader
        title="Institutional Hostel Telemetry & Analytics"
        subtitle="Multi-block occupancy matrices, maintenance resolution curves, and gate throughput metrics"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Campus Capacity</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {occupiedBeds} / {totalBeds}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">{occupancyRate}% Overall Occupancy</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Mean Resolution</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">1.9 Hours</p>
            <p className="text-[11px] text-emerald-600 font-semibold">↑ 95% SLA Compliance</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Residential Staff</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">38 On Duty</p>
            <p className="text-[11px] text-purple-600 font-semibold">Wardens, Guards & Techs</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Mess Satisfaction</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">4.7 ★</p>
            <p className="text-[11px] text-amber-600 font-semibold">Rotational Dining Quality</p>
          </div>
        </Card>
      </div>

      {/* Row 1 Analytics: Block Occupancy & Complaint Turnaround */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Block Occupancy Comparison */}
        <Card
          title="Residential Block Occupancy Comparison"
          subtitle="Total available capacity vs occupied resident beds"
          className="lg:col-span-7"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="block" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="occupied" name="Occupied Beds" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="vacancy" name="Vacant Beds" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Complaint Turnaround Speed Trend */}
        <Card
          title="Maintenance Turnaround & Resolution"
          subtitle="Reported tickets vs resolved jobs (Hours to close)"
          className="lg:col-span-5"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintTrendsData}>
                <defs>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved Tickets"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
                <Line
                  type="monotone"
                  dataKey="avgHours"
                  name="Avg Hours To Fix"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2 Analytics: Gate Throughput & Mess Dining Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gate Throughput Peak Hours */}
        <Card
          title="Gate 1 Hourly Turnstile Traffic Intensity"
          subtitle="Resident exits vs visitor check-ins across the day"
          className="lg:col-span-6"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gateThroughputData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  name="Student Turnstile Count"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  name="Visitor Passes Scanned"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leave Pattern Pie Chart */}
        <Card
          title="Outstation Pass Types"
          subtitle="Leave distribution by intent"
          className="lg:col-span-3"
        >
          <div className="h-72 w-full pt-2 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={175}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Pie
                  data={leavePatternData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {leavePatternData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] text-slate-400">
              {leavePatternData.map((d) => (
                <span key={d.type} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.type} ({d.count})
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Mess Rating Breakdown */}
        <Card
          title="Dining Quality Rating"
          subtitle="Student meal reviews"
          className="lg:col-span-3"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messRatingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 5]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={65} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rating" name="Rating" fill="#ec4899" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Block Governance Directory */}
      <Card title="Residential Block Executive Audit" subtitle="Supervising wardens and operational capacity">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Residential Block</th>
                <th className="py-3 px-4">Supervising Warden</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Occupancy</th>
                <th className="py-3 px-4">Facilities Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {[
                { block: 'Block A (Senior Wing)', warden: 'Dr. K. Ramanathan', cap: '114 / 120', status: 'Optimal' },
                { block: 'Block B (Tech & AI)', warden: 'Dr. K. Ramanathan', cap: '121 / 130', status: 'Optimal' },
                { block: 'Block C (Freshers)', warden: 'Prof. S. Natarajan', cap: '106 / 120', status: 'Sanitizing' },
                { block: 'Block D (Postgraduates)', warden: 'Dr. Meenakshi Sundaram', cap: '102 / 110', status: 'Optimal' },
              ].map((row) => (
                <tr key={row.block} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.block}</td>
                  <td className="py-3 px-4">{row.warden}</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {row.cap}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      92%+ Filled
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      ● {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
