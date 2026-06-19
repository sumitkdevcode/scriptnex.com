'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // IMPORTANT: Do NOT render Navbar/Footer here.
  // If the error was caused by AuthContext or a provider failure,
  // rendering Navbar (which uses useAuth()) would throw ANOTHER error
  // inside the error boundary, causing a white screen with no recovery.
  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-[#ababab] mb-8 max-w-md mx-auto">
        A runtime error occurred. Our team has been notified.
        <br />
        <small className="text-[10px] opacity-50 uppercase tracking-widest mt-2 block">
          ID: {error.digest || 'unknown'}
        </small>
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all transform hover:-translate-y-1"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-8 py-3 border border-[#2a2d35] text-white font-semibold rounded-xl hover:bg-white/5 transition-all transform hover:-translate-y-1"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
