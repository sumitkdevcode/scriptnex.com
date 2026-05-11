'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function LoginPage() {
  const { login, error, isLoading, clearErrors } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push('/certifications');
    } catch {
      // errors handled by context
    }
  }

  return (
    <div className="login-page">
      {/* Background effects */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      {/* Navbar */}
      <Navbar />

      {/* Login Form */}
      <main className="login-main">
        <div className="login-card">
          <div className="card-header">
            <h1>Welcome back</h1>
            <p>Sign in to your ScriptNex account</p>
          </div>

          <form onSubmit={handleSubmit} className="card-body">
            {error && (
              <div className="error-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#ff4444" strokeWidth="1.5" />
                  <path d="M8 4.5v4M8 10.5v.5" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '8px' }}>
              <Link href="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner" />
              ) : (
                'LOG IN'
              )}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btn-google"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="alt-link">
              Don&apos;t have an account?{' '}
              <Link href="/register">Create one</Link>
            </p>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-[#ababab] text-sm mt-auto">
        &copy; {new Date().getFullYear()} ScriptNex. All rights reserved.
      </footer>
    </div>
  );
}
