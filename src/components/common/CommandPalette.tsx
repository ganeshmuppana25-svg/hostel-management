import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  BedDouble,
  Wrench,
  CalendarDays,
  UtensilsCrossed,
  Megaphone,
  UserCheck,
  Shield,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Building,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { complaints, leaves, announcements, blockRooms } = useData();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global keydown listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          const evt = new CustomEvent('open-command-palette');
          window.dispatchEvent(evt);
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Quick Action Navigation Items
  const quickActions = [
    {
      id: 'act-dashboard',
      category: 'Navigation',
      title: 'Student Resident Dashboard',
      subtitle: 'Overview, quick metrics & notifications',
      icon: GraduationCap,
      action: () => navigate('/dashboard'),
    },
    {
      id: 'act-room',
      category: 'Navigation',
      title: 'My Room & Bed Details',
      subtitle: 'View room layout, roommates & amenities',
      icon: BedDouble,
      action: () => navigate('/room'),
    },
    {
      id: 'act-maintenance',
      category: 'Navigation',
      title: 'Maintenance Issues & Tickets',
      subtitle: 'Report a fault, track live technician timeline',
      icon: Wrench,
      action: () => navigate('/maintenance'),
    },
    {
      id: 'act-leaves',
      category: 'Navigation',
      title: 'Leave & Outstation Passes',
      subtitle: 'Apply for home visit, get digital gate QR',
      icon: CalendarDays,
      action: () => navigate('/leaves'),
    },
    {
      id: 'act-mess',
      category: 'Navigation',
      title: 'Dining & Mess rotational menu',
      subtitle: 'Today meals, nutrition & dish voting',
      icon: UtensilsCrossed,
      action: () => navigate('/mess'),
    },
    {
      id: 'act-announcements',
      category: 'Navigation',
      title: 'Hostel Notices & Announcements',
      subtitle: 'Important circulars & warden advisories',
      icon: Megaphone,
      action: () => navigate('/announcements'),
    },
    // Role Switchers
    {
      id: 'role-warden',
      category: 'Role Switcher',
      title: 'Switch to Warden Command Center',
      subtitle: 'Approvals, room assignment & student directory',
      icon: UserCheck,
      action: () => {
        switchRole('warden');
        navigate('/warden');
      },
    },
    {
      id: 'role-security',
      category: 'Role Switcher',
      title: 'Switch to Security Post Command',
      subtitle: 'Gate check-in, visitor passes & movement log',
      icon: Shield,
      action: () => {
        switchRole('security');
        navigate('/security');
      },
    },
    {
      id: 'role-maint',
      category: 'Role Switcher',
      title: 'Switch to Maintenance Staff Portal',
      subtitle: 'Assigned repair tasks & resolution notes',
      icon: Briefcase,
      action: () => {
        switchRole('maintenance');
        navigate('/maintenance-team');
      },
    },
    {
      id: 'role-admin',
      category: 'Role Switcher',
      title: 'Switch to Administrator Analytics',
      subtitle: 'Hostel-wide analytics, metrics & comparisons',
      icon: Building,
      action: () => {
        switchRole('admin');
        navigate('/admin');
      },
    },
  ];

  // Dynamic search data
  const complaintItems = complaints.map((c) => ({
    id: `cmp-${c.id}`,
    category: 'Maintenance Tickets',
    title: `${c.id} — ${c.title}`,
    subtitle: `Room ${c.roomNumber} • Status: ${c.status} • Priority: ${c.priority}`,
    icon: Wrench,
    action: () => navigate('/maintenance'),
  }));

  const leaveItems = leaves.map((l) => ({
    id: `leave-${l.id}`,
    category: 'Leave Requests',
    title: `${l.id} — ${l.studentName} (${l.destination})`,
    subtitle: `${l.leaveType} • ${l.status} • Pass: ${l.passCode || 'N/A'}`,
    icon: CalendarDays,
    action: () => navigate('/leaves'),
  }));

  const roomItems = blockRooms.map((r) => ({
    id: `rm-${r.roomNumber}`,
    category: 'Hostel Rooms & Blocks',
    title: `Room ${r.roomNumber} (${r.block})`,
    subtitle: `${r.type} • Floor ${r.floor} • ${r.occupiedBeds}/${r.totalBeds} Beds Occupied`,
    icon: BedDouble,
    action: () => {
      navigate('/warden');
    },
  }));

  const noticeItems = announcements.map((a) => ({
    id: `ann-${a.id}`,
    category: 'Hostel Circulars',
    title: a.title,
    subtitle: `${a.category} • Priority: ${a.priority} • By ${a.author}`,
    icon: Megaphone,
    action: () => navigate('/announcements'),
  }));

  const allItems = [...quickActions, ...complaintItems, ...leaveItems, ...roomItems, ...noticeItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  const handleSelect = (index: number) => {
    const item = filteredItems[index];
    if (item) {
      item.action();
      onClose();
    }
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[80vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownList}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search students, rooms, maintenance tickets, outstation passes, or switch roles..."
            className="flex-1 bg-transparent text-sm sm:text-base outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
              <p className="text-sm font-semibold">No matches found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for B-204, Fan, Leave, or Warden.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 shadow-sm'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-semibold truncate">{item.title}</p>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 dark:bg-[#0b111e] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↵
              </kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
};
