'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import InfiniteScrollTrigger from '@/components/ui/InfiniteScrollTrigger';

interface Contest {
  id: number; uuid: string; title: string; slug: string; type: string;
  start_time: string; end_time: string; duration_minutes: number;
  scoring_type: string; registration_count: number; status: string; problems_count: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  upcoming: { label: 'Upcoming', color: '#00d285', bg: 'rgba(0,210,133,0.1)' },
  active: { label: 'Live Now', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ended: { label: 'Ended', color: '#ababab', bg: 'rgba(100,116,139,0.1)' },
};

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchContests = (page = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    api.get<Contest[]>(`/contests?page=${page}`).then(res => {
      const r = res as any;
      if (append) {
        setContests(prev => {
          const combined = [...prev, ...r.data];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique;
        });
      } else {
        setContests(r.data);
      }
      if (r.meta?.pagination) {
        setCurrentPage(r.meta.pagination.current_page);
        setLastPage(r.meta.pagination.last_page);
      }
      setLoading(false);
      setLoadingMore(false);
    }).catch(() => {
      if (!append) setContests([]);
      setLoading(false);
      setLoadingMore(false);
    });
  };

  useEffect(() => {
    fetchContests(1);
  }, []);

  const loadMore = () => {
    if (currentPage < lastPage && !loadingMore) {
      fetchContests(currentPage + 1, true);
    }
  };

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
          <span className="text-[10px] uppercase tracking-wider text-[#ababab] font-semibold">{contest.type}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#00d285] transition-colors">{contest.title}</h3>
        <div className="flex flex-wrap gap-4 text-xs text-[#ababab] mb-4">
          <span>📅 {formatDate(contest.start_time)}</span>
          <span>⏱ {contest.duration_minutes} min</span>
          <span>📝 {contest.problems_count} problems</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#2a2d35] pt-3">
          <span className="text-xs text-[#ababab]">{contest.registration_count} registered</span>
          <span className="text-xs font-semibold text-[#00d285] uppercase tracking-wider">{contest.scoring_type}</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold mb-1">Live Coding Contests</h1>
        <p className="text-[#ababab] text-sm mb-4">Compete with developers worldwide in weekly programming competitions</p>
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
              <section className="mb-4">
                <h2 className="text-sm uppercase tracking-widest text-[#ababab] font-bold mb-4">Past Contests</h2>
                <div className="grid md:grid-cols-2 gap-4">{past.map(c => <ContestCard key={c.id} contest={c} />)}</div>
              </section>
            )}
            
            {contests.length === 0 && <div className="text-center py-20 text-[#ababab]">No contests found.</div>}

            <InfiniteScrollTrigger 
              onIntersect={loadMore}
              isLoading={loadingMore}
              hasMore={currentPage < lastPage}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
