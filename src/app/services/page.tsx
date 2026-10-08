import { Metadata } from 'next';
import {
  Wrench,
  Cpu,
  Monitor,
  HardDrive,
  Terminal,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { getServices, getBusinessSettings } from '@/lib/data/store';
import { RepairBookingForm } from '@/components/repairs/RepairBookingForm';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Laptop & Computer Repair Services in Aba, Abia State',
  description:
    'Component-level motherboard repair, screen & battery replacement, SSD cloning, and liquid damage recovery in 37B St. Michael Road, Aba, Abia State. Transparent pricing & warranty.',
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getServices(),
    getBusinessSettings(),
  ]);

  const iconMap: Record<string, React.ReactNode> = {
    Cpu: <Cpu className="w-6 h-6 text-blue-600" />,
    Monitor: <Monitor className="w-6 h-6 text-blue-600" />,
    HardDrive: <HardDrive className="w-6 h-6 text-blue-600" />,
    Terminal: <Terminal className="w-6 h-6 text-blue-600" />,
    ShieldAlert: <ShieldAlert className="w-6 h-6 text-blue-600" />,
    Briefcase: <Briefcase className="w-6 h-6 text-blue-600" />,
    Wrench: <Wrench className="w-6 h-6 text-blue-600" />,
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Professional Engineering Workshop
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#0B192C] tracking-tight">
            Computer Repairs & Technical Maintenance
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            We operate a component-level hardware laboratory in 37B St. Michael Road, Aba, Abia State. Our engineers diagnose short circuits, reconstruct burned motherboard power rails, replace screens and batteries with genuine parts, and clone storage with zero data loss.
          </p>
        </div>

        {/* 4-Step Repair Protocol */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400 text-center mb-6">
            Our Transparent Repair Protocol
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-semibold text-[#0B192C]">Free Intake Diagnostic</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                We perform an initial bench test using multimeters and thermal imaging to isolate the root cause.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-semibold text-[#0B192C]">Itemized Quote Approval</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                We contact you via WhatsApp with the exact part cost and turnaround estimate before doing any work.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-semibold text-[#0B192C]">Component-Level Repair</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Our technicians replace blown micro-components and renew thermal paste using high-grade compounds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-sm font-semibold text-[#0B192C]">Stress Test & Warranty</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                The machine is stress-tested under load before collection, backed by our 60-day hardware warranty.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Services Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
                Available Repair & Service Packages
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Transparent starting prices and estimated turnaround times.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-blue-400 transition-colors"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                    {iconMap[service.icon] || <Wrench className="w-6 h-6 text-blue-600" />}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#0B192C]">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                      {service.full_description}
                    </p>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-medium text-slate-400 block">Starting at</span>
                    <span className="text-lg font-semibold text-[#0B192C]">
                      ₦{service.price_starting_at.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Turnaround: {service.turnaround_time}
                    </span>
                  </div>

                  <WhatsAppButton
                    message={WhatsAppTemplates.repairEnquiry(service.name)}
                    label="WhatsApp Quote"
                    variant="compact"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Repair Booking Form */}
        <RepairBookingForm services={services} />
      </div>
    </div>
  );
}
