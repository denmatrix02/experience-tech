'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      title: 'FASTEST DELIVERY',
      subtitle: 'Delivery in 24/48h in Aba & across Nigeria',
      icon: Truck,
    },
    {
      title: '24 HOURS RETURN',
      subtitle: '100% money-back & inspection guarantee',
      icon: RotateCcw,
    },
    {
      title: 'SECURE PAYMENT',
      subtitle: 'Pay on delivery & bank transfer protected',
      icon: ShieldCheck,
    },
    {
      title: 'SUPPORT 24/7',
      subtitle: 'Direct technician & sales WhatsApp desk',
      icon: Headphones,
    },
  ];

  return (
    <section className="bg-white py-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className={`flex items-center gap-4 ${i !== 0 ? 'sm:pl-6' : ''} pt-4 sm:pt-0`}>
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-[#0F3460]">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0B192C]">
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {b.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
