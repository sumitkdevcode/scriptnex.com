'use client';

import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';
import type { Category, Problem } from '@/types/problem';

import InfiniteScrollTrigger from '@/components/ui/InfiniteScrollTrigger';

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#00d285', bg: 'rgba(0,210,133,0.1)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  expert: { label: 'Expert', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const deferredSearch = useDeferredValue(search.trim());

  const fetchProblems = useCallback(async (page = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());

      if (activeCategory !== 'all') {
        params.set('category', activeCategory);
      }

      if (activeDifficulty !== 'all') {
        params.set('difficulty', activeDifficulty);
      }

      if (deferredSearch) {
        params.set('search', deferredSearch);
      }

      const queryString = params.toString();
      const response = await api.get<Problem[]>(`/problems${queryString ? `?${queryString}` : ''}`);
      
      const res = response as any;
      if (append) {
        setProblems(prev => {
          const combined = [...prev, ...res.data];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique;
        });
      } else {
        setProblems(res.data);
      }
      
      if (res.meta?.pagination) {
        setCurrentPage(res.meta.pagination.current_page);
        setLastPage(res.meta.pagination.last_page);
        setTotalCount(res.meta.pagination.total);
      }
    } catch {
      if (!append) setProblems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, activeDifficulty, deferredSearch]);

  useEffect(() => {
    let cancelled = false;

    api.get<{ categories: Category[] }>('/categories')
      .then((response) => {
        if (!cancelled) {
          setCategories(response.data.categories);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProblems(1, false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchProblems]);

  const loadMore = () => {
    if (currentPage < lastPage && !loadingMore) {
      void fetchProblems(currentPage + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-0.5">Practice Coding Problems</h1>
            <p className="text-[#ababab] text-[10px]">Sharpen your programming skills with {totalCount.toLocaleString()} coding challenges across algorithms, data structures, and more</p>
          </div>
          <div className="flex bg-[#16181d] p-1 rounded-md border border-[#2a2d35]">
            <Link href="/problems" className="px-4 py-1.5 bg-[#00d285] text-black text-xs font-bold rounded-md transition-all">Problems</Link>
            <Link href="/tracks" className="px-4 py-1.5 text-[#ababab] hover:text-white text-xs font-bold rounded-md transition-all">Learning Tracks</Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mb-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ababab]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(event) => { setSearch(event.target.value); }}
              className="w-full pl-9 pr-4 py-2 bg-[#1a1c23] border border-[#2a2d35] rounded-md text-sm text-white placeholder:text-[#ababab] focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[rgba(0,210,133,0.2)] transition-all"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => { setActiveDifficulty(difficulty); }}
                className={`px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeDifficulty === difficulty
                    ? 'bg-[#00d285] text-black'
                    : 'bg-[#1a1c23] border border-[#2a2d35] text-[#ababab] hover:border-[#00d285]/30'
                }`}
              >
                {difficulty === 'all' ? 'All' : difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1.5 scrollbar-hide">
          <button
            onClick={() => { setActiveCategory('all'); }}
            className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === 'all' ? 'bg-[#00d285]/10 text-[#00d285] border border-[#00d285]/30' : 'bg-[#1a1c23] text-[#ababab] border border-transparent hover:border-[#2a2d35]'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => { setActiveCategory(category.slug); }}
              className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === category.slug ? 'bg-[#00d285]/10 text-[#00d285] border border-[#00d285]/30' : 'bg-[#1a1c23] text-[#ababab] border border-transparent hover:border-[#2a2d35]'
              }`}
            >
              {category.icon} {category.name}
              <span className="ml-1.5 text-[#ababab]">{category.problem_count}</span>
            </button>
          ))}
        </div>

        <div className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden mb-4">
          <div className="grid grid-cols-[1fr_80px] md:grid-cols-[1fr_100px_120px_100px] gap-2 md:gap-4 px-4 md:px-6 py-3 border-b border-[#2a2d35] text-[9px] md:text-[10px] uppercase tracking-widest text-[#ababab] font-semibold">
            <span>Problem</span>
            <span className="text-center">Difficulty</span>
            <span className="hidden md:block text-center">Acceptance</span>
            <span className="hidden md:block text-right">Solved</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]"></div>
            </div>
          ) : problems.length === 0 ? (
            <div className="text-center py-20 text-[#ababab]">No problems found matching your filters.</div>
          ) : (
            problems.map((problem, index) => {
              const difficulty = DIFFICULTY_CONFIG[problem.difficulty];

              return (
                <Link
                  key={problem.id}
                  href={`/problems/${problem.slug}`}
                  className="grid grid-cols-[1fr_80px] md:grid-cols-[1fr_100px_120px_100px] gap-2 md:gap-4 px-4 md:px-6 py-4 items-center hover:bg-white/[0.02] transition-colors border-b border-[#2a2d35]/50 last:border-b-0 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs md:text-sm font-medium text-white group-hover:text-[#00d285] transition-colors truncate block">
                        {index + 1}. {problem.title}
                      </span>
                      {problem.is_premium && (
                        <span className="shrink-0 px-1.5 py-0.5 text-[8px] md:text-[9px] font-bold bg-amber-500/10 text-amber-400 rounded">PRO</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                      {problem.tags.slice(0, 2).map((tag) => (
                        <span key={tag.slug} className="px-1.5 py-0.5 text-[9px] md:text-[10px] bg-white/5 text-[#ababab] rounded whitespace-nowrap">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[9px] md:text-[11px] font-semibold" style={{ color: difficulty.color, backgroundColor: difficulty.bg }}>
                      {difficulty.label}
                    </span>
                  </div>
                  <div className="hidden md:block text-center text-sm text-[#ababab]">
                    {problem.success_rate > 0 ? `${problem.success_rate}%` : '—'}
                  </div>
                  <div className="hidden md:block text-right text-sm text-[#ababab]">
                    {problem.solve_count.toLocaleString()}
                  </div>
                </Link>
              );
            })
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
