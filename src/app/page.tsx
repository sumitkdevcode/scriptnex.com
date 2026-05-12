import Link from "next/link";
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { getPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata("/");
}

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
          The Ultimate Learning Education Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 max-w-4xl leading-[1.1]">
          Master Programming.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d285] to-[#00e691]">
            Earn a ScriptNex Certificate.
          </span>
        </h1>

        <p className="text-[#ababab] text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Accelerate your learning education journey. Practice programming challenges, master complex concepts, and earn a verified ScriptNex certificate to showcase your expertise.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
          <Link href="/register" className="px-6 py-3.5 rounded-md bg-[#00d285] text-black font-bold text-sm hover:bg-[#00e691] transition-colors shadow-[0_0_30px_rgba(0,210,133,0.2)]">
            Get Started — It&apos;s Free
          </Link>
          <Link href="/problems" className="px-6 py-3.5 rounded-md border border-[#2a2d35] text-white font-semibold text-sm hover:bg-white/5 transition-colors">
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
              <div className="text-[10px] text-[#ababab] mt-0.5 uppercase tracking-wide font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 border-t border-[#2a2d35] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Comprehensive Programming Education</h2>
          <p className="text-[#ababab] text-sm text-center mb-10 max-w-xl mx-auto">From fundamental programming concepts to advanced algorithms, ScriptNex accelerates your learning.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⌨️', title: 'Interactive Learning', desc: 'Solve 500+ programming challenges to reinforce your education with our in-browser code editor.' },
              { icon: '🏆', title: 'Live Contests', desc: 'Compete in programming contests. Climb the leaderboard and earn recognition.' },
              { icon: '📜', title: 'ScriptNex Certificate', desc: 'Take rigorous exams and earn a verified ScriptNex certificate to prove your programming mastery.' },
            ].map((f) => (
              <div key={f.title} className="bg-[#16181d] border border-[#2a2d35] rounded-md p-6 hover:border-[#00d285]/20 transition-colors group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[#00d285] transition-colors">{f.title}</h3>
                <p className="text-sm text-[#ababab] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-6 bg-[#16181d] border-t border-[#2a2d35]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Your Programming Learning Path</h2>
            <p className="text-[#ababab] max-w-xl mx-auto">Follow a structured learning education approach to land your dream role.</p>
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
                <p className="text-sm text-[#ababab] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="relative z-10 py-16 px-6 border-t border-[#2a2d35] overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">Start Learning in Your Favorite Language</h2>
          <p className="text-[#ababab] text-sm max-w-xl mx-auto">Write, run, and test code in our in-browser editor. No setup required.</p>
        </div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0f1115] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0f1115] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 animate-marquee">
            {[
              { name: 'Python', color: '#3776AB' },
              { name: 'JavaScript', color: '#F7DF1E' },
              { name: 'Java', color: '#ED8B00' },
              { name: 'C++', color: '#00599C' },
              { name: 'C', color: '#A8B9CC' },
              { name: 'TypeScript', color: '#3178C6' },
              { name: 'Go', color: '#00ADD8' },
              { name: 'Rust', color: '#DEA584' },
              { name: 'Ruby', color: '#CC342D' },
              { name: 'PHP', color: '#777BB4' },
              { name: 'Swift', color: '#FA7343' },
              { name: 'Kotlin', color: '#7F52FF' },
              { name: 'C#', color: '#239120' },
              { name: 'Dart', color: '#0175C2' },
              { name: 'Scala', color: '#DC322F' },
              { name: 'R', color: '#276DC3' },
              { name: 'SQL', color: '#E38C00' },
              { name: 'Perl', color: '#39457E' },
              { name: 'Haskell', color: '#5D4F85' },
              { name: 'Lua', color: '#000080' },
              { name: 'Python', color: '#3776AB' },
              { name: 'JavaScript', color: '#F7DF1E' },
              { name: 'Java', color: '#ED8B00' },
              { name: 'C++', color: '#00599C' },
              { name: 'C', color: '#A8B9CC' },
              { name: 'TypeScript', color: '#3178C6' },
              { name: 'Go', color: '#00ADD8' },
              { name: 'Rust', color: '#DEA584' },
              { name: 'Ruby', color: '#CC342D' },
              { name: 'PHP', color: '#777BB4' },
              { name: 'Swift', color: '#FA7343' },
              { name: 'Kotlin', color: '#7F52FF' },
              { name: 'C#', color: '#239120' },
              { name: 'Dart', color: '#0175C2' },
              { name: 'Scala', color: '#DC322F' },
              { name: 'R', color: '#276DC3' },
              { name: 'SQL', color: '#E38C00' },
              { name: 'Perl', color: '#39457E' },
              { name: 'Haskell', color: '#5D4F85' },
              { name: 'Lua', color: '#000080' },
            ].map((lang, i) => (
              <div
                key={`${lang.name}-${i}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#16181d] border border-[#2a2d35] shrink-0"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-sm font-semibold text-[#ababab] whitespace-nowrap">
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-6 border-t border-[#2a2d35] bg-[#16181d]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-[#ababab] max-w-xl mx-auto">Everything you need to know about ScriptNex — the programming and learning education platform.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is ScriptNex?',
                a: 'ScriptNex is a comprehensive learning education platform designed for programmers of all skill levels. It offers interactive coding challenges, structured learning tracks, live programming contests, and industry-recognized certifications to help you master programming.',
              },
              {
                q: 'Is ScriptNex free to use?',
                a: 'Yes! ScriptNex offers a generous free tier that includes access to hundreds of programming challenges, learning tracks, and community discussions. Premium plans unlock additional features like advanced certifications and exclusive contests.',
              },
              {
                q: 'How do I earn a ScriptNex certificate?',
                a: 'To earn a ScriptNex certificate, navigate to the Certifications page, choose a topic, and take a timed exam. If you pass, you receive a verified digital certificate with a unique verification link that you can share on LinkedIn or attach to your resume.',
              },
              {
                q: 'What programming languages does ScriptNex support?',
                a: 'ScriptNex supports popular programming languages including Python, JavaScript, Java, C++, and C. Our in-browser code editor provides real-time feedback so you can focus on learning without any setup.',
              },
              {
                q: 'How is ScriptNex different from other learning platforms?',
                a: 'ScriptNex combines learning education, competitive programming, and certification into a single platform. Unlike other platforms, we offer structured learning paths, live contests with leaderboards, and verified certificates — all in one place.',
              },
              {
                q: 'Can I use ScriptNex certificates on my resume?',
                a: 'Absolutely. Every ScriptNex certificate comes with a unique verification URL. Employers and recruiters can verify your certificate instantly, making it a credible addition to your resume and LinkedIn profile.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-[#0f1115] border border-[#2a2d35] rounded-lg overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-semibold text-sm hover:text-[#00d285] transition-colors list-none">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-[#ababab] group-open:rotate-180 transition-transform shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-[#ababab] text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* FAQ JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is ScriptNex?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ScriptNex is a comprehensive learning education platform designed for programmers of all skill levels. It offers interactive coding challenges, structured learning tracks, live programming contests, and industry-recognized certifications to help you master programming.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is ScriptNex free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! ScriptNex offers a generous free tier that includes access to hundreds of programming challenges, learning tracks, and community discussions. Premium plans unlock additional features like advanced certifications and exclusive contests.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I earn a ScriptNex certificate?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'To earn a ScriptNex certificate, navigate to the Certifications page, choose a topic, and take a timed exam. If you pass, you receive a verified digital certificate with a unique verification link that you can share on LinkedIn or attach to your resume.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What programming languages does ScriptNex support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ScriptNex supports popular programming languages including Python, JavaScript, Java, C++, and C. Our in-browser code editor provides real-time feedback so you can focus on learning without any setup.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How is ScriptNex different from other learning platforms?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ScriptNex combines learning education, competitive programming, and certification into a single platform. Unlike other platforms, we offer structured learning paths, live contests with leaderboards, and verified certificates — all in one place.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I use ScriptNex certificates on my resume?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Every ScriptNex certificate comes with a unique verification URL. Employers and recruiters can verify your certificate instantly, making it a credible addition to your resume and LinkedIn profile.',
                  },
                },
              ],
            }),
          }}
        />
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 border-t border-[#2a2d35] overflow-hidden">
        <div className="absolute inset-0 bg-[#00d285]/5" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to write better code?</h2>
          <p className="text-[#ababab] text-lg mb-10">Join ScriptNex today and unlock your full potential. Start solving problems for free.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-[#00d285] text-black font-bold text-base hover:bg-[#00e691] transition-transform hover:scale-105 shadow-[0_0_30px_rgba(0,210,133,0.3)]">
            Create Free Account
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
