import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { BusinessSettings } from '@/types';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

interface LocationMapProps {
  settings: BusinessSettings;
}

export const LocationMap: React.FC<LocationMapProps> = ({ settings }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: NAP & Hours */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                Physical Store & Workshop
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B192C]">
                Visit Our Store in Aba, Abia State
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Test laptops in person, speak with our hardware technicians, or drop off your computer for component diagnostics.
              </p>

              {/* NAP Block */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Physical Address:</strong>
                    <span>{settings.address}, {settings.city}, {settings.state}, {settings.country}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Operating Hours:</strong>
                    <span>{settings.opening_hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Phone Desk:</strong>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {settings.phone_display}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B192C] text-white font-medium text-xs sm:text-sm hover:bg-[#1E3E62] transition-colors"
              >
                <Navigation className="w-4 h-4 text-blue-400" />
                <span>Get Directions</span>
              </a>

              <WhatsAppButton
                message={WhatsAppTemplates.generalHelp()}
                label="WhatsApp"
                variant="primary"
                className="flex-1 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative min-h-[350px] bg-slate-100">
            <iframe
              src={settings.google_maps_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ExperienceTech 37B St. Michael Road Aba Abia State Location Map"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
