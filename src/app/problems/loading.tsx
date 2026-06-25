import Navbar from '@/components/layout/Navbar';

export default function ProblemsLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        {/* Header skeleton */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="h-7 w-64 bg-[#1a1c23] rounded animate-pulse mb-1" />
            <div className="h-3 w-96 bg-[#1a1c23] rounded animate-pulse" />
          </div>
          <div className="h-9 w-48 bg-[#1a1c23] rounded animate-pulse" />
        </div>

        {/* Search + filters skeleton */}
        <div className="flex flex-col lg:flex-row gap-3 mb-3">
          <div className="flex-1 h-10 bg-[#1a1c23] rounded-md animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-16 bg-[#1a1c23] rounded-md animate-pulse" />
            ))}
          </div>
        </div>

        {/* Categories skeleton */}
        <div className="flex gap-1.5 mb-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-9 w-28 bg-[#1a1c23] rounded-md animate-pulse shrink-0" />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden">
          <div className="h-10 border-b border-[#2a2d35] bg-[#1a1c23] animate-pulse" />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#2a2d35]/50">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#1a1c23] rounded animate-pulse" />
                <div className="flex gap-1.5">
                  <div className="h-3 w-16 bg-[#1a1c23] rounded animate-pulse" />
                  <div className="h-3 w-12 bg-[#1a1c23] rounded animate-pulse" />
                </div>
              </div>
              <div className="h-5 w-14 bg-[#1a1c23] rounded animate-pulse" />
              <div className="hidden md:block h-4 w-12 bg-[#1a1c23] rounded animate-pulse" />
              <div className="hidden md:block h-4 w-12 bg-[#1a1c23] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
