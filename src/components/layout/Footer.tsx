import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f1115] border-t border-[#2a2d35] pt-16 pb-4 relative z-10 mt-auto">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <img src="/logo-nav.png" alt="ScriptNex Logo" className="h-[58px] md:h-[64px] w-auto object-contain" />
            </Link>
              <p className="text-[#ababab] text-sm leading-relaxed mb-6 max-w-sm">
                The ultimate platform to level up your coding skills, prepare for technical interviews, and earn verified certifications.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1a1c23] border border-[#2a2d35] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <span className="text-[#ababab] text-sm">contact@scriptnex.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1a1c23] border border-[#2a2d35] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <span className="text-[#ababab] text-sm">+91 6391518059</span>
                </div>
              </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/problems" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Practice Problems</Link></li>
              <li><Link href="/contests" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Contests</Link></li>
              <li><Link href="/leaderboard" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Leaderboard</Link></li>
              <li><Link href="/certifications" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Certifications</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/tracks" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Learning Tracks</Link></li>
              <li><Link href="#" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Documentation</Link></li>
              <li><Link href="#" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Discuss</Link></li>
              <li><Link href="#" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Contact</Link></li>
              <li><Link href="/privacy" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'LinkedIn', icon: <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/> },
              { label: 'Instagram', icon: <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/> },
              { label: 'YouTube', icon: <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/> },
              { label: 'Facebook', icon: <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/> },
              { label: 'Twitter', icon: <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.37-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.78 1.89 3.53-.7 0-1.36-.22-1.94-.53v.05c0 2.07 1.47 3.8 3.43 4.19-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.54 1.69 2.11 2.93 3.97 2.96-1.45 1.14-3.29 1.82-5.28 1.82-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/> },
            ].map((social) => (
              <a 
                key={social.label} 
                href="#" 
                aria-label={social.label} 
                className="w-12 h-12 rounded-full bg-[#d1d5db] flex items-center justify-center transition-all hover:scale-110 hover:bg-white flex-shrink-0"
              >
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-[#2a2d35] flex flex-col md:flex-row items-center justify-center">
          <p className="text-[#ababab] text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} ScriptNex</span>
            <span className="w-1 h-1 rounded-full bg-[#ababab]" />
            <span>All Rights Reserved</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
