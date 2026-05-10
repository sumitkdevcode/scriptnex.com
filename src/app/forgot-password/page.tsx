'use client';

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('otp');
      setResendCooldown(60);
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

  // OTP input handlers
  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    setError(null);
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post<{ reset_token: string }>('/auth/forgot-password/verify', {
        email,
        otp: otpString,
      });
      setResetToken(res.data.reset_token);
      setStep('reset');
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

  // Step 3: Reset password
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        reset_token: resetToken,
        password,
        password_confirmation: passwordConfirmation,
      });
      setStep('success');
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

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      await api.post('/auth/resend-otp', { email, type: 'password_reset' });
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to resend code.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <Navbar />

      <main className="login-main">
        <div className="login-card">
          {/* ── Step 1: Enter Email ────────────── */}
          {step === 'email' && (
            <>
              <div className="card-header">
                <div className="otp-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h1>Forgot Password?</h1>
                <p>Enter your email and we&apos;ll send you a verification code.</p>
              </div>

              <form onSubmit={handleSendOtp} className="card-body">
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
                  <label htmlFor="fp-email">Email Address</label>
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="you@example.com"
                    autoFocus
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? <span className="spinner" /> : 'SEND VERIFICATION CODE'}
                </button>

                <p className="alt-link">
                  Remember your password?{' '}
                  <Link href="/login">Sign in</Link>
                </p>
              </form>
            </>
          )}

          {/* ── Step 2: Enter OTP ────────────── */}
          {step === 'otp' && (
            <>
              <div className="card-header">
                <div className="otp-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h1>Enter Verification Code</h1>
                <p>We sent a 6-digit code to <strong style={{ color: '#00d285' }}>{email}</strong></p>
              </div>

              <form onSubmit={handleVerifyOtp} className="card-body">
                {error && (
                  <div className="error-box">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#ff4444" strokeWidth="1.5" />
                      <path d="M8 4.5v4M8 10.5v.5" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="otp-inputs">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="otp-input"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isLoading || otp.join('').length !== 6}
                >
                  {isLoading ? <span className="spinner" /> : 'VERIFY CODE'}
                </button>

                <div className="otp-resend">
                  <span>Didn&apos;t receive the code?</span>
                  {resendCooldown > 0 ? (
                    <span className="otp-cooldown">Resend in {resendCooldown}s</span>
                  ) : (
                    <button type="button" className="otp-resend-btn" onClick={handleResendOtp}>
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="otp-back-btn"
                  onClick={() => { setStep('email'); setError(null); setOtp(['', '', '', '', '', '']); }}
                >
                  ← Change email
                </button>
              </form>
            </>
          )}

          {/* ── Step 3: Reset Password ────────────── */}
          {step === 'reset' && (
            <>
              <div className="card-header">
                <div className="otp-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h1>Set New Password</h1>
                <p>Create a strong password for your account</p>
              </div>

              <form onSubmit={handleResetPassword} className="card-body">
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
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="Min 8 characters"
                    autoFocus
                  />
                </div>

                <div className="field">
                  <label htmlFor="confirm-new-password">Confirm New Password</label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => { setPasswordConfirmation(e.target.value); setError(null); }}
                    placeholder="••••••••"
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? <span className="spinner" /> : 'RESET PASSWORD'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 4: Success ────────────── */}
          {step === 'success' && (
            <>
              <div className="card-header">
                <div className="otp-icon-wrapper otp-icon-success">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d285" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h1>Password Reset!</h1>
                <p>Your password has been successfully updated.</p>
              </div>

              <div className="card-body">
                <div className="success-message">
                  <p>You can now sign in with your new password.</p>
                </div>
                <Link href="/login" className="btn-submit" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  GO TO LOGIN
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-[#ababab] text-sm mt-auto">
        &copy; {new Date().getFullYear()} ScriptNex. All rights reserved.
      </footer>
    </div>
  );
}
