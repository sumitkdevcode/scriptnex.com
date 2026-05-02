'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ problems: 0, contests: 0, certs: 0 });

  useEffect(() => {
    // Fetch user stats (simplified)
    Promise.all([
      api.get<{ data: unknown[] }>('/problems').catch(() => ({ data: [] })),
    ]).then(() => {
      setStats({ problems: 0, contests: 0, certs: 0 });
    });
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Welcome back, {user?.name} 👋</h1>
        <p className="text-[#94a3b8] text-sm">Here&apos;s your coding journey at a glance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Problems Solved', value: stats.problems, icon: '⌨️', color: '#00d285' },
          { label: 'Current Streak', value: '0 days', icon: '🔥', color: '#f59e0b' },
          { label: 'Certifications', value: stats.certs, icon: '📜', color: '#a855f7' },
          { label: 'Contest Rating', value: '—', icon: '🏆', color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-5 relative overflow-hidden group hover:border-[rgba(0,210,133,0.15)] transition-colors">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-40" style={{ backgroundImage: `linear-gradient(to right, ${s.color}, transparent)` }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-semibold">{s.label}</span>
              <span className="text-lg">{s.icon}</span>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Solve a Problem', desc: 'Pick a challenge and start coding', href: '/problems', color: '#00d285' },
          { label: 'Join a Contest', desc: 'Compete with developers worldwide', href: '/contests', color: '#f59e0b' },
          { label: 'Get Certified', desc: 'Earn verified credentials', href: '/certifications', color: '#a855f7' },
        ].map(a => (
          <Link key={a.label} href={a.href} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-5 hover:border-[rgba(0,210,133,0.15)] transition-all group block">
            <h3 className="font-semibold mb-1 group-hover:text-[#00d285] transition-colors">{a.label}</h3>
            <p className="text-sm text-[#94a3b8]">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#16181d] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Activity</h2>
          <div className="h-40 flex items-center justify-center border border-dashed border-[#2a2d35] rounded-lg">
            <span className="text-[#475569] text-sm">Solve problems to see your activity heatmap</span>
          </div>
        </div>
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Recent Submissions</h2>
          <div className="h-40 flex items-center justify-center border border-dashed border-[#2a2d35] rounded-lg">
            <span className="text-[#475569] text-sm">No submissions yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
