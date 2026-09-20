import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '../common/Card';
import { ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AttendanceChart: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const data = [
    { week: 'W1 (Aug)', present: 7, leaves: 0 },
    { week: 'W2 (Aug)', present: 6, leaves: 1 },
    { week: 'W3 (Aug)', present: 7, leaves: 0 },
    { week: 'W4 (Aug)', present: 7, leaves: 0 },
    { week: 'W1 (Sep)', present: 5, leaves: 2 },
    { week: 'W2 (Sep)', present: 7, leaves: 0 },
    { week: 'W3 (Sep)', present: 6, leaves: 0 },
  ];

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Biometric Attendance Trends
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              92% Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hostel curfew & morning roll-call logs
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Present (Days)
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Approved Leave
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#23324d' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="week"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 7]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#182234' : '#ffffff',
                borderColor: isDark ? '#2d3f60' : '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: isDark ? '#ffffff' : '#0f172a',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="present" name="Days Present" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="leaves" name="Approved Outstation" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Warden Attendance Threshold (&gt;85%) Satisfied
        </span>
        <span>Semester 5 • 2026</span>
      </div>
    </Card>
  );
};
