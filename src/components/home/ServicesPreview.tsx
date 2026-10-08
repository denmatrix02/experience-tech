import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Cpu,
  Monitor,
  HardDrive,
  Terminal,
  ShieldAlert,
  ArrowRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Service } from '@/types';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

interface ServicesPreviewProps {
  services: Service[];
}

export const ServicesPreview: React.FC<ServicesPreviewProps> = ({ services }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Cpu: <Cpu className="w-5 h-5 text-blue-600" />,
    Monitor: <Monitor className="w-5 h-5 text-blue-600" />,
    HardDrive: <HardDrive className="w-5 h-5 text-blue-600" />,
    Terminal: <Terminal className="w-5 h-5 text-blue-600" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-blue-600" />,
    Wrench: <Wrench className="w-5 h-5 text-blue-600" />,
  };

  const previewServices = services.slice(0, 4);

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
              Technical Lab & Repairs
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">
              Professional Computer Repair & Maintenance
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl font-normal">
              We fix hardware faults at the component level: short-circuited motherboards, liquid spills, cracked screens, dying batteries, and slow storage.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link
              href="/services#book"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] bg-[#0B192C] text-white text-xs sm:text-sm font-medium hover:bg-[#1E3E62] transition-colors"
            >
              <span>Request a Repair</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewServices.map((service) => (
            <div
              key={service.id}
              className="rounded-[3px] border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[2px] bg-blue-50 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {iconMap[service.icon] || <Wrench className="w-5 h-5 text-blue-600" />}
                </div>

                <h3 className="text-base font-semibold text-[#0B192C] group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                  {service.short_description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Turnaround: {service.turnaround_time}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-medium text-slate-400 block">From</span>
                  <span className="text-sm font-semibold text-[#0B192C]">
                    ₦{service.price_starting_at.toLocaleString()}
                  </span>
                </div>

                <WhatsAppButton
                  message={WhatsAppTemplates.repairEnquiry(service.name)}
                  label="Enquire"
                  variant="compact"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-[3px] bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0" />
            <p className="text-xs sm:text-sm text-blue-900 font-medium">
              <strong>Transparent Diagnostic Policy:</strong> We perform an intake inspection and provide an itemized quote before carrying out any work. No surprises.
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-900 underline whitespace-nowrap"
          >
            Explore All Repair Services →
          </Link>
        </div>
      </div>
    </section>
  );
};
