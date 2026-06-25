import Navbar from '@/components/layout/Navbar';

export default function CertificationsLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="h-7 w-72 bg-[#1a1c23] rounded animate-pulse mb-1" />
        <div className="h-4 w-96 bg-[#1a1c23] rounded animate-pulse mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden">
              <div className="h-1.5 bg-[#1a1c23] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 bg-[#1a1c23] rounded animate-pulse" />
                </div>
                <div className="h-5 w-3/4 bg-[#1a1c23] rounded animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-full bg-[#1a1c23] rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-[#1a1c23] rounded animate-pulse" />
                </div>
                <div className="flex gap-3">
                  <div className="h-3 w-12 bg-[#1a1c23] rounded animate-pulse" />
                  <div className="h-3 w-14 bg-[#1a1c23] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
