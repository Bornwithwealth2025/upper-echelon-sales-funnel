import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Crest, Wordmark } from '../components/UpperEchelonBrand';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setDevToken(null);

    try {
      const result = await forgotPassword(email);
      setMessage('If this email exists, a reset link has been sent.');
      if (result.resetToken) {
        setDevToken(result.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
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
            Reset your password
          </h1>
          <p className="text-slate-500 text-sm">Enter your email to receive a reset link.</p>
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

        {devToken && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4 text-sm break-all">
            Development reset token: {devToken}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a445] focus:border-transparent transition"
              placeholder="you@company.com"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0a1628] hover:bg-[#10203b] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 'Send reset link'}
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

export default ForgotPasswordPage;