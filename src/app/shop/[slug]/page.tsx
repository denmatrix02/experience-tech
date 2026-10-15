import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { PackageX, ArrowLeft, MessageSquare } from 'lucide-react';
import {
  getServerProductBySlug,
  getServerProducts,
} from '@/lib/data/server-store';
import { getBusinessSettings } from '@/lib/data/store';
import { ProductDetailClient } from '@/components/shop/ProductDetailClient';
import { generateProductSchema, generateBreadcrumbSchema, SITE_URL } from '@/lib/seo';

// Cache page on Edge CDN with Incremental Static Regeneration (ISR).
// Revalidates every 60s, or on-demand when product details change in admin.
export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);

  if (!product || product.status === 'archived' || product.status === 'draft' || !product.is_published) {
    return {
      title: 'Product Unavailable | ExperienceTech',
      description: 'The requested computer or accessory is currently unavailable or has been archived from our active catalogue.',
    };
  }

  const title = product.seo_title || `${product.name} | ExperienceTech Aba`;
  const description =
    product.seo_description ||
    product.short_description ||
    `Buy ${product.name} at ExperienceTech 37B St. Michael Road, Aba, Abia State Nigeria. Price: ₦${product.price.toLocaleString()}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      url: `${SITE_URL}/shop/${product.slug}`,
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Handle unpublished or archived products cleanly
  const isPubliclyAvailable = product.status === 'published' && product.is_published && !product.is_archived;
  if (!isPubliclyAvailable) {
    return (
      <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
            <PackageX className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-[#0B192C]">
              Product Currently Unavailable
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              &quot;{product.name}&quot; has been archived or removed from our active inventory. Please browse our live catalogue for tested alternatives.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/shop"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Active Shop Catalogue</span>
            </Link>
            <a
              href={`https://wa.me/2348021234567?text=${encodeURIComponent(`Hello ExperienceTech, I am looking for ${product.name} (SKU: ${product.sku}). Is this or an equivalent system available in stock?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask Sales Desk on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const [allProducts, settings] = await Promise.all([
    getServerProducts({ publishedOnly: true }),
    getBusinessSettings(),
  ]);

  // Find related products (same category or brand, excluding current product)
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category_id === product.category_id || p.brand.toLowerCase() === product.brand.toLowerCase())
    )
    .slice(0, 4);

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product.name, url: `/shop/${product.slug}` },
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      {/* Product & Breadcrumb JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-blue-600">Shop</Link>
            </li>
            <li>/</li>
            <li className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Client Product View */}
        <ProductDetailClient
          product={product}
          settings={settings}
          relatedProducts={relatedProducts}
        />
      </div>
    </div>
  );
}
