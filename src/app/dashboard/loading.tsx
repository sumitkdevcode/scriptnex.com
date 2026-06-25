import Navbar from '@/components/layout/Navbar';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-10 w-full flex flex-col gap-5">
        {/* Welcome banner skeleton */}
        <div className="rounded-xl border border-[#2a2d35] bg-[#1a1c23] p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-7 w-64 bg-[#16181d] rounded animate-pulse" />
              <div className="h-4 w-80 bg-[#16181d] rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-[#16181d] rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-5 h-[140px] animate-pulse" />
          ))}
        </div>

        {/* Features grid skeleton */}
        <div className="h-5 w-40 bg-[#1a1c23] rounded animate-pulse mt-2" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="bg-[#1a1c23] border border-[#2a2d35] rounded-xl p-4 h-[160px] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
