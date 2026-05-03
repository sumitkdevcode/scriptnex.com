'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LeaderboardPage() {
  // Mock leaderboard data until real submissions fill in
  const leaders = [
    { rank: 1, name: 'Alex Chen', problems: 245, rating: 2150, badge: '🥇' },
    { rank: 2, name: 'Priya Sharma', problems: 230, rating: 2080, badge: '🥈' },
    { rank: 3, name: 'James Wilson', problems: 210, rating: 1990, badge: '🥉' },
    { rank: 4, name: 'Maria Garcia', problems: 195, rating: 1920, badge: '' },
    { rank: 5, name: 'Yuki Tanaka', problems: 180, rating: 1870, badge: '' },
    { rank: 6, name: 'David Kim', problems: 170, rating: 1820, badge: '' },
    { rank: 7, name: 'Sarah Johnson', problems: 165, rating: 1790, badge: '' },
    { rank: 8, name: 'Ahmed Hassan', problems: 155, rating: 1750, badge: '' },
    { rank: 9, name: 'Lisa Wang', problems: 145, rating: 1700, badge: '' },
    { rank: 10, name: 'Carlos Ruiz', problems: 140, rating: 1680, badge: '' },
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-[#94a3b8] mb-8">Top performers on ScriptNex</p>

        <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_120px_120px] gap-4 px-6 py-3 border-b border-[#2a2d35] text-[10px] uppercase tracking-widest text-[#64748b] font-semibold">
            <span>Rank</span><span>Developer</span><span className="text-center">Solved</span><span className="text-right">Rating</span>
          </div>
          {leaders.map((l) => (
            <div key={l.rank} className={`grid grid-cols-[80px_1fr_120px_120px] gap-4 px-6 py-4 items-center border-b border-[#2a2d35]/50 last:border-none hover:bg-white/[0.02] transition-colors ${l.rank <= 3 ? 'bg-gradient-to-r from-[#00d285]/[0.03] to-transparent' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${l.rank <= 3 ? 'text-[#00d285]' : 'text-[#64748b]'}`}>{l.rank}</span>
                {l.badge && <span className="text-lg">{l.badge}</span>}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1f2229] flex items-center justify-center text-sm font-bold text-[#00d285]">{l.name.charAt(0)}</div>
                <span className="text-sm font-medium">{l.name}</span>
              </div>
              <div className="text-center text-sm text-[#94a3b8]">{l.problems}</div>
              <div className="text-right text-sm font-bold text-[#00d285]">{l.rating}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
