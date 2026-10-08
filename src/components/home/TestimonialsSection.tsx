import React from 'react';
import { Star, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { Testimonial } from '@/types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">
            Trusted by Aba Professionals & Corporate Teams
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-normal">
            Real feedback from software engineers, creative studios, and corporate offices who depend on our laptops and repair turnaround.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-normal">
                  "{item.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#0B192C]">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-normal">{item.role}</p>
                </div>
                {item.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Business Proof Metrics */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">25-Point</div>
            <div className="text-xs text-slate-500 font-normal mt-1">Hardware Diagnostic Test</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">85%+</div>
            <div className="text-xs text-slate-500 font-normal mt-1">Minimum Battery Health Stocked</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">6 - 12 Mo.</div>
            <div className="text-xs text-slate-500 font-normal mt-1">Written Warranty Coverage</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">24 - 48h</div>
            <div className="text-xs text-slate-500 font-normal mt-1">Average Board-Level Turnaround</div>
          </div>
        </div>
      </div>
    </section>
  );
};
