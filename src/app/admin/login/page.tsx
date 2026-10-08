'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please enter both your staff email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid staff email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const success = await login(cleanEmail, cleanPass);
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid email or password. Please verify your staff credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-var(--navbar-height,180px))] bg-[#071322] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-white rounded-[6px] shadow-2xl p-8 sm:p-10 space-y-6 border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-[3px] bg-[#0B192C] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-950/20">
            <KeyRound className="w-7 h-7 text-[#38BDF8]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0B192C] tracking-tight">
            Staff Access Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Authorized personnel only. Please sign in with your staff email and password.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-[3px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Staff Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Staff Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. experiencetechservices@gmail.com"
                className="w-full text-sm pl-10 pr-4 py-2.5 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Staff Password */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Staff Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter staff password..."
                className="w-full text-sm pl-10 pr-10 py-2.5 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-[3px] border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted internal authentication session.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-[2px] bg-[#0B192C] hover:bg-[#1E3E62] text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Staff Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-blue-600 font-medium inline-flex items-center gap-1"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
