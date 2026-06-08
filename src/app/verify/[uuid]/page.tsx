'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { downloadCertificatePdf } from '@/lib/certificates';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

interface Certificate {
  uuid: string;
  verification_url: string;
  user: { name: string; username: string };
  certification: { title: string; difficulty_level: string };
  score: number;
  percentage: number;
  issued_at: string;
  download_price_paise: number;
  download_paid: boolean;
}

interface OwnedCertificate {
  uuid: string;
  verification_url: string;
  certification_title: string;
  download_price_paise: number;
  download_paid: boolean;
  download_paid_at: string | null;
}

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
  unlocked?: boolean;
  verification_url?: string;
}

interface VerifyPaymentResult {
  order_id: string;
  payment_id: string;
  status: string;
  paid: boolean;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
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

export default function VerifyCertPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;
  const verifyPath = `/verify/${uuid}`;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [cert, setCert] = useState<Certificate | null>(null);
  const [ownedCertificate, setOwnedCertificate] = useState<OwnedCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUnlockingDownload, setIsUnlockingDownload] = useState(false);
  const [ownerStatusLoading, setOwnerStatusLoading] = useState(false);
  const [config, setConfig] = useState<{ active_gateway: string } | null>(null);
  const [showGatewayModal, setShowGatewayModal] = useState(false);

  useEffect(() => {
    api.get<{ active_gateway: string }>('/payment/config')
      .then(res => setConfig(res.data))
      .catch(() => {});
  }, []);

  const loadOwnedCertificate = useCallback(async () => {
    if (!isAuthenticated) {
      setOwnedCertificate(null);
      return;
    }

    setOwnerStatusLoading(true);

    try {
      const response = await api.get<{ certificate: OwnedCertificate }>(`/my-certificates/${uuid}`, { force: true });
      setOwnedCertificate(response.data.certificate);
    } catch {
      setOwnedCertificate(null);
    } finally {
      setOwnerStatusLoading(false);
    }
  }, [isAuthenticated, uuid]);

  const handleDownloadPdf = useCallback(async (forceAccess = false) => {
    if (!cert || (!forceAccess && !cert.download_paid)) {
      return;
    }

    try {
      setIsDownloading(true);
      await downloadCertificatePdf(cert.uuid, `ScriptNex-Certificate-${cert.user.name.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      const message = err instanceof ApiError
        ? err.message
        : 'Failed to download the certificate PDF. Please try again.';
      alert(message);
    } finally {
      setIsDownloading(false);
    }
  }, [cert]);

  const handleUnlockDownload = useCallback(async (selectedGateway?: 'razorpay' | 'cashfree') => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(verifyPath)}`);
      return;
    }

    if (!ownedCertificate) {
      alert('Only the certificate owner can unlock this PDF download.');
      return;
    }

    if (ownedCertificate.download_paid) {
      await handleDownloadPdf();
      return;
    }

    if (config?.active_gateway === 'both' && !selectedGateway) {
      setShowGatewayModal(true);
      return;
    }

    setIsUnlockingDownload(true);
    let openedCheckout = false;

    try {
      const response = await api.post<CheckoutOrder>(`/my-certificates/${uuid}/download/checkout`, {
        ...(selectedGateway && { gateway: selectedGateway })
      });

      if (response.data.unlocked) {
        await loadOwnedCertificate();
        alert('Certificate download unlocked.');
        return;
      }

      if (response.data.gateway === 'cashfree') {
        const checkoutLoaded = await loadCashfreeCheckout();
        if (!checkoutLoaded || !(window as any).Cashfree) {
          throw new Error('Could not load Cashfree Checkout.');
        }

        const cashfree = (window as any).Cashfree({
          mode: response.data.environment === 'production' ? 'production' : 'sandbox'
        });

        cashfree.checkout({
          paymentSessionId: response.data.payment_session_id,
          redirectTarget: "_modal",
        }).then(async (result: any) => {
          if (result.error) {
            setIsUnlockingDownload(false);
            alert(result.error.message || 'Payment failed. Please try again.');
          } else if (result.redirect) {
            console.log('Cashfree is redirecting...');
          } else if (result.paymentDetails) {
            // Modal completed, verify payment
            setIsUnlockingDownload(true);
            try {
              const verifyRes = await api.post<VerifyPaymentResult>('/payment/verify', { gateway: 'cashfree', order_id: response.data.order_id });
              if (verifyRes.data.paid) {
                await loadOwnedCertificate();
                alert('Payment successful. Your certificate PDF is now unlocked.');
                void handleDownloadPdf(true);
              } else {
                alert('Payment is processing. Please refresh in a moment to check the download status.');
              }
            } catch (err) {
              const message = err instanceof ApiError ? err.message : 'Verification failed.';
              alert(message);
            } finally {
              setIsUnlockingDownload(false);
            }
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
        key: response.data.key || '',
        amount: response.data.amount,
        currency: response.data.currency,
        name: response.data.name || '',
        description: response.data.description || '',
        order_id: response.data.order_id,
        prefill: response.data.prefill,
        theme: { color: '#00d285' },
        modal: {
          ondismiss: () => setIsUnlockingDownload(false),
        },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await api.post<VerifyPaymentResult>('/payment/verify', paymentResponse);

            if (verifyResponse.data.paid) {
              await loadOwnedCertificate();
              alert('Payment successful. Your certificate PDF is now unlocked.');
              void handleDownloadPdf(true);
              return;
            }

            alert('Payment is processing. Please refresh in a moment to check the download status.');
          } catch (err) {
            const message = err instanceof ApiError
              ? err.message
              : 'Payment completed, but verification failed. Please contact support with your order ID.';

            alert(message);
          } finally {
            setIsUnlockingDownload(false);
          }
        },
      });

      razorpay.on('payment.failed', (paymentError) => {
        setIsUnlockingDownload(false);
        alert(paymentError.error.description || 'Payment failed. Please try again.');
      });

      openedCheckout = true;
      razorpay.open();
    } catch (err) {
      console.error('Certificate unlock checkout failed:', err);
      const message = err instanceof ApiError
        ? err.message
        : 'Could not start the certificate download payment. Please try again.';

      alert(message);
    } finally {
      if (!openedCheckout) {
        setIsUnlockingDownload(false);
      }
    }
  }, [config, handleDownloadPdf, isAuthenticated, loadOwnedCertificate, ownedCertificate, router, uuid, verifyPath]);

  useEffect(() => {
    api.get<{ certificate: Certificate }>(`/certifications/verify/${uuid}`)
      .then((response) => setCert(response.data.certificate))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [uuid]);

  // Handle automatic download if requested via query param
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('download') === 'true' && cert && cert.download_paid && !loading && !isDownloading) {
      void handleDownloadPdf();
      // Remove the param from URL to prevent re-downloading on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    } else if (searchParams.get('download') === 'true' && cert && ownedCertificate && !ownedCertificate.download_paid && !loading) {
      // If download requested but not paid, trigger unlock/payment
      void handleUnlockDownload();
      const newUrl = window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [cert, ownedCertificate, loading, handleDownloadPdf, handleUnlockDownload, isDownloading]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let isActive = true;

    const syncOwnedCertificate = async () => {
      if (!isAuthenticated) {
        if (isActive) {
          setOwnedCertificate(null);
        }
        return;
      }

      await loadOwnedCertificate();
    };

    void syncOwnedCertificate();

    return () => {
      isActive = false;
    };
  }, [authLoading, isAuthenticated, loadOwnedCertificate]);

  const downloadPrice = Math.round((ownedCertificate?.download_price_paise ?? cert?.download_price_paise ?? 0) / 100);
  const canDownload = !!cert?.download_paid;

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col relative">
      {showGatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setShowGatewayModal(false)} className="absolute top-4 right-4 text-[#ababab] hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-2">Select Payment Method</h3>
            <p className="text-sm text-[#ababab] mb-6">Choose your preferred secure payment gateway to complete the transaction.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowGatewayModal(false); void handleUnlockDownload('razorpay'); }} className="flex items-center justify-between p-4 rounded-xl border border-[#2a2d35] bg-[#0f1115] hover:border-[#00d285] transition-colors">
                <span className="font-bold text-[#f8fafc]">Razorpay</span>
                <span className="text-[10px] uppercase tracking-wider text-[#00d285] bg-[#00d285]/10 px-2 py-1 rounded">Popular</span>
              </button>
              <button onClick={() => { setShowGatewayModal(false); void handleUnlockDownload('cashfree'); }} className="flex items-center justify-between p-4 rounded-xl border border-[#2a2d35] bg-[#0f1115] hover:border-[#3b82f6] transition-colors">
                <span className="font-bold text-[#f8fafc]">Cashfree</span>
                <span className="text-[10px] uppercase tracking-wider text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-1 rounded">Fast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downloading Overlay */}
      {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('download') === 'true' && !loading && (
        <div className="fixed inset-0 z-[100] bg-[#0f1115] flex flex-col items-center justify-center text-center p-6">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-[#00d285]/20 border-t-[#00d285] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">📄</div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Preparing your certificate...</h2>
          <p className="text-[#ababab] max-w-sm">
            Please wait while we generate your high-resolution PDF. Your download will start automatically.
          </p>
          {!cert?.download_paid && !loading && (
            <div className="mt-8 animate-pulse text-[#00d285] font-semibold">
              Redirecting to secure payment...
            </div>
          )}
        </div>
      )}

      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        {loading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" />
        ) : notFound || !cert ? (
          <div className="bg-[#16181d] border border-red-500/20 rounded-2xl p-12 max-w-md w-full text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-xl font-bold mb-2 text-red-400">Certificate Not Found</h1>
            <p className="text-[#ababab] text-sm mb-6">
              This certificate ID is invalid or doesn&apos;t exist. It may have been revoked.
            </p>
            <Link href="/" className="px-6 py-3 bg-[#16181d] border border-[#2a2d35] rounded-xl text-sm font-semibold hover:border-[#00d285]/30 transition-colors">
              Go Home
            </Link>
          </div>
        ) : (
          <div className="max-w-lg w-full">
            <div
              className={`relative w-full aspect-[1.414] mb-6 bg-white overflow-hidden rounded-md shadow-lg ${!canDownload && ownedCertificate ? 'blur-[8px]' : ''}`}
              style={{
                backgroundImage: 'url(/certificate.png?v=3)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-[8%] text-center font-sans">
                <div className="flex-1"></div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 font-serif mb-2 uppercase tracking-wider">
                  {cert.user.name}
                </h1>
                
                <div className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 font-medium max-w-[80%]">
                  has successfully completed the certification exam for
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00d285] mb-8 drop-shadow-sm">
                  {cert.certification.title}
                </h2>
                
                <div className="w-full flex justify-between px-[10%] mt-auto pb-4">
                  <div className="text-center">
                    <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 border-b border-gray-400 pb-1 mb-1 px-4">
                      {new Date(cert.issued_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold">Date</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 border-b border-gray-400 pb-1 mb-1 px-4">
                      {cert.percentage}%
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold">Score</div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-6 text-[8px] sm:text-[10px] text-gray-400 font-mono text-right">
                  Verify at: scriptnex.com/verify/{cert.uuid}<br/>
                  ID: {cert.uuid}
                </div>
              </div>
              
              {!canDownload && ownedCertificate && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-20">
                  <div className="bg-[#1a1c23] p-4 rounded-full mb-3 shadow-2xl border border-white/20">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00d285]">PDF Download Locked</span>
                  <p className="text-[10px] text-white/70 mt-2">Pay to unlock high-resolution PDF</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              {canDownload ? (
                <button
                  onClick={() => void handleDownloadPdf()}
                  disabled={isDownloading}
                  className="px-6 py-2.5 bg-[#00d285] text-black font-bold rounded-xl hover:bg-[#00e691] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Download PDF
                    </>
                  )}
                </button>
              ) : ownedCertificate ? (
                <button
                  onClick={() => void handleUnlockDownload()}
                  disabled={isUnlockingDownload || ownerStatusLoading}
                  className="px-6 py-2.5 bg-[#00d285] text-black font-bold rounded-xl hover:bg-[#00e691] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isUnlockingDownload ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black" />
                      Opening Payment...
                    </>
                  ) : (
                    <>Pay ₹{downloadPrice} to Download PDF</>
                  )}
                </button>
              ) : authLoading || ownerStatusLoading ? (
                <div className="px-6 py-2.5 bg-[#16181d] border border-[#2a2d35] text-[#ababab] rounded-xl text-sm">
                  Checking download access...
                </div>
              ) : isAuthenticated ? (
                <div className="px-6 py-2.5 bg-[#16181d] border border-[#2a2d35] text-[#ababab] rounded-xl text-sm text-center">
                  Only the certificate owner can unlock this PDF download.
                </div>
              ) : (
                <button
                  onClick={() => router.push(`/login?redirect=${encodeURIComponent(verifyPath)}`)}
                  className="px-6 py-2.5 bg-[#16181d] border border-[#2a2d35] text-white font-bold rounded-xl hover:border-[#00d285]/30 transition-colors"
                >
                  Sign In to Unlock PDF
                </button>
              )}
            </div>

            <div className="text-center mb-6">
              <p className="text-xs text-[#ababab]">
                {canDownload
                  ? 'PDF download is unlocked for this certificate.'
                  : `Viewing is free. PDF download requires a one-time ₹${downloadPrice} payment from the certificate owner.`}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-[#ababab] mb-4">
                This certificate was issued by ScriptNex and is cryptographically verified.
              </p>
              <Link href="/certifications" className="text-sm text-[#00d285] hover:underline">
                Browse Certifications →
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
