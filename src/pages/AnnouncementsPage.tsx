import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Pin,
  Search,
  Calendar,
  User,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/formatters';

export const AnnouncementsPage: React.FC = () => {
  const { announcements } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { label: string; value: string }[] = [
    { label: 'All Notices', value: 'all' },
    { label: 'Emergency', value: 'Emergency' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Mess Operations', value: 'Mess' },
    { label: 'Events & Cultural', value: 'Events' },
    { label: 'General', value: 'General' },
  ];

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [announcements, selectedCategory, searchQuery]);

  const pinnedItems = filteredAnnouncements.filter((a) => a.isPinned);
  const regularItems = filteredAnnouncements.filter((a) => !a.isPinned);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Hostel Notices & Announcements"
        subtitle="Official circulars, facility maintenance alerts, dining timings, and student committee announcements"
      />

      {/* Filter and Search Bar */}
      <Card padded={false} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars, keywords or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Pinned Announcements */}
      {pinnedItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned Official Advisories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedItems.map((ann) => (
              <Card
                key={ann.id}
                className="border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-[#131b2b] dark:to-[#131b2b]"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white flex items-center gap-1">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                    <Badge
                      variant={
                        ann.priority === 'Urgent'
                          ? 'danger'
                          : ann.priority === 'High'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    >
                      {ann.priority} Priority
                    </Badge>
                    <Badge variant="primary" size="sm">
                      {ann.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {formatDate(ann.date)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {ann.description}
                </p>

                <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    {ann.author}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Hostel Administration
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-4">
        {pinnedItems.length > 0 && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
            Recent Circulars
          </h4>
        )}

        {regularItems.length > 0 ? (
          regularItems.map((ann) => {
            const isEmergency = ann.category === 'Emergency' || ann.priority === 'Urgent';
            return (
              <Card
                key={ann.id}
                hoverEffect
                className={
                  isEmergency
                    ? 'border-rose-300/80 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                    : ''
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isEmergency && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Urgent Advisory
                      </span>
                    )}
                    <Badge
                      variant={
                        ann.priority === 'Urgent'
                          ? 'danger'
                          : ann.priority === 'High'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    >
                      {ann.priority} Priority
                    </Badge>
                    <Badge variant={isEmergency ? 'danger' : 'primary'} size="sm">
                      {ann.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(ann.date)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {ann.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    {ann.author}
                  </span>
                  <span className="text-[11px] text-slate-400">Office of the Chief Warden</span>
                </div>
              </Card>
            );
          })
        ) : pinnedItems.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="w-7 h-7" />}
            title="No announcements found"
            description="There are currently no active circulars matching your search or category filter."
          />
        ) : null}
      </div>
    </div>
  );
};
