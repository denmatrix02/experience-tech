import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Laptop, MousePointer, Shield, HardDrive, Monitor } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
              Hardware Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">
              Explore Product Categories
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl font-normal">
              From enterprise laptops to high-speed NVMe storage and ergonomic peripherals, find tested equipment built for durability.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?cat=${category.slug}`}
              className="group relative rounded-[3px] bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {category.image_url && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className="absolute bottom-3 right-3 text-xs font-medium bg-white/90 backdrop-blur-xs text-slate-800 px-2.5 py-1 rounded-[2px] shadow-xs">
                    {category.item_count ?? 0} {category.item_count === 1 ? 'item' : 'items'}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0B192C] group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600 group-hover:text-blue-700">
                  <span>Browse Category</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
