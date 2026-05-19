import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageMetadata('/terms');
  return {
    title: seo.title || 'Terms and Conditions | ScriptNex',
    description: seo.description || 'Read the terms and conditions for using the ScriptNex platform.',
    ...seo,
  };
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-[#ababab] mb-12">Last Updated: May 2026</p>

        <div className="space-y-8 text-[#ababab] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ScriptNex ("the Platform"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. User Accounts</h2>
            <p>
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Intellectual Property</h2>
            <p>
              All content on ScriptNex, including but not limited to problems, challenges, learning tracks, and software code, is the property of ScriptNex or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Prohibited Conduct</h2>
            <p>
              Users are prohibited from:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Attempting to bypass platform security or automated judging systems.</li>
              <li>Plagiarizing solutions or sharing answers for active contests.</li>
              <li>Using the platform for any illegal purpose or to harass other users.</li>
              <li>Scraping content or automated harvesting of platform data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Subscription and Payments</h2>
            <p>
              Certain features require a paid subscription. All payments are processed securely through our third-party payment gateways. Subscriptions automatically renew unless cancelled before the end of the current period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p>
              ScriptNex is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Significant changes will be communicated via email or platform announcements.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
