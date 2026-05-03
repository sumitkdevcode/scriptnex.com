'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-[#1a1c23] border border-[#2a2d35] text-[#94a3b8] hover:border-[#00d285]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className="flex items-center gap-1.5">
        {rangeWithDots.map((page, i) => (
          <React.Fragment key={i}>
            {page === '...' ? (
              <span className="px-2 text-[#475569]">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-[#00d285] text-black shadow-[0_0_15px_rgba(0,210,133,0.3)]'
                    : 'bg-[#1a1c23] border border-[#2a2d35] text-[#94a3b8] hover:border-[#00d285]/30'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-2 rounded-lg bg-[#1a1c23] border border-[#2a2d35] text-[#94a3b8] hover:border-[#00d285]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}
