'use client';

import React from 'react';
import { Star, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data/initial-data';
import { logAnalyticsEvent } from '@/lib/data/store';

export const GoogleReviewsSection: React.FC = () => {
  const handleReviewClick = (action: string) => {
    try {
      logAnalyticsEvent('google_reviews_click', {
        action,
        destination: initialBusinessSettings.google_maps_url,
      });
    } catch {}
  };

  const googleReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'ExperienceTech 37B St. Michael Road Aba Abia State'
  )}`;

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[6px] border border-slate-200 p-8 sm:p-12 shadow-xs text-center space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
              Customer Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#0B192C] tracking-tight">
              See What Customers Say
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-normal">
              Check our 5-star Google reviews.
            </p>
          </div>

          {/* Genuine Google Trust Card */}
          <div className="bg-slate-50 rounded-[3px] border border-slate-200/90 p-6 sm:p-8 max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-base text-[#0B192C]">
                ExperienceTech Verified Business Profile
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>37B St. Michael Road, Aba, Abia State</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              We build customer trust through transparent diagnostics, honest hardware testing, and documented warranties. Read authentic customer ratings directly on Google.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleReviewClick('view_google_reviews')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[2px] bg-[#1B6392] hover:bg-[#154E73] text-white font-medium text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <span>View Google Reviews</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={initialBusinessSettings.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleReviewClick('view_on_google_maps')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[2px] border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 font-medium text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>View on Google Maps</span>
              <MapPin className="w-4 h-4 text-blue-600" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
