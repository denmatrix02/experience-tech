'use client';

import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Laptop,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Service, RepairRequest } from '@/types';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates, buildWhatsAppLink } from '@/lib/whatsapp';
import { createRepairRequest } from '@/lib/data/store';

interface RepairBookingFormProps {
  services: Service[];
}

export const RepairBookingForm: React.FC<RepairBookingFormProps> = ({ services }) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deviceType, setDeviceType] = useState<RepairRequest['device_type']>('Laptop');
  const [deviceBrand, setDeviceBrand] = useState('HP');
  const [deviceModel, setDeviceModel] = useState('');
  const [serviceRequired, setServiceRequired] = useState(services[0]?.name || 'Motherboard Diagnostic');
  const [problemDescription, setProblemDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredContact, setPreferredContact] = useState<RepairRequest['preferred_contact_method']>('WhatsApp');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<RepairRequest | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createRepairRequest({
        customer_name: customerName,
        phone,
        email,
        device_type: deviceType,
        device_brand: deviceBrand,
        device_model: deviceModel,
        problem_description: `[Service: ${serviceRequired}] ${problemDescription}`,
        preferred_date: preferredDate,
        preferred_contact_method: preferredContact,
      });
      setSubmittedBooking(result);
    } catch (err) {
      console.error('Error submitting repair request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="book" className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-10 shadow-sm scroll-mt-24">
      {!submittedBooking ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
              Online Intake Booking
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C] mt-1">
              Book a Diagnostic / Repair Session
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              Drop off your computer at our Aba workshop or request safe door-to-door courier dispatch in Aba, Abia State.
            </p>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Babatunde Johnson"
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Phone Number (WhatsApp) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0803 123 4567"
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="babatunde@gmail.com"
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 font-normal"
              />
            </div>
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Device Type *
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as any)}
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-white font-normal"
              >
                <option value="Laptop">Windows Laptop</option>
                <option value="MacBook">Apple MacBook / Mac Mini</option>
                <option value="Desktop">Desktop PC / All-in-One</option>
                <option value="Workstation">High-end Workstation</option>
                <option value="Monitor">Monitor / Display Panel</option>
                <option value="Other">Other Hardware</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Device Brand *
              </label>
              <input
                type="text"
                required
                value={deviceBrand}
                onChange={(e) => setDeviceBrand(e.target.value)}
                placeholder="e.g. HP, Dell, Apple, Lenovo, Asus"
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Specific Model (Optional)
              </label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="e.g. EliteBook 840 G5, Latitude 5400"
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 font-normal"
              />
            </div>
          </div>

          {/* Service & Problem Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Primary Service Needed
              </label>
              <select
                value={serviceRequired}
                onChange={(e) => setServiceRequired(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-white font-normal"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} (Starts at ₦{s.price_starting_at.toLocaleString()})
                  </option>
                ))}
                <option value="General Diagnostics">General Hardware Diagnostic / Not Sure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Describe the Fault or Symptoms *
              </label>
              <textarea
                required
                rows={4}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Please describe what happens: e.g. Laptop powers on but screen remains blank; power light blinks 3 times; spilled tea on keyboard yesterday; battery drains in 15 minutes; blue screen with CRITICAL_PROCESS_DIED error."
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 leading-relaxed font-normal"
              />
            </div>
          </div>

          {/* Date & Contact Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Preferred Drop-off / Dispatch Date *
              </label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-white font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Preferred Contact Method *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['WhatsApp', 'Phone Call', 'Email'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPreferredContact(method)}
                    className={`py-2.5 px-2 rounded-[2px] text-xs font-medium border transition-all text-center ${
                      preferredContact === method
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-[2px] bg-[#0B192C] text-white font-medium text-sm hover:bg-[#1E3E62] transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Diagnostic Request...' : 'Submit Repair Request & Generate Tracking ID'}
            </button>
          </div>
        </form>
      ) : (
        /* Confirmation State & WhatsApp Continuation (Section 11) */
        <div className="text-center py-8 space-y-6 max-w-xl mx-auto animate-in fade-in">
          <div className="w-16 h-16 rounded-[2px] bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-[2px] border border-emerald-200">
              Booking Received
            </span>
            <h3 className="text-2xl font-semibold text-[#0B192C]">
              Your Tracking ID: <span className="text-blue-600">{submittedBooking.tracking_code}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Thank you, <strong>{submittedBooking.customer_name}</strong>. Your {submittedBooking.device_brand} {submittedBooking.device_type} repair request has been logged in our workshop system.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-[3px] border border-slate-200 text-left text-xs space-y-1.5 font-normal">
            <div><strong className="font-medium">Device:</strong> {submittedBooking.device_brand} {submittedBooking.device_type} {submittedBooking.device_model}</div>
            <div><strong className="font-medium">Issue:</strong> {submittedBooking.problem_description}</div>
            <div><strong className="font-medium">Intake Target:</strong> {submittedBooking.preferred_date}</div>
            <div><strong className="font-medium">Location:</strong> 37B St. Michael Road, Aba, Abia State</div>
          </div>

          {/* Section 11 Requirement: Continue to WhatsApp with contextual details */}
          <div className="space-y-3 pt-2">
            <a
              href={buildWhatsAppLink(
                WhatsAppTemplates.repairSubmittedContinuation({
                  trackingCode: submittedBooking.tracking_code,
                  customerName: submittedBooking.customer_name,
                  deviceType: submittedBooking.device_type,
                  deviceBrand: submittedBooking.device_brand,
                  problem: submittedBooking.problem_description.slice(0, 100),
                })
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[2px] bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium text-sm shadow transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Continue on WhatsApp with My Tracking ID</span>
            </a>

            <button
              onClick={() => setSubmittedBooking(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium underline block mx-auto"
            >
              Submit Another Repair Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
