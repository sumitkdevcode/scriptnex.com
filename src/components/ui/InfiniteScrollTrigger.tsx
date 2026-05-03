'use client';

import React, { useEffect, useRef } from 'react';

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export default function InfiniteScrollTrigger({ onIntersect, isLoading, hasMore }: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    if (!hasMore || isLoading) {
      isIntersectingRef.current = false;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isIntersectingRef.current) {
          isIntersectingRef.current = true;
          onIntersect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [onIntersect, isLoading, hasMore]);

  if (!hasMore) return null;

  return (
    <div ref={triggerRef} className="py-8 flex justify-center">
      {isLoading && (
        <div className="flex items-center gap-3 text-[#64748b] text-sm animate-pulse">
          <div className="w-5 h-5 border-2 border-[#00d285]/30 border-t-[#00d285] rounded-full animate-spin" />
          Loading more...
        </div>
      )}
    </div>
  );
}
