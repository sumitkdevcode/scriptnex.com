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
          Free Online Coding Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 max-w-4xl leading-[1.1]">
          Master Programming Online.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d285] to-[#00e691]">
            Earn Verified Coding Certificates.
          </span>
        </h1>

        <p className="text-[#ababab] text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Practice 500+ coding challenges, follow structured learning tracks, compete in live programming contests, and earn verified certificates — all for free on ScriptNex.
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

      {/* Why ScriptNex — unique SEO content section */}
      <section className="relative z-10 border-t border-[#2a2d35] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Why Developers Choose ScriptNex</h2>
          <p className="text-[#ababab] text-sm text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            ScriptNex is built for developers who want to go beyond tutorials. Whether you&apos;re preparing for coding interviews, learning your first programming language, or sharpening your competitive programming skills, ScriptNex gives you everything you need in one platform.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#16181d] border border-[#2a2d35] rounded-md p-6">
              <h3 className="text-lg font-semibold mb-2 text-[#00d285]">Built for Real Learning</h3>
              <p className="text-sm text-[#ababab] leading-relaxed">
                Unlike passive video courses, ScriptNex focuses on active problem-solving. Every challenge comes with test cases, editorial solutions, and difficulty ratings so you can track your growth from beginner to advanced.
              </p>
            </div>
            <div className="bg-[#16181d] border border-[#2a2d35] rounded-md p-6">
              <h3 className="text-lg font-semibold mb-2 text-[#00d285]">Certificates That Matter</h3>
              <p className="text-sm text-[#ababab] leading-relaxed">
                Each ScriptNex certificate is backed by a timed exam and comes with a unique verification URL. Employers and recruiters can instantly verify your skills, making it a credible addition to your resume and LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 border-t border-[#2a2d35] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Everything You Need to Learn Programming</h2>
          <p className="text-[#ababab] text-sm text-center mb-10 max-w-xl mx-auto">From fundamental concepts to advanced algorithms, ScriptNex accelerates your coding journey.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⌨️', title: 'Interactive Coding Challenges', desc: 'Solve 500+ problems in our in-browser code editor with real-time feedback. Practice algorithms, data structures, and more.' },
              { icon: '🏆', title: 'Live Programming Contests', desc: 'Compete in weekly coding contests. Test your speed and accuracy under pressure, climb the leaderboard, and earn recognition.' },
              { icon: '📜', title: 'Verified Coding Certificates', desc: 'Take rigorous timed exams and earn verified certificates in Python, JavaScript, DSA, and more to prove your mastery.' },
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
            <h2 className="text-3xl font-bold mb-4">Your Path to Programming Mastery</h2>
            <p className="text-[#ababab] max-w-xl mx-auto">Follow a structured approach to become a confident programmer and land your dream developer role.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Learn', desc: 'Read curated tracks and editorials to master the fundamentals of algorithms and data structures.' },
              { step: '02', title: 'Practice', desc: 'Solve hundreds of problems in our blazing-fast IDE with real-time feedback and test cases.' },
              { step: '03', title: 'Compete', desc: 'Participate in weekly contests to test your speed and accuracy under time pressure.' },
              { step: '04', title: 'Get Certified', desc: 'Pass timed exams to earn verified certificates you can attach to your resume and LinkedIn.' },
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
          <h2 className="text-2xl font-bold mb-3">Code in Your Favorite Programming Language</h2>
          <p className="text-[#ababab] text-sm max-w-xl mx-auto">Write, run, and test code in our in-browser editor. No setup required — supports 20+ programming languages.</p>
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
                  aria-hidden="true"
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
            <p className="text-[#ababab] max-w-xl mx-auto">Everything you need to know about ScriptNex — the free online coding platform.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is ScriptNex?',
                a: 'ScriptNex is a free online coding platform designed for programmers of all skill levels. It offers 500+ interactive coding challenges, structured learning tracks, live programming contests, and verified certifications to help you master programming and advance your career.',
              },
              {
                q: 'Is ScriptNex free to use?',
                a: 'Yes! ScriptNex offers a generous free tier that includes access to hundreds of coding challenges, learning tracks, and community discussions. Premium plans unlock additional features like advanced certifications and exclusive contests.',
              },
              {
                q: 'How do I earn a coding certificate on ScriptNex?',
                a: 'To earn a certificate, navigate to the Certifications page, choose a topic like Python, JavaScript, or Data Structures, and take a timed exam. If you pass, you receive a verified digital certificate with a unique verification link that you can share on LinkedIn or attach to your resume.',
              },
              {
                q: 'What programming languages does ScriptNex support?',
                a: 'ScriptNex supports 20+ programming languages including Python, JavaScript, Java, C++, C, TypeScript, Go, Rust, and more. Our in-browser code editor provides real-time feedback so you can focus on learning without any setup.',
              },
              {
                q: 'How is ScriptNex different from LeetCode and HackerRank?',
                a: 'ScriptNex combines interactive coding practice, structured learning tracks, competitive programming contests, and verified certifications into a single free platform. Unlike other platforms, we offer a complete learning path from beginner to advanced with certificates that employers can verify instantly.',
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
                    text: 'ScriptNex is a free online coding platform designed for programmers of all skill levels. It offers 500+ interactive coding challenges, structured learning tracks, live programming contests, and verified certifications to help you master programming and advance your career.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is ScriptNex free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! ScriptNex offers a generous free tier that includes access to hundreds of coding challenges, learning tracks, and community discussions. Premium plans unlock additional features like advanced certifications and exclusive contests.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I earn a coding certificate on ScriptNex?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'To earn a certificate, navigate to the Certifications page, choose a topic like Python, JavaScript, or Data Structures, and take a timed exam. If you pass, you receive a verified digital certificate with a unique verification link that you can share on LinkedIn or attach to your resume.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What programming languages does ScriptNex support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ScriptNex supports 20+ programming languages including Python, JavaScript, Java, C++, C, TypeScript, Go, Rust, and more. Our in-browser code editor provides real-time feedback so you can focus on learning without any setup.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How is ScriptNex different from LeetCode and HackerRank?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ScriptNex combines interactive coding practice, structured learning tracks, competitive programming contests, and verified certifications into a single free platform. Unlike other platforms, we offer a complete learning path from beginner to advanced with certificates that employers can verify instantly.',
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
          <h2 className="text-4xl font-bold mb-6">Ready to Write Better Code?</h2>
          <p className="text-[#ababab] text-lg mb-10">Join thousands of developers on ScriptNex. Start solving coding challenges, earn certificates, and level up your career — completely free.</p>
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
