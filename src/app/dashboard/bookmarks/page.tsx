'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface BookmarkedProblem {
  id: number; title: string; slug: string; difficulty: string;
  category: { name: string } | null; acceptance_rate: number;
}

const DIFF_CLR: Record<string, string> = { easy: '#00d285', medium: '#f59e0b', hard: '#ef4444', expert: '#a855f7' };

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    api.get<{ bookmarks: BookmarkedProblem[] }>('/auth/bookmarks')
      .then(r => setBookmarks(r.data.bookmarks))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? bookmarks : bookmarks.filter(b => b.difficulty === filter);

  const handleRemove = async (slug: string) => {
    try {
      await api.delete(`/problems/${slug}/bookmark`);
      setBookmarks(prev => prev.filter(b => b.slug !== slug));
    } catch { /* ignore */ }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">Bookmarks</h1>
        <span className="text-sm text-[#64748b]">{bookmarks.length} saved</span>
      </div>
      <p className="text-[#94a3b8] text-sm mb-6">Problems you&apos;ve saved to tackle later.</p>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'easy', 'medium', 'hard', 'expert'].map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === d
                ? 'bg-[#00d285] text-black'
                : 'bg-[#16181d] border border-[#2a2d35] text-[#64748b] hover:text-white'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d285]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#16181d] border border-[#2a2d35] border-dashed rounded-xl p-16 text-center">
          <div className="text-5xl mb-4">🔖</div>
          <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-[#64748b] text-sm mb-6">
            {filter !== 'all' ? `No ${filter} problems bookmarked.` : 'Save problems to revisit them later.'}
          </p>
          <Link href="/problems" className="px-6 py-3 bg-[#00d285] text-black font-bold rounded-xl text-sm hover:bg-[#00e691] transition-colors">
            Browse Problems
          </Link>
        </div>
      ) : (
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] text-[10px] uppercase tracking-widest text-[#64748b] font-semibold px-6 py-3 border-b border-[#2a2d35] gap-4">
            <span>Problem</span>
            <span>Category</span>
            <span>Acceptance</span>
            <span></span>
          </div>
          {filtered.map((b, i) => (
            <div
              key={b.id}
              className={`grid grid-cols-[1fr_auto_auto_auto] items-center px-6 py-4 gap-4 hover:bg-white/[0.02] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#2a2d35]/50' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-[#475569] w-6 shrink-0">{i + 1}</span>
                <Link href={`/problems/${b.slug}`} className="font-medium text-sm hover:text-[#00d285] transition-colors truncate">
                  {b.title}
                </Link>
                <span className="text-xs font-semibold shrink-0" style={{ color: DIFF_CLR[b.difficulty] || '#64748b' }}>
                  {b.difficulty}
                </span>
              </div>
              <span className="text-xs text-[#64748b] shrink-0">{b.category?.name || '—'}</span>
              <span className="text-xs text-[#64748b] shrink-0">{b.acceptance_rate ?? '—'}%</span>
              <button
                onClick={() => handleRemove(b.slug)}
                className="text-[#64748b] hover:text-red-400 transition-colors p-1 shrink-0"
                title="Remove bookmark"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
