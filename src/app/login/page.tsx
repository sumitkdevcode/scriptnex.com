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
      router.push('/dashboard');
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

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner" />
              ) : (
                'LOG IN'
              )}
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
