'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      router.push('/dashboard');
    } catch {
      // errors handled by context
    }
  }

  return (
    <div className="login-page">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <nav className="navbar">
        <Link href="/" className="brand">
          <img src="/logo-nav.png" alt="ScriptNex Logo" className="h-[60px] w-auto object-contain" style={{ background: 'transparent' }} />
        </Link>
      </nav>

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

            <p className="alt-link">
              Already have an account?{' '}
              <Link href="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-[#475569] text-sm mt-auto">
        &copy; {new Date().getFullYear()} ScriptNex. All rights reserved.
      </footer>
    </div>
  );
}
