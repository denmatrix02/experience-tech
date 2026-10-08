import React from 'react';
import {
  CheckCircle,
  Cpu,
  Wrench,
  Clock,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Layers,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: 'Genuine & Documented Inventory',
      description: 'We do not sell tampered or refurbished-disguised machines. Every brand new laptop is sealed, and every UK-used laptop is graded honestly with verified battery health.',
    },
    {
      icon: Cpu,
      title: 'Component-Level Technical Depth',
      description: 'Unlike ordinary sellers who outsource repairs, we operate an in-house hardware laboratory in Aba equipped with thermal cameras and micro-soldering stations.',
    },
    {
      icon: Wrench,
      title: 'Direct Repair & Upgrade Support',
      description: 'Need RAM or SSD expanded before delivery? Need a cracked screen replaced or battery swapped? We service the exact equipment we sell right on the spot.',
    },
    {
      icon: HelpCircle,
      title: 'Honest Product Guidance',
      description: 'Not sure if 16GB RAM is enough for your programming stack or architectural rendering? We advise based on your actual budget and workflow, not inflated sales quotas.',
    },
    {
      icon: MapPin,
      title: 'Physical 37B St. Michael Road, Aba Presence',
      description: 'You can walk into our office on St. Michael Road, inspect your chosen laptop in person, run hardware benchmarks on our test bench, and pick up your receipt.',
    },
    {
      icon: Layers,
      title: 'Written Warranty & Software Support',
      description: 'Enjoy 6 to 12 months documented warranty backed by our Aba service centre. Plus, enjoy 1 year of free Windows cleanups and driver updates.',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Real Customer Confidence
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">
            Why Professionals & Businesses Choose ExperienceTech
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-normal">
            In a market filled with deceptive grading and counterfeit accessories, we build relationships through technical integrity, transparent diagnostics, and dependable after-sales care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-[3px] border border-slate-200 shadow-xs hover:border-blue-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-[2px] bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#0B192C] mb-2">{pt.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {pt.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
