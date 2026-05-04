'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Contest, ContestLeaderboardEntry } from '@/types/contest';

export default function ContestLeaderboardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [contest, setContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<ContestLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const contestRes = await api.get<{ contest: Contest }>(`/contests/${slug}`);
        setContest(contestRes.data.contest);
        const lbRes = await api.get<{ leaderboard: ContestLeaderboardEntry[] }>(`/contests/${slug}/leaderboard`);
        setLeaderboard(lbRes.data.leaderboard);
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/contests/${slug}`} className="text-[#ababab] hover:text-white transition-colors">
                ← Back to Contest
              </Link>
            </div>
            <h1 className="text-3xl font-bold">{contest?.title || 'Contest'} Leaderboard</h1>
          </div>
        </div>

        <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
          {leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1a1c23] border-b border-[#2a2d35]">
                    <th className="px-6 py-4 text-xs font-semibold text-[#ababab] uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#ababab] uppercase tracking-wider">Participant</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#ababab] uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#ababab] uppercase tracking-wider">Solved</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#ababab] uppercase tracking-wider text-right">Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2d35]">
                  {leaderboard.map((entry, idx) => (
                    <tr key={entry.user_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className={`font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-[#ababab]'}`}>
                          #{entry.rank || idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#2a2d35] flex items-center justify-center text-xs font-bold text-[#00d285]">
                            {entry.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold">{entry.name || 'Unknown User'}</div>
                            <div className="text-xs text-[#ababab]">@{entry.username || `user${entry.user_id}`}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#00d285]">{entry.total_score}</td>
                      <td className="px-6 py-4 text-[#cbd5e1]">{entry.problems_solved}</td>
                      <td className="px-6 py-4 text-right text-[#ababab]">{entry.total_penalty}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-bold mb-2">No results yet</h3>
              <p className="text-[#ababab] text-sm">The leaderboard will update as participants submit solutions.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
