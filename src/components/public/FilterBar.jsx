import React, { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

const DRIVE_TYPES = [
  'All Types', 'Weekly Drive', 'Special Event', 'Festival Drive',
  'Emergency Relief', 'School Meal', 'Elder Care',
];

export default function FilterBar({ onFilter }) {
  const [search,    setSearch]    = useState('');
  const [month,     setMonth]     = useState('');
  const [location,  setLocation]  = useState('');
  const [driveType, setDriveType] = useState('All Types');

  const months = [
    '', 'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  const handleChange = (updates) => {
    const state = { search, month, location, driveType, ...updates };
    onFilter(state);
    if ('search'    in updates) setSearch(updates.search);
    if ('month'     in updates) setMonth(updates.month);
    if ('location'  in updates) setLocation(updates.location);
    if ('driveType' in updates) setDriveType(updates.driveType);
  };

  const clearAll = () => {
    setSearch(''); setMonth(''); setLocation(''); setDriveType('All Types');
    onFilter({ search: '', month: '', location: '', driveType: 'All Types' });
  };

  const hasFilters = search || month || location || driveType !== 'All Types';

  return (
    <div className="bg-white rounded-2xl shadow-card border border-primary-50 p-4 sm:p-6">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
        <input
          id="blog-search"
          type="search"
          placeholder="Search drives by title, location, story…"
          value={search}
          onChange={e => handleChange({ search: e.target.value })}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-primary-100 bg-cream-50
                     font-body text-charcoal-800 placeholder-charcoal-400 focus:outline-none
                     focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
          aria-label="Search blog posts"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Month */}
        <div className="relative">
          <select
            id="filter-month"
            value={month}
            onChange={e => handleChange({ month: e.target.value })}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-primary-100
                       bg-cream-50 text-sm font-medium text-charcoal-700 focus:outline-none
                       focus:ring-2 focus:ring-primary-400 cursor-pointer"
            aria-label="Filter by month"
          >
            {months.map((m, i) => (
              <option key={i} value={i > 0 ? String(i) : ''}>{i === 0 ? 'All Months' : m}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
        </div>

        {/* Location */}
        <input
          id="filter-location"
          type="text"
          placeholder="Filter by location…"
          value={location}
          onChange={e => handleChange({ location: e.target.value })}
          className="pl-4 pr-4 py-2.5 rounded-xl border border-primary-100 bg-cream-50
                     text-sm font-medium text-charcoal-700 placeholder-charcoal-400 focus:outline-none
                     focus:ring-2 focus:ring-primary-400 min-w-[160px]"
          aria-label="Filter by location"
        />

        {/* Drive type chips */}
        <div className="flex flex-wrap gap-2">
          {DRIVE_TYPES.map(type => (
            <button
              key={type}
              id={`filter-type-${type.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => handleChange({ driveType: type })}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                driveType === type
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'border-primary-200 text-primary-600 bg-white hover:bg-primary-500 hover:text-white hover:border-primary-500'
              }`}
              aria-pressed={driveType === type}
            >
              {type}
            </button>
          ))}

        </div>

        {/* Clear all */}
        {hasFilters && (
          <button
            id="filter-clear-btn"
            onClick={clearAll}
            className="flex items-center gap-1 text-rose-500 text-sm font-medium
                       hover:text-rose-600 transition-colors ml-auto"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
