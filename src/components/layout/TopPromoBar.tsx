'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Zap } from 'lucide-react';

export const TopPromoBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#111317] text-white text-xs py-2 px-4 border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Spacer to center content */}
        <div className="hidden lg:block w-8" />

        {/* Center: Deal Banner */}
        <div className="flex-1 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-center">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#FACC15] text-[#0B192C] font-medium text-[11px] uppercase tracking-wider shadow-xs">
            <Zap className="w-3 h-3 fill-current" />
            <span>Black Friday</span>
          </span>
          <span className="text-slate-200 font-normal tracking-wide">
            UP TO <strong className="text-[#FACC15] font-semibold">59% OFF</strong> ON VERIFIED LAPTOPS & ACCESSORIES
          </span>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#FACC15] hover:bg-[#EAB308] text-[#0B192C] font-medium text-[11px] uppercase tracking-wider transition-colors shadow-xs"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-3 h-3 stroke-2" />
          </Link>
        </div>

        {/* Right: Dismiss button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
