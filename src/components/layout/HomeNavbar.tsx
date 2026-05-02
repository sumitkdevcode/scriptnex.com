'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomeNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full flex items-center justify-between px-4 md:px-12 lg:px-24 py-1.5 border-b border-[#2a2d35] z-50 bg-[#0f1115]/80 backdrop-blur-md">
      <Link href="/" className="flex items-center z-10 shrink-0">
        <img src="/logo-nav.png" alt="ScriptNex Logo" className="h-[40px] md:h-[60px] w-auto object-contain" />
      </Link>
      
      {/* Desktop Links */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm">
        <Link href="/problems" className="text-[#94a3b8] hover:text-white transition-colors font-medium">Practice</Link>
        <Link href="/certifications" className="text-[#94a3b8] hover:text-white transition-colors font-medium">Certify</Link>
        <Link href="#" className="text-[#94a3b8] hover:text-white transition-colors font-medium">Leaderboard</Link>
        <Link href="#" className="text-[#00d285] font-semibold border border-[#00d285]/30 px-3 py-1 rounded-full text-xs hover:bg-[#00d285]/10 transition-colors">Pro Plans</Link>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 z-10 shrink-0">
        <Link href="/login" className="hidden sm:block px-3 md:px-4 py-2 rounded-lg border border-[#2a2d35] text-xs md:text-sm text-[#94a3b8] hover:text-white hover:border-[#94a3b8]/50 transition-all font-medium whitespace-nowrap">Log In</Link>
        <Link href="/register" className="hidden sm:block px-3 md:px-4 py-2 rounded-lg bg-[#00d285] text-black text-xs md:text-sm font-semibold hover:bg-[#00e691] transition-colors whitespace-nowrap">Sign Up</Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#94a3b8] hover:text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16 M10 12h10 M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-[100%] left-0 right-0 bg-[#16181d] border-b border-[#2a2d35] p-6 flex flex-col gap-5 md:hidden shadow-xl shadow-black/50 z-50">
          <Link href="/problems" onClick={() => setIsMobileMenuOpen(false)} className="text-[#e2e8f0] hover:text-[#00d285] transition-colors text-lg font-medium">Practice</Link>
          <Link href="/certifications" onClick={() => setIsMobileMenuOpen(false)} className="text-[#e2e8f0] hover:text-[#00d285] transition-colors text-lg font-medium">Certify</Link>
          <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-[#e2e8f0] hover:text-[#00d285] transition-colors text-lg font-medium">Leaderboard</Link>
          <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-[#00d285] font-semibold text-lg">Pro Plans</Link>
          <div className="h-px bg-[#2a2d35] my-2"></div>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-white transition-colors text-lg font-medium">Log In</Link>
          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-[#00d285] font-semibold text-lg">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
