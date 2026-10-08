'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  emblemColor?: 'white' | 'orange' | 'auto';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  emblemColor,
}) => {
  const isLight = variant === 'light';

  const dimensions = {
    sm: { w: 38, h: 17, text: 'text-base sm:text-lg' },
    md: { w: 50, h: 23, text: 'text-xl sm:text-2xl' },
    lg: { w: 66, h: 30, text: 'text-2xl sm:text-3xl' },
  };

  const { w, h, text } = dimensions[size];

  // If emblemColor is explicitly provided, use it. Otherwise, light variant defaults to white emblem (for top nav), dark to orange.
  const chosenColor = emblemColor ? emblemColor : (isLight ? 'white' : 'orange');
  const emblemSrc = chosenColor === 'white' ? '/logo-white-emblem.png' : '/logo-orange-transparent.png';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
      title="ExperienceTech Homepage"
    >
      {/* Authentic Brand Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <Image
          src={emblemSrc}
          alt="ExperienceTech Logo"
          width={w * 2}
          height={h * 2}
          className="w-full h-full object-contain drop-shadow-xs"
          priority
          unoptimized
        />
      </div>

      {/* Brand Typography: ExperienceTech - NO Tagline */}
      <div className={`font-semibold tracking-tight leading-none ${text}`}>
        <span className={isLight ? 'text-white' : 'text-[#0B192C]'}>Experience</span>
        <span className={isLight ? 'text-white' : 'text-[#FA8232]'}>Tech</span>
      </div>
    </Link>
  );
};
