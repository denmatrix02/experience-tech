import { initialBusinessSettings } from './data/initial-data';

/**
 * Normalizes phone numbers to standard international WhatsApp format without '+' or special characters.
 * E.g. '+234 802 123 4567' -> '2348021234567'
 */
export function cleanWhatsAppNumber(number?: string): string {
  const raw = number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || initialBusinessSettings.whatsapp_number;
  return raw.replace(/[^0-9]/g, '');
}

/**
 * Builds a direct, encoded WhatsApp URL with contextual message.
 */
export function buildWhatsAppLink(message: string, customNumber?: string): string {
  const phone = cleanWhatsAppNumber(customNumber);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Contextual WhatsApp templates for specific user actions
 */
export const WhatsAppTemplates = {
  // Product templates
  productAvailability: (productName: string, sku?: string, price?: number) => {
    const priceText = price ? ` listed for ₦${price.toLocaleString()}` : '';
    const skuText = sku ? ` (Ref: ${sku})` : '';
    return `Hello Experience Tech, I am browsing your website and interested in checking availability for: *${productName}*${skuText}${priceText}. Is this currently in stock at your Aba showroom?`;
  },

  productBuy: (productName: string, sku?: string, price?: number) => {
    const priceText = price ? ` for ₦${price.toLocaleString()}` : '';
    const skuText = sku ? ` [SKU: ${sku}]` : '';
    return `Hello Experience Tech, I would like to purchase the *${productName}*${skuText}${priceText}. Please guide me on payment options and pick-up or delivery arrangements.`;
  },

  productInquiry: (product: { name: string; sku?: string; price?: number }) => {
    const priceText = product.price ? ` (₦${product.price.toLocaleString()})` : '';
    const skuText = product.sku ? ` [SKU: ${product.sku}]` : '';
    return `Hello Experience Tech, I am interested in ordering *${product.name}*${skuText}${priceText}. Can you confirm availability and delivery?`;
  },

  productAdvice: (productName: string) => {
    return `Hello Experience Tech, I am looking at the *${productName}* on your website. I would like some technical guidance on whether this laptop will comfortably fit my daily computing needs.`;
  },

  // General templates
  generalHelp: () => {
    return `Hello Experience Tech, I am visiting your website and would like to speak with a technology specialist regarding your laptops, accessories, and technical services.`;
  },

  laptopFinderAdvice: (purpose: string, budget: string, portability: string) => {
    return `Hello Experience Tech, I used your Laptop Finder on the website. I am looking for a laptop for *${purpose}*, with a budget around *${budget}*, and preference for *${portability}*. What options do you recommend?`;
  },

  // Repair & Service templates
  repairEnquiry: (serviceName?: string) => {
    const service = serviceName ? ` for *${serviceName}*` : '';
    return `Hello Experience Tech, I would like to enquire about your technical repair and maintenance services${service}. Can you assist me?`;
  },

  repairSubmittedContinuation: (data: {
    trackingCode: string;
    customerName: string;
    deviceType: string;
    deviceBrand: string;
    problem: string;
  }) => {
    return `Hello Experience Tech! I just submitted a repair request online.\n\n*Tracking Code:* ${data.trackingCode}\n*Name:* ${data.customerName}\n*Device:* ${data.deviceBrand} ${data.deviceType}\n*Issue:* ${data.problem}\n\nPlease let me know the intake diagnostic schedule.`;
  },

  // Training templates
  trainingInterest: (programTitle: string) => {
    return `Hello Experience Tech, I am interested in your *${programTitle}* program. Please share more details on the curriculum, upcoming cohort dates, and registration.`;
  },

  trainingRegisteredContinuation: (name: string, programTitle: string) => {
    return `Hello Experience Tech! My name is ${name}. I just registered my interest in the *${programTitle}* on your website. Looking forward to updates on the start date!`;
  },
};
