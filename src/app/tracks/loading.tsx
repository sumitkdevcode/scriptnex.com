import Navbar from '@/components/layout/Navbar';

export default function TracksLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="h-7 w-64 bg-[#1a1c23] rounded animate-pulse mb-1" />
        <div className="h-4 w-96 bg-[#1a1c23] rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-[#16181d] border border-[#2a2d35] rounded-md p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-[#1a1c23] animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 w-full space-y-2">
                <div className="h-5 w-3/5 bg-[#1a1c23] rounded animate-pulse" />
                <div className="h-3 w-full bg-[#1a1c23] rounded animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-3 w-16 bg-[#1a1c23] rounded animate-pulse" />
                  <div className="h-3 w-20 bg-[#1a1c23] rounded animate-pulse" />
                  <div className="h-3 w-18 bg-[#1a1c23] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
