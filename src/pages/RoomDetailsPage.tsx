import React, { useState } from 'react';
import {
  BedDouble,
  Users,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  CircleDot,
  Phone,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { RequestRoomChangeModal } from '../components/modals/RequestRoomChangeModal';
import { useData } from '../context/DataContext';

export const RoomDetailsPage: React.FC = () => {
  const { room, profile } = useData();
  const [changeModalOpen, setChangeModalOpen] = useState(false);

  const inventoryItems = [
    { name: 'Study Desks & Ergonomic Chairs', count: 4, condition: 'Good' },
    { name: 'Wardrobe Closets with Digital Locks', count: 4, condition: 'Good' },
    { name: 'Ceiling Fans', count: 2, condition: '1 Needs Service (MH-1024)' },
    { name: 'Washroom Geyser (25L)', count: 1, condition: 'Operational' },
    { name: 'Wi-Fi 6 Access Node', count: 1, condition: 'Optimal' },
    { name: 'LED Tube Fixtures & Reading Lamps', count: 4, condition: 'Functional' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="My Room & Allocation"
        subtitle={`Detailed room specs, bed assignments, and roommate directory for Room ${room.roomNumber}`}
        badge={
          <Badge variant="primary" size="sm">
            {room.type}
          </Badge>
        }
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setChangeModalOpen(true)}
            leftIcon={<ArrowRightLeft className="w-4 h-4" />}
          >
            Request Room Change
          </Button>
        }
      />

      {/* Room Overview Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Room ID</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{room.roomNumber}</p>
            <p className="text-xs text-slate-500">{room.block}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Occupancy</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {room.occupiedBeds} / {room.totalBeds}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {room.totalBeds - room.occupiedBeds} Bed{room.totalBeds - room.occupiedBeds === 1 ? '' : 's'} Available
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Floor Level</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{room.floor}</p>
            <p className="text-xs text-slate-500">Wing B-East</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Your Bed</span>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {profile.bedNumber}
            </p>
            <p className="text-xs text-slate-500">Corner Window Facing</p>
          </div>
        </Card>
      </div>

      {/* Visual Bed Occupancy & Roommates Directory */}
      <Card>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Bed Layout & Roommate Directory
            </h3>
            <p className="text-xs text-slate-400">
              Verified resident occupants in Room {room.roomNumber}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Academic Year 2026-27
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {room.beds.map((bed) => {
            const isOccupied = bed.status === 'occupied';
            const isCurrentUser = bed.occupantName?.includes('Aravind');

            return (
              <div
                key={bed.bedNumber}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isCurrentUser
                    ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm'
                    : isOccupied
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40'
                    : 'border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Bed 0{bed.bedNumber}
                    </span>
                    {isOccupied ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                        Occupied
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CircleDot className="w-3 h-3 text-emerald-500" />
                        Available
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {bed.occupantName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isCurrentUser
                      ? 'You (STU2026-0142)'
                      : isOccupied
                      ? bed.studentId || 'Resident Scholar'
                      : 'Unallocated bed'}
                  </p>
                </div>

                {isOccupied && bed.phone ? (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-mono text-[11px]">{bed.phone}</span>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-dashed border-emerald-300/40 dark:border-emerald-800/40 text-[11px] text-emerald-600 dark:text-emerald-400 italic">
                    Ready for warden allocation
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Room Inventory and Regulations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inventory Checklist */}
        <div className="lg:col-span-7">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Room Inventory & Inspection Status
                </h3>
                <p className="text-xs text-slate-400">Hostel asset checklist provided on check-in</p>
              </div>
              <Badge variant="success" size="sm">
                Verified
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {inventoryItems.map((item) => (
                <div key={item.name} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                    <span className="text-slate-400">({item.count} units)</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      item.condition.includes('Service')
                        ? 'text-amber-500'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {item.condition}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Room Guidelines */}
        <div className="lg:col-span-5">
          <Card>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <FileText className="w-4 h-4 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hostel Guidelines
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>Curfew:</strong> Mandatory gate return before 10:30 PM on weekdays.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>Quiet Hours:</strong> 11:00 PM – 06:00 AM observed across all corridors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>Heavy Appliances:</strong> Induction plates, immersion rods, and electric heaters are prohibited.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>Visitors:</strong> Permitted in guest reception lobby with security pass.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <RequestRoomChangeModal
        isOpen={changeModalOpen}
        onClose={() => setChangeModalOpen(false)}
      />
    </div>
  );
};
