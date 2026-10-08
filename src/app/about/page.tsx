import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Wrench,
  GraduationCap,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'About Us | Computer Retail, Repairs & Training Aba',
  description:
    'Learn about ExperienceTech: our origin in 37B St. Michael Road, Aba, Abia State, technical engineering standards, 25-point hardware inspection, and commitment to genuine computer systems in Nigeria.',
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            About ExperienceTech
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#0B192C] tracking-tight">
            Building Real Trust in Nigerian Computer Retail & Engineering
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Founded on a commitment to technical integrity, we are bridge builders between authentic hardware manufacturers and Nigerian professionals, creators, and corporate teams.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
                Why ExperienceTech Was Built
              </h2>
              <p>
                In the bustling electronics markets of Nigeria, particularly 37B St. Michael Road, Aba in Aba, buying a laptop has historically carried anxiety. Buyers often grapple with altered specifications, degraded batteries disguised with software reset tools, and sellers who vanish the moment a hardware defect emerges.
              </p>
              <p>
                <strong>ExperienceTech</strong> was established with a singular standard: complete diagnostic transparency. We do not just "sell boxes." Every single computer—whether brand new or certified UK used—is subjected to a comprehensive 25-point bench inspection before it is ever listed for sale.
              </p>
              <p>
                Furthermore, our in-house hardware engineering workshop means we do not outsource your technical support. From micro-soldering burned motherboard rails to SSD data migration, our engineers handle everything right here on St. Michael Road.
              </p>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80"
                alt="ExperienceTech Engineering Lab"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Pillars of Integrity */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C] text-center">
            Our Core Quality Guarantees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0B192C]">25-Point Rigorous Testing</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                We stress test memory, verify NVMe read/write health via CrystalDiskInfo, inspect thermal paste condition, check display panel uniformity, and benchmark battery endurance under genuine workload.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0B192C]">Direct Hardware Lab</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Equipped with thermal cameras, stereo microscopes, and precision soldering equipment, we solve complex motherboard short circuits rather than telling clients to abandon their machines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0B192C]">Knowledge Transfer</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                We believe in elevating the technical capacity of Nigerian technicians. Our forthcoming practical masterclasses will equip youth and professionals with real board-level diagnostic skills.
              </p>
            </div>
          </div>
        </div>

        {/* Visit & CTA Banner */}
        <div className="bg-[#0B192C] text-white p-8 sm:p-10 rounded-2xl text-center space-y-4 shadow-lg border border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Experience the Difference in Person
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
            Visit our workshop at 37B St. Michael Road, Aba, Abia State. Test any computer on our diagnostic bench before making your decision.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
            >
              <span>Explore Tested Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <WhatsAppButton
              message={WhatsAppTemplates.generalHelp()}
              label="Talk with Our Tech Lead"
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
