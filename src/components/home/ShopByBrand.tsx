'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ShopByBrand: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const brands = [
    {
      name: 'HP',
      category: 'Computer & Laptop',
      href: '/shop?brand=HP',
      imageSrc: '/brand-hp.png',
      alt: 'HP Official Logo',
    },
    {
      name: 'Dell',
      category: 'SmartPhone',
      href: '/shop?brand=Dell',
      imageSrc: '/brand-dell.png',
      alt: 'Dell Official Logo',
    },
    {
      name: 'Acer',
      category: 'Headphones',
      href: '/shop?brand=Acer',
      imageSrc: '/brand-acer.png',
      alt: 'Acer Official Logo',
    },
    {
      name: 'Apple',
      category: 'Accessories',
      href: '/shop?brand=Apple',
      imageSrc: '/brand-apple.png',
      alt: 'Apple Official Logo',
    },
    {
      name: 'Lenovo',
      category: 'Camera & Photo',
      href: '/shop?brand=Lenovo',
      imageSrc: '/brand-lenovo.png',
      alt: 'Lenovo Official Logo',
    },
    {
      name: 'ASUS',
      category: 'TV & Homes',
      href: '/shop?brand=ASUS',
      imageSrc: '/brand-asus.png',
      alt: 'ASUS Official Logo',
    },
    {
      name: 'Samsung',
      category: 'Galaxy & Displays',
      href: '/shop?brand=Samsung',
      imageSrc: '/brand-samsung.png',
      alt: 'Samsung Official Logo',
    },
    {
      name: 'Microsoft',
      category: 'Surface & PC',
      href: '/shop?brand=Microsoft',
      imageSrc: '/brand-microsoft.png',
      alt: 'Microsoft Official Logo',
    },
    {
      name: 'MSI',
      category: 'Gaming Laptops',
      href: '/shop?brand=MSI',
      imageSrc: '/brand-msi.png',
      alt: 'MSI Official Logo',
    },
    {
      name: 'LG',
      category: 'UltraGear & Monitors',
      href: '/shop?brand=LG',
      imageSrc: '/brand-lg.png',
      alt: 'LG Official Logo',
    },
    {
      name: 'Chromebook',
      category: 'ChromeOS & Cloud',
      href: '/shop?brand=Chromebook',
      imageSrc: '/brand-chromebook.png',
      alt: 'Chromebook Official Logo',
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 390;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white py-10 sm:py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching User Mockup */}
        <div className="text-center mb-7 sm:mb-9">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Shop by Brand
          </h2>
        </div>

        {/* Carousel Container with Authentic Orange Navigation Arrows */}
        <div className="relative group/carousel">
          {/* Left Navigation Arrow */}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll brands left"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FA8232] hover:bg-[#E06F23] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Side-by-Side Horizontal Scroll Track */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth scrollbar-none py-2 px-1 snap-x snap-mandatory"
          >
            {brands.map((b, i) => (
              <Link
                key={i}
                href={b.href}
                className="flex-none w-[150px] sm:w-[175px] lg:w-[190px] snap-start group bg-white rounded-md sm:rounded-lg border border-slate-200/90 p-4 sm:p-5 flex flex-col items-center justify-between text-center hover:border-[#1B6392] hover:shadow-md transition-all duration-200 min-h-[175px]"
              >
                {/* Authentic Brand Logo Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-3">
                  <Image
                    src={b.imageSrc}
                    alt={b.alt}
                    width={111}
                    height={111}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                </div>

                {/* Subtitle / Category Label from Reference Mockup */}
                <span className="font-semibold text-xs sm:text-sm text-slate-800 tracking-tight group-hover:text-[#1B6392] transition-colors leading-tight">
                  {b.category}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll brands right"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FA8232] hover:bg-[#E06F23] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
