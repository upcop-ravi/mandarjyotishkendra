import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FilePlus, List, LogOut, ExternalLink, Leaf,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'tab-overview', icon: LayoutDashboard, label: 'Overview',     tab: 'overview' },
  { id: 'tab-create',   icon: FilePlus,        label: 'Create Post',  tab: 'create'   },
  { id: 'tab-manage',   icon: List,            label: 'Manage Posts', tab: 'manage'   },
];

const SIDEBAR_STYLE = {
  background: 'linear-gradient(180deg, #0B3D2A 0%, #1a5c3f 50%, #2D6A4F 100%)',
};

export default function AdminNav({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col text-white z-40"
      style={SIDEBAR_STYLE}
      aria-label="Admin navigation"
    >
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-heading font-bold text-sm leading-none">NourishHope</p>
            <p className="text-white/50 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center
                          font-semibold text-sm shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-white/90 truncate">{user?.email ?? 'Admin'}</p>
            <p className="text-xs text-white/40">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin sections">
        {NAV_ITEMS.map(({ id, icon: Icon, label, tab }) => (
          <button
            key={tab}
            id={id}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                        transition-all duration-200 ${
              activeTab === tab
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
            style={activeTab === tab ? {
              background: 'rgba(255,255,255,0.15)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            } : {}}
            onMouseEnter={e => {
              if (activeTab !== tab) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={e => {
              if (activeTab !== tab) e.currentTarget.style.background = '';
            }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
        {/* Back to site */}
        <Link
          to="/"
          id="admin-back-to-site"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60
                     hover:text-white transition-all duration-200"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = ''}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View Public Site
        </Link>

        {/* Logout */}
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-300
                     hover:text-rose-200 transition-all duration-200"
          aria-label="Logout"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = ''}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
