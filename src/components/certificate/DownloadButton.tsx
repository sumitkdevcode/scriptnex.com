'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { downloadCertificatePdf } from '@/lib/certificates';

interface DownloadButtonProps {
  cert: {
    uuid: string;
    certification?: { title: string };
    created_at: string;
    score?: number;
    percentage?: number;
    issued_at?: string;
    download_paid?: boolean;
    download_price_paise?: number;
  };
  userName: string;
  className?: string;
  label?: string;
  onSuccess?: () => void | Promise<void>;
}

const RAZORPAY_SCRIPT_ID = 'razorpay-checkout-js';

const loadRazorpay = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  if ((window as any).Razorpay) return true;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DownloadButton({ cert, userName, className, label = 'Download PDF', onSuccess }: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'paying' | 'generating'>('idle');

  const performDownload = async () => {
    try {
      setStatus('generating');
      const fallbackFileName = `ScriptNex-Certificate-${(userName || 'Certificate').replace(/\s+/g, '-')}.pdf`;
      await downloadCertificatePdf(cert.uuid, fallbackFileName);
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Failed to download the certificate PDF. Please try again.';
      alert(message);
      console.error('Download setup failed:', err);
    } finally {
      setStatus('idle');
    }
  };

  const handleDownloadClick = async () => {
    try {
      setStatus('checking');

      // 1. Check access via API
      const response = await api.get<{ certificate: any }>(`/my-certificates/${cert.uuid}`, { force: true });
      const ownedCert = response.data.certificate;
      
      if (ownedCert.download_paid) {
        await performDownload();
        if (onSuccess) await onSuccess();
        return;
      }

      // 2. If not paid, start payment flow
      setStatus('paying');
      const checkoutOrder = await api.post<any>(`/my-certificates/${cert.uuid}/download/checkout`);
      
      if (checkoutOrder.data.unlocked) {
        if (onSuccess) await onSuccess();
        await performDownload();
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded || !(window as any).Razorpay) {
        throw new Error('Razorpay failed to load');
      }

      const razorpay = new (window as any).Razorpay({
        ...checkoutOrder.data,
        theme: { color: '#00d285' },
        handler: async (paymentResponse: any) => {
          try {
            setStatus('checking');
            const verify = await api.post<any>('/payment/verify', paymentResponse);
            if (verify.data.paid) {
              if (onSuccess) await onSuccess();
              await performDownload();
            } else {
              alert('Payment verification pending. Please try again in a moment.');
              setStatus('idle');
            }
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
            setStatus('idle');
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        }
      });

      razorpay.open();

    } catch (err) {
      console.error('Action failed:', err);
      setStatus('idle');
      const message = err instanceof ApiError
        ? err.message
        : 'Could not start the certificate download flow. Please try again.';
      alert(message);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleDownloadClick();
      }}
      disabled={status !== 'idle'}
      className={className}
    >
      {status === 'idle' ? label : (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-current" />
          <span>{status === 'checking' ? 'Checking...' : status === 'paying' ? 'Opening Payment...' : 'Generating PDF...'}</span>
        </div>
      )}
    </button>
  );
}
