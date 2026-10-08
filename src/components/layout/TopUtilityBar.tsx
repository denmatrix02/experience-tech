'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { OFFICIAL_SOCIAL_LINKS } from '@/components/common/SocialLinks';

export const TopUtilityBar: React.FC = () => {
  return (
    <div className="bg-[#091F38] text-slate-300 text-[11px] py-1.5 px-4 border-b border-blue-950/60 hidden sm:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Welcome Text */}
        <div className="flex items-center gap-2">
          <span>Welcome to ExperienceTech — Quality Laptops, Accessories & Technical Services.</span>
        </div>

        {/* Right Utility & Social Icons */}
        <div className="flex items-center gap-5">
          {/* Social Follow: Only TikTok, YouTube, Facebook */}
          <div className="flex items-center gap-2 text-slate-400">
            <span>Follow us:</span>
            <div className="flex items-center gap-2.5">
              {OFFICIAL_SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    title={social.label}
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          <span className="text-slate-700">|</span>

          {/* Currency / Location */}
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-300">NGN (₦)</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-normal">Aba, Abia State</span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Staff Portal Icon Link */}
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group cursor-pointer"
            title="Staff Portal (Restricted Access - Email & Password Required)"
            aria-label="Staff Portal Login"
          >
            <Lock className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors" />
            <span>Staff Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
