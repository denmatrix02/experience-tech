'use client';

import React from 'react';

export const TikTokIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.49V8.78a8.18 8.18 0 0 0 3.91 1.09V6.69z" />
  </svg>
);

export const YouTubeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const FacebookIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export interface SocialLinkItem {
  id: 'tiktok' | 'youtube' | 'facebook';
  name: string;
  url: string;
  label: string;
  handle: string;
  icon: React.FC<{ className?: string }>;
}

export const OFFICIAL_SOCIAL_LINKS: readonly SocialLinkItem[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/@experience7378',
    label: 'ExperienceTech on TikTok',
    handle: '@experience7378',
    icon: TikTokIcon,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com/@lap_hub_1',
    label: 'ExperienceTech on YouTube',
    handle: '@lap_hub_1',
    icon: YouTubeIcon,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61581347956677',
    label: 'ExperienceTech on Facebook',
    handle: 'ExperienceTech',
    icon: FacebookIcon,
  },
] as const;

interface SocialLinksProps {
  variant?: 'topbar' | 'footer' | 'card' | 'badge';
  className?: string;
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'footer',
  className = '',
  showLabels = false,
}) => {
  if (variant === 'topbar') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {OFFICIAL_SOCIAL_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors p-0.5"
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {OFFICIAL_SOCIAL_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-[3px] border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group"
              aria-label={item.label}
            >
              <div className="w-8 h-8 rounded-[2px] bg-slate-100 group-hover:bg-[#0B192C] group-hover:text-white text-slate-700 flex items-center justify-center shrink-0 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-[#0B192C]">
                  {item.name}
                </span>
                <span className="block text-[11px] text-slate-500 truncate font-normal">
                  {item.handle}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // Default: footer style with crisp 2px rounded icon boxes
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {OFFICIAL_SOCIAL_LINKS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-[2px] bg-slate-800/80 hover:bg-[#FA8232] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 hover:border-[#FA8232]"
            title={item.label}
            aria-label={item.label}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};
