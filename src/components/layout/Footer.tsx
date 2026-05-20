'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { api } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await api.post<{ message: string }>('/newsletter/subscribe', { email });
      setStatus('success');
      setMessage(res.data.message || 'Successfully subscribed! 🎉');
      setEmail('');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000);
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 4000);
    }
  };

  return (
    <footer className="bg-[#0f1115] border-t border-[#2a2d35] pt-16 pb-4 relative z-10 mt-auto">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-8">
          <div className="col-span-2 lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="mb-6">
              <Image src="/logo-nav.png" alt="ScriptNex — Free Online Coding Platform" width={180} height={60} className="h-[54px] md:h-[60px] w-auto object-contain" />
            </Link>
            
            <div className="flex flex-wrap gap-5 mb-8">
              {[
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/scriptnex/', icon: <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/> },
                { label: 'Instagram', href: 'https://www.instagram.com/scriptnex', icon: <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/> },
                { label: 'GitHub', href: 'https://github.com/ScriptNex-Learning', icon: <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" /> },
                { label: 'YouTube', href: 'https://www.youtube.com/@scriptnex', icon: <path d="M21.582 6.186a2.63 2.63 0 0 0-1.846-1.868C18.106 3.882 12 3.882 12 3.882s-6.106 0-7.736.436a2.63 2.63 0 0 0-1.846 1.868C2 7.838 2 12 2 12s0 4.162.418 5.814a2.63 2.63 0 0 0 1.846 1.868c1.63.436 7.736.436 7.736.436s6.106 0 7.736-.436a2.63 2.63 0 0 0 1.846-1.868C22 16.162 22 12 22 12s0-4.162-.418-5.814zM9.912 15.176V8.824L15.38 12l-5.468 3.176z" /> },
              ].map((social) => (
                <a 
                  key={social.label} 
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label} 
                  className="text-[#ababab] hover:text-white transition-colors"
                >
                  <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>

            <div className="w-full max-w-[280px]">
              <p className="text-[#ababab] text-[15px] mb-3">
                Get product updates and news from ScriptNex.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" 
                  required
                  className="bg-[#121212] border border-[#2a2d35] text-white text-[13px] rounded px-3 py-1.5 focus:outline-none focus:border-[#4a4d55] transition-colors w-full"
                />
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#00d285] hover:bg-[#00e691] text-black font-bold text-[12px] rounded px-3.5 py-[5px] transition-colors self-start disabled:opacity-50"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
                {message && (
                  <p className={`text-[11px] font-medium ${status === 'success' ? 'text-[#00d285]' : status === 'error' ? 'text-[#ef4444]' : 'text-[#ababab]'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>


          <nav className="col-span-1" aria-label="Platform navigation">
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/problems" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Practice Problems</Link></li>
              <li><Link href="/contests" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Coding Contests</Link></li>
              <li><Link href="/leaderboard" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Leaderboard</Link></li>
              <li><Link href="/certifications" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Coding Certifications</Link></li>
            </ul>
          </nav>

          <nav className="col-span-1" aria-label="Resources navigation">
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/tracks" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Learning Tracks</Link></li>
              <li><Link href="/discuss" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Discuss</Link></li>
              <li><Link href="/pricing" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Pricing</Link></li>
              <li><a href="https://github.com/ScriptNex-Learning" target="_blank" rel="noopener noreferrer" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">GitHub</a></li>
            </ul>
          </nav>

          <nav className="col-span-1" aria-label="Developers navigation">
            <h3 className="text-white font-semibold mb-4">Developers</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Blog</Link></li>
              <li><Link href="/changelog" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Changelog</Link></li>
              <li><Link href="/open-source" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Open Source</Link></li>
              <li><Link href="/careers" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Careers</Link></li>
            </ul>
          </nav>

          <nav className="col-span-1" aria-label="Company navigation">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Refund Policy</Link></li>
              <li><a href="mailto:support@scriptnex.com" className="text-[#ababab] hover:text-[#00d285] transition-colors text-sm">Contact Us</a></li>
            </ul>
          </nav>
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
