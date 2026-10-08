'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Lock } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { SocialLinks } from '@/components/common/SocialLinks';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer from all staff portal pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const topCategories = [
    { name: 'Computer & Laptop', href: '/shop?cat=laptops' },
    { name: 'Accessories', href: '/shop?cat=accessories' },
    { name: 'Storage & SSDs', href: '/shop?cat=storage' },
    { name: 'Computer Peripherals', href: '/shop?cat=peripherals' },
    { name: 'Monitors & Displays', href: '/shop?cat=monitors' },
  ];

  const quickLinks = [
    { name: 'Products Catalogue', href: '/shop' },
    { name: 'Repairs & Diagnostics', href: '/services' },
    { name: 'Smart Laptop Finder', href: '/laptop-finder' },
    { name: 'Hardware Academy', href: '/training' },
    { name: 'About ExperienceTech', href: '/about' },
    { name: 'Contact & Directions', href: '/contact' },
    { name: 'Warranty Policy', href: '/warranty-policy' },
  ];

  const popularTags = [
    { name: 'HP Laptops', href: '/shop?brand=HP' },
    { name: 'Dell Laptops', href: '/shop?brand=Dell' },
    { name: 'MacBook', href: '/shop?brand=Apple' },
    { name: 'Lenovo ThinkPad', href: '/shop?brand=Lenovo' },
    { name: 'Asus Laptops', href: '/shop?brand=Asus' },
    { name: 'NVMe SSD', href: '/shop?cat=storage' },
    { name: 'Fast Chargers', href: '/shop?cat=accessories', highlighted: true },
    { name: 'Motherboard Repair', href: '/services' },
    { name: 'Screen Replacement', href: '/services' },
    { name: 'Battery Replacement', href: '/services' },
    { name: 'Samsung Accessories', href: '/shop?brand=Samsung' },
  ];

  return (
    <footer className="bg-[#16191E] text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Contact Info (~33%) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" emblemColor="orange" size="lg" />

            <div className="space-y-2 pt-2 text-xs">
              <span className="text-slate-400 block text-xs">
                Customer Support:
              </span>

              {/* Exact Phone number */}
              <a
                href="tel:+2348133948068"
                className="text-base sm:text-lg font-semibold text-white hover:text-orange-400 transition-colors block tracking-wide"
              >
                (234) 813 394 8068
              </a>

              {/* Exact Address */}
              <p className="text-slate-400 leading-relaxed text-xs font-normal">
                37B St. Michael Road, Aba, Abia State
              </p>

              {/* Exact Email */}
              <a
                href="mailto:experiencetechservices@gmail.com"
                className="text-slate-400 hover:text-white transition-colors block text-xs pt-0.5 font-normal"
              >
                experiencetechservices@gmail.com
              </a>

              {/* Official Social Media Channels: TikTok · YouTube · Facebook */}
              <div className="pt-3 border-t border-slate-800/60">
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider mb-2 font-medium">
                  Follow Our Channels:
                </span>
                <SocialLinks variant="footer" />
              </div>
            </div>
          </div>

          {/* Column 2: TOP CATEGORY (~23%) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-white text-xs font-medium uppercase tracking-wider">
              TOP CATEGORY
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
              {topCategories.map((cat, i) => (
                <li key={i}>
                  <Link href={cat.href} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1.5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-[#FACC15] hover:underline font-medium text-xs"
                >
                  <span>Browse All Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: QUICK LINKS (~20%) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-white text-xs font-medium uppercase tracking-wider">
              QUICK LINKS
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: POPULAR TAG (~24%) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-white text-xs font-medium uppercase tracking-wider">
              POPULAR TAG
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, i) => (
                <Link
                  key={i}
                  href={tag.href}
                  className={`px-3 py-1.5 rounded-[2px] text-xs transition-colors border ${
                    tag.highlighted
                      ? 'border-[#FA8232] text-white bg-[#FA8232]/10 font-medium'
                      : 'border-slate-700/80 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Area (TikTok · YouTube · Facebook) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <p>© 2026 ExperienceTech. All rights reserved.</p>
            <span className="text-slate-700">·</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
              title="Staff Portal (Restricted Access - Email & Password Required)"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Staff Portal</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <a
              href="https://www.tiktok.com/@experience7378"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              TikTok
            </a>
            <span className="text-slate-600">·</span>
            <a
              href="https://youtube.com/@lap_hub_1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              YouTube
            </a>
            <span className="text-slate-600">·</span>
            <a
              href="https://www.facebook.com/profile.php?id=61581347956677"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
