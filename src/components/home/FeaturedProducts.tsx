import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard';

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const featured = products.filter((p) => p.is_featured).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Handpicked Systems</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">
              Featured Laptops & Hardware
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl font-normal">
              Each unit has passed our 25-point physical and hardware diagnostic bench test at our Aba workshop.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Browse Full Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
