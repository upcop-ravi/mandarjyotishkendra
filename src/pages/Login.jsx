import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email.trim())    return setError('Please enter your email address.');
    if (!password)        return setError('Please enter your password.');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Please enter a valid email address.');

    setLoading(true);
    try {
      if (!auth) {
        throw { code: 'auth/unconfigured' };
      }
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = {
        'auth/unconfigured':        'Firebase Auth is unconfigured. Please add your credentials to .env file.',
        'auth/invalid-credential':  'Invalid email or password. Please try again.',
        'auth/user-not-found':      'No account found with this email.',
        'auth/wrong-password':      'Incorrect password. Please try again.',
        'auth/too-many-requests':   'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/invalid-api-key':      'Invalid Firebase API Key. Please check your .env credentials.',
      }[err.code] ?? 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-300/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-glass">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center
                            shadow-glass mb-4 animate-float">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-charcoal-800">Admin Portal</h1>
            <p className="text-charcoal-500 text-sm mt-1">NourishHope Foundation</p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              id="login-error-banner"
              className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700
                         rounded-xl px-4 py-3 mb-6 animate-slide-up text-sm"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-charcoal-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@nourishhope.org"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-100 bg-cream-50
                             font-body text-charcoal-800 placeholder-charcoal-400 focus:outline-none
                             focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-charcoal-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-primary-100 bg-cream-50
                             font-body text-charcoal-800 placeholder-charcoal-400 focus:outline-none
                             focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                  aria-required="true"
                />
                <button
                  type="button"
                  id="login-toggle-password"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400
                             hover:text-charcoal-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-charcoal-400 mt-6">
            This portal is restricted to authorized staff only.
          </p>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            ← Back to Public Site
          </a>
        </div>
      </div>
    </div>
  );
}
