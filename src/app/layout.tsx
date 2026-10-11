import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileStickyBar } from '@/components/layout/MobileStickyBar';
import { generateLocalBusinessSchema, generateWebSiteSchema } from '@/lib/seo';
import { initialBusinessSettings } from '@/lib/data/initial-data';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://experiencetech.org'),
  title: {
    default: 'ExperienceTech | Quality Laptops, Accessories & Repairs in Aba, Abia State',
    template: '%s | ExperienceTech',
  },
  description:
    'Premier technology retail store and computer repair workshop at 37B St. Michael Road, Aba, Abia State. Genuine brand new & UK-used laptops, original accessories, component-level motherboard repairs, and practical tech training.',
  keywords: [
    'laptops in aba abia state',
    'laptops in aba',
    'buy laptop in nigeria',
    'uk used laptops aba',
    'laptop repair aba',
    'motherboard repair aba',
    'computer accessories nigeria',
    'ssd upgrade aba',
    'experiencetech aba',
  ],
  authors: [{ name: 'ExperienceTech' }],
  creator: 'ExperienceTech',
  publisher: 'ExperienceTech',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    title: 'ExperienceTech | Quality Laptops & Technical Repairs in Aba',
    description:
      'Verified laptops, genuine accessories, component-level repair diagnostics, and technical services at 37B St. Michael Road, Aba, Abia State.',
    url: 'https://experiencetech.org',
    siteName: 'ExperienceTech',
    locale: 'en_NG',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = generateLocalBusinessSchema(initialBusinessSettings);
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* LocalBusiness JSON-LD for Local SEO and Google Maps discovery */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${publicSans.variable} font-sans min-h-screen flex flex-col bg-white text-slate-900 pb-16 md:pb-0`}>
        <Navbar />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
        <Footer />
        <MobileStickyBar />
      </body>
    </html>
  );
}
