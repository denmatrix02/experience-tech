import { Product, BusinessSettings, FAQ } from '@/types';
import { initialBusinessSettings } from './data/initial-data';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://experiencetech.ng';

/**
 * Generates Google LocalBusiness JSON-LD structured data
 */
export function generateLocalBusinessSchema(settings: BusinessSettings = initialBusinessSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    '@id': `${SITE_URL}/#store`,
    name: settings.business_name,
    legalName: `${settings.business_name} Nigeria Ltd`,
    description: 'Premier technology retailer and repair specialist in 37B St. Michael Road, Aba, Abia State. Genuine laptops, accessories, computer parts, motherboard diagnostics, and IT services.',
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    priceRange: '₦₦₦',
    paymentAccepted: 'Cash, Bank Transfer, Debit Card',
    currenciesAccepted: 'NGN',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.state,
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.598583,
      longitude: 3.339247,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:30',
      },
    ],
    sameAs: [
      settings.google_business_profile_url,
      settings.tiktok_url,
      settings.youtube_url,
      settings.facebook_url,
    ].filter(Boolean),
  };
}

/**
 * Generates WebSite with SearchAction structured data
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'ExperienceTech',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates Product Schema.org with Offer
 */
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.short_description || product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    itemCondition:
      product.condition === 'Brand New'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: product.currency || 'NGN',
      price: product.price,
      priceValidUntil: '2026-12-31',
      availability:
        product.stock_status === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ExperienceTech',
      },
    },
  };
}

/**
 * Generates BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates FAQPage structured data
 */
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
