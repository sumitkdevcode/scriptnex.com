'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    
    if (token) {
      loginWithToken(token)
        .then(() => {
          router.push('/certifications');
        })
        .catch(() => {
          router.push('/login?error=session_failed');
        });
    } else {
      router.push('/login?error=no_token');
    }
  }, [searchParams, loginWithToken, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
      <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4" />
      <p className="text-lg font-medium">Authenticating...</p>
    </div>
  );
}

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
