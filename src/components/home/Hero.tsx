'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-white py-5 sm:py-7 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Hero Card (Left ~66% - 8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-[6px] border border-slate-200/90 p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Content Area (7 Cols on desktop) */}
              <div className="md:col-span-7 space-y-3.5 sm:space-y-4">
                {/* Eyebrow with blue dash */}
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1B6392]">
                  <span className="w-5 h-0.5 bg-[#1B6392]" />
                  <span className="tracking-wide">Your Tech. Our Expertise</span>
                </div>

                {/* Exact Headline from User Reference */}
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#111827] tracking-tight leading-[1.12]">
                  ExperienceTech — <br />
                  Stay Ahead
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-sm">
                  Quality laptops, accessories, and expert services to keep you moving.
                </p>

                {/* Action Buttons matching User Reference */}
                <div className="pt-2 flex items-center gap-5 sm:gap-6 flex-wrap">
                  <Link
                    href="/shop"
                    className="px-7 py-3 rounded-[2px] bg-[#FA8232] hover:bg-[#E06F23] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    SHOP NOW
                  </Link>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#111827] hover:text-[#FA8232] transition-colors uppercase tracking-wider group"
                  >
                    <span>GET SUPPORT</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Exact Dual ROG Laptops Visual from User Reference (5 Cols on desktop) */}
              <div className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center">
                  <Image
                    src="/hero-rog-laptops.png"
                    alt="ExperienceTech Gaming & Workstation Laptops"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Stacked Promo Cards (Right ~34% - 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
            {/* Top Promo Card: Hp 1030g2 Elitebook (Dark Charcoal) */}
            <div className="flex-1 bg-[#181A20] text-white rounded-[6px] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-xs group min-h-[170px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#FACC15]">
                  PRODUCT / OFFER
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#FACC15] text-[#111827] text-[10px] font-medium uppercase">
                  29% OFF
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <div className="space-y-3 max-w-[55%]">
                  <h3 className="text-base sm:text-lg font-semibold text-white leading-tight tracking-tight">
                    Hp 1030g2 <br />
                    Elitebook
                  </h3>
                  <div>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] bg-[#FA8232] hover:bg-[#E06F23] text-white text-xs font-medium transition-all shadow-xs"
                    >
                      <span>SHOP NOW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Exact HP 1030g2 Keyboard Photo */}
                <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-[3px] overflow-hidden shrink-0 shadow-xs">
                  <Image
                    src="/hero-hp-1030g2.png"
                    alt="Hp 1030g2 Elitebook Keyboard"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Bottom Promo Card: HP ENVY x360 (Light Silver/Grey) */}
            <div className="flex-1 bg-[#EFF2F5] text-slate-900 rounded-[6px] p-5 sm:p-6 flex items-center justify-between relative overflow-hidden border border-slate-200/80 shadow-xs group min-h-[170px]">
              {/* Exact HP Envy Lid Photo on Left */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[3px] overflow-hidden shrink-0 shadow-xs bg-white">
                <Image
                  src="/hero-hp-envy.png"
                  alt="HP ENVY x360"
                  fill
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>

              {/* Content on Right */}
              <div className="space-y-2 pl-4 text-left flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-[#111827] tracking-tight leading-tight">
                  HP ENVY x360
                </h3>
                <div className="text-xs font-medium text-slate-600">
                  Touchscreen Convertible
                </div>
                <div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] bg-[#FA8232] hover:bg-[#E06F23] text-white text-xs font-medium transition-all shadow-xs"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
