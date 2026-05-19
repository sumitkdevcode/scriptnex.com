import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageMetadata('/refund');
  return {
    title: seo.title || 'Refund Policy | ScriptNex',
    description: seo.description || 'Review our policy regarding refunds and subscription cancellations.',
    ...seo,
  };
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-[#ababab] mb-12">Last Updated: May 2026</p>

        <div className="space-y-8 text-[#ababab] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Subscription Cancellations</h2>
            <p>
              You can cancel your ScriptNex Pro subscription at any time through your Account Settings. Upon cancellation, you will continue to have access to Pro features until the end of your current billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Eligibility for Refunds</h2>
            <p>
              Due to the digital nature of our content (problems, editorials, and certificates), we generally do not offer refunds once a subscription has been used to access premium content or take a certification exam.
            </p>
            <p className="mt-4">
              However, we may consider refund requests in the following exceptional cases:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Technical issues preventing you from accessing the Platform for an extended period.</li>
              <li>Duplicate charges caused by a processing error.</li>
              <li>Fraudulent transactions made using your payment method.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Refund Request Process</h2>
            <p>
              To request a refund, please contact our support team at <span className="text-[#00d285]">support@scriptnex.com</span> within 7 days of the transaction. Please include your transaction ID and a brief explanation of the issue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Processing Refunds</h2>
            <p>
              If approved, refunds will be processed back to the original payment method within 5-10 business days, depending on your bank or card issuer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Certificate Purchases</h2>
            <p>
              Payments made specifically to unlock and download a certification PDF are final and non-refundable once the download link has been generated.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
