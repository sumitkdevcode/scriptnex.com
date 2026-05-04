'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import logoNav from '../../../public/logo-nav.png';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname === path || pathname.startsWith(path + '/');
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  const publicLinks = [
    { name: 'Practice', href: '/problems' },
    { name: 'Tracks', href: '/tracks' },
    { name: 'Certify', href: '/certifications' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  const privateLinks = [
    { name: 'Practice', href: '/problems' },
    { name: 'Tracks', href: '/tracks' },
    { name: 'Contests', href: '/contests' },
    { name: 'Certify', href: '/certifications' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const navLinks = isAuthenticated ? privateLinks : publicLinks;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full border-b border-[#2a2d35] bg-[#0f1115]/80 backdrop-blur-md z-50">
        <nav className="w-full flex items-center justify-between px-6 md:px-12 lg:px-24 py-2.5 md:py-1">
          <Link href="/" className="flex items-center z-10 shrink-0">
            <Image src={logoNav} alt="ScriptNex Logo" className="h-[52px] md:h-[54px] w-auto object-contain" priority />
          </Link>
          
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  isActive(link.href)
                    ? 'text-[#00d285] font-semibold'
                    : 'text-[#ababab] hover:text-white transition-colors'
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
            {!isAuthenticated ? (
              !isAuthPage && (
                <>
                  <Link href="/login" className="hidden sm:block px-3 md:px-4 py-2 rounded-md border border-[#2a2d35] text-xs md:text-sm text-[#ababab] hover:text-white hover:border-[#ababab]/50 transition-all font-medium whitespace-nowrap">Log In</Link>
                  <Link href="/register" className="hidden sm:block px-3 md:px-4 py-2 rounded-md bg-[#00d285] text-black text-xs md:text-sm font-semibold hover:bg-[#00e691] transition-colors whitespace-nowrap">Sign Up</Link>
                </>
              )
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/pricing" className="hidden sm:flex px-3 py-1.5 bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b]/20 border border-[#f59e0b]/30 rounded-md text-xs font-bold transition-colors items-center gap-1">Premium</Link>
                
                <div className="flex items-center gap-3 text-[#ababab] mx-1">
                  <button className="hover:text-[#f59e0b] transition-colors flex items-center gap-1" title="0 Day Streak">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path></svg>
                    <span className="text-xs font-bold text-white">0</span>
                  </button>
                  <button className="hover:text-white transition-colors relative" title="Notifications">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#0f1115]"></span>
                  </button>
                </div>

                <Link href={user?.username ? `/profile/${user.username}` : '/dashboard'} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#2a2d35] hover:border-white transition-all overflow-hidden shrink-0 bg-gradient-to-br from-[#00d285] to-[#00a669] text-black">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'ME'
                  )}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#ababab] hover:text-white z-10 p-2 -mr-2"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#16181d] border-b border-[#2a2d35] shadow-xl shadow-black/50 max-h-[calc(100vh-65px)] overflow-y-auto">
            <div className="p-6 flex flex-col gap-5">
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
              
              {isAuthenticated && (
                <>
                  <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-[#f59e0b] font-semibold text-lg">Premium</Link>
                  <Link href={user?.username ? `/profile/${user.username}` : '/dashboard'} onClick={() => setIsMobileMenuOpen(false)} className="text-[#e2e8f0] hover:text-[#00d285] transition-colors text-lg font-medium">Profile</Link>
                </>
              )}
              
              <div className="h-px bg-[#2a2d35] my-2"></div>
              
              {!isAuthenticated ? (
                !isAuthPage && (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[#ababab] hover:text-white transition-colors text-lg font-medium">Log In</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-[#00d285] font-semibold text-lg">Sign Up</Link>
                  </>
                )
              ) : (
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="text-[#ababab] hover:text-white text-left text-lg font-medium"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-[75px] md:h-[62px]" aria-hidden="true"></div>
    </>
  );
}
