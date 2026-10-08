import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hardware Warranty Policy | ExperienceTech Aba',
  description: 'Detailed warranty terms for brand new and UK used laptops, replacement parts, and motherboard repairs at ExperienceTech 37B St. Michael Road, Aba, Abia State.',
};

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">Peace of Mind</span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">Hardware Warranty Terms</h1>
            <p className="text-xs text-slate-500 mt-1 font-normal">Version 2.0 • March 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">1. UK Used Laptops (6 Months Hardware Warranty)</h2>
            <p className="font-normal">
              Every Grade A UK Used laptop sold by ExperienceTech is backed by a 6-month hardware warranty covering the motherboard, CPU, display ribbon, RAM, and internal storage. In addition, customers receive 1 full year of free OS clean-up and driver optimization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">2. Brand New Systems (1 Year Manufacturer Warranty)</h2>
            <p className="font-normal">
              Brand new, factory-sealed laptops (HP, Dell, Apple, Lenovo, Asus) carry the standard 1-year manufacturer warranty. Our technical team assists customers with official service centre liaison in Aba, Abia State where required.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">3. Motherboard Repairs (60-Day Repair Guarantee)</h2>
            <p className="font-normal">
              All component-level motherboard repairs carry a 60-day warranty specifically covering the micro-components replaced and power rails serviced. If the same fault recurs within 60 days, we rework it free of charge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">4. Exclusions</h2>
            <p>The warranty does not cover:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Physical screen breakage or liquid spill after purchase.</li>
              <li>Torn or tampered internal warranty security seals.</li>
              <li>Unauthorized repair attempts carried out by third-party technicians.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
