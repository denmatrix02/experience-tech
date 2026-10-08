import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data/initial-data';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-16 bg-[#0B192C] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3e62_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Professional Tech Guidance • Fast Response Time</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Need a Laptop, Accessory, or Immediate Technical Support?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Speak directly with our technical advisors. We will help you select the exact computer specifications for your work, send live photos or video of any unit, or book your repair with zero hassle.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <WhatsAppButton
            message={WhatsAppTemplates.generalHelp()}
            label="WhatsApp Us Now"
            variant="primary"
            className="py-3 px-6 text-sm"
          />

          <a
            href={`tel:${initialBusinessSettings.phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[2px] border border-slate-600 bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 transition-colors"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            <span>Call: {initialBusinessSettings.phone_display}</span>
          </a>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[2px] bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-slate-400 pt-2">
          Pick up at 37B St. Michael Road, Aba, Abia State or request fast insured nationwide courier delivery.
        </p>
      </div>
    </section>
  );
};
