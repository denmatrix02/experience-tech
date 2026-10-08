'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  FolderTree,
  Upload,
  Check,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getCategories, saveCategory, archiveCategory, restoreCategory, deleteCategory } from '@/lib/data/store';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArchived, setFilterArchived] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Modal Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugCustomized, setSlugCustomized] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    try {
      const data = await getCategories(true);
      setCategories(data);
    } catch (err) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setSlugCustomized(false);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80');
    setDisplayOrder(String(categories.length + 1));
    setSeoTitle('');
    setSeoDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setSlugCustomized(true);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setDisplayOrder(String(cat.display_order ?? 1));
    setSeoTitle(cat.seo_title || '');
    setSeoDescription(cat.seo_description || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugCustomized) {
      const gen = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(gen);
    }
    if (!seoTitle) {
      setSeoTitle(`${val} | ExperienceTech Aba Abia State`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (data.url) setImageUrl(data.url);
    } catch (err: any) {
      setFormError(err?.message || 'Error uploading image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await saveCategory({
        id: editingCategory?.id,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        image_url: imageUrl.trim() || undefined,
        display_order: parseInt(displayOrder) || 1,
        seo_title: seoTitle.trim() || `${name} | ExperienceTech Aba`,
        seo_description: seoDescription.trim() || description.trim(),
      });

      showToast(editingCategory ? 'Category updated successfully.' : 'Category created successfully.');
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = async (cat: Category) => {
    try {
      if (cat.is_archived) {
        await restoreCategory(cat.id);
        showToast(`Category "${cat.name}" restored successfully.`);
      } else {
        await archiveCategory(cat.id);
        showToast(`Category "${cat.name}" archived successfully.`);
      }
      await loadData();
    } catch (err: any) {
      showToast('Failed to update category status.', 'error');
    }
  };

  const handleDeletePermanent = async (cat: Category) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete category "${cat.name}"? Products assigned to it should be reassigned.`
      )
    ) {
      try {
        await deleteCategory(cat.id, true);
        showToast(`Category "${cat.name}" permanently deleted.`);
        await loadData();
      } catch (err) {
        showToast('Failed to delete category.', 'error');
      }
    }
  };

  const displayedCategories = categories.filter((c) => {
    if (filterArchived) return c.is_archived;
    return !c.is_archived;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all animate-in fade-in slide-in-from-bottom-4 border ${
            toast.type === 'success'
              ? 'bg-[#0B192C] text-white border-blue-500/30'
              : 'bg-red-900 text-white border-red-500'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B192C]">Category Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure product departments, hero banner photos, slugs, and SEO metadata.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterArchived(!filterArchived)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
              filterArchived
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {filterArchived ? 'Viewing Archived Categories' : 'View Archived Categories'}
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-500">
            Loading categories from database...
          </div>
        ) : displayedCategories.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <FolderTree className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No categories found in this view</p>
          </div>
        ) : (
          displayedCategories.map((cat) => (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all hover:shadow-sm ${
                cat.is_archived ? 'border-purple-200 bg-purple-50/20 opacity-80' : 'border-slate-200'
              }`}
            >
              {/* Category Cover Image */}
              <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={cat.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  unoptimized={cat.image_url?.startsWith('/')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-medium tracking-wider text-blue-300">
                      /{cat.slug}
                    </span>
                    <h3 className="text-lg font-semibold">{cat.name}</h3>
                  </div>
                </div>
                {cat.is_archived && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-medium">
                    Archived
                  </span>
                )}
              </div>

              {/* Description & Metrics */}
              <div className="p-5 space-y-3 flex-1">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                  <span className="text-slate-500">
                    Active Stock:{' '}
                    <strong className="text-[#0B192C] font-semibold">
                      {cat.item_count ?? 0} {cat.item_count === 1 ? 'Product' : 'Products'}
                    </strong>
                  </span>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"
                  >
                    <span>View in Shop</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <span>Order: {cat.display_order ?? 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleArchive(cat)}
                    title={cat.is_archived ? 'Restore Category' : 'Archive Category'}
                    className={`p-1.5 rounded-lg ${
                      cat.is_archived
                        ? 'text-purple-600 hover:bg-purple-100'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    title="Edit Category Details"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePermanent(cat)}
                    title="Permanently Delete Category"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#0B192C]">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Department Category'}
                </h2>
                <p className="text-xs text-slate-500">
                  Products assigned to this category will automatically filter under this section.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Workstation Laptops"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugCustomized(true);
                  }}
                  placeholder="e.g. workstation-laptops"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for customer shop page..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category Banner Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL or upload photo below"
                    className="flex-1 text-sm px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="cat-image-file"
                  />
                  <label
                    htmlFor="cat-image-file"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 text-slate-700"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Upload</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">SEO Title Tag</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Custom SEO title tag..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">SEO Description</label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description for search engine snippets..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
