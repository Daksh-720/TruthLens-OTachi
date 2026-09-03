import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';

export default function AuthModal({ onLogin = () => {}, onClose = null }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      const initials = name.trim()
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : email.slice(0, 2).toUpperCase();

      onLogin({
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        initials: initials || 'U',
        provider: 'email'
      });
    }, 500);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: 'GitHub User',
        email: '',
        initials: 'GH',
        provider: 'github'
      });
    }, 450);
  };

  const handleContinueAsGuest = () => {
    if (onClose) {
      onClose();
    } else {
      // Enter without account as an unlogged user
      onLogin(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
      {/* Ambient glowing background orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphic Card */}
      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-2xl border border-white/20 dark:border-white/10 bg-white/15 dark:bg-black/35 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-100 transition-all">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#b91c1c] to-[#ef4444] text-white flex items-center justify-center shadow-lg shadow-red-500/30 mb-3 border border-white/20">
            <ShieldCheck size={28} className="stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            TruthLens <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">AI</span>
          </h2>
          <p className="text-xs font-mono-code uppercase tracking-widest text-slate-300/80 mt-1">
            Forensic Analyst Authentication
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex rounded-xl p-1 bg-white/10 dark:bg-white/5 border border-white/15 backdrop-blur-md mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold font-mono-code tracking-wider rounded-lg transition-all ${
              !isRegister
                ? 'bg-[#b91c1c] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold font-mono-code tracking-wider rounded-lg transition-all ${
              isRegister
                ? 'bg-[#b91c1c] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* GitHub OAuth Button */}
        <button
          type="button"
          onClick={handleGithubLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/15 active:scale-[0.99] border border-white/20 backdrop-blur-md transition-all shadow-sm mb-4"
        >
          <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>Continue with GitHub</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-white/15" />
          <span className="absolute px-3 text-[10px] font-mono-code uppercase text-slate-300 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10">
            OR USE EMAIL
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name / Handle"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all shadow-inner"
              />
            </div>
          )}

          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all shadow-inner"
            />
          </div>

          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold font-mono-code text-xs text-white tracking-wider bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] hover:opacity-95 active:scale-[0.99] border border-red-400/40 shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>VERIFYING CREDENTIALS...</span>
            ) : (
              <>
                <span>{isRegister ? 'CREATE ACCOUNT' : 'ENTER PORTAL'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Continue as Guest (person who hasn't logged in) */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Browse without signing in?</span>
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="flex items-center gap-1 text-[11px] font-mono-code font-bold text-slate-300 hover:text-white transition-colors underline"
          >
            <span>Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
}
