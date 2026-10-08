'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const MacBookBanner: React.FC = () => {
  return (
    <section className="bg-white py-8 sm:py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFE7D6] rounded-[6px] border border-[#F8D5C0] p-7 sm:p-10 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          {/* Left Text & Call-To-Action matching User Mockup */}
          <div className="space-y-4 max-w-md relative z-10 text-left">
            {/* Blue Deal Badge */}
            <div>
              <span className="inline-block px-2.5 py-1 rounded-[2px] bg-[#2DA5F3] text-white text-[11px] font-medium uppercase tracking-wider shadow-xs">
                SAVE UP TO ₦200,000
              </span>
            </div>

            {/* Exact Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#191C1F] tracking-tight leading-tight">
              Macbook Pro
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#475156] leading-relaxed font-normal">
              Apple M1 Max Chip. 32GB Unified <br className="hidden sm:inline" />
              Memory, 1TB SSD Storage
            </p>

            {/* Orange Action Button */}
            <div className="pt-2">
              <Link
                href="/shop/apple-macbook-pro-14-m2-pro"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-[2px] bg-[#FA8232] hover:bg-[#E06F23] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-2" />
              </Link>
            </div>
          </div>

          {/* Right Product Visual: MacBook Pro with Perfectly Aligned ₦2.5M Price Tag */}
          <div className="relative w-full max-w-[320px] sm:max-w-[390px] lg:max-w-[430px] aspect-[420/275] flex items-center justify-center">
            <Image
              src="/MAC.png"
              alt="Apple Macbook Pro M1 Max - ₦2.5M"
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
