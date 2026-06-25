import Navbar from '@/components/layout/Navbar';

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="h-7 w-64 bg-[#1a1c23] rounded animate-pulse mb-1" />
        <div className="h-4 w-96 bg-[#1a1c23] rounded animate-pulse mb-4" />
        <div className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden">
          <div className="h-10 border-b border-[#2a2d35] bg-[#1a1c23] animate-pulse" />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#2a2d35]/50">
              <div className="h-5 w-8 bg-[#1a1c23] rounded animate-pulse" />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#1a1c23] animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-[#1a1c23] rounded animate-pulse" />
                  <div className="h-3 w-20 bg-[#1a1c23] rounded animate-pulse" />
                </div>
              </div>
              <div className="hidden md:block h-4 w-12 bg-[#1a1c23] rounded animate-pulse" />
              <div className="h-4 w-14 bg-[#1a1c23] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
