import Link from 'next/link';
import { PackageSearch, ArrowLeft, Home, MessageSquare } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-slate-50 min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <PackageSearch className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
            404 — Page Not Found
          </span>
          <h1 className="text-2xl font-semibold text-[#0B192C]">
            Looking for a computer or service?
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            The page or product you requested is no longer available, was archived, or the link might be broken. Browse our live inventory or ask our workshop team directly.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Active Catalogue</span>
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <a
            href="https://wa.me/2348021234567?text=Hello%20Experience%20Tech%2C%20I%20am%20looking%20for%20a%20product%20on%20your%20website%20that%20seems%20unavailable."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-medium transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
