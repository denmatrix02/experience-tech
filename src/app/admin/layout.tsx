'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Mail,
  GraduationCap,
  Settings,
  History,
  BarChart3,
  LogOut,
  Laptop,
  Menu,
  X,
  ExternalLink,
  Shield,
  Layers,
  FolderTree,
  Sparkles,
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isLoading, logout, userEmail } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAdmin && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#071322] flex items-center justify-center text-slate-300 text-xs font-medium">
        Verifying staff session...
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Inventory', href: '/admin/products', icon: Package },
    { name: 'Studio White BG Tool', href: '/admin/tools/bg-remover', icon: Sparkles },
    { name: 'Category Management', href: '/admin/categories', icon: FolderTree },
    { name: 'Repair Requests', href: '/admin/repairs', icon: Wrench },
    { name: 'Customer Enquiries', href: '/admin/enquiries', icon: Mail },
    { name: 'Training Waitlist', href: '/admin/training', icon: GraduationCap },
    { name: 'Services Catalogue', href: '/admin/services', icon: Layers },
    { name: 'Business Settings & NAP', href: '/admin/settings', icon: Settings },
    { name: 'Analytics & Conversions', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Admin Activity Log', href: '/admin/activity', icon: History },
  ];

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="flex-1 w-full bg-slate-100 min-h-[calc(100vh-var(--navbar-height,180px))]">
      {/* Mobile Top Header */}
      <div className="md:hidden shrink-0 bg-[#0B192C] text-white p-3.5 flex items-center justify-between z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[2px] bg-blue-600 flex items-center justify-center text-white">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs tracking-tight block">EXPERIENCE TECH</span>
            <span className="text-[10px] text-blue-400 uppercase font-medium tracking-wider">Staff Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-1.5 rounded-[2px] text-xs text-slate-300 hover:text-white bg-slate-800/80 inline-flex items-center gap-1"
            title="Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Store</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-[2px] text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Fixed in place beneath sticky navbar while main content scrolls */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B192C] text-slate-300 flex flex-col justify-between transition-transform duration-300 md:top-[var(--navbar-height,180px)] md:bottom-0 md:h-[calc(100vh-var(--navbar-height,180px))] md:z-30 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
          {/* Logo & Portal Badge */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-[3px] bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm tracking-tight">EXPERIENCE TECH</span>
                <span className="text-[10px] text-blue-400 uppercase font-semibold tracking-wider">Staff Portal</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-3 bg-slate-800/90 rounded-[3px] border border-slate-700/80 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Staff Online</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-[2px] bg-blue-900/60 text-blue-300 font-mono">
                Staff Area
              </span>
            </div>
            <p className="text-slate-300 truncate font-mono text-[11px]" title={userEmail || 'staff@experiencetechservices.com'}>
              {userEmail || 'staff@experiencetechservices.com'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-xs font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: View Site & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-[2px] text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Return to Public Website</span>
            </span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[2px] text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport - Scrolls smoothly while sidebar stays fixed */}
      <main className="flex-1 min-w-0 md:pl-64">
        <div className="p-4 sm:p-7 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
