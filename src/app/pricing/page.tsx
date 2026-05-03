'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface RazorpayCheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpayCheckoutResponse) => void | Promise<void>;
}

interface RazorpayCheckoutInstance {
  open: () => void;
  on: (
    event: 'payment.failed',
    handler: (response: { error: { description?: string } }) => void
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}

interface CheckoutOrder {
  order_id: string;
  amount: number;
  currency: string;
  key: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
  };
}

interface VerifyPaymentResult {
  order_id: string;
  payment_id: string;
  status: string;
  paid: boolean;
}

const RAZORPAY_SCRIPT_ID = 'razorpay-checkout-js';

const loadRazorpayCheckout = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;

  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/forever',
    description: 'Start your journey at no cost',
    color: '#94a3b8',
    features: [
      '50+ free problems',
      'Beginner learning tracks',
      '2 contest entries/month',
      'Community discussions',
      'Basic profile',
    ],
    missing: ['Premium editorials', 'Certifications', 'Priority support'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    period: '/month',
    description: 'Perfect for learners starting',
    color: '#3b82f6',
    features: [
      'Access to 200+ problems',
      'Basic learning tracks',
      '5 contest entries/month',
      'Community discussions',
      'Basic profile & stats',
    ],
    missing: ['Premium editorials', 'Certifications', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    period: '/month',
    badge: 'Popular',
    description: 'For serious programmers',
    color: '#00d285',
    features: [
      'All 500+ problems',
      'All learning tracks',
      'Unlimited contest entries',
      'Premium editorials',
      'Certification exams',
      'Priority support',
    ],
    missing: [],
  },
];

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') {
      router.push('/register');
      return;
    }
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }
    setLoading(planId);
    let openedCheckout = false;

    try {
      const res = await api.post<CheckoutOrder>('/checkout/premium', { plan: planId });
      const checkoutLoaded = await loadRazorpayCheckout();

      if (!checkoutLoaded || !window.Razorpay) {
        throw new Error('Could not load Razorpay Checkout.');
      }

      const razorpay = new window.Razorpay({
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: res.data.name,
        description: res.data.description,
        order_id: res.data.order_id,
        prefill: res.data.prefill,
        theme: { color: '#00d285' },
        modal: {
          ondismiss: () => setLoading(current => current === planId ? null : current),
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post<VerifyPaymentResult>('/payment/verify', response);

            if (verifyRes.data.paid) {
              alert('Payment successful. Premium access has been unlocked.');
              router.push('/dashboard?payment=success');
              return;
            }

            alert('Payment is processing. Premium access will unlock after capture completes.');
            router.push('/dashboard?payment=pending');
          } catch (err) {
            const message = err instanceof ApiError
              ? err.message
              : 'Payment completed, but verification failed. Please contact support with your order ID.';

            alert(message);
          } finally {
            setLoading(null);
          }
        },
      });

      razorpay.on('payment.failed', (response) => {
        setLoading(null);
        alert(response.error.description || 'Payment failed. Please try again.');
      });

      openedCheckout = true;
      razorpay.open();
    } catch (err) {
      console.error('Checkout failed', err);
      const message = err instanceof ApiError
        ? err.message
        : 'Could not initiate payment. Please try again.';

      alert(message);
    } finally {
      if (!openedCheckout) {
        setLoading(null);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8fafc]">
      <Navbar />

      <main className="flex-1 pt-2 pb-10 px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="inline-block text-[10px] uppercase tracking-widest text-[#00d285] font-bold bg-[#00d285]/10 px-3 py-1 rounded-full mb-1">
            Membership
          </span>
          <h1 className="text-2xl md:text-3xl font-black mb-1">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d285] to-[#3b82f6]">Plan</span>
          </h1>
          <p className="text-[#94a3b8] text-[12px] max-w-lg mx-auto">
            Upgrade your skills with premium access to problems and certifications.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className="relative rounded-xl p-6 flex flex-col transition-all hover:translate-y-[-4px]"
              style={{
                background: plan.id === 'pro' ? 'linear-gradient(135deg, #16181d 0%, #1a1f1e 100%)' : '#16181d',
                border: plan.id === 'pro' ? `1px solid ${plan.color}50` : '1px solid #2a2d35',
                boxShadow: plan.id === 'pro' ? `0 10px 40px ${plan.color}10` : 'none',
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest text-black"
                  style={{ background: plan.color }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-lg font-bold mb-0.5" style={{ color: plan.id === 'pro' ? plan.color : '#fff' }}>{plan.name}</h2>
                <p className="text-[#64748b] text-[11px]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">₹{plan.price}</span>
                <span className="text-[#64748b] text-xs ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-[#cbd5e1]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-[#475569]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={!!loading}
                className="w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: plan.id === 'pro' ? plan.color : (plan.id === 'free' ? 'transparent' : 'rgba(255,255,255,0.03)'),
                  color: plan.id === 'pro' ? '#000' : (plan.id === 'free' ? '#94a3b8' : plan.color),
                  border: plan.id === 'pro' ? 'none' : `1px solid ${plan.id === 'free' ? '#2a2d35' : plan.color}`,
                }}
              >
                {loading === plan.id ? 'Loading...' : (plan.id === 'free' ? 'Get Started' : `Upgrade to ${plan.name}`)}
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
              { q: 'Is payment secure?', a: 'All payments are processed securely through Razorpay, a PCI-DSS compliant payment gateway trusted by businesses across India.' },
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
