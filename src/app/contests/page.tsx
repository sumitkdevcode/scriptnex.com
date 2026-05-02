'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Contest {
  id: number; uuid: string; title: string; slug: string; type: string;
  start_time: string; end_time: string; duration_minutes: number;
  scoring_type: string; registration_count: number; status: string; problems_count: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  upcoming: { label: 'Upcoming', color: '#00d285', bg: 'rgba(0,210,133,0.1)' },
  active: { label: 'Live Now', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ended: { label: 'Ended', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
};

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ contests: Contest[] }>('/contests').then(res => {
      setContests(res.data.contests);
      setLoading(false);
    });
  }, []);

  const upcoming = contests.filter(c => c.status === 'upcoming');
  const active = contests.filter(c => c.status === 'active');
  const past = contests.filter(c => c.status === 'ended');

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function ContestCard({ contest }: { contest: Contest }) {
    const st = STATUS_CONFIG[contest.status] || STATUS_CONFIG.ended;
    return (
      <Link href={`/contests/${contest.slug}`} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 hover:border-[#00d285]/20 transition-all group block">
        <div className="flex items-start justify-between mb-3">
          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ color: st.color, backgroundColor: st.bg }}>{st.label}</span>
          <span className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold">{contest.type}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#00d285] transition-colors">{contest.title}</h3>
        <div className="flex flex-wrap gap-4 text-xs text-[#94a3b8] mb-4">
          <span>📅 {formatDate(contest.start_time)}</span>
          <span>⏱ {contest.duration_minutes} min</span>
          <span>📝 {contest.problems_count} problems</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#2a2d35] pt-3">
          <span className="text-xs text-[#64748b]">{contest.registration_count} registered</span>
          <span className="text-xs font-semibold text-[#00d285] uppercase tracking-wider">{contest.scoring_type}</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Contests</h1>
        <p className="text-[#94a3b8] mb-8">Compete with developers worldwide</p>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]"></div></div>
        ) : (
          <>
            {active.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm uppercase tracking-widest text-[#ef4444] font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />Live Now</h2>
                <div className="grid md:grid-cols-2 gap-4">{active.map(c => <ContestCard key={c.id} contest={c} />)}</div>
              </section>
            )}
            {upcoming.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm uppercase tracking-widest text-[#00d285] font-bold mb-4">Upcoming</h2>
                <div className="grid md:grid-cols-2 gap-4">{upcoming.map(c => <ContestCard key={c.id} contest={c} />)}</div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-sm uppercase tracking-widest text-[#64748b] font-bold mb-4">Past Contests</h2>
                <div className="grid md:grid-cols-2 gap-4">{past.map(c => <ContestCard key={c.id} contest={c} />)}</div>
              </section>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
