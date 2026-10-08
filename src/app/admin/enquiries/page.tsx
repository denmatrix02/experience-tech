'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Search, MessageSquare, Phone, Laptop, CheckCircle2 } from 'lucide-react';
import { getEnquiries, updateEnquiryStatus } from '@/lib/data/store';
import { Enquiry, LeadStatus } from '@/types';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    await updateEnquiryStatus(id, newStatus);
    loadData();
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      searchTerm === '' ||
      e.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      (e.product_name && e.product_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || e.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Customer Lead Management
          </span>
          <h1 className="text-2xl font-semibold text-[#0B192C] mt-0.5">
            Website Enquiries
          </h1>
          <p className="text-xs text-slate-500">
            Messages and quote requests submitted from product pages and contact forms.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by customer name, phone, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-slate-50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 w-full sm:w-auto font-medium"
          >
            <option value="all">All Inquiry Types ({enquiries.length})</option>
            <option value="product">Product Inquiries</option>
            <option value="general">General Contact Messages</option>
            <option value="service">Service Requests</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date / Source</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subject & Message</th>
                  <th className="py-3 px-4">Lead Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((e) => {
                  const replyMsg = `Hello ${e.customer_name}, this is Experience Tech replying to your inquiry regarding ${e.product_name || 'our technology services'}. How can we help you today?`;
                  const whatsappLink = buildWhatsAppLink(replyMsg, e.phone);

                  return (
                    <tr key={e.id} className="hover:bg-slate-50/60 transition-colors align-top">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(e.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 inline-block mt-1">
                          {e.type}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#0B192C]">{e.customer_name}</div>
                        <div className="text-slate-500 text-[11px]">{e.phone}</div>
                        <div className="text-slate-400 text-[10px]">{e.email}</div>
                      </td>

                      <td className="py-4 px-4 max-w-md">
                        {e.product_name && (
                          <div className="font-medium text-blue-600 mb-1 flex items-center gap-1">
                            <Laptop className="w-3.5 h-3.5" />
                            <span>Product: {e.product_name}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {e.message}
                        </p>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={e.status}
                          onChange={(ev) => handleStatusChange(e.id, ev.target.value as LeadStatus)}
                          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-slate-800"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-right space-x-1">
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-xs border border-emerald-200"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${e.phone}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-xs border border-slate-200"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No customer enquiries logged yet.
          </div>
        )}
      </div>
    </div>
  );
}
