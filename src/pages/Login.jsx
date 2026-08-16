import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  // ==========================================
  // LOGIN / SIGNUP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          onLogin(data.session);
        } else {
          setMessage(
            'Account created. Check your email to confirm your account.'
          );
          setNeedsConfirmation(true);
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;

        onLogin(data.session);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND CONFIRMATION EMAIL
  // ==========================================

  const handleResendConfirmation = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setMessage(
        'Confirmation email sent again. Check your inbox.'
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PASSWORD RESET
  // ==========================================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      setMessage(
        'Password reset email sent. Check your inbox and follow the link to create a new password.'
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORGOT PASSWORD SCREEN
  // ==========================================

  if (isForgotPassword) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">

        {/* Background glow */}
        <div className="absolute w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -bottom-20 -right-20" />

        <div className="relative z-10 w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">

            <div className="text-5xl mb-4">
              🔐
            </div>

            <h1 className="text-4xl font-bold text-white">
              Reset Password
            </h1>

            <p className="text-gray-400 mt-2">
              Recover your Cyber Journey account.
            </p>

          </div>

          {/* Reset Card */}
          <div className="glass-card p-8 rounded-3xl">

            <h2 className="text-2xl font-bold text-white mb-2">
              Forgot your password?
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Enter your account email and we'll send you a secure
              password reset link.
            </p>

            <form onSubmit={handleForgotPassword}>

              {/* Email */}
              <div className="mb-5">

                <label className="block text-sm text-gray-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-black/40 border border-pink-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
                />

              </div>

              {/* Message */}
              {message && (
                <div className="mb-5 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-200 text-sm">
                  {message}
                </div>
              )}

              {/* Send Reset */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20"
              >
                {loading
                  ? 'Sending...'
                  : 'Send Reset Link'}
              </button>

            </form>

            {/* Back */}
            <div className="text-center mt-6">

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setMessage('');
                }}
                className="text-pink-300 hover:text-pink-200 font-semibold text-sm"
              >
                ← Back to Login
              </button>

            </div>

          </div>

          <p className="text-center text-gray-500 text-xs mt-6">
            Your account and cybersecurity progress remain protected.
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // NORMAL LOGIN / SIGNUP SCREEN
  // ==========================================

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">

      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -top-20 -left-20" />

      <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -bottom-20 -right-20" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo / Title */}
        <div className="text-center mb-8">

<div className="text-5xl mb-4">
              🌸
            </div>

            <h1 className="text-4xl font-bold text-white">
              Cyber Journey
            </h1>

          <p className="text-gray-400 mt-2">
            Your cybersecurity journey starts here.
          </p>

        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-3xl">

          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignup
              ? 'Create your account'
              : 'Welcome back'}
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            {isSignup
              ? 'Create an account to save your cybersecurity journey.'
              : 'Login to continue your cybersecurity journey.'}
          </p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-4">

              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-black/40 border border-pink-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
              />

            </div>

            {/* Password */}
            <div className="mb-2">

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full bg-black/40 border border-pink-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
              />

            </div>

            {/* Forgot Password */}
            {!isSignup && (
              <div className="text-right mb-5">

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setMessage('');
                    setNeedsConfirmation(false);
                  }}
                  className="text-sm text-pink-300 hover:text-pink-200 transition-colors"
                >
                  Forgot password?
                </button>

              </div>
            )}

            {/* Signup spacing */}
            {isSignup && <div className="mb-3" />}

            {/* Message */}
            {message && (
              <div className="mb-5 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-200 text-sm">
                {message}
              </div>
            )}

            {/* Resend confirmation */}
            {needsConfirmation && (
              <div className="mb-5 text-center">
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={loading}
                  className="text-sm text-pink-300 hover:text-pink-200 font-semibold disabled:opacity-50"
                >
                  📧 Resend confirmation email
                </button>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20"
            >
              {loading
                ? 'Please wait...'
                : isSignup
                  ? 'Create Account'
                  : 'Login'}
            </button>

          </form>

          {/* Switch */}
          <div className="text-center mt-6 text-sm text-gray-400">

            {isSignup
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage('');
                setNeedsConfirmation(false);
              }}
              className="ml-2 text-pink-300 hover:text-pink-200 font-semibold"
            >
              {isSignup
                ? 'Login'
                : 'Create one'}
            </button>

          </div>

        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Your account keeps your cybersecurity progress synchronized.
        </p>

      </div>

    </div>
  );
}