'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  MessageSquare,
  Phone,
  Clock,
  CheckCircle2,
  Calendar,
  Laptop,
} from 'lucide-react';
import { getRepairRequests, updateRepairStatus } from '@/lib/data/store';
import { RepairRequest, LeadStatus } from '@/types';
import { Badge } from '@/components/common/Badge';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getRepairRequests();
      setRepairs(data);
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
    await updateRepairStatus(id, newStatus);
    loadData();
  };

  const handleSaveNotes = async (id: string) => {
    const item = repairs.find((r) => r.id === id);
    if (item) {
      await updateRepairStatus(id, item.status, notesDraft);
      setEditingNotesId(null);
      loadData();
    }
  };

  const filteredRepairs = repairs.filter((r) => {
    const matchesSearch =
      searchTerm === '' ||
      r.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.device_brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Workshop Intake & Pipeline
          </span>
          <h1 className="text-2xl font-semibold text-[#0B192C] mt-0.5">
            Repair & Service Requests
          </h1>
          <p className="text-xs text-slate-500">
            Track customer devices, diagnostic statuses, and follow up directly via WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by Tracking ID (e.g. ET-REP-...), Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-slate-50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 w-full sm:w-auto font-medium"
          >
            <option value="all">All Statuses ({repairs.length})</option>
            <option value="New">New Intake</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress (Diagnosing/Repairing)</option>
            <option value="Converted">Converted (Completed)</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Repairs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredRepairs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tracking Code / Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Device & Problem Description</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4">Technician Notes</th>
                  <th className="py-3 px-4 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRepairs.map((r) => {
                  const whatsappReplyUrl = buildWhatsAppLink(
                    `Hello ${r.customer_name}, this is ExperienceTech 37B St. Michael Road, Aba, Abia State regarding your repair request *${r.tracking_code}* for your ${r.device_brand} ${r.device_type}.`,
                    r.phone
                  );

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors align-top">
                      {/* Tracking code & Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-medium text-blue-600 block text-sm">
                          {r.tracking_code}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                          Target: {r.preferred_date}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#0B192C]">{r.customer_name}</div>
                        <div className="text-slate-500 text-[11px]">{r.phone}</div>
                        <div className="text-slate-400 text-[10px]">{r.email}</div>
                      </td>

                      {/* Device & Description */}
                      <td className="py-4 px-4 max-w-sm">
                        <div className="font-medium text-slate-900 flex items-center gap-1.5">
                          <Laptop className="w-3.5 h-3.5 text-blue-600" />
                          <span>{r.device_brand} {r.device_type} {r.device_model && `(${r.device_model})`}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                          {r.problem_description}
                        </p>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value as LeadStatus)}
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

                      {/* Technician Notes */}
                      <td className="py-4 px-4 max-w-xs">
                        {editingNotesId === r.id ? (
                          <div className="space-y-1.5">
                            <textarea
                              rows={2}
                              value={notesDraft}
                              onChange={(e) => setNotesDraft(e.target.value)}
                              className="w-full text-xs p-1.5 border border-slate-300 rounded bg-slate-50"
                              placeholder="e.g. Replaced charging IC; testing power rails..."
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleSaveNotes(r.id)}
                                className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotesId(r.id);
                              setNotesDraft(r.notes || '');
                            }}
                            className="cursor-pointer text-xs text-slate-600 hover:text-blue-600 group"
                            title="Click to add/edit technician notes"
                          >
                            <span>{r.notes || 'Click to add technician notes...'}</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 whitespace-nowrap text-right space-x-1">
                        <a
                          href={whatsappReplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-xs border border-emerald-200"
                          title="Open WhatsApp chat with pre-filled tracking ID"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${r.phone}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-xs border border-slate-200"
                          title="Call Customer"
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
            No repair requests found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
}
