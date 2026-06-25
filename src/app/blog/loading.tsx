import Navbar from '@/components/layout/Navbar';

export default function BlogLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {/* Featured skeleton */}
        <div className="h-8 w-48 bg-[#1a1c23] rounded animate-pulse mb-6" />
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden">
              <div className="h-48 bg-[#1a1c23] animate-pulse" />
              <div className="p-5 space-y-2">
                <div className="h-5 w-3/4 bg-[#1a1c23] rounded animate-pulse" />
                <div className="h-3 w-full bg-[#1a1c23] rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-[#1a1c23] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Posts grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-[#16181d] border border-[#2a2d35] rounded-md overflow-hidden">
              <div className="h-40 bg-[#1a1c23] animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-[#1a1c23] rounded animate-pulse" />
                <div className="h-3 w-full bg-[#1a1c23] rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-[#1a1c23] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
