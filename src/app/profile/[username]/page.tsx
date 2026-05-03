'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import ActivityGraph from '@/components/profile/ActivityGraph';

interface PublicProfile {
  id: number; name: string; username: string; avatar: string | null;
  bio: string | null; github_url: string | null; linkedin_url: string | null;
  created_at: string;
}

interface UserStats {
  problems_solved: number; acceptance_rate: number;
  easy_solved: number; medium_solved: number; hard_solved: number;
  current_streak: number; certificates_earned: number;
  submission_calendar: Record<string, number>;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ user: PublicProfile; stats: UserStats }>(`/users/${username}`)
      .then(res => { setProfile(res.data.user); setStats(res.data.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]"><Navbar />
      <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" /></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]"><Navbar />
      <div className="flex flex-col items-center py-32 gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-[#94a3b8]">@{username} doesn&apos;t exist.</p>
      </div><Footer />
    </div>
  );

  const isOwn = currentUser?.username === username;
  const totalSolved = stats?.problems_solved || 0;
  const easy = stats?.easy_solved || 0;
  const medium = stats?.medium_solved || 0;
  const hard = stats?.hard_solved || 0;
  const totalProblems = 3920; // Hardcoded max like in screenshot

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const easyOffset = circumference - (easy / totalProblems) * circumference;
  const mediumOffset = circumference - (medium / totalProblems) * circumference;
  const hardOffset = circumference - (hard / totalProblems) * circumference;

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-0 pb-6 flex flex-col md:flex-row gap-4">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-4">
          
          {/* Main Info Card */}
          <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5">
            <div className="flex gap-4 items-center mb-4">
              {profile.avatar ? (
                <div
                  className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0 border border-[#2a2d35]"
                  style={{ backgroundImage: `url(${profile.avatar})` }}
                  aria-hidden="true"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00d285] to-[#00a669] flex items-center justify-center text-2xl font-bold text-black shrink-0">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold truncate">{profile.name}</h1>
                <p className="text-xs text-[#94a3b8]">@{profile.username}</p>
              </div>
            </div>
            
            {profile.bio && <p className="text-xs text-[#cbd5e1] mb-4 leading-relaxed">{profile.bio}</p>}
            
            {isOwn && (
              <Link href="/dashboard/settings" className="block w-full text-center py-2 bg-[#00d285]/10 text-[#00d285] hover:bg-[#00d285]/20 rounded-lg text-xs font-semibold transition-colors mb-4">
                Edit Profile
              </Link>
            )}

            <div className="flex flex-col gap-2 text-xs text-[#94a3b8]">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>Member since {new Date(profile.created_at).getFullYear()}</span>
              </div>
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors truncate">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors truncate">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-4">
            <h2 className="text-xs font-semibold text-[#f8fafc] mb-3">Community Stats</h2>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <span className="text-blue-400">👁</span> Views
                </div>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <span className="text-[#00d285]">✓</span> Solution
                </div>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <span className="text-[#00d285]">💬</span> Discuss
                </div>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <span className="text-yellow-500">⭐</span> Reputation
                </div>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Main Area */}
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Solved Problems Chart Widget */}
            <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 flex items-center justify-between">
              <div className="relative w-[110px] h-[110px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#2a2d35" strokeWidth="4" />
                  {/* Hard */}
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={hardOffset} strokeLinecap="round" />
                  {/* Medium */}
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={mediumOffset} strokeLinecap="round" />
                  {/* Easy */}
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#00d285" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={easyOffset} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-bold text-[#f8fafc] leading-none">{totalSolved}</div>
                  <div className="text-[10px] text-[#64748b] mt-1">Solved</div>
                </div>
              </div>
              
              <div className="flex-1 ml-6 flex flex-col gap-3">
                <div className="bg-[#16181d] rounded-lg p-2 flex justify-between items-center border border-[#2a2d35]">
                  <div className="text-[11px] text-[#00d285] font-semibold">Easy</div>
                  <div className="text-xs font-bold">{easy}<span className="text-[#64748b] text-[10px] font-normal"> / 941</span></div>
                </div>
                <div className="bg-[#16181d] rounded-lg p-2 flex justify-between items-center border border-[#2a2d35]">
                  <div className="text-[11px] text-[#f59e0b] font-semibold">Med.</div>
                  <div className="text-xs font-bold">{medium}<span className="text-[#64748b] text-[10px] font-normal"> / 2050</span></div>
                </div>
                <div className="bg-[#16181d] rounded-lg p-2 flex justify-between items-center border border-[#2a2d35]">
                  <div className="text-[11px] text-[#ef4444] font-semibold">Hard</div>
                  <div className="text-xs font-bold">{hard}<span className="text-[#64748b] text-[10px] font-normal"> / 929</span></div>
                </div>
              </div>
            </div>

            {/* Badges Widget */}
            <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 relative">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-[#94a3b8] font-semibold">Certificates</div>
                <Link href={`/profile/${username}/badges`} className="text-[#64748b] hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
              <div className="text-2xl font-bold mb-4">{stats?.certificates_earned || 0}</div>
              {stats?.certificates_earned ? (
                <div className="absolute bottom-5 right-5 text-4xl opacity-80">📜</div>
              ) : (
                <div className="text-xs text-[#64748b] absolute bottom-5 left-5">No certificates yet</div>
              )}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5">
            <div className="flex justify-between text-xs text-[#94a3b8] mb-4">
              <span>
                <strong className="text-white">
                  {Object.values(stats?.submission_calendar || {}).reduce((a, b) => a + b, 0)} submissions
                </strong> in the past one year
              </span>
              <div className="flex gap-4">
                <span>Total active days: <strong>{stats?.current_streak || 0}</strong></span>
                <span>Max streak: <strong>{stats?.current_streak || 0}</strong></span>
              </div>
            </div>
            
            {/* Activity Heatmap Grid */}
            <ActivityGraph calendar={stats?.submission_calendar || {}} />
          </div>

          {/* Recent Submissions */}
          <div className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl overflow-hidden flex flex-col min-h-[300px]">
            <div className="flex border-b border-[#2a2d35] bg-[#16181d] px-2 py-2 gap-2">
              <button className="px-4 py-1.5 text-xs font-semibold text-[#f8fafc] bg-[#2a2d35] rounded-md flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Recent AC
              </button>
              <button className="px-4 py-1.5 text-xs font-semibold text-[#94a3b8] hover:bg-[#2a2d35]/50 rounded-md">
                Solutions
              </button>
            </div>
            <div className="flex-1 p-4 flex flex-col">
              {totalSolved > 0 ? (
                <div className="text-sm text-[#64748b] text-center mt-10">
                  Recent submissions will appear here.
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-[#64748b]">
                  No recent submissions.
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}
