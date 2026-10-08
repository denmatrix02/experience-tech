'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Wrench } from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data/initial-data';
import { buildWhatsAppLink, WhatsAppTemplates } from '@/lib/whatsapp';
import { logAnalyticsEvent } from '@/lib/data/store';

export const MobileStickyBar: React.FC = () => {
  const pathname = usePathname();

  // Hide mobile action bar inside staff portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const whatsappHref = buildWhatsAppLink(WhatsAppTemplates.generalHelp());

  const handleWhatsAppClick = () => {
    try {
      logAnalyticsEvent('whatsapp_general_enquiry', { source: 'mobile_sticky_bar' });
    } catch {}
  };

  const handlePhoneClick = () => {
    try {
      logAnalyticsEvent('phone_click', { source: 'mobile_sticky_bar' });
    } catch {}
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-3 gap-2">
        {/* Call CTA */}
        <a
          href={`tel:${initialBusinessSettings.phone}`}
          onClick={handlePhoneClick}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-slate-100 text-slate-800 font-medium text-xs hover:bg-slate-200 active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 text-[#0B192C] mb-0.5" />
          <span>Call Us</span>
        </a>

        {/* WhatsApp CTA */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-[#25D366] text-white font-medium text-xs shadow hover:bg-[#1EBE5D] active:scale-95 transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-white mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* Book Repair CTA */}
        <Link
          href="/services#book"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-[#0B192C] text-white font-medium text-xs hover:bg-[#1E3E62] active:scale-95 transition-all"
        >
          <Wrench className="w-4 h-4 text-blue-400 mb-0.5" />
          <span>Fix Device</span>
        </Link>
      </div>
    </div>
  );
};
