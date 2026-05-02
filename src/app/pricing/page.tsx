'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    period: '/month',
    description: 'Perfect for learners getting started',
    color: '#3b82f6',
    features: [
      'Access to 200+ problems',
      'Basic learning tracks',
      '5 contest entries/month',
      'Community discussions',
      'Basic profile & stats',
    ],
    missing: ['Premium editorials', 'Certification exams', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    period: '/month',
    badge: 'Most Popular',
    description: 'For serious competitive programmers',
    color: '#00d285',
    features: [
      'All 500+ problems unlocked',
      'All learning tracks',
      'Unlimited contest entries',
      'Premium editorials',
      'Certification exams (unlimited)',
      'Activity heatmap & analytics',
      'Priority support',
      'Downloadable certificates',
    ],
    missing: [],
  },
];

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }
    setLoading(planId);
    try {
      const res = await api.post<{
        success: boolean;
        order_id: string;
        payment_session_id: string;
      }>('/checkout/premium', { plan: planId });

      if (res.data.success) {
        // Load Cashfree JS SDK and trigger payment
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.onload = () => {
          // @ts-expect-error - Cashfree JS SDK global
          const cashfree = Cashfree({ mode: 'sandbox' });
          cashfree.checkout({
            paymentSessionId: res.data.payment_session_id,
            redirectTarget: '_modal',
          }).then(() => {
            router.push(`/dashboard?order_id=${res.data.order_id}`);
          });
        };
        document.head.appendChild(script);
      }
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Could not initiate payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs uppercase tracking-widest text-[#00d285] font-semibold bg-[#00d285]/10 px-4 py-1.5 rounded-full mb-6">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-5">
            Invest in your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d285] to-[#3b82f6]">
              coding career
            </span>
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-xl mx-auto">
            Level up with premium problems, certifications, and exclusive learning tracks. Cancel anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Free</h2>
              <p className="text-[#64748b] text-sm">Start your journey at no cost</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-black">₹0</span>
              <span className="text-[#64748b] ml-1">/forever</span>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {['50+ free problems', 'Beginner learning tracks', '2 contest entries/month', 'Community discussions', 'Basic profile'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
              {['Premium editorials', 'Certifications', 'Priority support'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#475569]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <a href="/register" className="block text-center py-3 px-6 border border-[#2a2d35] rounded-xl font-bold text-sm hover:border-[#475569] transition-colors">
              Get Started Free
            </a>
          </div>

          {PLANS.map(plan => (
            <div
              key={plan.id}
              className="relative rounded-2xl p-8 flex flex-col"
              style={{
                background: plan.id === 'pro' ? 'linear-gradient(135deg, #16181d 0%, #1a1f1e 100%)' : '#16181d',
                border: `1px solid ${plan.color}40`,
                boxShadow: plan.id === 'pro' ? `0 0 40px ${plan.color}15` : 'none',
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider text-black"
                  style={{ background: plan.color }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: plan.color }}>{plan.name}</h2>
                <p className="text-[#64748b] text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-black">₹{plan.price}</span>
                <span className="text-[#64748b] ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#475569]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={!!loading}
                className="w-full py-3 px-6 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
                style={{
                  background: plan.id === 'pro' ? plan.color : 'transparent',
                  color: plan.id === 'pro' ? '#000' : plan.color,
                  border: `1px solid ${plan.color}`,
                }}
              >
                {loading === plan.id ? 'Processing...' : `Get ${plan.name} — ₹${plan.price}/mo`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You\'ll retain access until the end of your billing period.' },
              { q: 'Is payment secure?', a: 'All payments are processed securely through Cashfree, a PCI-DSS compliant payment gateway trusted by thousands of businesses in India.' },
              { q: 'Do certifications expire?', a: 'ScriptNex certificates are issued for lifetime by default. Some advanced certifications may have optional renewal periods.' },
              { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade your plan at any time. Prorated billing applies when upgrading.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-[#16181d] border border-[#2a2d35] rounded-xl p-6">
                <h3 className="font-semibold text-sm mb-2">{q}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
