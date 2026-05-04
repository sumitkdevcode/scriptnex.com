import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black leading-none opacity-10 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold tracking-tight">PAGE NOT FOUND</span>
          </div>
        </div>
        
        <h2 className="text-xl text-[#ababab] mb-8 max-w-md mx-auto">
          Oops! The coding challenge you're looking for seems to have moved or never existed.
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link 
            href="/" 
            className="px-8 py-3 bg-[#00d285] text-black font-bold rounded-xl hover:bg-[#00e691] transition-all transform hover:-translate-y-1"
          >
            Back to Home
          </Link>
          <Link 
            href="/problems" 
            className="px-8 py-3 bg-[#1e2128] text-white font-bold rounded-xl border border-[#2a2d35] hover:border-[#00d285]/50 transition-all"
          >
            Browse Problems
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
