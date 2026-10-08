'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Wrench,
  Mail,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Phone,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
  Laptop,
  Shield,
  RefreshCw,
  Layers,
  MapPin,
  Settings as SettingsIcon,
} from 'lucide-react';
import {
  getProducts,
  getRepairRequests,
  getEnquiries,
  getTrainingRegistrations,
  getActivityLogs,
  getAnalyticsSummary,
  updateRepairStatus,
  updateEnquiryStatus,
} from '@/lib/data/store';
import { Product, RepairRequest, Enquiry, ActivityLog, LeadStatus } from '@/types';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/lib/auth';

export default function AdminDashboardPage() {
  const { userEmail } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [trainingRegsCount, setTrainingRegsCount] = useState<number>(0);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [p, r, e, tr, logs, ana] = await Promise.all([
        getProducts({ publishedOnly: false, includeArchived: true }),
        getRepairRequests(),
        getEnquiries(),
        getTrainingRegistrations(),
        getActivityLogs(),
        getAnalyticsSummary(),
      ]);
      setProducts(p);
      setRepairs(r);
      setEnquiries(e);
      setTrainingRegsCount(tr.length);
      setActivityLogs(logs.slice(0, 8));
      setAnalytics(ana);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleRepairStatusChange = async (id: string, newStatus: LeadStatus) => {
    await updateRepairStatus(id, newStatus);
    loadData();
  };

  const handleEnquiryStatusChange = async (id: string, newStatus: LeadStatus) => {
    await updateEnquiryStatus(id, newStatus);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-xs font-medium">Loading staff operations metrics...</span>
      </div>
    );
  }

  // Key KPI calculations
  const totalProducts = products.filter((p) => !p.is_archived).length;
  const publishedProducts = products.filter((p) => !p.is_archived && p.is_published).length;
  const outOfStockProducts = products.filter((p) => !p.is_archived && p.stock_status === 'out_of_stock').length;
  const newRepairs = repairs.filter((r) => r.status === 'New').length;
  const inProgressRepairs = repairs.filter((r) => r.status === 'In Progress').length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP HEADER & OPERATIONAL STATUS BANNER */}
      <div className="bg-white p-5 sm:p-6 rounded-[6px] border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-200">
              Staff Command Center
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[2px] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Store Operations Active
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>37B St. Michael Road, Aba</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
            ExperienceTech Staff Dashboard
          </h1>

          <p className="text-xs text-slate-500 max-w-2xl">
            Logged in as <span className="font-mono text-slate-800 font-semibold">{userEmail || 'staff@experiencetechservices.com'}</span>. Manage store products, technical diagnostics, customer leads, and business configurations.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[2px] bg-[#0B192C] text-white text-xs font-medium hover:bg-[#1E3E62] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">View Public Storefront</span>
            <span className="sm:hidden">Storefront</span>
          </Link>
        </div>
      </div>

      {/* 2. QUICK-LAUNCH OPERATIONS SHORTCUTS */}
      <div>
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
          Quick Management Portals
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/products"
            className="p-3.5 bg-white rounded-[3px] border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-[2px] bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                Products & Stock
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {publishedProducts} Published Laptops
              </div>
            </div>
          </Link>

          <Link
            href="/admin/repairs"
            className="p-3.5 bg-white rounded-[3px] border border-slate-200 hover:border-amber-500 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-[2px] bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                Repair Pipeline
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {repairs.length} Total Jobs ({newRepairs} New)
              </div>
            </div>
          </Link>

          <Link
            href="/admin/enquiries"
            className="p-3.5 bg-white rounded-[3px] border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-[2px] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                Customer Leads
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {enquiries.length} Inquiries Received
              </div>
            </div>
          </Link>

          <Link
            href="/admin/training"
            className="p-3.5 bg-white rounded-[3px] border border-slate-200 hover:border-purple-500 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-[2px] bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                Academy Waitlist
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {trainingRegsCount} Students Waitlisted
              </div>
            </div>
          </Link>

          <Link
            href="/admin/tools/bg-remover"
            className="p-3.5 bg-white rounded-[3px] border border-slate-200 hover:border-sky-500 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-[2px] bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                Studio BG Tool
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Clean Product Photos
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="p-3.5 bg-white rounded-[3px] border border-slate-200 hover:border-slate-500 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-[2px] bg-slate-100 text-slate-700 flex items-center justify-center mb-2 group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                Store Settings & NAP
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Phone, Hours & Map
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. CORE KPI CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Inventory */}
        <div className="bg-white p-5 rounded-[3px] border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Product Catalogue</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#0B192C]">{totalProducts}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-medium text-emerald-700">{publishedProducts} Live on Store</span>
            {outOfStockProducts > 0 ? (
              <span className="text-rose-600 font-medium">{outOfStockProducts} out of stock</span>
            ) : (
              <span className="text-slate-400">All in stock</span>
            )}
          </div>
        </div>

        {/* KPI 2: Repair Pipeline */}
        <div className="bg-white p-5 rounded-[3px] border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Diagnostics & Repairs</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#0B192C]">{repairs.length}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-amber-700 font-semibold">{newRepairs} New Intake Leads</span>
            <Link href="/admin/repairs" className="text-blue-600 hover:underline">
              Pipeline →
            </Link>
          </div>
        </div>

        {/* KPI 3: WhatsApp & Site Enquiries */}
        <div className="bg-white p-5 rounded-[3px] border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enquiries & Leads</span>
            <Mail className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#0B192C]">{enquiries.length}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-emerald-700 font-semibold">{newEnquiries} Unprocessed</span>
            <Link href="/admin/enquiries" className="text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
        </div>

        {/* KPI 4: Training Registrations */}
        <div className="bg-white p-5 rounded-[3px] border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Academy Waitlist</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-[#0B192C]">{trainingRegsCount}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-purple-700 font-medium">Hardware Students</span>
            <Link href="/admin/training" className="text-blue-600 hover:underline">
              Manage →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. REAL COMMERCIAL CONVERSION CLICKS STRIP */}
      {analytics && (
        <div className="bg-white p-5 sm:p-6 rounded-[6px] border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#0B192C]">
                Real Business Conversion Telemetry
              </h2>
              <p className="text-xs text-slate-500">
                Direct visitor engagement across product catalogue, phone calls, and direct WhatsApp consultations.
              </p>
            </div>
            <Link href="/admin/analytics" className="text-xs text-blue-600 font-medium hover:underline shrink-0">
              Full Analytics Report →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 bg-emerald-50 rounded-[3px] border border-emerald-100">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Consultations</span>
              </div>
              <div className="text-xl font-bold text-emerald-900">{analytics.whatsappClicks}</div>
            </div>

            <div className="p-3 bg-blue-50 rounded-[3px] border border-blue-100">
              <div className="flex items-center gap-1.5 text-xs text-blue-800 font-medium mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Phone Inquiries</span>
              </div>
              <div className="text-xl font-bold text-blue-900">{analytics.phoneClicks}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-[3px] border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium mb-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Catalog Product Views</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{analytics.productViews}</div>
            </div>

            <div className="p-3 bg-purple-50 rounded-[3px] border border-purple-100">
              <div className="flex items-center gap-1.5 text-xs text-purple-800 font-medium mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Total Conversions</span>
              </div>
              <div className="text-xl font-bold text-purple-900">{analytics.totalConversions}</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SPLIT WORKSPACE: RECENT REPAIR LEADS & CUSTOMER ENQUIRIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Repair Bookings Pipeline */}
        <div className="lg:col-span-7 bg-white rounded-[6px] border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#0B192C]">
                Active Repair Diagnostic Jobs
              </h2>
              <p className="text-xs text-slate-500">
                Customer hardware repair bookings and diagnostic pipeline.
              </p>
            </div>
            <Link href="/admin/repairs" className="text-xs text-blue-600 font-medium hover:underline">
              Manage All ({repairs.length}) →
            </Link>
          </div>

          {repairs.length > 0 ? (
            <div className="divide-y divide-slate-100 space-y-2.5">
              {repairs.slice(0, 5).map((r) => {
                const cleanPhone = r.phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/234${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
                  `Hello ${r.customer_name}, this is ExperienceTech Aba regarding your ${r.device_brand} repair (${r.tracking_code}).`
                )}`;

                return (
                  <div key={r.id} className="pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-[2px] border border-blue-200 text-[11px]">
                          {r.tracking_code}
                        </span>
                        <span className="font-semibold text-slate-900">{r.customer_name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({r.phone})</span>
                      </div>
                      <p className="text-slate-600 line-clamp-1">
                        <span className="font-medium text-slate-800">{r.device_brand} {r.device_type}:</span> {r.problem_description}
                      </p>
                    </div>

                    {/* Actions & Status Dropdown */}
                    <div className="shrink-0 flex items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-[2px] text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-200 transition-colors"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

                      <select
                        value={r.status}
                        onChange={(e) => handleRepairStatusChange(r.id, e.target.value as LeadStatus)}
                        className="text-xs border border-slate-300 rounded-[2px] px-2 py-1 bg-white font-medium text-slate-700 cursor-pointer focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No repair bookings submitted yet.
            </div>
          )}
        </div>

        {/* Right Column: Recent Customer Enquiries */}
        <div className="lg:col-span-5 bg-white rounded-[6px] border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#0B192C]">
                Customer Enquiries & Leads
              </h2>
              <p className="text-xs text-slate-500">
                Product quotes and customer consultation messages.
              </p>
            </div>
            <Link href="/admin/enquiries" className="text-xs text-blue-600 font-medium hover:underline">
              View All ({enquiries.length}) →
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div className="divide-y divide-slate-100 space-y-2.5">
              {enquiries.slice(0, 4).map((enq) => {
                const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/234${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
                  `Hello ${enq.customer_name}, this is ExperienceTech following up on your inquiry.`
                )}`;

                return (
                  <div key={enq.id} className="pt-3 pb-2 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{enq.customer_name}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-600">
                          {enq.type}
                        </span>
                      </div>
                      <select
                        value={enq.status}
                        onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value as LeadStatus)}
                        className="text-[11px] border border-slate-300 rounded-[2px] px-1.5 py-0.5 bg-white font-medium text-slate-700 cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      "{enq.message}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{enq.phone}</span>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No customer enquiries received yet.
            </div>
          )}
        </div>
      </div>

      {/* 6. RECENT STAFF ACTIVITY TIMELINE */}
      <div className="bg-white rounded-[6px] border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#0B192C]">
              Staff Activity History & Operations Trail
            </h2>
            <p className="text-xs text-slate-500">
              Audit log of product updates, lead status transitions, and store settings adjustments.
            </p>
          </div>
          <Link href="/admin/activity" className="text-xs text-blue-600 font-medium hover:underline">
            View Complete Activity Log →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activityLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-[3px] bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded-[2px]">
                  {log.action}
                </span>
                <span>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-800 line-clamp-2 leading-relaxed text-[11px] pt-0.5">
                {log.details}
              </p>
              <div className="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between">
                <span>By: <span className="font-medium text-slate-600">{log.user}</span></span>
                <span>{new Date(log.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
