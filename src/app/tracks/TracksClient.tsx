'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';

import InfiniteScrollTrigger from '@/components/ui/InfiniteScrollTrigger';

interface TrackItem { id: number; title: string; slug: string; description: string; difficulty: string; estimated_hours: number; is_premium: boolean; modules_count: number; lessons_count: number; }
const LEVEL_COLOR: Record<string, string> = { beginner: '#00d285', intermediate: '#f59e0b', advanced: '#ef4444' };

interface TracksClientProps {
  initialTracks: TrackItem[];
  initialPagination: {
    current_page: number;
    last_page: number;
  };
}

export default function TracksClient({
  initialTracks,
  initialPagination,
}: TracksClientProps) {
  const [tracks, setTracks] = useState<TrackItem[]>(initialTracks);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPagination.current_page);
  const [lastPage, setLastPage] = useState(initialPagination.last_page);

  const loadMore = () => {
    if (currentPage >= lastPage || loadingMore) return;
    setLoadingMore(true);

    api.get<TrackItem[]>(`/tracks?page=${currentPage + 1}`).then(r => {
      const res = r as any;
      setTracks(prev => {
        const combined = [...prev, ...res.data];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique;
      });
      if (res.meta?.pagination) {
        setCurrentPage(res.meta.pagination.current_page);
        setLastPage(res.meta.pagination.last_page);
      }
      setLoadingMore(false);
    }).catch(() => {
      setLoadingMore(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold mb-1">Structured Learning Tracks</h1>
        <p className="text-[#ababab] text-sm mb-4">Follow curated learning paths to master programming from beginner to advanced</p>
        
        <div className="space-y-4 mb-4">
          {tracks.map(track => (
            <Link key={track.id} href={`/tracks/${track.slug}`} className="bg-[#16181d] border border-[#2a2d35] rounded-md p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-[#00d285]/20 transition-all group block">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-gradient-to-br from-[#00d285]/20 to-[#00a669]/10 flex items-center justify-center text-xl sm:text-2xl shrink-0">📚</div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-[#00d285] transition-colors truncate">{track.title}</h3>
                  {track.is_premium && <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 rounded">PRO</span>}
                </div>
                <p className="text-xs sm:text-sm text-[#ababab] line-clamp-2 sm:line-clamp-1 mb-2 sm:mb-2">{track.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-xs text-[#ababab]">
                  <span className="capitalize font-medium" style={{ color: LEVEL_COLOR[track.difficulty] }}>{track.difficulty}</span>
                  <span>{track.estimated_hours}h estimated</span>
                  <span>{track.modules_count} modules</span>
                  <span>{track.lessons_count} lessons</span>
                </div>
              </div>
              <svg className="hidden sm:block text-[#ababab] group-hover:text-[#00d285] transition-colors shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          ))}
          {tracks.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No learning tracks found</h3>
              <p className="text-[#ababab] text-sm max-w-md mx-auto">
                We couldn't find any learning tracks at the moment. Please try refreshing the page or check back later.
              </p>
            </div>
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
