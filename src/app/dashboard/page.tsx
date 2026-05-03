'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface UserStats {
  problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  current_streak: number;
  certificates_earned: number;
  acceptance_rate: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user?.username) {
      api.get<{ user: unknown; stats: UserStats }>(`/users/${user.username}`)
        .then(res => setStats(res.data.stats))
        .catch(() => {});
    }
  }, [user?.username]);

  const totalSolved = stats?.problems_solved || 0;
  const easy = stats?.easy_solved || 0;
  const medium = stats?.medium_solved || 0;
  const hard = stats?.hard_solved || 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const solvedFraction = totalSolved / 3920;
  const solvedOffset = circumference - solvedFraction * circumference;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 w-full">

      {/* Top row: Solved + Calendar + Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Solved Problems Donut */}
        <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-6 flex items-center gap-6">
          <div className="relative w-[100px] h-[100px] shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#2a2d35" strokeWidth="5" />
              <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#00d285" strokeWidth="5"
                strokeDasharray={circumference} strokeDashoffset={solvedOffset} strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold leading-none">{totalSolved}</span>
              <span className="text-[10px] text-[#64748b] mt-0.5">/{3920}</span>
              <span className="text-[9px] text-[#64748b]">Solved</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex justify-between items-center bg-[#16181d] rounded-lg px-3 py-2 border border-[#2a2d35]">
              <span className="text-[11px] font-semibold text-[#00d285]">Easy</span>
              <span className="text-xs font-bold">{easy}<span className="text-[#64748b] font-normal text-[10px]"> /941</span></span>
            </div>
            <div className="flex justify-between items-center bg-[#16181d] rounded-lg px-3 py-2 border border-[#2a2d35]">
              <span className="text-[11px] font-semibold text-[#f59e0b]">Med.</span>
              <span className="text-xs font-bold">{medium}<span className="text-[#64748b] font-normal text-[10px]"> /2050</span></span>
            </div>
            <div className="flex justify-between items-center bg-[#16181d] rounded-lg px-3 py-2 border border-[#2a2d35]">
              <span className="text-[11px] font-semibold text-[#ef4444]">Hard</span>
              <span className="text-xs font-bold">{hard}<span className="text-[#64748b] font-normal text-[10px]"> /929</span></span>
            </div>
          </div>
        </div>

        {/* Badges / Certificates */}
        <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-[#94a3b8] font-semibold">Badges</span>
            <Link href="/certifications" className="text-[#64748b] hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="text-3xl font-bold mb-2">{stats?.certificates_earned || 0}</div>
          <div className="flex-1 flex items-end">
            {(stats?.certificates_earned || 0) > 0 ? (
              <div className="text-4xl">🏅</div>
            ) : (
              <span className="text-xs text-[#475569]">Earn certificates to collect badges</span>
            )}
          </div>
        </div>

        {/* Streak & Quick Stats */}
        <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center text-2xl">🔥</div>
            <div>
              <div className="text-2xl font-bold">{stats?.current_streak || 0}</div>
              <div className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">Day Streak</div>
            </div>
          </div>
          <div className="h-px bg-[#2a2d35]" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-lg font-bold">{stats?.acceptance_rate || 0}%</div>
              <div className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">Acceptance</div>
            </div>
            <div>
              <div className="text-lg font-bold">—</div>
              <div className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">Contest Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 mb-6">
        <div className="flex flex-wrap justify-between text-xs text-[#94a3b8] mb-4 gap-2">
          <span><strong className="text-white">{totalSolved} submissions</strong> in the past one year</span>
          <div className="flex gap-4">
            <span>Total active days: <strong className="text-white">{stats?.current_streak || 0}</strong></span>
            <span>Max streak: <strong className="text-white">{stats?.current_streak || 0}</strong></span>
          </div>
        </div>
        <div className="flex gap-[3px] overflow-x-auto pb-2">
          {Array.from({ length: 52 }).map((_, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, di) => {
                const active = totalSolved > 0 && Math.random() > 0.85;
                const intensity = active ? (Math.random() > 0.5 ? 'bg-[#00d285]' : 'bg-[#00d285]/50') : 'bg-[#1f2229]';
                return <div key={di} className={`w-[11px] h-[11px] rounded-[2px] ${intensity}`} />;
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-3 justify-end text-[10px] text-[#64748b]">
          <span>Less</span>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#1f2229]" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#00d285]/30" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#00d285]/50" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#00d285]/80" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#00d285]" />
          <span>More</span>
        </div>
      </div>

      {/* Bottom row: Recent + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-[#1a1c23] border border-[#2a2d35] rounded-xl overflow-hidden">
          <div className="flex border-b border-[#2a2d35] bg-[#16181d]">
            <button className="px-5 py-3 text-xs font-semibold text-white border-b-2 border-[#00d285] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Recent AC
            </button>
            <button className="px-5 py-3 text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              List
            </button>
            <button className="px-5 py-3 text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Discuss
            </button>
            <div className="flex-1" />
            <Link href="/problems" className="px-4 py-3 text-[11px] text-[#64748b] hover:text-white transition-colors self-center">
              View all submissions →
            </Link>
          </div>
          <div className="p-6 min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3 opacity-40">📋</div>
              <p className="text-sm text-[#475569]">No recent submissions yet.</p>
              <Link href="/problems" className="text-xs text-[#00d285] hover:underline mt-2 inline-block">Start solving →</Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/problems" className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 hover:border-[#00d285]/20 transition-all group block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#00d285]/10 flex items-center justify-center text-lg">⌨️</div>
              <h3 className="font-semibold text-sm group-hover:text-[#00d285] transition-colors">Solve a Problem</h3>
            </div>
            <p className="text-xs text-[#94a3b8] pl-12">Pick a challenge and start coding</p>
          </Link>
          <Link href="/contests" className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 hover:border-[#f59e0b]/20 transition-all group block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center text-lg">🏆</div>
              <h3 className="font-semibold text-sm group-hover:text-[#f59e0b] transition-colors">Join a Contest</h3>
            </div>
            <p className="text-xs text-[#94a3b8] pl-12">Compete with developers worldwide</p>
          </Link>
          <Link href="/certifications" className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 hover:border-[#a855f7]/20 transition-all group block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#a855f7]/10 flex items-center justify-center text-lg">📜</div>
              <h3 className="font-semibold text-sm group-hover:text-[#a855f7] transition-colors">Get Certified</h3>
            </div>
            <p className="text-xs text-[#94a3b8] pl-12">Earn verified credentials</p>
          </Link>
          <Link href={user?.username ? `/profile/${user.username}` : '#'} className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 hover:border-[#3b82f6]/20 transition-all group block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center text-lg">👤</div>
              <h3 className="font-semibold text-sm group-hover:text-[#3b82f6] transition-colors">My Profile</h3>
            </div>
            <p className="text-xs text-[#94a3b8] pl-12">View your public profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
