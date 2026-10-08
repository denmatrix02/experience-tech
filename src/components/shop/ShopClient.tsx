'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  HelpCircle,
  MessageSquare,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Product, Category, ProductCondition } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { buildWhatsAppLink, WhatsAppTemplates } from '@/lib/whatsapp';

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export const ShopClient: React.FC<ShopClientProps> = ({
  initialProducts,
  categories,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || searchParams.get('cat') || 'all';
  const conditionParam = searchParams.get('condition') || 'all';

  // Local state
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState(conditionParam);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  React.useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('cat');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);

  // Extract unique brands from inventory
  const brands = useMemo(() => {
    const list = Array.from(new Set(initialProducts.map((p) => p.brand))).filter(Boolean);
    return ['all', ...list];
  }, [initialProducts]);

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.short_description.toLowerCase().includes(term) ||
          (p.specifications.processor && p.specifications.processor.toLowerCase().includes(term)) ||
          (p.specifications.storage && p.specifications.storage.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.slug === selectedCategory);
      if (catObj) {
        result = result.filter((p) => p.category_id === catObj.id);
      }
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      result = result.filter((p) => p.condition === selectedCondition);
    }

    // In-stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock_status === 'in_stock');
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      }
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

    return result;
  }, [
    initialProducts,
    categories,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedCondition,
    inStockOnly,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedCondition('all');
    setInStockOnly(false);
    setSortBy('featured');
    router.push('/shop');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedCondition !== 'all' ||
    inStockOnly;

  return (
    <div className="space-y-8">
      {/* Banner / Smart Help Callout */}
      <div className="rounded-[6px] bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unsure which laptop fits your workload?</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Use our 60-Second Interactive Laptop Finder
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Answer 3 quick questions about your budget, programming/office usage, and screen preference to get matched directly.
          </p>
        </div>
        <a
          href="/laptop-finder"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-colors"
        >
          <span>Find My Laptop</span>
          <span>→</span>
        </a>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white p-4 rounded-[3px] border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by laptop name, processor, brand, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs sm:text-sm border border-slate-300 rounded-[2px] px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Pills / Quick Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Category Pills */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-[2px] text-xs font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0B192C] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1 rounded-[2px] text-xs font-semibold transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {/* Condition Select */}
          <div className="ml-auto hidden md:flex items-center gap-2">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="text-xs border border-slate-300 rounded-[2px] px-2.5 py-1 bg-white text-slate-700"
            >
              <option value="all">Any Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="UK Used">Grade A UK Used</option>
              <option value="Certified Pre-Owned">Certified Pre-Owned</option>
            </select>

            {/* Brand Select */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs border border-slate-300 rounded-[2px] px-2.5 py-1 bg-white text-slate-700"
            >
              <option value="all">All Brands</option>
              {brands.filter((b) => b !== 'all').map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Stock Toggle */}
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer pl-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>In-stock only</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline pl-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterDrawerOpen && (
          <div className="md:hidden pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                Condition
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-[2px] p-2 bg-white"
              >
                <option value="all">All Conditions</option>
                <option value="Brand New">Brand New</option>
                <option value="UK Used">Grade A UK Used</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-[2px] p-2 bg-white"
              >
                <option value="all">All Brands</option>
                {brands.filter((b) => b !== 'all').map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex items-center justify-between pt-2">
              <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Show in-stock only</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 font-medium underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
        <span>
          Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 font-medium">Filtered search results</span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty Search State with WhatsApp Lead Conversion CTA (Section 27) */
        <div className="bg-white rounded-[6px] border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-[2px] bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-[#0B192C]">
            We Couldn't Find That Exact Product
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {searchTerm
              ? `We don't currently have "${searchTerm}" listed online, but we receive fresh shipments weekly at our Aba store and can source it for you immediately.`
              : 'No products match the selected filters. Try broadening your criteria or ask our desk.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <WhatsAppButton
              message={`Hello Experience Tech, I searched your website for "${searchTerm || 'a specific laptop'}" but could not find it. Do you have it in stock or can you source it for me?`}
              label="Ask on WhatsApp"
              variant="primary"
            />
            <button
              onClick={clearAllFilters}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline px-3 py-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
