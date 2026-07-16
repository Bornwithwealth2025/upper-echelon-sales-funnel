import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Crest, Wordmark } from '../components/UpperEchelonBrand';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();

  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Reset token is missing. Please request a new reset link.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setMessage('Password updated successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="bg-[#fcfbf8] rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex flex-col items-center gap-2 mb-6">
            <Crest size={40} />
            <Wordmark tone="dark" />
          </Link>
          <h1
            className="text-2xl text-[#0a1628] mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Choose a new password
          </h1>
          <p className="text-slate-500 text-sm">Set a strong password for your account.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a445] focus:border-transparent transition"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a445] focus:border-transparent transition"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0a1628] hover:bg-[#10203b] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Reset password'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          <Link to="/login" className="text-[#8a6e24] hover:text-[#c9a445] font-semibold transition">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;