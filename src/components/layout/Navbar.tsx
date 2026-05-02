'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/problems' && (pathname.startsWith('/problems') || pathname.startsWith('/tracks'))) {
      return true;
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Practice', href: '/problems' },
    { name: 'Contests', href: '/contests' },
    { name: 'Certify', href: '/certifications' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full flex items-center justify-between px-4 md:px-12 lg:px-24 py-1.5 border-b border-[#2a2d35] bg-[#0f1115]/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center z-10 shrink-0">
          <img src="/logo-nav.png" alt="ScriptNex Logo" className="h-[40px] md:h-[60px] w-auto object-contain" />
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
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#94a3b8] hover:text-white z-10 p-2"
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
                    : 'text-[#e2e8f0] hover:text-[#00d285] transition-colors text-lg'
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-[65px]" aria-hidden="true"></div>
    </>
  );
}
