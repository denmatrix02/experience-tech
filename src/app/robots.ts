import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Priority: explicit env override → Vercel auto-URL → canonical production domain
  // NEVER use localhost — NEXT_PUBLIC_SITE_URL must be set to https://experiencetech.org in Vercel env settings
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const baseUrl = (siteUrl && !siteUrl.includes('localhost') ? siteUrl : null)
    ?? vercelUrl
    ?? 'https://experiencetech.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
