'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

interface DailyChallengeData {
  id: number;
  date: string;
  completed: boolean;
  total_completions: number;
  problem: {
    id: number;
    title: string;
    slug: string;
    difficulty: string;
    description: string;
    category?: { name: string; slug: string };
  };
}

interface StreakData {
  current: number;
  longest: number;
  total: number;
  last_completed?: string;
}

interface LeaderEntry {
  user: { name: string; username: string; avatar?: string };
  current_streak: number;
  longest_streak: number;
  total_completed: number;
}

interface DailyClientProps {
  initialChallenge: DailyChallengeData | null;
  initialLeaders: LeaderEntry[];
}

export default function DailyClient({ initialChallenge, initialLeaders }: DailyClientProps) {
  const { user, isAuthenticated } = useAuth();
  const [challenge, setChallenge] = useState<DailyChallengeData | null>(initialChallenge);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [completions, setCompletions] = useState<string[]>([]);
  const [leaders, setLeaders] = useState<LeaderEntry[]>(initialLeaders);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function loadAuthData() {
      if (isAuthenticated) {
        try {
          const streakRes = await api.get<{ streak: StreakData; completions: string[] }>('/daily-challenge/streak');
          setStreak(streakRes.data.streak);
          setCompletions(streakRes.data.completions);
        } catch {
          // ignore
        }
      }
    }
    loadAuthData();
  }, [isAuthenticated]);

  const handleComplete = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      const res = await api.post<{ streak: StreakData }>('/daily-challenge/complete', {});
      setStreak(res.data.streak);
      setChallenge(prev => prev ? { ...prev, completed: true } : null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete';
      alert(msg);
    } finally {
      setCompleting(false);
    }
  };

  const diffColor: Record<string, string> = { easy: '#00d285', medium: '#f59e0b', hard: '#ef4444' };

  // Generate heatmap for last 365 days
  const today = new Date();
  const days = Array.from({ length: 365 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (364 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00d285]/10 text-[#00d285] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <span className="text-lg">🔥</span> Daily Challenge
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Problem of the Day
          </h1>
          <p className="text-[#ababab] text-lg max-w-xl mx-auto">
            Solve one problem every day. Build your streak. Become unstoppable.
          </p>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
          {[
            { label: 'Current Streak', value: streak?.current ?? 0, icon: '🔥' },
            { label: 'Longest Streak', value: streak?.longest ?? 0, icon: '🏆' },
            { label: 'Total Completed', value: streak?.total ?? 0, icon: '✅' },
          ].map((s) => (
            <div key={s.label} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[10px] text-[#ababab] uppercase tracking-wider font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Today's Challenge Card */}
        {challenge && (
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-8 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d285]/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ababab]">
                    {new Date(challenge.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                  <span style={{ color: diffColor[challenge.problem.difficulty] || '#00d285', backgroundColor: `${diffColor[challenge.problem.difficulty] || '#00d285'}15` }} className="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
                    {challenge.problem.difficulty}
                  </span>
                  {challenge.problem.category && (
                    <span className="text-xs text-[#ababab] bg-[#2a2d35] px-2 py-0.5 rounded-full">{challenge.problem.category.name}</span>
                  )}
                </div>
                <span className="text-xs text-[#ababab]">{challenge.total_completions} solved today</span>
              </div>

              <h2 className="text-2xl font-bold mb-3">{challenge.problem.title}</h2>
              <p className="text-[#ababab] text-sm mb-6 line-clamp-3">{challenge.problem.description}</p>

              <div className="flex items-center gap-3">
                {challenge.completed ? (
                  <div className="flex items-center gap-2 bg-[#00d285]/10 text-[#00d285] px-5 py-2.5 rounded-lg font-bold text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    Completed!
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/problems/${challenge.problem.slug}`}
                      className="px-5 py-2.5 bg-[#00d285] text-black font-bold rounded-lg hover:bg-[#00e691] transition-all text-sm"
                    >
                      Solve Challenge →
                    </Link>
                    {isAuthenticated && (
                      <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="px-5 py-2.5 bg-[#2a2d35] text-white font-bold rounded-lg hover:bg-[#3b3e46] transition-all text-sm disabled:opacity-50"
                      >
                        {completing ? 'Marking...' : 'Mark as Done'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Heatmap Calendar */}
        {isAuthenticated && (
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6 mb-10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📅</span> Your Activity
            </h3>
            <div className="overflow-x-auto">
              <div className="flex gap-[3px] flex-wrap" style={{ maxWidth: '100%' }}>
                {days.map((day) => {
                  const isCompleted = completions.includes(day);
                  const isToday = day === today.toISOString().split('T')[0];
                  return (
                    <div
                      key={day}
                      title={`${day}${isCompleted ? ' ✅' : ''}`}
                      className={`w-[12px] h-[12px] rounded-sm transition-colors ${
                        isCompleted ? 'bg-[#00d285]' : isToday ? 'bg-[#2a2d35] ring-1 ring-[#00d285]' : 'bg-[#1a1c23]'
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-[#ababab]">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-sm bg-[#1a1c23]" />
                <div className="w-[10px] h-[10px] rounded-sm bg-[#00d285]/30" />
                <div className="w-[10px] h-[10px] rounded-sm bg-[#00d285]/60" />
                <div className="w-[10px] h-[10px] rounded-sm bg-[#00d285]" />
                <span>More</span>
              </div>
            </div>
          </div>
        )}

        {/* Streak Leaderboard */}
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🏆</span> Streak Leaderboard
          </h3>
          {leaders.length === 0 ? (
            <p className="text-[#ababab] text-sm">No streaks yet. Be the first!</p>
          ) : (
            <div className="space-y-2">
              {leaders.slice(0, 20).map((entry, i) => (
                <Link key={entry.user.username} href={`/${entry.user.username}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1a1c23] transition-colors">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${i < 3 ? 'bg-[#00d285]/20 text-[#00d285]' : 'bg-[#2a2d35] text-[#ababab]'}`}>
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#2a2d35] flex items-center justify-center text-xs font-bold text-white">
                    {entry.user.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{entry.user.name}</div>
                    <div className="text-xs text-[#ababab]">@{entry.user.username}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#00d285]">🔥 {entry.current_streak} days</div>
                    <div className="text-[10px] text-[#ababab]">Best: {entry.longest_streak}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
