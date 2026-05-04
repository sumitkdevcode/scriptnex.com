'use client';

import { useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-[#16181d] border border-[#2a2d35] rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d285]/20 to-[#00d285]/5 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-sm text-[#ababab]">
                {success
                  ? 'Check your email for the reset link.'
                  : 'Enter your email and we\'ll send you a reset link.'}
              </p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="bg-[#00d285]/10 border border-[#00d285]/20 rounded-xl p-4 text-center">
                  <svg className="w-8 h-8 text-[#00d285] mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <p className="text-sm text-[#00d285] font-medium">Reset link sent to <span className="font-bold">{email}</span></p>
                  <p className="text-xs text-[#ababab] mt-1">Didn&apos;t get it? Check your spam folder.</p>
                </div>
                <Link href="/login" className="block w-full text-center py-3 rounded-xl bg-[#1a1c23] border border-[#2a2d35] text-sm font-semibold hover:border-[#00d285]/30 transition-colors">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">{error}</div>
                )}
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white placeholder:text-[#ababab] focus:outline-none focus:border-[#00d285]/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#00d285] to-[#00a669] rounded-xl text-sm font-bold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <p className="text-center text-sm text-[#ababab]">
                  Remember your password?{' '}
                  <Link href="/login" className="text-[#00d285] font-semibold hover:underline">Sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
