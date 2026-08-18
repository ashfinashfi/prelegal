'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin, signup } = useAuth();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const switchMode = useCallback((newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signin(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    const demoEmail = 'demo@prelegal.ai';
    const demoPassword = 'password123';

    try {
      try {
        await signin(demoEmail, demoPassword);
      } catch {
        await signup(demoEmail, demoPassword);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1c1b18]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" role="presentation">
      <div
        className="bg-[#fdfbf7] rounded-2xl p-7 sm:p-9 max-w-md w-full shadow-2xl border border-[#e4ded3]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="hanko-seal">認証</span>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#78736a]">Prelegal Studio</span>
            </div>
            <h2 id="auth-modal-title" className="font-serif text-2xl font-bold text-[#1c1b18]">
              {mode === 'signin' ? 'Enter Sanctuary' : 'Create Atelier Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#78736a] hover:text-[#1c1b18] p-1.5 rounded-lg hover:bg-[#f4f0e8]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex mb-6 bg-[#f4f0e8] p-1 rounded-xl border border-[#e4ded3]">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-serif transition-all ${
              mode === 'signin'
                ? 'bg-[#fdfbf7] text-[#1c1b18] shadow-xs font-medium'
                : 'text-[#78736a] hover:text-[#1c1b18]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-serif transition-all ${
              mode === 'signup'
                ? 'bg-[#fdfbf7] text-[#1c1b18] shadow-xs font-medium'
                : 'text-[#78736a] hover:text-[#1c1b18]'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-serif text-[#78736a] mb-1">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-serif text-[#78736a] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3.5 py-2.5 text-xs border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
            />
          </div>

          {error && (
            <div className="bg-[#fbf0ec] border border-[#c85a38]/30 text-[#c85a38] px-3.5 py-2.5 rounded-xl text-xs font-serif">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#c85a38] hover:bg-[#b54f30] text-[#fdfbf7] rounded-xl text-xs font-serif font-medium tracking-wide shadow-xs transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'signin' ? 'Enter Sanctuary' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e4ded3]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-serif tracking-widest">
            <span className="bg-[#fdfbf7] px-2.5 text-[#968f83]">Or Quick Entry</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2 px-4 bg-[#f4f0e8] hover:bg-[#ece6dc] text-[#36332e] rounded-xl text-xs font-serif transition-colors flex items-center justify-center gap-2 border border-[#e4ded3]"
        >
          <span>印 Instant Demo Sign In</span>
        </button>

        <p className="mt-5 text-center text-xs font-serif text-[#78736a]">
          {mode === 'signin' ? (
            <>
              New to Prelegal?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-[#c85a38] font-semibold hover:underline"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-[#c85a38] font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
