'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

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

export default function DownloadButton({ cert, userName, className, label = 'Download PDF' }: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'paying' | 'generating'>('idle');

  const performDownload = async () => {
    try {
      setStatus('generating');
      
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      
      // visibility: hidden allows the iframe to render properly unlike display: none
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '1200px';
      iframe.style.height = '900px';
      iframe.style.visibility = 'hidden';
      iframe.src = `/certifications/download/${cert.uuid}`;
      
      const cleanup = (event: MessageEvent) => {
        if (event.data?.type === 'DOWNLOAD_COMPLETE' && event.data?.uuid === cert.uuid) {
          document.body.removeChild(iframe);
          window.removeEventListener('message', cleanup);
          setStatus('idle');
        } else if (event.data?.type === 'DOWNLOAD_ERROR') {
          console.error('Iframe Download Error:', event.data.error);
          document.body.removeChild(iframe);
          window.removeEventListener('message', cleanup);
          setStatus('idle');
          alert('Failed to generate PDF. Opening manual download link...');
          window.open(`/certifications/download/${cert.uuid}`, '_blank');
        }
      };

      window.addEventListener('message', cleanup);
      document.body.appendChild(iframe);

      // Timeout as a safety measure
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
          window.removeEventListener('message', cleanup);
          setStatus('idle');
        }
      }, 15000);

    } catch (err: any) {
      console.error('Download setup failed:', err);
      setStatus('idle');
      window.open(`/certifications/download/${cert.uuid}`, '_blank');
    }
  };

  const handleDownloadClick = async () => {
    try {
      setStatus('checking');

      // 1. Check access via API
      const response = await api.get<{ certificate: any }>(`/my-certificates/${cert.uuid}`);
      const ownedCert = response.data.certificate;
      
      if (ownedCert.download_paid) {
        await performDownload();
        return;
      }

      // 2. If not paid, start payment flow
      setStatus('paying');
      const checkoutOrder = await api.post<any>(`/my-certificates/${cert.uuid}/download/checkout`);
      // ... same as before
      
      if (checkoutOrder.data.unlocked) {
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
      // If everything fails, then and only then redirect as a last resort
      window.location.href = `/certifications/verify/${cert.uuid}?download=true`;
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
