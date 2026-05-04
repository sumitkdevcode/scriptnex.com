'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InfiniteScrollTrigger from '@/components/ui/InfiniteScrollTrigger';

interface Leader {
  id: number;
  name: string;
  username: string;
  solved_count: number;
  rating: number;
  avatar?: string;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const fetchLeaderboard = (page = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    api.get<Leader[]>(`/leaderboard?page=${page}`).then(res => {
      const r = res as any;
      if (append) {
        setLeaders(prev => {
          const combined = [...prev, ...r.data];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique;
        });
      } else {
        setLeaders(r.data);
      }
      if (r.meta?.pagination) {
        setCurrentPage(r.meta.pagination.current_page);
        setLastPage(r.meta.pagination.last_page);
        setPerPage(r.meta.pagination.per_page);
      }
      setLoading(false);
      setLoadingMore(false);
    }).catch(() => {
      if (!append) setLeaders([]);
      setLoading(false);
      setLoadingMore(false);
    });
  };

  useEffect(() => {
    fetchLeaderboard(1);
  }, []);

  const loadMore = () => {
    if (currentPage < lastPage && !loadingMore) {
      fetchLeaderboard(currentPage + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold mb-1">Leaderboard</h1>
        <p className="text-[#ababab] text-sm mb-4">Top performers on ScriptNex</p>

        <div className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden mb-4">
          <div className="grid grid-cols-[50px_1fr_80px] md:grid-cols-[80px_1fr_120px_120px] gap-2 md:gap-4 px-4 md:px-6 py-3 border-b border-[#2a2d35] text-[9px] md:text-[10px] uppercase tracking-widest text-[#ababab] font-semibold">
            <span>Rank</span><span>Developer</span><span className="hidden md:block text-center">Solved</span><span className="text-right">Rating</span>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]"></div></div>
          ) : (
            <>
              {leaders.map((l, index) => {
                const rank = index + 1;
                let badge = '';
                if (rank === 1) badge = '🥇';
                else if (rank === 2) badge = '🥈';
                else if (rank === 3) badge = '🥉';

                return (
                  <div key={l.id} className={`grid grid-cols-[50px_1fr_80px] md:grid-cols-[80px_1fr_120px_120px] gap-2 md:gap-4 px-4 md:px-6 py-4 items-center border-b border-[#2a2d35]/50 last:border-none hover:bg-white/[0.02] transition-colors ${rank <= 3 ? 'bg-gradient-to-r from-[#00d285]/[0.03] to-transparent' : ''}`}>
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className={`font-bold text-base md:text-lg ${rank <= 3 ? 'text-[#00d285]' : 'text-[#ababab]'}`}>{rank}</span>
                      {badge && <span className="text-base md:text-lg hidden sm:inline">{badge}</span>}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#1f2229] flex items-center justify-center text-xs md:text-sm font-bold text-[#00d285] shrink-0">
                        {l.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs md:text-sm font-medium truncate">{l.name}</div>
                        <div className="text-[9px] md:text-[10px] text-[#ababab] truncate">@{l.username}</div>
                      </div>
                    </div>
                    <div className="hidden md:block text-center text-sm text-[#ababab]">{l.solved_count}</div>
                    <div className="text-right text-sm font-bold text-[#00d285]">{l.rating}</div>
                  </div>
                );
              })}
              {leaders.length === 0 && <div className="text-center py-20 text-[#ababab]">No developers on the leaderboard yet.</div>}
            </>
          )}
        </div>

        <InfiniteScrollTrigger 
          onIntersect={loadMore}
          isLoading={loadingMore}
          hasMore={currentPage < lastPage}
        />
      </div>
      <Footer />
    </div>
  );
}
