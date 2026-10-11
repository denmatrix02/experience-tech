'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Truck,
  RotateCcw,
  Sparkles,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Layers,
  HelpCircle,
  Mail,
  X,
  Share2,
} from 'lucide-react';
import { Product, BusinessSettings } from '@/types';
import { Badge } from '@/components/common/Badge';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { buildWhatsAppLink, WhatsAppTemplates } from '@/lib/whatsapp';
import { createEnquiry, logAnalyticsEvent } from '@/lib/data/store';

interface ProductDetailClientProps {
  product: Product;
  settings: BusinessSettings;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  settings,
  relatedProducts,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Enquiry form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    `Hello, I would like to inquire about the ${product.name} (SKU: ${product.sku}).`
  );

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'];

  const formattedPrice = `₦${product.price.toLocaleString()}`;
  const formattedPrevPrice = product.previous_price
    ? `₦${product.previous_price.toLocaleString()}`
    : null;

  // Predefined WhatsApp Options (Requirement 9)
  const option1Msg = WhatsAppTemplates.productAvailability(product.name, product.sku, product.price);
  const option2Msg = WhatsAppTemplates.productBuy(product.name, product.sku, product.price);
  const option3Msg = WhatsAppTemplates.productAdvice(product.name);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEnquiry({
        type: 'product',
        product_id: product.id,
        product_name: product.name,
        customer_name: customerName,
        phone,
        email,
        message,
      });
      setEnquirySuccess(true);
    } catch {
      // fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Main Product Showcase Box */}
      <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-[3px] overflow-hidden border border-slate-200">
              <Image
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge value={product.condition} />
                <Badge value={product.stock_status} />
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-[3px] overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality & Hardware Assurance Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-[3px] text-xs space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <strong className="block text-slate-900 font-semibold">Tested Hardware</strong>
                <span className="text-slate-500">25-Point benchmark pass</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-[3px] text-xs space-y-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <strong className="block text-slate-900 font-semibold">Safe Logistics</strong>
                <span className="text-slate-500">Aba pickup or insured courier</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-[3px] text-xs space-y-1 col-span-2 sm:col-span-1">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <strong className="block text-slate-900 font-semibold">Warranty Included</strong>
                <span className="text-slate-500">{product.specifications?.warranty || 'Documented warranty'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Commercial Info & Contextual WhatsApp Conversions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium uppercase tracking-wider text-blue-600">
                  {product.brand}
                </span>
                <span className="font-normal">SKU: {product.sku}</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0B192C] leading-snug">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                {product.short_description}
              </p>
            </div>

            {/* Price Block */}
            <div className="p-4 bg-slate-50 rounded-[3px] border border-slate-200">
              <span className="text-xs uppercase font-medium text-slate-500 block">Offer Price</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">
                  {formattedPrice}
                </span>
                {formattedPrevPrice && (
                  <span className="text-sm text-slate-400 line-through font-normal">
                    {formattedPrevPrice}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Includes all diagnostic inspections and standard software configuration.
              </p>
            </div>

            {/* Predefined WhatsApp Options Section (Requirement 9) */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Choose a WhatsApp Conversation Option:
              </label>

              {/* Option 1 */}
              <a
                href={buildWhatsAppLink(option1Msg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  logAnalyticsEvent('whatsapp_product_enquiry', {
                    product_id: product.id,
                    option: 'check_availability',
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-[2px] border-2 border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100/60 text-slate-900 transition-all text-xs sm:text-sm font-semibold group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
                  <span>"Is this product available right now?"</span>
                </div>
                <span className="text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">
                  Chat →
                </span>
              </a>

              {/* Option 2 */}
              <a
                href={buildWhatsAppLink(option2Msg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  logAnalyticsEvent('whatsapp_product_enquiry', {
                    product_id: product.id,
                    option: 'ready_to_buy',
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-[2px] bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-all text-xs sm:text-sm font-medium shadow-sm group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                  <span>"I want to buy this product (Proceed to order)"</span>
                </div>
                <span className="font-semibold group-hover:translate-x-1 transition-transform">
                  Order →
                </span>
              </a>

              {/* Option 3 */}
              <a
                href={buildWhatsAppLink(option3Msg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  logAnalyticsEvent('whatsapp_product_enquiry', {
                    product_id: product.id,
                    option: 'need_advice',
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-[2px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-all text-xs sm:text-sm font-medium group"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>"I need advice: Will this suit my workflow?"</span>
                </div>
                <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Ask →
                </span>
              </a>
            </div>

            {/* Secondary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`tel:${settings.phone}`}
                onClick={() => logAnalyticsEvent('phone_click', { product_id: product.id })}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-[2px] border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call {settings.phone_display}</span>
              </a>

              <button
                type="button"
                onClick={async () => {
                  const url = typeof window !== 'undefined' ? window.location.href : `https://experiencetech.org/shop/${product.slug}`;
                  try {
                    await navigator.clipboard.writeText(url);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2500);
                  } catch {
                    const inp = document.createElement('input');
                    inp.value = url;
                    document.body.appendChild(inp);
                    inp.select();
                    document.execCommand('copy');
                    document.body.removeChild(inp);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2500);
                  }
                }}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-[2px] border text-xs sm:text-sm font-medium transition-colors ${
                  linkCopied
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                }`}
                title="Copy shareable link for WhatsApp status, social media, and SEO"
              >
                {linkCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>Share & Copy Link</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-[2px] bg-[#0B192C] text-white text-xs sm:text-sm font-medium hover:bg-[#1E3E62] transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Submit Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Description Section */}
      <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#0B192C]">
            Technical Specifications
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Exact hardware parameters verified on our diagnostic bench.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(product.specifications || {}).map(([key, val]) => {
              if (!val) return null;
              const formattedKey = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <div
                  key={key}
                  className="flex items-start justify-between py-2 border-b border-slate-100 text-xs sm:text-sm"
                >
                  <span className="font-medium text-slate-600">{formattedKey}</span>
                  <span className="font-normal text-[#0B192C] text-right max-w-[60%]">{val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="pt-6 border-t border-slate-200">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0B192C]">
            Detailed Overview
          </h2>
          <div className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-normal">
            <p>{product.description}</p>
          </div>
        </div>

        {/* Warranty & In-store Testing Guarantee */}
        <div className="pt-6 border-t border-slate-200 bg-blue-50/60 p-5 rounded-[3px] border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span>Inspection & Testing Policy at 37B St. Michael Road, Aba, Abia State</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed font-normal">
            Customers visiting our physical store are encouraged to power on the system, run CPU-Z, CrystalDiskInfo, or battery diagnostics on our testing bench prior to purchase. Remote buyers receive live video demonstrations and CrystalDiskInfo screenshots over WhatsApp before dispatch.
          </p>
        </div>
      </div>

      {/* Related Products Section (Requirement 46) */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
              Similar & Related Systems
            </h2>
            <Link href="/shop" className="text-xs sm:text-sm text-blue-600 font-medium hover:underline">
              View All Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-[3px] border border-slate-200 overflow-hidden p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-[3px] overflow-hidden">
                    <Image
                      src={rel.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt={rel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-medium uppercase text-blue-600">{rel.brand}</span>
                  <h4 className="text-xs font-semibold text-[#0B192C] line-clamp-2">
                    <Link href={`/shop/${rel.slug}`}>{rel.name}</Link>
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0B192C]">
                    ₦{rel.price.toLocaleString()}
                  </span>
                  <Link
                    href={`/shop/${rel.slug}`}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Specs →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make an Enquiry Modal (Requirement 7) */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[6px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsEnquiryModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-[2px]"
            >
              <X className="w-5 h-5" />
            </button>

            {!enquirySuccess ? (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                    Product Enquiry
                  </span>
                  <h3 className="text-lg font-semibold text-[#0B192C] mt-1">
                    Ask About {product.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Our sales team will respond via phone call, WhatsApp, or email promptly.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Samuel Okon"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g. 08012345678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600"
                      placeholder="samuel@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message / Question *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-[2px] bg-[#0B192C] text-white font-medium text-sm hover:bg-[#1E3E62] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Enquiry to Store Desk'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-[2px] bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#0B192C]">
                  Enquiry Received Successfully!
                </h3>
                <p className="text-xs text-slate-600">
                  We have logged your enquiry for <strong>{product.name}</strong>. Our Aba desk will reach out immediately.
                </p>
                <div className="pt-2">
                  <WhatsAppButton
                    message={WhatsAppTemplates.productAvailability(product.name, product.sku, product.price)}
                    label="Continue to WhatsApp for Instant Reply"
                    variant="primary"
                    fullWidth
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
