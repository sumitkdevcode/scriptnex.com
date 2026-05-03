'use client';

import { useDeferredValue, useEffect, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  slug?: string;
  username?: string;
  difficulty?: string;
}

interface SearchResults {
  problems: SearchResult[];
  users: SearchResult[];
  contests: SearchResult[];
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const deferredQuery = useDeferredValue(query.trim());

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!deferredQuery) {
      const timer = window.setTimeout(() => {
        setResults(null);
        setLoading(false);
      }, 0);

      return () => {
        window.clearTimeout(timer);
      };
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await api.get<SearchResults>(`/search?q=${encodeURIComponent(deferredQuery)}`);
        if (!cancelled) {
          setResults(response.data);
        }
      } catch {
        if (!cancelled) {
          setResults(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [deferredQuery, open]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const close = () => {
    setOpen(false);
    setQuery('');
    setResults(null);
    setLoading(false);
  };

  const hasResults = !!results && (results.problems.length + results.users.length + results.contests.length) > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-[#2a2d35] rounded-lg text-[#64748b] text-sm hover:border-[#475569] hover:text-white transition-colors"
        aria-label="Open search"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <span className="hidden sm:inline text-xs bg-white/10 px-1.5 py-0.5 rounded">⌘K</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={(event) => event.target === event.currentTarget && close()}
        >
          <div className="w-full max-w-2xl bg-[#16181d] border border-[#2a2d35] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2d35]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search problems, users, contests..."
                value={query}
                onChange={handleChange}
                className="flex-1 bg-transparent text-white placeholder-[#475569] outline-none text-base"
              />
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#00d285]" />}
              <button onClick={close} className="text-[#475569] hover:text-white text-xs">ESC</button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query && (
                <div className="px-4 py-8 text-center text-[#475569] text-sm">
                  Type to search problems, users, and contests
                </div>
              )}

              {query && !loading && !hasResults && (
                <div className="px-4 py-8 text-center text-[#475569] text-sm">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

              {results?.problems.length ? (
                <div className="px-2 py-2">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#475569] font-semibold">Problems</div>
                  {results.problems.map((problem) => (
                    <Link key={problem.id} href={`/problems/${problem.slug}`} onClick={close}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group">
                      <div className="w-7 h-7 rounded-md bg-[#1a1c23] flex items-center justify-center text-sm">⌨️</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{problem.title}</div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${problem.difficulty === 'easy' ? 'text-[#00d285]' : problem.difficulty === 'medium' ? 'text-yellow-400' : problem.difficulty === 'hard' ? 'text-red-400' : 'text-purple-400'}`}>{problem.difficulty}</span>
                    </Link>
                  ))}
                </div>
              ) : null}

              {results?.users.length ? (
                <div className="px-2 py-2 border-t border-[#1a1c23]">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#475569] font-semibold">Users</div>
                  {results.users.map((user) => (
                    <Link key={user.id} href={`/profile/${user.username}`} onClick={close}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                      <div className="w-7 h-7 rounded-full bg-[#00d285]/10 border border-[#00d285]/20 flex items-center justify-center text-[#00d285] text-xs font-bold">
                        {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-[#475569]">@{user.username}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}

              {results?.contests.length ? (
                <div className="px-2 py-2 border-t border-[#1a1c23]">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#475569] font-semibold">Contests</div>
                  {results.contests.map((contest) => (
                    <Link key={contest.id} href={`/contests/${contest.slug}`} onClick={close}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                      <div className="w-7 h-7 rounded-md bg-[#1a1c23] flex items-center justify-center text-sm">🏆</div>
                      <div className="text-sm font-medium text-white truncate">{contest.title}</div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
