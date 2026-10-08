'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, MapPin, Phone, MessageSquare, Mail, Globe } from 'lucide-react';
import { getBusinessSettings, updateBusinessSettings } from '@/lib/data/store';
import { BusinessSettings } from '@/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappDisplay, setWhatsappDisplay] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState('');
  const [googleBusinessProfileUrl, setGoogleBusinessProfileUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getBusinessSettings().then((s) => {
      setSettings(s);
      setBusinessName(s.business_name);
      setTagline(s.tagline);
      setPhone(s.phone);
      setPhoneDisplay(s.phone_display);
      setWhatsappNumber(s.whatsapp_number);
      setWhatsappDisplay(s.whatsapp_display);
      setEmail(s.email);
      setAddress(s.address);
      setCity(s.city);
      setState(s.state);
      setCountry(s.country);
      setOpeningHours(s.opening_hours);
      setGoogleMapsUrl(s.google_maps_url);
      setGoogleMapsEmbedUrl(s.google_maps_embed_url);
      setGoogleBusinessProfileUrl(s.google_business_profile_url);
      setTiktokUrl(s.tiktok_url || 'https://www.tiktok.com/@experience7378');
      setYoutubeUrl(s.youtube_url || 'https://youtube.com/@lap_hub_1');
      setFacebookUrl(s.facebook_url || 'https://www.facebook.com/profile.php?id=61581347956677');
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBusinessSettings({
        business_name: businessName,
        tagline,
        phone,
        phone_display: phoneDisplay,
        whatsapp_number: whatsappNumber,
        whatsapp_display: whatsappDisplay,
        email,
        address,
        city,
        state,
        country,
        opening_hours: openingHours,
        google_maps_url: googleMapsUrl,
        google_maps_embed_url: googleMapsEmbedUrl,
        google_business_profile_url: googleBusinessProfileUrl,
        facebook_url: facebookUrl,
        tiktok_url: tiktokUrl,
        youtube_url: youtubeUrl,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-slate-500">Loading business settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Local SEO & NAP Configuration
          </span>
          <h1 className="text-2xl font-semibold text-[#0B192C] mt-0.5">
            Business Settings & Contact
          </h1>
          <p className="text-xs text-slate-500">
            Configure physical 37B St. Michael Road, Aba address, phone desk, WhatsApp numbers, and Google Business Profile links.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Section 1: Business Identity */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            1. Business Brand Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Company Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Desk & WhatsApp */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            2. Contact Channels & WhatsApp (Dynamic Integration)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                WhatsApp Number (Raw digits: e.g. 2348021234567) *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-mono"
              />
              <span className="text-[10px] text-slate-400">Used for generating direct WhatsApp wa.me links</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                WhatsApp Display Format (e.g. +234 802 123 4567)
              </label>
              <input
                type="text"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Telephone Call Number (e.g. +2348021234567) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Customer Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Address & Opening Hours */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            3. Physical Location & Hours (Local SEO NAP)
          </h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Country *</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Opening Hours *</label>
            <input
              type="text"
              required
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>
        </div>

        {/* Section 4: Google Maps & Business Profile (Section 23) */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            4. Google Maps & Google Business Profile (Section 23)
          </h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Google Business Profile URL
            </label>
            <input
              type="url"
              value={googleBusinessProfileUrl}
              onChange={(e) => setGoogleBusinessProfileUrl(e.target.value)}
              placeholder="https://business.google.com/..."
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Google Maps Share URL (For "Get Directions")
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Google Maps Embed Iframe URL
            </label>
            <input
              type="text"
              value={googleMapsEmbedUrl}
              onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] bg-slate-50 text-slate-600 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Section 5: Official Social Media Channels */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            5. Official Social Media Channels (TikTok, YouTube, Facebook)
          </h2>
          <p className="text-xs text-slate-500">
            Only these three platforms are connected and displayed publicly across the header, footer, and contact channels.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                TikTok Channel URL
              </label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@experience7378"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@lap_hub_1"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://www.facebook.com/profile.php?id=61581347956677"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-[3px] bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          {saveSuccess ? (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Company settings saved & updated across the platform!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Zero coding needed to update business phone or social profiles.
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[2px] bg-[#0B192C] text-white text-xs font-medium hover:bg-[#1E3E62] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Business Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
