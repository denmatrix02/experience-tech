'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Star,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Product } from '@/types';
import { WhatsAppTemplates } from '@/lib/whatsapp';

interface FeaturedDealsSectionProps {
  products: Product[];
}

export const FeaturedDealsSection: React.FC<FeaturedDealsSectionProps> = ({ products }) => {
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  // Functional countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    // 14 days active promo campaign countdown
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    targetDate.setHours(23, 59, 59, 999);
    const targetTimestamp = targetDate.getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const distance = targetTimestamp - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter products by selected brand tab
  const brandTabs = ['ALL', 'HP', 'DELL', 'APPLE', 'LENOVO'];

  const displayedProducts = products
    .filter((p) => {
      if (selectedBrand === 'ALL') return true;
      return p.brand.toUpperCase() === selectedBrand;
    })
    .slice(0, 8);

  const getDealBadge = (product: Product, index: number) => {
    if (product.previous_price && product.previous_price > product.price) {
      const discount = Math.round(
        ((product.previous_price - product.price) / product.previous_price) * 100
      );
      return { text: `${discount}% OFF`, bg: 'bg-[#FACC15] text-[#0B192C]' };
    }
    const badges = [
      { text: 'HOT', bg: 'bg-red-500 text-white' },
      { text: 'BEST DEALS', bg: 'bg-cyan-600 text-white' },
      { text: 'SALE', bg: 'bg-emerald-600 text-white' },
      { text: 'FEATURED', bg: 'bg-blue-600 text-white' },
    ];
    return badges[index % badges.length];
  };

  return (
    <section className="bg-[#F8FAFC] py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Yellow Promo Deal Card (~28%) */}
          <div className="lg:col-span-3 bg-[#F5C242] text-[#0B192C] rounded-[6px] p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden border border-amber-300">
            <div className="space-y-3.5 relative z-10">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-900 bg-white/80 px-2 py-0.5 rounded-[2px] inline-block">
                Computer Accessories
              </span>
              <h3 className="text-3xl sm:text-4xl font-semibold text-[#0B192C] leading-none tracking-tight">
                32% <br />
                Discount
              </h3>
              <p className="text-xs text-slate-800 leading-snug font-normal">
                For all modern laptops, gadgets, original GaN chargers, and high-speed SSDs.
              </p>

              {/* Functional White Countdown Box with Visible Border and Black Text */}
              <div className="bg-white rounded-[3px] p-3 text-center border border-slate-300 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-black block mb-1.5">
                  OFFERS END IN
                </span>
                {timeLeft.isExpired ? (
                  <span className="font-semibold text-xs text-rose-600 uppercase tracking-wider">
                    Offer Expired
                  </span>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm text-black tracking-tight">
                    <span className="tabular-nums">{String(timeLeft.days).padStart(2, '0')}D</span>
                    <span>:</span>
                    <span className="tabular-nums">{String(timeLeft.hours).padStart(2, '0')}H</span>
                    <span>:</span>
                    <span className="tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}M</span>
                    <span>:</span>
                    <span className="tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}S</span>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <Link
                  href="/shop?cat=accessories"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-[#FA8232] hover:bg-[#E06F23] text-white text-xs font-medium uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-2" />
                </Link>
              </div>
            </div>

            {/* Accessory Flatlay Image with Provided Promotional Image */}
            <div className="relative w-full h-54 sm:h-90 overflow-hidden">
              <Image
                src="/GADGETS.png"
                alt="32% Discount Tech Flatlay"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column: Featured Products Grid (~72%) */}
          <div className="lg:col-span-9 flex flex-col justify-between space-y-5">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C] tracking-tight">
                  Featured Products
                </h2>
                <p className="text-xs text-slate-500">
                  Tested and verified by our hardware engineers in Aba, Abia State.
                </p>
              </div>

              {/* Brand Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
                {brandTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedBrand(tab)}
                    className={`px-3 py-1.5 rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${selectedBrand === tab
                      ? 'bg-[#1B6392] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                  >
                    {tab === 'ALL' ? 'All Products' : tab}
                  </button>
                ))}
                <Link
                  href="/shop"
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline pl-2 whitespace-nowrap"
                >
                  Browse All Products →
                </Link>
              </div>
            </div>

            {/* 4x2 Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedProducts.map((product, idx) => {
                const badge = getDealBadge(product, idx);
                const isOutOfStock = product.stock_status === 'out_of_stock';

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-[3px] border border-slate-200 p-3.5 flex flex-col justify-between hover:shadow-md hover:border-blue-400 transition-all duration-200 group relative"
                  >
                    {/* Top Deal Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-[2px] text-[10px] font-medium uppercase tracking-wider ${badge.bg}`}
                      >
                        {badge.text}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase">
                        {product.condition}
                      </span>
                    </div>

                    {/* Product Photo with hover actions */}
                    <div className="relative h-36 w-full rounded-[3px] bg-white overflow-hidden mb-3 border border-slate-50">
                      <Image
                        src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        unoptimized={product.images[0]?.startsWith('/')}
                      />

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="w-8 h-8 rounded-[2px] bg-white text-slate-800 hover:text-blue-600 flex items-center justify-center shadow-md transition-colors"
                          title="View Product Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <a
                          href={`https://wa.me/2348133948068?text=${encodeURIComponent(
                            WhatsAppTemplates.productInquiry(product)
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-[2px] bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center shadow-md transition-colors"
                          title="WhatsApp Enquiry"
                        >
                          <MessageSquare className="w-4 h-4 fill-current" />
                        </a>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">
                        (4.8)
                      </span>
                    </div>

                    {/* Product Title */}
                    <Link
                      href={`/shop/${product.slug}`}
                      className="font-medium text-xs text-[#0B192C] line-clamp-2 hover:text-blue-600 transition-colors mb-2 leading-snug"
                    >
                      {product.name}
                    </Link>

                    {/* Price and Stock */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-[#0B192C]">
                          ₦{product.price.toLocaleString()}
                        </div>
                        {product.previous_price && (
                          <div className="text-[10px] text-slate-400 line-through font-normal">
                            ₦{product.previous_price.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {isOutOfStock ? (
                        <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-[2px]">
                          Restocking
                        </span>
                      ) : (
                        <a
                          href={`https://wa.me/2348133948068?text=${encodeURIComponent(
                            WhatsAppTemplates.productInquiry(product)
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                        >
                          <span>Enquire</span>
                          <MessageSquare className="w-3 h-3 fill-current" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
