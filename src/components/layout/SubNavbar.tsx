'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  ChevronDown,
  Phone,
  MapPin,
  Laptop,
  Headphones,
  HardDrive,
  Monitor,
  Wrench,
  GraduationCap,
  Sparkles,
  Search,
} from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data/initial-data';

export const SubNavbar: React.FC = () => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const categories = [
    { name: 'Laptops & Workstations', href: '/shop?cat=laptops', icon: Laptop },
    { name: 'Computer Peripherals', href: '/shop?cat=peripherals', icon: Headphones },
    { name: 'Laptop Accessories & Chargers', href: '/shop?cat=accessories', icon: Laptop },
    { name: 'Storage & SSD Upgrades', href: '/shop?cat=storage', icon: HardDrive },
    { name: 'Monitors & Displays', href: '/shop?cat=monitors', icon: Monitor },
  ];

  return (
    <div className="bg-white border-b border-slate-200 text-xs text-slate-700 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 gap-4">
          {/* Left: All Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[2px] bg-[#1B6392] hover:bg-[#154E73] text-white font-medium transition-colors shadow-xs"
            >
              <Menu className="w-4 h-4" />
              <span>All Category</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Category Dropdown Menu */}
            {isCategoryMenuOpen && (
              <div
                className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-[3px] shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-medium text-slate-400 tracking-wider">
                  Departments
                </div>
                {categories.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={i}
                      href={c.href}
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{c.name}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-slate-100 my-1" />
                <Link
                  href="/services"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  <Wrench className="w-4 h-4 text-slate-400" />
                  <span>Repairs & Maintenance</span>
                </Link>
                <Link
                  href="/training"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>Hardware Training</span>
                </Link>
              </div>
            )}
          </div>

          {/* Center Quick Navigation Links - Clean, focused on Products, Services, About, Contact */}
          <div className="hidden lg:flex items-center gap-6 text-slate-700 font-medium text-xs">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/services" className="hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/laptop-finder" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Smart Finder</span>
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <span className="flex items-center gap-1.5 text-slate-500 pl-2 border-l border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-slate-700 font-normal">37B St. Michael Road, Aba, Abia State</span>
            </span>
          </div>

          {/* Right Phone Call Strip */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+2348133948068"
              className="inline-flex items-center gap-2 font-medium text-[#0B192C] hover:text-blue-600 transition-colors py-1 px-2 rounded-[2px] hover:bg-slate-50"
            >
              <div className="w-7 h-7 rounded-[2px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold tracking-tight text-xs sm:text-sm text-slate-900">+234 813 394 8068</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
