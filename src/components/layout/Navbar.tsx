'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Phone,
  MessageSquare,
  Sparkles,
  MapPin,
  Laptop,
  Wrench,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { TopPromoBar } from '@/components/layout/TopPromoBar';
import { TopUtilityBar } from '@/components/layout/TopUtilityBar';
import { SubNavbar } from '@/components/layout/SubNavbar';
import { initialBusinessSettings } from '@/lib/data/initial-data';
import { WhatsAppTemplates } from '@/lib/whatsapp';
import { SocialLinks } from '@/components/common/SocialLinks';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          '--navbar-height',
          `${headerRef.current.offsetHeight}px`
        );
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header ref={headerRef} className="w-full sticky top-0 z-50 shadow-md">
      {/* 1. Top Announcement Bar (Black Friday Deals) */}
      <TopPromoBar />

      {/* 2. Top Utility Bar (Welcome + Social + Currency) */}
      <TopUtilityBar />

      {/* 3. Main Header (Vibrant Brand Navy #1B6392 with White Logo, Search, and Action Icons) */}
      <div className="bg-[#1B6392] text-white py-3.5 px-4 sm:px-6 lg:px-8 border-b border-[#154E73]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo with White Brand Mark - No Tagline */}
          <div className="shrink-0">
            <BrandLogo variant="light" emblemColor="white" size="md" />
          </div>

          {/* Central Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center"
          >
            <div className="relative w-full flex items-center bg-white rounded-[3px] overflow-hidden shadow-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-4 pr-12 py-2.5 sm:py-2.5 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1 bottom-1 px-3.5 text-slate-600 hover:text-[#1B6392] flex items-center justify-center transition-colors"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Right Action: Direct WhatsApp & Support Enquiries */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Call Direct */}
            <a
              href={`tel:${initialBusinessSettings.phone}`}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
              title="Call ExperienceTech Support"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{initialBusinessSettings.phone_display}</span>
            </a>

            {/* Direct WhatsApp Fast Chat */}
            <a
              href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(
                WhatsAppTemplates.generalHelp()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[2px] bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-medium transition-all shadow-xs"
              title="WhatsApp Enquiry"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Contact / Enquiries Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[2px] bg-[#FA8232] hover:bg-[#E06F23] text-white text-xs font-medium transition-all shadow-xs"
            >
              <span>Contact</span>
            </Link>

            {/* Staff Portal Icon */}
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center justify-center p-2 rounded-[2px] bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Staff Portal (Restricted Access)"
              aria-label="Staff Portal Login"
            >
              <Lock className="w-4 h-4 text-slate-200 hover:text-white" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-[2px]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Visible on small screens) */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
          <div className="relative flex items-center bg-white rounded-[3px] overflow-hidden shadow-inner">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laptops, accessories, parts..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 pl-3.5 pr-10 py-2.5 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 rounded-[2px] bg-[#FF5B22] text-white flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 4. Sub-Navigation Bar (All Category + Quick Links + Phone Call) */}
      <SubNavbar />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-4 space-y-3 animate-in fade-in">
          <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[2px] hover:bg-slate-50 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[2px] hover:bg-slate-50 hover:text-blue-600"
            >
              Products Catalogue
            </Link>
            <Link
              href="/laptop-finder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[2px] hover:bg-slate-50 hover:text-blue-600 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Laptop Finder</span>
            </Link>
            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[2px] hover:bg-slate-50 hover:text-blue-600 flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-slate-400" />
              <span>Repairs & Diagnostics</span>
            </Link>
            <Link
              href="/training"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[2px] hover:bg-slate-50 hover:text-blue-600 flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>Hardware Academy</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[2px] hover:bg-slate-50 hover:text-blue-600"
            >
              About ExperienceTech
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[2px] hover:bg-slate-50 hover:text-blue-600"
            >
              Contact & Directions
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${initialBusinessSettings.phone}`}
              className="w-full py-2.5 px-4 rounded-[2px] bg-slate-100 text-[#0B192C] font-medium text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Call: {initialBusinessSettings.phone_display}</span>
            </a>
            <a
              href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(
                WhatsAppTemplates.generalHelp()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-[2px] bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Enquire on WhatsApp</span>
            </a>

            {/* Staff Portal Link in Mobile Drawer */}
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2 px-3 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Staff Portal Login</span>
            </Link>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Social Channels:</span>
              <SocialLinks variant="footer" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
