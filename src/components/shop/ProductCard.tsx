'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Cpu, HardDrive, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/common/Badge';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Format price in Naira
  const formattedPrice = `₦${product.price.toLocaleString()}`;
  const formattedPrevPrice = product.previous_price ? `₦${product.previous_price.toLocaleString()}` : null;

  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-[3px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <Link href={`/shop/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Condition & Stock Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <Badge value={product.condition} />
          {product.stock_status !== 'in_stock' && (
            <Badge value={product.stock_status} />
          )}
        </div>

        {product.is_featured && (
          <span className="absolute top-3 right-3 bg-[#0B192C] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-[2px] shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium uppercase tracking-wider text-blue-600">{product.brand}</span>
            <span className="font-normal">SKU: {product.sku}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-[#0B192C] line-clamp-2 group-hover:text-blue-600 transition-colors">
            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Key Hardware Specs Pills */}
          {(product.specifications?.processor || product.specifications?.ram || product.specifications?.storage) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.specifications.processor && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-[2px] font-medium">
                  <Cpu className="w-3 h-3 text-slate-500" />
                  <span className="truncate max-w-[140px]">{product.specifications.processor.split('(')[0]}</span>
                </span>
              )}
              {product.specifications.ram && (
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-[2px] font-medium">
                  {product.specifications.ram.split('(')[0]}
                </span>
              )}
              {product.specifications.storage && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-[2px] font-medium">
                  <HardDrive className="w-3 h-3 text-slate-500" />
                  <span>{product.specifications.storage.split('(')[0]}</span>
                </span>
              )}
            </div>
          )}

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {product.short_description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-semibold text-[#0B192C]">
                {formattedPrice}
              </span>
              {formattedPrevPrice && (
                <span className="text-xs text-slate-400 line-through ml-2 font-normal">
                  {formattedPrevPrice}
                </span>
              )}
            </div>
            <Link
              href={`/shop/${product.slug}`}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              <span>Specs</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Conversion Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <WhatsAppButton
              message={WhatsAppTemplates.productAvailability(product.name, product.sku, product.price)}
              label="Enquire"
              variant="primary"
              analyticsEvent="whatsapp_product_enquiry"
              analyticsMetadata={{
                product_id: product.id,
                product_name: product.name,
                price: product.price,
              }}
              className="w-full text-xs py-2 font-medium"
            />
            <Link
              href={`/shop/${product.slug}`}
              className="inline-flex items-center justify-center text-xs font-medium py-2 px-3 rounded-[2px] border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
