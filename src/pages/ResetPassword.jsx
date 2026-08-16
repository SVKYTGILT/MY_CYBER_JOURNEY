import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    setMessage('');
    setSuccess(false);

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      setMessage(
        'Password updated successfully. You can now continue to your dashboard.'
      );

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

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
            New Password
          </h1>

          <p className="text-gray-400 mt-2">
            Secure your Cyber Journey account.
          </p>

        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl">

          <h2 className="text-2xl font-bold text-white mb-2">
            Create a new password
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleUpdatePassword}>

            {/* New password */}
            <div className="mb-4">

              <label className="block text-sm text-gray-300 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                className="w-full bg-black/40 border border-pink-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
              />

            </div>

            {/* Confirm password */}
            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                className="w-full bg-black/40 border border-pink-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-300"
              />

            </div>

            {/* Message */}
            {message && (
              <div
                className={`mb-5 p-3 rounded-xl text-sm ${
                  success
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                    : 'bg-pink-500/10 border border-pink-500/20 text-pink-200'
                }`}
              >
                {message}
              </div>
            )}

            {/* Update button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20"
            >
              {loading
                ? 'Updating...'
                : success
                  ? 'Password Updated ✓'
                  : 'Update Password'}
            </button>

          </form>

        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Your password is securely managed by Supabase.
        </p>

      </div>

    </div>
  );
}