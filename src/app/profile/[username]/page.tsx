'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface PublicProfile {
  id: number; name: string; username: string; avatar: string | null;
  bio: string | null; github_url: string | null; linkedin_url: string | null;
  role: string; created_at: string;
}

interface UserStats {
  problems_solved: number; acceptance_rate: number;
  easy_solved: number; medium_solved: number; hard_solved: number;
  current_streak: number; certificates_earned: number;
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
  const cards = stats ? [
    { label: 'Problems Solved', value: stats.problems_solved, icon: '⌨️', color: '#00d285' },
    { label: 'Acceptance Rate', value: `${stats.acceptance_rate}%`, icon: '✅', color: '#3b82f6' },
    { label: 'Current Streak', value: `${stats.current_streak}d`, icon: '🔥', color: '#f59e0b' },
    { label: 'Certificates', value: stats.certificates_earned, icon: '📜', color: '#a855f7' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]"><Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d285] via-[#00a669] to-transparent" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d285] to-[#00a669] flex items-center justify-center text-3xl font-bold text-black shrink-0">
              {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover rounded-2xl" /> : profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-sm text-[#94a3b8] mb-1">@{profile.username}</p>
              {profile.bio && <p className="text-sm text-[#cbd5e1]">{profile.bio}</p>}
              <div className="flex gap-4 mt-2 text-xs text-[#64748b]">
                <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#00d285]">GitHub ↗</a>}
                {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#00d285]">LinkedIn ↗</a>}
              </div>
            </div>
            {isOwn && <Link href="/dashboard/settings" className="px-4 py-2 bg-[#1a1c23] border border-[#2a2d35] rounded-xl text-xs font-semibold hover:border-[#00d285]/30 transition-colors">Edit Profile</Link>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {cards.map(s => (
            <div key={s.label} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${s.color}, transparent)`, opacity: 0.4 }} />
              <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-semibold">{s.label}</span>
              <div className="text-xl font-bold mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b] mb-4">Difficulty Breakdown</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Easy', count: stats?.easy_solved || 0, color: '#00d285' },
              { label: 'Medium', count: stats?.medium_solved || 0, color: '#f59e0b' },
              { label: 'Hard', count: stats?.hard_solved || 0, color: '#ef4444' },
            ].map(d => (
              <div key={d.label} className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: d.color }}>{d.count}</div>
                <div className="text-xs text-[#64748b] font-semibold uppercase tracking-wider">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
