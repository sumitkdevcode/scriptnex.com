'use client';

import { useState, useEffect } from 'react';
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
  key?: string;
  name?: string;
  description?: string;
  prefill?: {
    name: string;
    email: string;
  };
  gateway?: 'razorpay' | 'cashfree';
  payment_session_id?: string;
  environment?: string;
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

const CASHFREE_SCRIPT_ID = 'cashfree-checkout-js';

const loadCashfreeCheckout = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  if ((window as any).Cashfree) return true;

  const existingScript = document.getElementById(CASHFREE_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = CASHFREE_SCRIPT_ID;
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
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
    color: '#ababab',
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
  const [config, setConfig] = useState<{ active_gateway: string } | null>(null);
  const [gatewayModal, setGatewayModal] = useState<string | null>(null); // stores planId

  useEffect(() => {
    api.get<{ active_gateway: string }>('/payment/config')
      .then(res => setConfig(res.data))
      .catch(() => {});
  }, []);

  const handleCheckout = async (planId: string, selectedGateway?: 'razorpay' | 'cashfree') => {
    if (planId === 'free') {
      router.push('/register');
      return;
    }
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }
    if (config?.active_gateway === 'both' && !selectedGateway) {
      setGatewayModal(planId);
      return;
    }

    setLoading(planId);
    let openedCheckout = false;

    const verifyCashfreePayment = async (orderId: string) => {
      try {
        setLoading(planId);
        const verifyRes = await api.post<VerifyPaymentResult>('/payment/verify', { gateway: 'cashfree', order_id: orderId });
        
        if (verifyRes.data.paid) {
          alert('Payment successful. Premium access has been unlocked.');
          router.push('/dashboard?payment=success');
        } else {
          alert('Payment is processing. Premium access will unlock after capture completes.');
          router.push('/dashboard?payment=pending');
        }
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Payment completed, but verification failed.';
        alert(message);
      } finally {
        setLoading(null);
      }
    };

    try {
      const res = await api.post<CheckoutOrder>('/checkout/premium', { 
        plan: planId,
        ...(selectedGateway && { gateway: selectedGateway })
      });

      if (res.data.gateway === 'cashfree') {
        const checkoutLoaded = await loadCashfreeCheckout();
        if (!checkoutLoaded || !(window as any).Cashfree) {
          throw new Error('Could not load Cashfree Checkout.');
        }

        const cashfree = (window as any).Cashfree({
          mode: res.data.environment === 'production' ? 'production' : 'sandbox'
        });

        cashfree.checkout({
          paymentSessionId: res.data.payment_session_id,
          redirectTarget: "_modal",
        }).then((result: any) => {
          if (result.error) {
            setLoading(null);
            alert(result.error.message || 'Payment failed. Please try again.');
          } else if (result.redirect) {
            console.log('Cashfree is redirecting...');
          } else if (result.paymentDetails) {
            // Cashfree modal completed
            verifyCashfreePayment(res.data.order_id);
          }
        });

        openedCheckout = true;
        return;
      }

      const checkoutLoaded = await loadRazorpayCheckout();

      if (!checkoutLoaded || !window.Razorpay) {
        throw new Error('Could not load Razorpay Checkout.');
      }

      const razorpay = new window.Razorpay({
        key: res.data.key || '',
        amount: res.data.amount,
        currency: res.data.currency,
        name: res.data.name || '',
        description: res.data.description || '',
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
      {gatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setGatewayModal(null)} className="absolute top-4 right-4 text-[#ababab] hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-2">Select Payment Method</h3>
            <p className="text-sm text-[#ababab] mb-6">Choose your preferred secure payment gateway to complete the transaction.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setGatewayModal(null); void handleCheckout(gatewayModal, 'razorpay'); }} className="flex items-center justify-between p-4 rounded-xl border border-[#2a2d35] bg-[#0f1115] hover:border-[#00d285] transition-colors">
                <span className="font-bold text-[#f8fafc]">Razorpay</span>
                <span className="text-[10px] uppercase tracking-wider text-[#00d285] bg-[#00d285]/10 px-2 py-1 rounded">Popular</span>
              </button>
              <button onClick={() => { setGatewayModal(null); void handleCheckout(gatewayModal, 'cashfree'); }} className="flex items-center justify-between p-4 rounded-xl border border-[#2a2d35] bg-[#0f1115] hover:border-[#3b82f6] transition-colors">
                <span className="font-bold text-[#f8fafc]">Cashfree</span>
                <span className="text-[10px] uppercase tracking-wider text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-1 rounded">Fast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <main className="flex-1 pt-10 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[10px] uppercase tracking-widest text-[#00d285] font-bold bg-[#00d285]/10 px-3 py-1 rounded-full mb-3">
            Membership
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d285] to-[#3b82f6]">Plan</span>
          </h1>
          <p className="text-[#ababab] text-sm md:text-base max-w-lg mx-auto">
            Upgrade your skills with premium access to problems and certifications.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className="relative rounded-md p-6 flex flex-col transition-all hover:translate-y-[-4px]"
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
                <p className="text-[#ababab] text-[11px]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">₹{plan.price}</span>
                <span className="text-[#ababab] text-xs ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-[#cbd5e1]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-[#ababab]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ababab" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={!!loading}
                className="w-full py-2.5 px-4 rounded-md font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: plan.id === 'pro' ? plan.color : (plan.id === 'free' ? 'transparent' : 'rgba(255,255,255,0.03)'),
                  color: plan.id === 'pro' ? '#000' : (plan.id === 'free' ? '#ababab' : plan.color),
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
              <div key={q} className="bg-[#16181d] border border-[#2a2d35] rounded-md p-6">
                <h3 className="font-semibold text-sm mb-2">{q}</h3>
                <p className="text-[#ababab] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
