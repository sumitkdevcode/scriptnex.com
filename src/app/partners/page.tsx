import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Partners & Resources | ScriptNex',
  description: 'Explore our trusted educational partners, sponsors, and coding resources. Exchange links with ScriptNex.',
};

export default function PartnersPage() {
  const partners = [
    {
      name: 'TechInterview Pro',
      url: 'https://techinterviewpro.com',
      description: 'The ultimate guide to passing software engineering interviews at FAANG.',
      category: 'Interview Prep',
    },
    {
      name: 'CodeMentor',
      url: 'https://codementor.io',
      description: 'Find a freelance developer or mentor for 1-on-1 live coding help.',
      category: 'Mentorship',
    },
    {
      name: 'OpenSource.org',
      url: 'https://opensource.org',
      description: 'The Open Source Initiative (OSI) protects and promotes open source software.',
      category: 'Community',
    },
    // Add more partners here as they exchange links
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted <span className="text-[#00d285]">Partners</span> & Resources
          </h1>
          <p className="text-lg text-[#ababab]">
            We collaborate with the best platforms in the industry to bring you top-tier coding resources, interview prep, and community support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1a1d24] border border-[#2d3139] rounded-xl p-6 hover:border-[#00d285] transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00d285] bg-[#00d285]/10 px-3 py-1 rounded-full">
                  {partner.category}
                </span>
                <svg
                  className="w-5 h-5 text-[#ababab] group-hover:text-[#00d285] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#00d285] transition-colors">{partner.name}</h3>
              <p className="text-[#ababab] text-sm flex-1">{partner.description}</p>
            </a>
          ))}
        </div>

        {/* Link Exchange CTA */}
        <div className="bg-gradient-to-r from-[#1a1d24] to-[#0f1115] border border-[#2d3139] rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d285]/10 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">Want to exchange links?</h2>
          <p className="text-[#ababab] mb-8 max-w-2xl mx-auto relative z-10">
            If you run a high-quality coding, tech, or educational website and want to exchange backlinks with ScriptNex, we&apos;d love to partner with you. Let&apos;s grow together!
          </p>
          <a
            href="mailto:contact@scriptnex.com?subject=Link Exchange Request"
            className="inline-block bg-[#00d285] text-black font-bold px-8 py-3 rounded-lg hover:bg-[#00e691] transition-colors relative z-10"
          >
            Request Link Exchange
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
