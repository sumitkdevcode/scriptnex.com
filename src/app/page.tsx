import Link from "next/link";
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc] overflow-hidden">
      {/* Background glows */}
      <div className="fixed top-[-30%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#00d285] opacity-[0.03] blur-[150px] z-0 pointer-events-none" />
      <div className="fixed bottom-[-30%] right-[10%] w-[50%] h-[50%] rounded-full bg-[#6366f1] opacity-[0.02] blur-[150px] z-0 pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d285]/30 text-[10px] font-bold text-[#00d285] mb-6 bg-[#00d285]/5 uppercase tracking-wider">
          <span className="w-1 h-1 rounded-full bg-[#00d285] animate-pulse" />
          Level Up Your Coding Skills
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 max-w-4xl leading-[1.1]">
          Practice. Compete.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d285] to-[#00e691]">
            Get Certified.
          </span>
        </h1>

        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Join thousands of developers who sharpen their skills through coding challenges, earn industry-recognized certifications, and showcase their expertise.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
          <Link href="/register" className="px-6 py-3.5 rounded-xl bg-[#00d285] text-black font-bold text-sm hover:bg-[#00e691] transition-colors shadow-[0_0_30px_rgba(0,210,133,0.2)]">
            Get Started — It&apos;s Free
          </Link>
          <Link href="/problems" className="px-6 py-3.5 rounded-xl border border-[#2a2d35] text-white font-semibold text-sm hover:bg-white/5 transition-colors">
            Explore Challenges
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-md">
          {[
            { num: '500+', label: 'Coding Problems' },
            { num: '50K+', label: 'Developers' },
            { num: '20+', label: 'Certifications' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-[#00d285]">{stat.num}</div>
              <div className="text-[10px] text-[#64748b] mt-0.5 uppercase tracking-wide font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 border-t border-[#2a2d35] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Everything you need to level up</h2>
          <p className="text-[#94a3b8] text-sm text-center mb-10 max-w-xl mx-auto">From beginner to expert, ScriptNex has tools for every stage of your coding journey.</p>

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

      {/* How It Works */}
      <section className="relative z-10 py-20 px-6 bg-[#16181d] border-t border-[#2a2d35]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Your Path to Mastery</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">Follow a structured approach to land your dream role.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Learn', desc: 'Read curated tracks and editorials to master the fundamentals of algorithms.' },
              { step: '02', title: 'Practice', desc: 'Solve hundreds of problems in our blazing-fast IDE with real-time feedback.' },
              { step: '03', title: 'Compete', desc: 'Participate in weekly contests to test your speed and accuracy under pressure.' },
              { step: '04', title: 'Certify', desc: 'Pass timed exams to earn verified certificates to attach to your resume.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-5xl font-extrabold text-[#2a2d35] mb-4">{s.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{s.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof */}
      <section className="relative z-10 py-16 px-6 border-t border-[#2a2d35]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-8">Developers from top companies train here</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Fake Logos using Text for demonstration */}
            <div className="text-xl font-bold tracking-tighter">Google</div>
            <div className="text-xl font-bold">Meta</div>
            <div className="text-xl font-bold tracking-tight">amazon</div>
            <div className="text-xl font-bold">Microsoft</div>
            <div className="text-xl font-bold italic">Netflix</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 border-t border-[#2a2d35] overflow-hidden">
        <div className="absolute inset-0 bg-[#00d285]/5" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to write better code?</h2>
          <p className="text-[#94a3b8] text-lg mb-10">Join ScriptNex today and unlock your full potential. Start solving problems for free.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00d285] text-black font-bold text-base hover:bg-[#00e691] transition-transform hover:scale-105 shadow-[0_0_30px_rgba(0,210,133,0.3)]">
            Create Free Account
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
