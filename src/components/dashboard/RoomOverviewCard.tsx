import React from 'react';
import { BedDouble, CheckCircle2, CircleDot, ArrowRightLeft, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';

interface RoomOverviewCardProps {
  onRequestRoomChange: () => void;
}

export const RoomOverviewCard: React.FC<RoomOverviewCardProps> = ({ onRequestRoomChange }) => {
  const { room } = useData();

  return (
    <Card className="relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner shrink-0">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Room {room.roomNumber}
              </h3>
              <Badge variant="primary" size="sm">
                {room.type}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {room.block} • {room.floor} • Wing B2
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRequestRoomChange}
          leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
        >
          Request Room Change
        </Button>
      </div>

      {/* Bed Layout Grid */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Bed Layout & Occupancy ({room.occupiedBeds}/{room.totalBeds} Beds Filled)
          </h4>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{' '}
            {room.totalBeds - room.occupiedBeds} Bed{room.totalBeds - room.occupiedBeds === 1 ? '' : 's'} Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {room.beds.map((bed) => {
            const isOccupied = bed.status === 'occupied';
            const isCurrentUser = bed.occupantName?.includes('Aravind');

            return (
              <div
                key={bed.bedNumber}
                className={`p-3.5 rounded-xl border transition-all duration-200 relative ${
                  isCurrentUser
                    ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-sm'
                    : isOccupied
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40'
                    : 'border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bed {bed.bedNumber}
                  </span>
                  {isOccupied ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
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

                <div className="mt-2">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isOccupied ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400 italic'
                    }`}
                  >
                    {bed.occupantName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isCurrentUser
                      ? 'You (STU2026-0142)'
                      : isOccupied
                      ? bed.studentId || 'Resident Scholar'
                      : 'Open for allocation'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Amenities Pills */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Amenities:
        </span>
        {room.amenities.map((amenity) => (
          <span
            key={amenity}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
          >
            {amenity}
          </span>
        ))}
      </div>
    </Card>
  );
};
