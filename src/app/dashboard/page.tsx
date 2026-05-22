'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import DownloadButton from '@/components/certificate/DownloadButton';

interface UserStats {
  problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  total_easy: number;
  total_medium: number;
  total_hard: number;
  total_problems: number;
  current_streak: number;
  certificates_earned: number;
  acceptance_rate: number;
  submission_calendar: Record<string, number>;
}

/* ── Animated counter hook ── */
function useAnimatedCount(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = ref.current;
    const diff = target - start;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(start + diff * eased);
      setCount(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

/* ── Stagger-in wrapper ── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Feature card data ── */
const FEATURES = [
  {
    title: 'Practice Problems',
    desc: '500+ coding challenges across all difficulty levels',
    href: '/problems',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: '#00d285',
    gradient: 'from-[#00d285]/20 to-[#00d285]/5',
    tag: 'Core',
  },
  {
    title: 'Learning Tracks',
    desc: 'Structured learning paths from beginner to advanced',
    href: '/tracks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    color: '#3b82f6',
    gradient: 'from-[#3b82f6]/20 to-[#3b82f6]/5',
    tag: 'Learn',
  },
  {
    title: 'Certifications',
    desc: 'Earn verified coding certificates to boost your resume',
    href: '/certifications',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: '#a855f7',
    gradient: 'from-[#a855f7]/20 to-[#a855f7]/5',
    tag: 'Certify',
  },
  {
    title: 'Live Contests',
    desc: 'Compete in weekly programming competitions',
    href: '/contests',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    color: '#f59e0b',
    gradient: 'from-[#f59e0b]/20 to-[#f59e0b]/5',
    tag: 'Compete',
  },
  {
    title: 'Daily Challenge',
    desc: 'Solve one problem every day to build consistency',
    href: '/daily',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    color: '#ef4444',
    gradient: 'from-[#ef4444]/20 to-[#ef4444]/5',
    tag: 'Daily',
  },
  {
    title: 'Interview Prep',
    desc: 'Company-specific kits for FAANG & top tech interviews',
    href: '/interview-prep',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    color: '#ec4899',
    gradient: 'from-[#ec4899]/20 to-[#ec4899]/5',
    tag: 'Career',
  },
  {
    title: 'Coding Sheets',
    desc: 'Curated problem sets like Striver SDE, Blind 75 & more',
    href: '/sheets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    color: '#06b6d4',
    gradient: 'from-[#06b6d4]/20 to-[#06b6d4]/5',
    tag: 'Sheets',
  },
  {
    title: 'Code Playground',
    desc: 'Write, run & share code in 10+ languages instantly',
    href: '/playground',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    color: '#10b981',
    gradient: 'from-[#10b981]/20 to-[#10b981]/5',
    tag: 'Code',
  },
  {
    title: 'Discussions',
    desc: 'Ask questions, share solutions & learn from peers',
    href: '/discuss',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: '#8b5cf6',
    gradient: 'from-[#8b5cf6]/20 to-[#8b5cf6]/5',
    tag: 'Community',
  },
  {
    title: 'Leaderboard',
    desc: 'See how you rank against developers worldwide',
    href: '/leaderboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
    color: '#f97316',
    gradient: 'from-[#f97316]/20 to-[#f97316]/5',
    tag: 'Rank',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user?.username) {
      api.get<{ user: unknown; stats: UserStats }>(`/users/${user.username}`)
        .then(res => setStats(res.data.stats))
        .catch(() => {});
        
      api.get<{ certificates: any[] }>('/my-certificates', { force: true })
        .then(res => setCertificates(res.data.certificates))
        .catch(() => {});
    }
  }, [user?.username]);

  const totalSolved = stats?.problems_solved || 0;
  const easy = stats?.easy_solved || 0;
  const medium = stats?.medium_solved || 0;
  const hard = stats?.hard_solved || 0;
  const totalProblems = stats?.total_problems || 1;
  const totalEasy = stats?.total_easy || 0;
  const totalMedium = stats?.total_medium || 0;
  const totalHard = stats?.total_hard || 0;

  const animatedTotal = useAnimatedCount(totalSolved);
  const animatedStreak = useAnimatedCount(stats?.current_streak || 0, 800);
  const animatedCerts = useAnimatedCount(stats?.certificates_earned || 0, 800);
  const animatedRate = useAnimatedCount(stats?.acceptance_rate || 0, 1000);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const solvedFraction = totalProblems > 0 ? totalSolved / totalProblems : 0;
  const solvedOffset = circumference - solvedFraction * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-10 w-full flex flex-col gap-5">

      {/* ═══════════ Welcome Banner ═══════════ */}
      <FadeIn delay={0}>
        <div className="relative overflow-hidden rounded-xl border border-[#2a2d35] bg-gradient-to-br from-[#1a1c23] via-[#16181d] to-[#1a1c23] p-6 md:p-8">
          {/* Animated background orbs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#00d285]/[0.04] blur-[80px] animate-pulse" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#3b82f6]/[0.04] blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                Welcome back, <span className="bg-gradient-to-r from-[#00d285] to-[#00e691] bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'Developer'}</span> 👋
              </h1>
              <p className="text-sm text-[#ababab]">Keep pushing your limits. Every problem solved is a step forward.</p>
            </div>
            <Link href="/problems" className="shrink-0 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00d285] to-[#00a669] text-black text-sm font-bold hover:shadow-[0_0_24px_rgba(0,210,133,0.3)] hover:scale-[1.02] transition-all duration-300">
              Start Coding →
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* ═══════════ Stats Row ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Solved Problems Donut */}
        <FadeIn delay={100}>
          <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 flex items-center gap-5 hover:border-[#00d285]/20 transition-all duration-500 group">
            <div className="relative w-[100px] h-[100px] shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#2a2d35" strokeWidth="5" />
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="url(#donutGradient)" strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={mounted ? solvedOffset : circumference}
                  strokeLinecap="round"
                  className="transition-all duration-[1.5s] ease-out"
                />
                <defs>
                  <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d285" />
                    <stop offset="100%" stopColor="#00e691" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold leading-none">{animatedTotal}</span>
                <span className="text-[9px] text-[#ababab] mt-0.5">/{totalProblems}</span>
                <span className="text-[8px] text-[#ababab]">Solved</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                { label: 'Easy', solved: easy, total: totalEasy, color: '#00d285' },
                { label: 'Medium', solved: medium, total: totalMedium, color: '#f59e0b' },
                { label: 'Hard', solved: hard, total: totalHard, color: '#ef4444' },
              ].map(d => {
                const pct = d.total > 0 ? (d.solved / d.total) * 100 : 0;
                return (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold w-10" style={{ color: d.color }}>{d.label}</span>
                    <div className="flex-1 h-1.5 bg-[#2a2d35] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1.5s] ease-out"
                        style={{ width: mounted ? `${pct}%` : '0%', background: d.color }}
                      />
                    </div>
                    <span className="text-[10px] font-bold w-14 text-right">{d.solved}<span className="text-[#ababab] font-normal">/{d.total}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Badges / Certificates */}
        <FadeIn delay={200}>
          <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 flex flex-col hover:border-[#a855f7]/20 transition-all duration-500">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-[#ababab] font-semibold uppercase tracking-wider">Certificates</span>
              <Link href="/certifications" className="text-[#ababab] hover:text-white transition-colors hover:scale-110 duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-[#a855f7] to-[#c084fc] bg-clip-text text-transparent">{animatedCerts}</div>
            <div className="text-xs text-[#ababab] mb-3">certificates earned</div>
            <div className="flex-1 flex items-end">
              {(stats?.certificates_earned || 0) > 0 ? (
                <div className="flex gap-1">
                  {[...Array(Math.min(stats?.certificates_earned || 0, 5))].map((_, i) => (
                    <div key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: '2s' }}>🏅</div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-[#ababab]">Complete certifications to earn badges</span>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Streak & Quick Stats */}
        <FadeIn delay={300}>
          <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 flex flex-col gap-4 hover:border-[#f59e0b]/20 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5 flex items-center justify-center text-3xl">
                🔥
                {(stats?.current_streak || 0) > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f59e0b] text-[9px] font-bold text-black flex items-center justify-center animate-pulse">
                    {stats?.current_streak}
                  </div>
                )}
              </div>
              <div>
                <div className="text-3xl font-bold">{animatedStreak}</div>
                <div className="text-[10px] text-[#ababab] uppercase tracking-wider font-semibold">Day Streak</div>
              </div>
            </div>
            <div className="h-px bg-[#2a2d35]" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xl font-bold">{animatedRate}<span className="text-sm text-[#ababab]">%</span></div>
                <div className="text-[10px] text-[#ababab] uppercase tracking-wider font-semibold">Acceptance</div>
              </div>
              <div>
                <div className="text-xl font-bold">—</div>
                <div className="text-[10px] text-[#ababab] uppercase tracking-wider font-semibold">Contest Rating</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ═══════════ Explore All Features ═══════════ */}
      <FadeIn delay={400}>
        <div className="flex items-center gap-3 mb-1 mt-2">
          <h2 className="text-lg font-bold">Explore Platform</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#2a2d35] to-transparent" />
          <span className="text-[10px] text-[#ababab] uppercase tracking-widest font-semibold">{FEATURES.length} Features</span>
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {FEATURES.map((f, i) => (
          <FadeIn key={f.title} delay={450 + i * 60}>
            <Link
              href={f.href}
              className="group relative bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-4 flex flex-col gap-3 hover:border-transparent transition-all duration-500 overflow-hidden"
              style={{ ['--accent' as string]: f.color }}
            >
              {/* Animated gradient border on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${f.color}22, transparent 50%, ${f.color}11)`,
                }}
              />
              {/* Glow effect on hover */}
              <div
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[40px] pointer-events-none"
                style={{ background: f.color }}
              />

              <div className="relative z-10">
                {/* Tag */}
                <span
                  className="inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest mb-2 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: f.color, background: `${f.color}15` }}
                >
                  {f.tag}
                </span>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${f.color}15`, color: f.color, boxShadow: 'none' }}
                >
                  {f.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold mb-1 transition-colors duration-300 group-hover:text-white">
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-[#ababab] leading-relaxed line-clamp-2">
                  {f.desc}
                </p>

                {/* Arrow */}
                <div
                  className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: f.color }}
                >
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      {/* ═══════════ Certificates + Submissions ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-2">

        {/* Left: Certificates & Submissions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Certificates Section */}
          {certificates.length > 0 && (
            <FadeIn delay={500}>
              <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl overflow-hidden">
                <div className="flex border-b border-[#2a2d35] bg-[#16181d] px-5 py-3">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    My Certificates
                  </span>
                </div>
                <div className="p-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {certificates.map((cert) => {
                    const isPaid = cert.download_paid;
                    return (
                    <div key={cert.uuid} className="bg-[#16181d] border border-[#2a2d35] rounded-lg overflow-hidden flex flex-col group hover:border-[#a855f7]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.08)]">
                      {/* Mini Certificate Preview */}
                      <div className="relative aspect-[1.414] w-full bg-white overflow-hidden">
                        <img 
                          src="/certificate.png?v=2" 
                          alt="Template" 
                          className={`absolute inset-0 w-full h-full object-cover ${!isPaid ? 'blur-[6px]' : ''}`} 
                        />
                        <div className={`absolute inset-0 flex flex-col items-center justify-center p-[6%] text-center scale-[0.3] origin-center whitespace-nowrap ${!isPaid ? 'blur-[6px]' : ''}`}>
                          <div className="flex-1"></div>
                          <h1 className="text-4xl font-bold text-gray-800 font-serif mb-2 uppercase">{user?.name}</h1>
                          <p className="text-lg text-gray-600 mb-4">has completed</p>
                          <h2 className="text-3xl font-bold text-[#00d285]">{cert.certification?.title}</h2>
                          <div className="mt-auto"></div>
                        </div>
                        
                        {/* Lock Overlay for Unpaid Certificates */}
                        {!isPaid && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                            <div className="bg-[#1a1c23] p-3 rounded-full mb-2 shadow-2xl border border-white/20">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00d285]">PDF Locked</span>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>
                      
                      <div className="p-2.5 flex flex-col gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-semibold truncate leading-tight">{cert.certification?.title}</h4>
                          <p className="text-[9px] text-[#ababab]">Earned on {new Date(cert.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <DownloadButton 
                            cert={cert}
                            userName={user?.name || ''}
                            onSuccess={() => {
                              api.get<{ certificates: any[] }>('/my-certificates', { force: true })
                                .then(res => setCertificates(res.data.certificates))
                                .catch(() => {});
                            }}
                            className="flex-1 py-1.5 text-center bg-[#00d285] text-[#0a0a0a] text-[10px] font-bold rounded hover:bg-[#00b371] transition-colors"
                            label={cert.download_paid ? 'Download' : 'Unlock PDF'}
                          />
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Recent Submissions */}
          <FadeIn delay={550}>
            <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl overflow-hidden">
              <div className="flex border-b border-[#2a2d35] bg-[#16181d]">
                <button className="px-5 py-3 text-xs font-semibold text-white border-b-2 border-[#00d285] flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Recent AC
                </button>
                <button className="px-5 py-3 text-xs font-semibold text-[#ababab] hover:text-white transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  List
                </button>
                <button className="px-5 py-3 text-xs font-semibold text-[#ababab] hover:text-white transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Discuss
                </button>
                <div className="flex-1" />
                <Link href="/problems" className="px-4 py-3 text-[11px] text-[#ababab] hover:text-white transition-colors self-center">
                  View all submissions →
                </Link>
              </div>
              <div className="p-6 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3 opacity-40">📋</div>
                  <p className="text-sm text-[#ababab]">No recent submissions yet.</p>
                  <Link href="/problems" className="text-xs text-[#00d285] hover:underline mt-2 inline-block">Start solving →</Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right: Quick Actions */}
        <FadeIn delay={500}>
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ababab] mb-1">Quick Actions</h3>
            {[
              { label: 'Solve a Problem', desc: 'Pick a challenge and start coding', href: '/problems', emoji: '⌨️', color: '#00d285' },
              { label: 'Join a Contest', desc: 'Compete with developers worldwide', href: '/contests', emoji: '🏆', color: '#f59e0b' },
              { label: 'Get Certified', desc: 'Earn verified credentials', href: '/certifications', emoji: '📜', color: '#a855f7' },
              { label: 'Daily Challenge', desc: 'Keep your streak alive', href: '/daily', emoji: '🔥', color: '#ef4444' },
              ...(user?.role === 'admin' ? [{
                label: 'Manage Blog', desc: 'Create and manage blog posts', href: '/dashboard/blog', emoji: '📝', color: '#06b6d4',
              }] : []),
              { label: 'My Profile', desc: 'View your public profile', href: user?.username ? `/${user.username}` : '#', emoji: '👤', color: '#3b82f6' },
            ].map((action, i) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-4 hover:border-transparent transition-all duration-500 group block relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${action.color}15, transparent)` }}
                />
                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform duration-500 group-hover:scale-110"
                    style={{ background: `${action.color}15` }}
                  >
                    {action.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm transition-colors duration-300" style={{ color: 'inherit' }}>
                      <span className="group-hover:text-white">{action.label}</span>
                    </h4>
                    <p className="text-[11px] text-[#ababab] truncate">{action.desc}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-[#ababab] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
