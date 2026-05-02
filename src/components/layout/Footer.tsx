import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f1115] border-t border-[#2a2d35] pt-16 pb-8 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <img src="/logo-nav.png" alt="ScriptNex Logo" className="h-[60px] w-auto object-contain" />

            </Link>
            <p className="text-[#64748b] text-sm leading-relaxed mb-6">
              The ultimate platform to level up your coding skills, prepare for technical interviews, and earn verified certifications.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/problems" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Practice Problems</Link></li>
              <li><Link href="/contests" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Contests</Link></li>
              <li><Link href="/leaderboard" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Leaderboard</Link></li>
              <li><Link href="/certifications" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Certifications</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/tracks" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Learning Tracks</Link></li>
              <li><Link href="#" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Documentation</Link></li>
              <li><Link href="#" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Discuss</Link></li>
              <li><Link href="#" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Contact</Link></li>
              <li><Link href="#" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[#64748b] hover:text-[#00d285] transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2a2d35] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#475569] text-sm">
            &copy; {new Date().getFullYear()} ScriptNex. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Twitter" className="text-[#64748b] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" aria-label="GitHub" className="text-[#64748b] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
