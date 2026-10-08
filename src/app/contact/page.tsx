import { Metadata } from 'next';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getBusinessSettings } from '@/lib/data/store';
import { ContactClientForm } from '@/components/contact/ContactClientForm';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';
import { SocialLinks } from '@/components/common/SocialLinks';

export const metadata: Metadata = {
  title: 'Contact & Location in Aba Abia State | ExperienceTech',
  description:
    'Visit our physical store and technical workshop at 37B St. Michael Road, Aba, Abia State. Phone: +234 813 394 8068. Open Monday to Saturday. Walk-ins & dispatch courier welcomed.',
};

export default async function ContactPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Visit Our Store & Lab
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#0B192C] tracking-tight">
            Contact & Find Us in Aba
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            We are located at 37B St. Michael Road, Aba, Abia State. You are welcome to visit in person to inspect any system, consult with our hardware specialists, or arrange nationwide courier delivery.
          </p>
        </div>

        {/* 2-Column Layout: NAP & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: NAP & Hours Card + Official Social Media */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0B192C]">
                  Official Business Details (NAP)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Consistent across Google Maps & verified directories.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[2px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Physical Address:</strong>
                    <span>{settings.address}, {settings.city}, {settings.state}, {settings.country}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[2px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Phone Desk:</strong>
                    <a href={`tel:${settings.phone}`} className="text-blue-600 font-medium hover:underline">
                      {settings.phone_display}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[2px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Email Inquiries:</strong>
                    <a href={`mailto:${settings.email}`} className="text-blue-600 hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[2px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Operating Hours:</strong>
                    <span>{settings.opening_hours}</span>
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <WhatsAppButton
                  message={WhatsAppTemplates.generalHelp()}
                  label="Direct WhatsApp Desk"
                  variant="primary"
                  fullWidth
                />

                <a
                  href={`tel:${settings.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[2px] border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Call: {settings.phone_display}</span>
                </a>

                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[2px] bg-[#0B192C] text-white text-xs sm:text-sm font-medium hover:bg-[#1E3E62] transition-colors"
                >
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span>Get Google Maps Directions</span>
                </a>
              </div>
            </div>

            {/* Official Social Media Channels (TikTok, YouTube, Facebook) */}
            <div className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-xs space-y-3">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600">
                  Stay Connected
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-[#0B192C] mt-0.5">
                  Official Social Channels
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Watch hardware test videos, repair walk-throughs, and stock arrivals:
                </p>
              </div>

              <SocialLinks variant="card" />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactClientForm />
          </div>
        </div>

        {/* Embedded Full Map Section */}
        <div className="bg-white rounded-[6px] border border-slate-200 overflow-hidden shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Interactive Google Map Navigation
            </span>
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps App</span>
              <span>↗</span>
            </a>
          </div>
          <div className="rounded-[3px] overflow-hidden h-[400px] w-full border border-slate-200">
            <iframe
              src={settings.google_maps_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ExperienceTech 37B St. Michael Road, Aba, Abia State Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
