import { MetadataRoute } from 'next';
import { getServerProducts, getServerCategories } from '@/lib/data/server-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Priority: explicit env override → Vercel auto-URL → canonical production domain
  // NEVER use localhost — NEXT_PUBLIC_SITE_URL must be set to https://experiencetech.org in Vercel env settings
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const baseUrl = (siteUrl && !siteUrl.includes('localhost') ? siteUrl : null)
    ?? vercelUrl
    ?? 'https://experiencetech.org';

  const [products, categories] = await Promise.all([
    getServerProducts({ publishedOnly: true }),
    getServerCategories(false),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/laptop-finder`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/training`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/warranty-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic Product Pages
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: new Date(product.updated_at || product.created_at),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes];
}
