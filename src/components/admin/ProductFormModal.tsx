'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { autoRemoveBackgroundToWhite } from '@/lib/image-processing';
import { Product, Category, ProductCondition, StockStatus, ProductStatus } from '@/types';

interface ProductFormModalProps {
  product?: Product | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product> & { name: string; price: number; brand: string }) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(product?.name || '');
  const [brand, setBrand] = useState(product?.brand || 'HP');
  const [categoryId, setCategoryId] = useState(product?.category_id || categories[0]?.id || 'cat-laptops');
  const [sku, setSku] = useState(product?.sku || `ET-${Date.now().toString().slice(-5)}`);
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [previousPrice, setPreviousPrice] = useState(product?.previous_price?.toString() || '');
  const [stockStatus, setStockStatus] = useState<StockStatus>(product?.stock_status || 'in_stock');
  const [quantity, setQuantity] = useState(product?.quantity?.toString() || '1');
  const [condition, setCondition] = useState<ProductCondition>(product?.condition || 'UK Used');
  const [status, setStatus] = useState<ProductStatus>(
    product?.status || (product?.is_published === false ? 'draft' : 'published')
  );
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [shortDescription, setShortDescription] = useState(product?.short_description || '');
  const [description, setDescription] = useState(product?.description || '');

  // Specifications
  const [processor, setProcessor] = useState(product?.specifications?.processor || '');
  const [ram, setRam] = useState(product?.specifications?.ram || '');
  const [storage, setStorage] = useState(product?.specifications?.storage || '');
  const [display, setDisplay] = useState(product?.specifications?.display || '');
  const [gpu, setGpu] = useState(product?.specifications?.gpu || '');
  const [os, setOs] = useState(product?.specifications?.os || 'Windows 11 Pro');
  const [battery, setBattery] = useState(product?.specifications?.battery || '');
  const [warranty, setWarranty] = useState(product?.specifications?.warranty || '6 Months Hardware Warranty');
  const [ports, setPorts] = useState(product?.specifications?.ports || '');
  const [color, setColor] = useState(product?.specifications?.color || '');

  // Image Management
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [autoWhiteBg, setAutoWhiteBg] = useState(true);
  const [processingIdx, setProcessingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SEO & URL Slug Automation
  const [slug, setSlug] = useState(product?.slug || '');
  const [slugCustomized, setSlugCustomized] = useState(Boolean(product?.slug));
  const [seoTitle, setSeoTitle] = useState(product?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(product?.seo_description || '');
  const [copiedSlug, setCopiedSlug] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'commercial' | 'specs' | 'images' | 'seo'>('basic');

  if (!isOpen) return null;

  // Auto-slugify generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugCustomized) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
    if (!seoTitle || seoTitle.includes('ExperienceTech')) {
      setSeoTitle(`${val} | ExperienceTech Aba`);
    }
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      if (autoWhiteBg) {
        const processedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          try {
            const whiteBgDataUrl = await autoRemoveBackgroundToWhite(files[i], { tolerance: 28, feather: 2 });
            processedUrls.push(whiteBgDataUrl);
          } catch {
            const formData = new FormData();
            formData.append('files', files[i]);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.urls?.[0]) processedUrls.push(data.urls[0]);
          }
        }
        setImageUrls((prev) => [...prev, ...processedUrls]);
      } else {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to upload image(s).');
        }

        if (data.urls && Array.isArray(data.urls)) {
          setImageUrls((prev) => [...prev, ...data.urls]);
        }
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMakeWhiteBackground = async (index: number) => {
    try {
      setProcessingIdx(index);
      const targetUrl = imageUrls[index];
      const whiteBgDataUrl = await autoRemoveBackgroundToWhite(targetUrl, { tolerance: 28, feather: 2 });
      setImageUrls((prev) => {
        const copy = [...prev];
        copy[index] = whiteBgDataUrl;
        return copy;
      });
    } catch (err: any) {
      alert('Could not convert to white background: ' + (err?.message || err));
    } finally {
      setProcessingIdx(null);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = imageUrls[index];
    const filtered = imageUrls.filter((_, i) => i !== index);
    setImageUrls([item, ...filtered]);
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const copy = [...imageUrls];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    setImageUrls(copy);
  };

  const handleMoveRight = (index: number) => {
    if (index === imageUrls.length - 1) return;
    const copy = [...imageUrls];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    setImageUrls(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Please enter a valid product price.');
      setIsSubmitting(false);
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      setIsSubmitting(false);
      return;
    }

    const categoryObj = categories.find((c) => c.id === categoryId);
    const is_published = status === 'published';
    const is_archived = status === 'archived';

    try {
      await onSave({
        id: product?.id,
        name: name.trim(),
        slug: slug.trim() || undefined,
        brand: brand.trim(),
        category_id: categoryId,
        category_name: categoryObj?.name || 'Laptops',
        sku: sku.trim(),
        price: parsedPrice,
        previous_price: previousPrice ? parseFloat(previousPrice) : undefined,
        stock_status: stockStatus,
        quantity: parseInt(quantity) || 1,
        condition,
        is_featured: isFeatured,
        is_published,
        status,
        is_archived,
        short_description: shortDescription.trim(),
        description: description.trim(),
        specifications: {
          processor,
          ram,
          storage,
          display,
          gpu,
          os,
          battery,
          warranty,
          ports,
          color,
        },
        images: imageUrls.length > 0 ? imageUrls : [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
        ],
        seo_title: seoTitle.trim() || `${name} | ExperienceTech Aba`,
        seo_description: seoDescription.trim() || shortDescription.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save product. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0B192C]">
              {product ? `Edit Product: ${product.name}` : 'Add New Hardware to Catalog'}
            </h2>
            <p className="text-xs text-slate-500">
              Database-driven inventory management. Changes sync immediately to the storefront and search results.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-slate-50 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'basic', label: '1. Basic Info' },
            { id: 'commercial', label: '2. Pricing & Stock' },
            { id: 'specs', label: '3. Technical Specs' },
            { id: 'images', label: `4. Images (${imageUrls.length})` },
            { id: 'seo', label: '5. SEO & Slug' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. HP EliteBook 840 G8 (14&quot; FHD, Core i7 11th Gen)"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="HP">HP</option>
                    <option value="Dell">Dell</option>
                    <option value="Apple">Apple</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="ASUS">ASUS</option>
                    <option value="Acer">Acer</option>
                    <option value="Baseus">Baseus</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Logitech">Logitech</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.is_archived ? '(Archived)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ProductCondition)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    <option value="UK Used">Grade A UK Used</option>
                    <option value="Refurbished">Factory Refurbished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Short Summary (Highlights)
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Core i7 11th Gen, 16GB RAM, 512GB NVMe SSD, Backlit keyboard."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Technical & Commercial Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description covering build quality, testing bench notes, battery health, and warranty terms..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STOCK */}
          {activeTab === 'commercial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Selling Price (₦ NGN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 585000"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Displays as: ₦{parseFloat(price || '0').toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Previous / Strike-through Price (₦ NGN)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={previousPrice}
                    onChange={(e) => setPreviousPrice(e.target.value)}
                    placeholder="e.g. 640000 (optional discount)"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Stock Availability <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="in_stock">In Stock (Available)</option>
                    <option value="low_stock">Low Stock (&lt; 3 units)</option>
                    <option value="out_of_stock">Out of Stock (Restock Soon)</option>
                    <option value="pre_order">Pre-Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Units in Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Stock Keeping Unit (SKU)
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Publication Status Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-colors ${
                      status === 'published'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={status === 'published'}
                        onChange={() => setStatus('published')}
                        className="text-emerald-600"
                      />
                      <span className="text-xs font-medium">Published</span>
                    </div>
                    <span className="text-[11px] text-slate-500 pl-5">
                      Visible in shop, search results, and category pages.
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-colors ${
                      status === 'draft'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={status === 'draft'}
                        onChange={() => setStatus('draft')}
                        className="text-amber-600"
                      />
                      <span className="text-xs font-medium">Draft</span>
                    </div>
                    <span className="text-[11px] text-slate-500 pl-5">
                      Hidden from public catalogue while saving your work.
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-colors ${
                      status === 'archived'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        checked={status === 'archived'}
                        onChange={() => setStatus('archived')}
                        className="text-purple-600"
                      />
                      <span className="text-xs font-medium">Archived</span>
                    </div>
                    <span className="text-[11px] text-slate-500 pl-5">
                      Preserved in admin records, removed from active shop.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Feature on Homepage Carousel (Handpicked Systems)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Processor</label>
                  <input
                    type="text"
                    value={processor}
                    onChange={(e) => setProcessor(e.target.value)}
                    placeholder="e.g. Intel Core i7-1165G7 (up to 4.7GHz)"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">RAM Memory</label>
                  <input
                    type="text"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    placeholder="e.g. 16GB DDR4 3200MHz"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Storage</label>
                  <input
                    type="text"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    placeholder="e.g. 512GB NVMe PCIe M.2 SSD"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Screen / Display</label>
                  <input
                    type="text"
                    value={display}
                    onChange={(e) => setDisplay(e.target.value)}
                    placeholder="e.g. 14.0&quot; Full HD IPS Anti-glare"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Graphics / GPU</label>
                  <input
                    type="text"
                    value={gpu}
                    onChange={(e) => setGpu(e.target.value)}
                    placeholder="e.g. Intel Iris Xe / NVIDIA RTX 3050"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Operating System</label>
                  <input
                    type="text"
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    placeholder="e.g. Windows 11 Pro 64-bit Genuine"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Battery Health & Backup</label>
                  <input
                    type="text"
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                    placeholder="e.g. 3-Cell 53Wh (Up to 6-8 hours tested)"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Warranty Period</label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 6 Months Hardware Warranty"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Ports & Connectivity</label>
                  <input
                    type="text"
                    value={ports}
                    onChange={(e) => setPorts(e.target.value)}
                    placeholder="e.g. Thunderbolt 4, HDMI, USB-A, Audio Jack"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Color / Finish</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Silver Aluminium / Midnight Black"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMAGES & MEDIA */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="product-image-upload"
                />
                <label
                  htmlFor="product-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-600 hover:underline">
                      {isUploading ? 'Uploading files...' : 'Click to upload product photos'}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      JPG, PNG, WEBP, or AVIF up to 5MB each. Multiple files supported.
                    </span>
                  </div>
                </label>
              </div>

              {/* Auto White Background Feature Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-medium text-sm shadow-xs">
                    🪄
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-800 block">
                      Auto-Remove Background to Studio Pure White (#FFFFFF)
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      Automatically cleans photo perimeter and replaces cluttered table/room backgrounds with pure e-commerce white.
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoWhiteBg}
                    onChange={(e) => setAutoWhiteBg(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Or Manual URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Or paste external image URL (e.g. https://...)"
                  className="flex-1 text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors"
                >
                  Add URL
                </button>
              </div>

              {/* Gallery Reordering & Management */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Gallery Order & Primary Selection
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    The first image is the Primary Thumbnail shown across the website.
                  </span>
                </div>

                {imageUrls.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-slate-200 rounded-xl">
                    No images added yet. Upload photos or paste URLs above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl border overflow-hidden bg-white shadow-xs p-2 space-y-2 ${
                          idx === 0 ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                        }`}
                      >
                        <div className="relative h-36 w-full rounded-lg overflow-hidden bg-slate-100">
                          <Image
                            src={url}
                            alt={`Product preview ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={url.startsWith('/')}
                          />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-medium flex items-center gap-1 shadow-xs">
                              <Star className="w-3 h-3 fill-white" /> Primary Image
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveLeft(idx)}
                              disabled={idx === 0}
                              title="Move Left / Earlier"
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveRight(idx)}
                              disabled={idx === imageUrls.length - 1}
                              title="Move Right / Later"
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(idx)}
                                className="text-[10px] font-semibold text-blue-600 hover:underline px-1.5 py-0.5"
                              >
                                Make Primary
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleMakeWhiteBackground(idx)}
                              disabled={processingIdx === idx}
                              className="text-[10px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded px-2 py-0.5 inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                              title="Convert to pure studio white background"
                            >
                              {processingIdx === idx ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                                  <span>Cleaning...</span>
                                </>
                              ) : (
                                <>
                                  <span>🪄 White BG</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Remove Photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SEO & SLUG */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    URL Slug & Canonical Link (SEO & Social Posting)
                  </label>
                  {slug && (
                    <button
                      type="button"
                      onClick={async () => {
                        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://experiencetech.org';
                        const fullUrl = `${origin}/shop/${slug}`;
                        await navigator.clipboard.writeText(fullUrl);
                        setCopiedSlug(true);
                        setTimeout(() => setCopiedSlug(false), 2500);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {copiedSlug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                          <span className="text-emerald-600">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Copy Full Link</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2 text-xs text-slate-500 rounded-l-[3px] font-mono">
                    /shop/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugCustomized(true);
                    }}
                    placeholder="hp-elitebook-840-g8"
                    className="flex-1 text-sm px-3.5 py-2 border border-slate-300 rounded-r-[3px] focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-blue-700"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Public address for this product. Clean, lowercase, separated by hyphens.</span>
                  {product?.slug && (
                    <a
                      href={`/shop/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Live Store Page</span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  SEO Page Title (Title Tag)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. HP EliteBook 840 G8 Core i7 in Aba Abia State Nigeria | ExperienceTech"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Recommended: 50–60 characters. Appears in Google search and browser tabs.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  SEO Meta Description
                </label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="e.g. Buy verified Grade A UK-used HP EliteBook 840 G8 in 37B St. Michael Road, Aba, Abia State. 16GB RAM, 512GB SSD with 6 months hardware warranty."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Recommended: 120–160 characters. Used by search engines for snippet previews.
                </span>
              </div>
            </div>
          )}

          {/* Footer Submit Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Status:{' '}
                <strong className={status === 'published' ? 'text-emerald-600' : 'text-amber-600'}>
                  {status.toUpperCase()}
                </strong>
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>{product ? 'Save & Sync Product' : 'Publish Product to Live Website'}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
