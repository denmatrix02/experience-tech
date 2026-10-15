import { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerProducts, getServerCategories } from '@/lib/data/server-store';
import { ShopClient } from '@/components/shop/ShopClient';

// Cache page on Edge CDN with Incremental Static Regeneration (ISR).
// Revalidates every 60s, or on-demand when products are updated in the admin dashboard.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop Laptops, Parts & Accessories in Aba Abia State Nigeria',
  description:
    'Browse verified business laptops, gaming machines, GaN fast chargers, and NVMe SSDs in 37B St. Michael Road, Aba, Abia State. Brand new & Grade A UK Used with warranty.',
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getServerProducts({ publishedOnly: true }),
    getServerCategories(false),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Breadcrumb */}
        <div>
          <div className="text-xs text-slate-500 font-normal mb-1">
            <span>Home</span> <span className="mx-1">/</span> <span className="text-slate-800 font-medium">Shop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">
            Laptops, Accessories & Computer Hardware
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            Physical stock verified at 37B St. Michael Road, Aba, Abia State. Order via WhatsApp or pick up in-store.
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading catalog...</div>}>
          <ShopClient initialProducts={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
