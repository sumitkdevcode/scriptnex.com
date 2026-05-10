'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function RegisterPage() {
  const { register, error, fieldErrors, isLoading, clearErrors } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearErrors();
  }

  function getFieldError(field: string): string | undefined {
    return fieldErrors?.[field]?.[0];
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await register(form);
      router.push('/certifications');
    } catch {
      // errors handled by context
    }
  }

  return (
    <div className="login-page">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <Navbar />

      <main className="login-main">
        <div className="login-card">
          <div className="card-header">
            <h1>Create Account</h1>
            <p>Join ScriptNex and start coding</p>
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
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" required />
              {getFieldError('name') && <span className="field-error">{getFieldError('name')}</span>}
            </div>

            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" value={form.username} onChange={(e) => update('username', e.target.value)} placeholder="johndoe" required />
              {getFieldError('username') && <span className="field-error">{getFieldError('username')}</span>}
            </div>

            <div className="field">
              <label htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required />
              {getFieldError('email') && <span className="field-error">{getFieldError('email')}</span>}
            </div>

            <div className="field">
              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 characters" required />
              {getFieldError('password') && <span className="field-error">{getFieldError('password')}</span>}
            </div>

            <div className="field">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input id="confirm-password" type="password" value={form.password_confirmation} onChange={(e) => update('password_confirmation', e.target.value)} placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : 'CREATE ACCOUNT'}
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
              Already have an account?{' '}
              <Link href="/login">Sign in</Link>
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
