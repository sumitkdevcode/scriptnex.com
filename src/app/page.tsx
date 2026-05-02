import Link from "next/link";
import Footer from '@/components/layout/Footer';
import HomeNavbar from '@/components/layout/HomeNavbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc] overflow-hidden">
      {/* Background glows */}
      <div className="fixed top-[-30%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#00d285] opacity-[0.03] blur-[150px] z-0 pointer-events-none" />
      <div className="fixed bottom-[-30%] right-[10%] w-[50%] h-[50%] rounded-full bg-[#6366f1] opacity-[0.02] blur-[150px] z-0 pointer-events-none" />

      {/* Navbar */}
      <HomeNavbar />
      <div className="h-[65px]" aria-hidden="true"></div>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00d285]/30 text-xs font-medium text-[#00d285] mb-10 bg-[#00d285]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d285] animate-pulse" />
          Level Up Your Coding Skills
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-[1.1]">
          Practice. Compete.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d285] to-[#00e691]">
            Get Certified.
          </span>
        </h1>

        <p className="text-[#94a3b8] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Join thousands of developers who sharpen their skills through coding challenges, earn industry-recognized certifications, and showcase their expertise.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Link href="/register" className="px-8 py-4 rounded-xl bg-[#00d285] text-black font-bold text-base hover:bg-[#00e691] transition-colors shadow-[0_0_30px_rgba(0,210,133,0.2)]">
            Get Started — It&apos;s Free
          </Link>
          <Link href="/problems" className="px-8 py-4 rounded-xl border border-[#2a2d35] text-white font-semibold text-base hover:bg-white/5 transition-colors">
            Explore Challenges
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg">
          {[
            { num: '500+', label: 'Coding Problems' },
            { num: '50K+', label: 'Developers' },
            { num: '20+', label: 'Certifications' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-[#00d285]">{stat.num}</div>
              <div className="text-xs text-[#64748b] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 border-t border-[#2a2d35] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need to level up</h2>
          <p className="text-[#94a3b8] text-center mb-14 max-w-xl mx-auto">From beginner to expert, ScriptNex has tools for every stage of your coding journey.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⌨️', title: 'Practice Problems', desc: 'Solve 500+ challenges across arrays, strings, trees, DP, graphs, and more with an in-browser code editor.' },
              { icon: '🏆', title: 'Live Contests', desc: 'Compete in rated and unrated contests. Climb the leaderboard and earn recognition.' },
              { icon: '📜', title: 'Certifications', desc: 'Take timed exams and earn verified certificates to prove your skills to employers.' },
            ].map((f) => (
              <div key={f.title} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6 hover:border-[#00d285]/20 transition-colors group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[#00d285] transition-colors">{f.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
