'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Package,
  Archive,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Radio,
  Tag,
  Link2,
  Copy,
  Share2,
  Send,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { getProducts, getCategories, saveProduct, deleteProduct, archiveProduct, restoreProduct } from '@/lib/data/store';
import { Product, Category, ProductStatus } from '@/types';
import { Badge } from '@/components/common/Badge';
import { ProductFormModal } from '@/components/admin/ProductFormModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [loading, setLoading] = useState(true);

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Safe Deletion confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Link copy and Share Hub state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [copiedModalLink, setCopiedModalLink] = useState(false);
  const [copiedPostText, setCopiedPostText] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const getProductCanonicalUrl = (product: Product) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://experiencetech.org';
    return `${origin}/shop/${product.slug}`;
  };

  const handleQuickCopyLink = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const url = getProductCanonicalUrl(product);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(product.id);
      showToast(`Product link copied! Ready for social posting & SEO: ${url}`, 'success');
      setTimeout(() => {
        setCopiedId((curr) => (curr === product.id ? null : curr));
      }, 2500);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedId(product.id);
      showToast(`Link copied: ${url}`, 'success');
    }
  };

  const getProductSocialPostText = (product: Product) => {
    const url = getProductCanonicalUrl(product);
    const specs = [
      product.specifications?.processor,
      product.specifications?.ram,
      product.specifications?.storage,
      product.specifications?.display,
    ]
      .filter(Boolean)
      .join(' • ');

    return `🔥 AVAILABLE NOW AT EXPERIENCE TECH ABA!

💻 ${product.name}
💰 Price: ₦${product.price.toLocaleString()}${product.previous_price ? ` (Was ₦${product.previous_price.toLocaleString()})` : ''}
⚡ Condition: ${product.condition}
${specs ? `⚙️ Specs: ${specs}\n` : ''}✅ Diagnostic Tested & Guaranteed Warranty
📍 37B St. Michael Road, Aba, Abia State

👉 Full Specs, High-Res Photos & Instant Order:
${url}`;
  };

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([
        getProducts({ publishedOnly: false, includeArchived: true }),
        getCategories(true),
      ]);
      setProducts(p);
      setCategories(c);
    } catch (err) {
      console.error(err);
      showToast('Failed to load catalogue from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Safe Deletion
  const handleConfirmPermanentDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id, { permanent: true });
      showToast(`Product "${deleteTarget.name}" permanently deleted.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmArchiveInstead = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await archiveProduct(deleteTarget.id);
      showToast('Product archived successfully.');
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to archive product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Action Toggles
  const handleTogglePublished = async (product: Product) => {
    try {
      const isCurrentlyPublished = product.status === 'published' && product.is_published;
      const newStatus: ProductStatus = isCurrentlyPublished ? 'draft' : 'published';

      await saveProduct({
        ...product,
        status: newStatus,
        is_published: newStatus === 'published',
        is_archived: false,
      });

      showToast(
        newStatus === 'published' ? 'Product published successfully.' : 'Product unpublished successfully.'
      );
      await loadData();
    } catch (err: any) {
      showToast('Failed to update publication status.', 'error');
    }
  };

  const handleToggleArchive = async (product: Product) => {
    try {
      if (product.status === 'archived' || product.is_archived) {
        await restoreProduct(product.id);
        showToast('Product restored successfully.');
      } else {
        await archiveProduct(product.id);
        showToast('Product archived successfully.');
      }
      await loadData();
    } catch (err: any) {
      showToast('Failed to toggle archive status.', 'error');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const nextFeatured = !product.is_featured;
      await saveProduct({
        ...product,
        is_featured: nextFeatured,
      });
      showToast(nextFeatured ? 'Marked as Featured system.' : 'Removed from Featured systems.');
      await loadData();
    } catch (err: any) {
      showToast('Failed to update featured setting.', 'error');
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const nextStock = product.stock_status === 'in_stock' ? 'out_of_stock' : 'in_stock';
      await saveProduct({
        ...product,
        stock_status: nextStock,
      });
      showToast(
        nextStock === 'in_stock'
          ? `Stock updated: "${product.name}" is now Available.`
          : `Stock updated: "${product.name}" marked as Out of Stock.`
      );
      await loadData();
    } catch (err: any) {
      showToast('Failed to update stock status.', 'error');
    }
  };

  const handleSaveModal = async (data: any) => {
    try {
      await saveProduct(data);
      showToast(
        data.status === 'published'
          ? 'Product published successfully.'
          : 'Product updated successfully.'
      );
      await loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save product to database.', 'error');
    }
  };

  // Counts for tabs
  const publishedCount = products.filter((p) => p.status === 'published' && p.is_published && !p.is_archived).length;
  const draftCount = products.filter((p) => p.status === 'draft' || (!p.is_published && !p.is_archived)).length;
  const archivedCount = products.filter((p) => p.status === 'archived' || p.is_archived).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;

    let matchesStatus = true;
    if (statusFilter === 'published') {
      matchesStatus = p.status === 'published' && p.is_published && !p.is_archived;
    } else if (statusFilter === 'draft') {
      matchesStatus = p.status === 'draft' || (!p.is_published && !p.is_archived);
    } else if (statusFilter === 'archived') {
      matchesStatus = p.status === 'archived' || Boolean(p.is_archived);
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all animate-in fade-in slide-in-from-bottom-4 border ${
            toast.type === 'success'
              ? 'bg-[#0B192C] text-white border-blue-500/30'
              : 'bg-red-900 text-white border-red-500'
          }`}
        >
          {toast.type === 'success' ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B192C]">Products & Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Database-driven product catalogue. All updates sync immediately to the storefront without redeployment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            <Tag className="w-4 h-4 text-slate-500" />
            <span>Manage Categories</span>
          </Link>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'all', label: `All Products (${products.length})` },
          { id: 'published', label: `Published (${publishedCount})` },
          { id: 'draft', label: `Drafts (${draftCount})` },
          { id: 'archived', label: `Archived (${archivedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              statusFilter === tab.id
                ? 'bg-[#0B192C] text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product Name, Brand, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            title="Refresh catalogue data"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Querying product database...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No products found matching criteria</p>
            <p className="text-xs text-slate-500">Try changing your search term, category, or status tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider">
                  <th className="py-3 px-4">Product & Specs</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (₦)</th>
                  <th className="py-3 px-4">Stock Availability</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const isPublished = product.status === 'published' && product.is_published && !product.is_archived;
                  const isArchived = product.status === 'archived' || Boolean(product.is_archived);
                  const isDraft = !isPublished && !isArchived;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product Thumbnail & Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <Image
                              src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized={product.images[0]?.startsWith('/')}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-[#0B192C] flex items-center gap-1.5 max-w-sm sm:max-w-md truncate">
                              <span>{product.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-slate-400">{product.sku}</span>
                              <span>•</span>
                              <span>{product.brand}</span>
                              <span>•</span>
                              <span className="text-blue-600 font-medium">{product.condition}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {product.category_name || categories.find((c) => c.id === product.category_id)?.name || 'General'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold text-[#0B192C]">
                        <div>₦{product.price.toLocaleString()}</div>
                        {product.previous_price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ₦{product.previous_price.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(product)}
                          title="Click to toggle availability"
                          className="text-left group"
                        >
                          {product.stock_status === 'in_stock' && (
                            <Badge value="in_stock">{`In Stock (${product.quantity})`}</Badge>
                          )}
                          {product.stock_status === 'low_stock' && (
                            <Badge value="low_stock">{`Low Stock (${product.quantity})`}</Badge>
                          )}
                          {product.stock_status === 'out_of_stock' && (
                            <Badge value="out_of_stock">Out of Stock</Badge>
                          )}
                          {product.stock_status === 'pre_order' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              Pre-Order
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublished(product)}
                          title="Click to toggle published / draft"
                          className="flex items-center gap-1.5 group"
                        >
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Published</span>
                            </span>
                          ) : isArchived ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                              <Archive className="w-3 h-3 text-purple-600" />
                              <span>Archived</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Draft</span>
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 transition-colors"
                          title="Toggle featured on homepage"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              product.is_featured ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Copiable Link for Social Posting & SEO */}
                          <button
                            type="button"
                            onClick={(e) => handleQuickCopyLink(e, product)}
                            title="Copy link for WhatsApp, TikTok, Facebook & SEO"
                            className={`px-2 py-1 rounded-[2px] transition-all flex items-center gap-1.5 text-xs font-medium border ${
                              copiedId === product.id
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 shadow-2xs'
                            }`}
                          >
                            {copiedId === product.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                <span className="text-[11px] text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link2 className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[11px]">Copy Link</span>
                              </>
                            )}
                          </button>

                          {/* Social & SEO Hub Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setShareProduct(product);
                              setCopiedModalLink(false);
                              setCopiedPostText(false);
                            }}
                            title="Social Media & SEO Hub"
                            className="p-1.5 rounded-[2px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          {/* Live Preview */}
                          {isPublished ? (
                            <Link
                              href={`/shop/${product.slug}`}
                              target="_blank"
                              title="View on Live Store"
                              className="p-1.5 rounded-[2px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : (
                            <span
                              title="Unpublished or archived (hidden from store)"
                              className="p-1.5 text-slate-300 cursor-not-allowed"
                            >
                              <Eye className="w-4 h-4 opacity-40" />
                            </span>
                          )}

                          {/* Quick Archive / Restore Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleArchive(product)}
                            title={isArchived ? 'Restore to Catalogue' : 'Archive Product'}
                            className={`p-1.5 rounded-[2px] transition-colors ${
                              isArchived
                                ? 'text-purple-600 hover:bg-purple-50'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(product)}
                            title="Edit Product Details"
                            className="p-1.5 rounded-[2px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Safe Delete Dialog Trigger */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            title="Delete Product"
                            className="p-1.5 rounded-[2px] text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Safe Deletion Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-semibold text-[#0B192C]">
                Remove &quot;{deleteTarget.name}&quot;?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Where possible, we recommend <strong>Archiving</strong> instead of permanently deleting. Archiving immediately removes the product from the public shop while preserving sales inquiries and audit logs.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmArchiveInstead}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Archive className="w-4 h-4" />
                <span>Archive Product (Recommended)</span>
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmPermanentDelete}
                className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Permanently Delete from Database</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Social Posting & SEO Link Hub Modal */}
      {shareProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[6px] max-w-2xl w-full p-5 sm:p-6 space-y-6 border border-slate-200 shadow-2xl my-8 animate-in fade-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[3px] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#0B192C]">
                    Product Social Posting & SEO Hub
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">
                    Generate shareable links, ready-to-post marketing captions, and preview Google SEO.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShareProduct(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[2px] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary Mini Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-[3px] bg-slate-50 border border-slate-200">
              <div className="relative w-14 h-14 bg-white rounded-[2px] border border-slate-200 overflow-hidden shrink-0">
                <Image
                  src={
                    shareProduct.images && shareProduct.images.length > 0
                      ? shareProduct.images[0]
                      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={shareProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-xs text-[#0B192C] truncate block">
                    {shareProduct.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-[2px] bg-slate-200 text-slate-700 font-mono">
                    {shareProduct.sku}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-blue-600">₦{shareProduct.price.toLocaleString()}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">{shareProduct.condition}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{shareProduct.brand}</span>
                </div>
              </div>
              <div className="shrink-0">
                {shareProduct.is_published && shareProduct.status === 'published' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Draft
                  </span>
                )}
              </div>
            </div>

            {/* 1. Direct Copiable Link */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                1. Shareable Canonical Product URL (Direct Link)
              </label>
              <div className="flex items-stretch gap-2">
                <div className="flex-1 relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    readOnly
                    value={getProductCanonicalUrl(shareProduct)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-[2px] font-mono text-blue-700 select-all focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const url = getProductCanonicalUrl(shareProduct);
                    await navigator.clipboard.writeText(url);
                    setCopiedModalLink(true);
                    showToast('Canonical link copied to clipboard!', 'success');
                    setTimeout(() => setCopiedModalLink(false), 2500);
                  }}
                  className={`px-4 py-2 rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                    copiedModalLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copiedModalLink ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <Link
                  href={`/shop/${shareProduct.slug}`}
                  target="_blank"
                  className="px-3 py-2 rounded-[2px] border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 shrink-0"
                  title="Open live product page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Visit</span>
                </Link>
              </div>
              <p className="text-[11px] text-slate-500">
                Use this link for TikTok bio, Instagram link sticker, WhatsApp catalog, Facebook ads, and YouTube descriptions.
              </p>
            </div>

            {/* 2. One-Click Social Media Channels */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                2. Instant 1-Click Social Sharing
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    getProductSocialPostText(shareProduct)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-[2px] bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    getProductCanonicalUrl(shareProduct)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-[2px] bg-[#1877F2] hover:bg-[#1464cc] text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Facebook</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Check out ${shareProduct.name} at ExperienceTech Aba! Price: ₦${shareProduct.price.toLocaleString()}`
                  )}&url=${encodeURIComponent(getProductCanonicalUrl(shareProduct))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-[2px] bg-black hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  <span>𝕏 / Twitter</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    getProductCanonicalUrl(shareProduct)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-[2px] bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* 3. Ready-to-Post Marketing Caption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-800">
                  3. Pre-Formatted Marketing Post Caption (For Instagram, TikTok, Facebook & WhatsApp Status)
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    const post = getProductSocialPostText(shareProduct);
                    await navigator.clipboard.writeText(post);
                    setCopiedPostText(true);
                    showToast('Marketing caption copied! Ready to paste into social media.', 'success');
                    setTimeout(() => setCopiedPostText(false), 2500);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {copiedPostText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Caption Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={getProductSocialPostText(shareProduct)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800 focus:outline-none"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>

            {/* 4. Google SERP & Search Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                4. Google Search & SEO Preview
              </label>
              <div className="p-3.5 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>experiencetech.org &gt; shop &gt; {shareProduct.slug}</span>
                </div>
                <div className="text-sm font-medium text-blue-800 hover:underline cursor-pointer">
                  {shareProduct.seo_title || `${shareProduct.name} | ExperienceTech Aba`}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                  {shareProduct.seo_description ||
                    shareProduct.short_description ||
                    `Buy genuine ${shareProduct.name} at ExperienceTech 37B St. Michael Road, Aba, Abia State. Price: ₦${shareProduct.price.toLocaleString()} with warranty.`}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShareProduct(null)}
                className="px-5 py-2 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
}
