'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { createEnquiry } from '@/lib/data/store';
import { buildWhatsAppLink, WhatsAppTemplates } from '@/lib/whatsapp';

export const ContactClientForm: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState<'general' | 'product' | 'service'>('general');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEnquiry({
        type: enquiryType,
        customer_name: customerName,
        phone,
        email,
        message,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit contact message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-[6px] border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 rounded-[2px] bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
            Message Received Successfully
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-normal">
            Thank you, <strong>{customerName}</strong>. Our front desk at 37B St. Michael Road, Aba, Abia State will respond promptly via your preferred channel.
          </p>
        </div>

        <div className="pt-2">
          <a
            href={buildWhatsAppLink(
              `Hello ExperienceTech, my name is ${customerName}. I just sent an enquiry through your website contact form regarding "${message.slice(0, 80)}".`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[2px] bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium text-sm shadow transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Continue on WhatsApp for Immediate Response</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-10 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Send a Direct Message
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C] mt-1">
            How Can We Assist You Today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            Whether you need pricing for bulk laptop procurement, have questions about a motherboard fault, or want product advice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Damilola Adeyemi"
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50"
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
              placeholder="0802 345 6789"
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="damilola@company.com"
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Inquiry Subject *
            </label>
            <select
              value={enquiryType}
              onChange={(e) => setEnquiryType(e.target.value as any)}
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="general">General Inquiry</option>
              <option value="product">Laptop & Accessories Purchase</option>
              <option value="service">Repair & Maintenance Service</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Your Message / Requirements *
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 leading-relaxed font-normal"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-[2px] bg-[#0B192C] text-white font-medium text-sm hover:bg-[#1E3E62] transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Sending Message...' : 'Submit Message'}
        </button>
      </form>
    </div>
  );
};
