'use client';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: '/problems', label: 'Problems', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { href: '/contests', label: 'Contests', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> },
  { href: '/certifications', label: 'Certify', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg> },
  { href: '/tracks', label: 'Tracks', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { href: '/dashboard/submissions', label: 'Submissions', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0f1115] text-[#f8fafc]">
        <aside className="w-60 bg-[#16181d] border-r border-[#2a2d35] flex flex-col shrink-0">
          <div className="py-2 px-5 border-b border-[#2a2d35] flex items-center">
            <img src="/logo-nav.png" alt="ScriptNex Logo" className="h-[60px] w-auto object-contain" />
          </div>
          <nav className="flex-1 py-4 flex flex-col gap-0.5">
            <div className="px-5 pb-2 text-[10px] uppercase tracking-wider text-[#475569] font-semibold">Menu</div>
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2 ${isActive ? 'text-[#00d285] bg-[rgba(0,210,133,0.08)] border-[#00d285] font-medium' : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.02] border-transparent'}`}>
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-[#2a2d35]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#1f2229] flex items-center justify-center font-bold text-[#00d285] text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-[#475569] truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.06)] rounded-md transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
