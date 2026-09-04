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
  X,
  Loader2,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

const PRESEEDED_ACCOUNTS = [
  {
    name: 'Senior Forensic Analyst',
    email: 'analyst@truthlens.ai',
    password: 'password123',
    initials: 'SA',
    provider: 'email'
  },
  {
    name: 'Daksh Salvi',
    email: 'dakshsalvi59@gmail.com',
    password: 'hackathon123',
    initials: 'DS',
    provider: 'email'
  }
];

function getAccounts() {
  if (typeof window === 'undefined') return PRESEEDED_ACCOUNTS;
  try {
    const data = localStorage.getItem('TRUTHLENS_REGISTERED_ACCOUNTS');
    if (!data) {
      localStorage.setItem('TRUTHLENS_REGISTERED_ACCOUNTS', JSON.stringify(PRESEEDED_ACCOUNTS));
      return PRESEEDED_ACCOUNTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return PRESEEDED_ACCOUNTS;
  }
}

function saveAccount(newAccount) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getAccounts();
    const updated = [...existing.filter(a => a.email.toLowerCase() !== newAccount.email.toLowerCase()), newAccount];
    localStorage.setItem('TRUTHLENS_REGISTERED_ACCOUNTS', JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save account:', e);
  }
}

export default function AuthModal({ onLogin = () => {}, onClose = null }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleFillDemo = () => {
    setIsRegister(false);
    setEmail('analyst@truthlens.ai');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide both your email and password.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. analyst@domain.com).');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const accounts = getAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (isRegister) {
      // Registration Flow
      if (!name.trim()) {
        setError('Please enter your full name or analyst handle.');
        return;
      }

      if (existing) {
        setError('An account with this email address already exists. Please sign in instead.');
        return;
      }

      setIsLoading(true);

      const initials = name.trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

      const newAccount = {
        name: name.trim(),
        email: cleanEmail,
        password: cleanPassword,
        initials,
        provider: 'email',
        verified: true,
        createdAt: new Date().toISOString()
      };

      saveAccount(newAccount);

      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg('Account registered successfully! Redirecting...');
        setTimeout(() => {
          onLogin(newAccount);
        }, 600);
      }, 500);

    } else {
      // Login Flow
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);

        if (existing) {
          if (existing.password && existing.password !== cleanPassword) {
            setError('Incorrect password for this account. Please verify credentials.');
            return;
          }
          setSuccessMsg('Authentication verified! Redirecting...');
          setTimeout(() => {
            onLogin(existing);
          }, 500);
        } else {
          // If account is new, auto-register seamlessly
          const derivedName = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
          const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
          const initials = formattedName.slice(0, 2).toUpperCase() || 'U';

          const autoAccount = {
            name: formattedName,
            email: cleanEmail,
            password: cleanPassword,
            initials,
            provider: 'email',
            verified: true,
            createdAt: new Date().toISOString()
          };

          saveAccount(autoAccount);
          setSuccessMsg('Welcome to TruthLens! Redirecting...');
          setTimeout(() => {
            onLogin(autoAccount);
          }, 500);
        }
      }, 450);
    }
  };

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    setOauthProvider(provider);
    setError('');
    setSuccessMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setOauthProvider(null);

      const profileData = provider === 'google'
        ? {
            name: 'Google Verified Analyst',
            email: 'dakshsalvi59@gmail.com',
            initials: 'GA',
            provider: 'google',
            verified: true
          }
        : {
            name: 'GitHub Verified Developer',
            email: 'dakshsalvi59@gmail.com',
            initials: 'GH',
            provider: 'github',
            verified: true
          };

      saveAccount(profileData);
      setSuccessMsg(`Authenticated with ${provider === 'google' ? 'Google' : 'GitHub'}!`);
      setTimeout(() => {
        onLogin(profileData);
      }, 500);
    }, 700);
  };

  const handleContinueAsGuest = () => {
    if (onClose) {
      onClose();
    } else {
      onLogin(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      {/* Ambient glowing background orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphic Card */}
      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-2xl border border-white/20 dark:border-white/10 bg-white/15 dark:bg-black/35 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-100 transition-all">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
            Forensic Analyst Authentication & OAuth
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex rounded-xl p-1 bg-white/10 dark:bg-white/5 border border-white/15 backdrop-blur-md mb-5">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold font-mono-code tracking-wider rounded-lg transition-all cursor-pointer ${
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
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold font-mono-code tracking-wider rounded-lg transition-all cursor-pointer ${
              isRegister
                ? 'bg-[#b91c1c] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* OAuth Authentication Providers */}
        <div className="space-y-2.5 mb-5">
          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-900 bg-white hover:bg-slate-100 active:scale-[0.99] border border-white/30 backdrop-blur-md transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading && oauthProvider === 'google' ? (
              <Loader2 size={16} className="animate-spin text-slate-800" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* GitHub OAuth Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/15 active:scale-[0.99] border border-white/20 backdrop-blur-md transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading && oauthProvider === 'github' ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-white/15" />
          <span className="absolute px-3 text-[10px] font-mono-code uppercase text-slate-300 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10">
            OR {isRegister ? 'REGISTER WITH EMAIL' : 'SIGN IN WITH EMAIL'}
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
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
                placeholder="Full Name (e.g. Alex Morgan)"
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
              placeholder="Analyst Email (e.g. analyst@truthlens.ai)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all shadow-inner"
            />
          </div>

          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (minimum 6 characters)"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold font-mono-code text-xs tracking-wider text-white bg-gradient-to-r from-[#b91c1c] to-[#dc2626] hover:from-[#991b1b] hover:to-[#b91c1c] active:scale-[0.99] transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'CREATE ANALYST ACCOUNT' : 'SECURE SIGN IN'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Autofill Hint */}
        {!isRegister && (
          <div className="mt-3.5 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono-code text-slate-300/80 hover:text-white px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <KeyRound size={12} className="text-amber-400" />
              <span>Use Demo Account: analyst@truthlens.ai</span>
            </button>
          </div>
        )}

        {/* Guest Access Alternative */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="text-xs font-mono-code text-slate-400 hover:text-white transition-colors underline decoration-dotted cursor-pointer"
          >
            Continue as Guest Analyst →
          </button>
        </div>
      </div>
    </div>
  );
}
