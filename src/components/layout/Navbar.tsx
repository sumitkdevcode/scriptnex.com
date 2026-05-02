'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import logoNav from '../../../public/logo-nav.png';
import GlobalSearch from './GlobalSearch';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/problems' && (pathname.startsWith('/problems') || pathname.startsWith('/tracks'))) {
      return true;
    }
    return pathname.startsWith(path);
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  const publicLinks = [
    { name: 'Practice', href: '/problems' },
    { name: 'Certify', href: '/certifications' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  const privateLinks = [
    { name: 'Practice', href: '/problems' },
    { name: 'Contests', href: '/contests' },
    { name: 'Certify', href: '/certifications' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const navLinks = isAuthenticated ? privateLinks : publicLinks;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full border-b border-[#2a2d35] bg-[#0f1115]/80 backdrop-blur-md z-50">
        <nav className="w-full flex items-center justify-between px-6 md:px-12 lg:px-24 py-1.5 relative">
          <Link href="/" className="flex items-center z-10 shrink-0">
            {/* Increased mobile logo size from h-[40px] to h-[50px] */}
            <img src={logoNav.src} alt="ScriptNex Logo" className="h-[50px] md:h-[60px] w-auto object-contain" />
          </Link>
          
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  isActive(link.href)
                    ? 'text-[#00d285] font-semibold'
                    : 'text-[#94a3b8] hover:text-white transition-colors'
                }
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link href="/pricing" className="text-[#00d285] font-semibold border border-[#00d285]/30 px-3 py-1 rounded-full text-xs hover:bg-[#00d285]/10 transition-colors">Pro Plans</Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3 z-10 shrink-0">
            <GlobalSearch />
            {!isAuthenticated ? (
              !isAuthPage && (
                <>
                  <Link href="/login" className="hidden sm:block px-3 md:px-4 py-2 rounded-lg border border-[#2a2d35] text-xs md:text-sm text-[#94a3b8] hover:text-white hover:border-[#94a3b8]/50 transition-all font-medium whitespace-nowrap">Log In</Link>
                  <Link href="/register" className="hidden sm:block px-3 md:px-4 py-2 rounded-lg bg-[#00d285] text-black text-xs md:text-sm font-semibold hover:bg-[#00e691] transition-colors whitespace-nowrap">Sign Up</Link>
                </>
              )
            ) : (
              <button 
                onClick={() => logout()}
                className="hidden sm:block px-3 md:px-4 py-2 rounded-lg border border-[#2a2d35] text-xs md:text-sm text-[#94a3b8] hover:text-white transition-all font-medium whitespace-nowrap"
              >
                Log Out
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#94a3b8] hover:text-white z-10 p-2 -mr-2"
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
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-[100%] left-0 right-0 bg-[#16181d] border-b border-[#2a2d35] p-6 flex flex-col gap-5 md:hidden shadow-xl shadow-black/50 z-50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={
                  isActive(link.href)
                    ? 'text-[#00d285] font-semibold text-lg'
                    : 'text-[#e2e8f0] hover:text-[#00d285] transition-colors text-lg font-medium'
                }
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
               <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-[#00d285] font-semibold text-lg">Pro Plans</Link>
            )}
            
            <div className="h-px bg-[#2a2d35] my-2"></div>
            
            {!isAuthenticated ? (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-white transition-colors text-lg font-medium">Log In</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-[#00d285] font-semibold text-lg">Sign Up</Link>
              </>
            ) : (
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="text-[#94a3b8] hover:text-white text-left text-lg font-medium"
              >
                Log Out
              </button>
            )}
          </div>
        )}
      </div>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-[65px]" aria-hidden="true"></div>
    </>
  );
}
