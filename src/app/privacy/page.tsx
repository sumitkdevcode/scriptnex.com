import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata('/privacy');
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-[#ababab] mb-12">Last Updated: May 2026</p>

        <div className="space-y-8 text-[#ababab] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or submit code solutions. This includes your name, email address, username, and profile data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Usage Data</h2>
            <p>
              We automatically collect information about your interactions with the Platform, including IP addresses, browser types, pages visited, and time spent on the site to improve our services and security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To provide and maintain our services.</li>
              <li>To process payments and subscriptions.</li>
              <li>To track your coding progress and award certifications.</li>
              <li>To send administrative emails and marketing communications (you can opt-out).</li>
              <li>To detect and prevent fraudulent or prohibited activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We share data only with trusted third-party service providers (like payment processors and cloud hosting) necessary to operate the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Cookies</h2>
            <p>
              We use cookies to maintain your session, remember your preferences, and analyze platform traffic. You can control cookie settings in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can manage most of this data directly through your profile settings or by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
