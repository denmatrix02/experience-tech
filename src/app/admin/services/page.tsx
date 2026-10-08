'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, CheckCircle2, Wrench, X } from 'lucide-react';
import { getAllServicesAdmin, saveService } from '@/lib/data/store';
import { Service } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [priceStartingAt, setPriceStartingAt] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');
  const [icon, setIcon] = useState('Cpu');
  const [featuresText, setFeaturesText] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const loadData = async () => {
    const list = await getAllServicesAdmin();
    setServices(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setShortDescription('');
    setFullDescription('');
    setPriceStartingAt('20000');
    setTurnaroundTime('24 Hours');
    setIcon('Cpu');
    setFeaturesText('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setShortDescription(s.short_description);
    setFullDescription(s.full_description);
    setPriceStartingAt(s.price_starting_at.toString());
    setTurnaroundTime(s.turnaround_time);
    setIcon(s.icon || 'Cpu');
    setFeaturesText(s.features?.join('\n') || '');
    setIsPublished(s.is_published);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    await saveService({
      id: editingService?.id,
      name,
      short_description: shortDescription,
      full_description: fullDescription,
      price_starting_at: parseFloat(priceStartingAt) || 0,
      turnaround_time: turnaroundTime,
      icon,
      features,
      is_published: isPublished,
    });

    setIsModalOpen(false);
    loadData();
  };

  const handleTogglePublish = async (s: Service) => {
    await saveService({
      ...s,
      is_published: !s.is_published,
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Workshop Offerings
          </span>
          <h1 className="text-2xl font-semibold text-[#0B192C] mt-0.5">
            Repair & Technical Services Catalogue
          </h1>
          <p className="text-xs text-slate-500">
            Define workshop diagnostic packages, starting fees, and turnaround commitments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B192C] text-white text-xs font-medium hover:bg-[#1E3E62] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Turnaround: {s.turnaround_time}
                </span>
                <button
                  onClick={() => handleTogglePublish(s)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    s.is_published
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  {s.is_published ? 'Published' : 'Hidden'}
                </button>
              </div>

              <h3 className="text-base font-semibold text-[#0B192C]">{s.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {s.short_description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Starting at</span>
                <span className="text-base font-semibold text-[#0B192C]">
                  ₦{s.price_starting_at.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => handleOpenEdit(s)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-[#0B192C]">
                {editingService ? 'Edit Repair Service' : 'Add New Service Package'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  placeholder="e.g. Laptop Motherboard IC Replacement"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Starting Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={priceStartingAt}
                    onChange={(e) => setPriceStartingAt(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Turnaround Time *</label>
                  <input
                    type="text"
                    required
                    value={turnaroundTime}
                    onChange={(e) => setTurnaroundTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                    placeholder="24 - 48 Hours"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Short Summary (For Card) *</label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Service Description *</label>
                <textarea
                  rows={3}
                  required
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Features / Guarantees (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="60-Day Hardware Repair Warranty&#10;Thermal Camera Inspection Included&#10;No-Fix No-Fee Policy"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <label htmlFor="pub" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Publish to Public Services Page
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B192C] text-white rounded-lg text-xs font-medium hover:bg-[#1E3E62]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
