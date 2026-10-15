import { Metadata } from 'next';
import {
  getServices,
  getTrainingProgram,
  getBusinessSettings,
} from '@/lib/data/store';
import { getServerProducts, getServerCategories } from '@/lib/data/server-store';
import { Hero } from '@/components/home/Hero';
import { TrustBadges } from '@/components/home/TrustBadges';
import { ShopByBrand } from '@/components/home/ShopByBrand';
import { FeaturedDealsSection } from '@/components/home/FeaturedDealsSection';
import { MacBookBanner } from '@/components/home/MacBookBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { TrainingPreview } from '@/components/home/TrainingPreview';
import { GoogleReviewsSection } from '@/components/home/GoogleReviewsSection';
import { LocationMap } from '@/components/home/LocationMap';
import { NewsletterBar } from '@/components/home/NewsletterBar';
import { FinalCTA } from '@/components/home/FinalCTA';

// Cache page on Edge CDN with Incremental Static Regeneration (ISR).
// Revalidates every 60s, or on-demand when products are updated in the admin dashboard.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ExperienceTech | Quality Laptops, Computer Accessories & Technical Repairs in Aba Abia State',
  description:
    'ExperienceTech at 37B St. Michael Road, Aba, Abia State. Tested Brand New & Grade-A UK Used HP, Dell, Apple MacBook, Lenovo laptops, original accessories, and component-level repairs with nationwide delivery.',
};

export default async function HomePage() {
  const [products, categories, services, training, settings] =
    await Promise.all([
      getServerProducts({ publishedOnly: true }),
      getServerCategories(false),
      getServices(),
      getTrainingProgram(),
      getBusinessSettings(),
    ]);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section matching Image 1 */}
      <Hero />

      {/* 2. 4-Column Trust Badges Guarantee */}
      <TrustBadges />

      {/* 3. Shop by Brand Carousel */}
      <ShopByBrand />

      {/* 4. Promo Deal Banner + 4x2 Featured Products Grid */}
      <FeaturedDealsSection products={products} />

      {/* 5. MacBook Pro Promotional Banner */}
      <MacBookBanner />

      {/* 6. Product Departments & Categories */}
      <CategoryGrid categories={categories} />

      {/* 7. Engineering Workshop & Motherboard Repairs Lab */}
      <ServicesPreview services={services} />

      {/* 8. Tech Academy / Hardware Training Cohort */}
      <TrainingPreview training={training} />

      {/* 9. Real Google Reviews & Location Access */}
      <GoogleReviewsSection />

      {/* 10. 37B St. Michael Road, Aba, Abia State Location & Directions */}
      <LocationMap settings={settings} />

      {/* 11. Newsletter Subscription Bar with Partner Brands */}
      <NewsletterBar />

      {/* 12. Final High-Conversion WhatsApp CTA */}
      <FinalCTA />
    </div>
  );
}
