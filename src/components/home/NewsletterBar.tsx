'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { logAnalyticsEvent } from '@/lib/data/store';

export const NewsletterBar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        logAnalyticsEvent('contact_submission', {
          type: 'newsletter_subscription',
          email: email.trim(),
        });
      } catch {}
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-[#1B6392] text-white py-14 sm:py-16 border-b border-[#154E73]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Subscribe to our newsletter
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed font-normal">
            Get instant notifications when new UK-used shipments on a specific spec of interest, plus flash deals and hardware maintenance guides.
          </p>
        </div>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          {subscribed ? (
            <div className="p-3.5 bg-emerald-500/20 border border-emerald-400 text-emerald-200 rounded-[3px] flex items-center justify-center gap-2 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Thank you! You are now subscribed to ExperienceTech updates.</span>
            </div>
          ) : (
            <div className="flex items-center bg-white rounded-[3px] p-1 shadow-md border border-slate-200">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 px-4 py-3 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 rounded-[2px] bg-[#FA8232] hover:bg-[#E06F23] text-white font-medium text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>

        {/* Brand Logos Asset Below Newsletter matching User Requirements */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-center">
          <div className="relative w-full max-w-lg aspect-[552/73]">
            <Image
              src="/brand-partners.png"
              alt="Partner Brand Logos"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
};
