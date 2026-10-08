import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { TrainingProgram } from '@/types';
import { Badge } from '@/components/common/Badge';

interface TrainingPreviewProps {
  training: TrainingProgram;
}

export const TrainingPreview: React.FC<TrainingPreviewProps> = ({ training }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B192C] text-white rounded-[6px] p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-medium uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{training.status}</span>
                </span>
                <span className="text-xs text-slate-400">
                  Expected Launch: {training.expected_launch}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
                {training.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                {training.overview}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-normal">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Duration: {training.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Format: {training.delivery_format}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/training"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[2px] bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors shadow-sm"
                >
                  <span>Register Your Interest</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/training#curriculum"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] border border-slate-700 text-slate-200 font-medium text-sm hover:bg-slate-800 transition-colors"
                >
                  <span>Preview Curriculum</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Key Focus Box */}
            <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-xs p-6 rounded-[3px] border border-slate-700/60 space-y-4">
              <h4 className="text-sm font-medium uppercase tracking-wider text-blue-400">
                What You Will Master:
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Multimeter & Oscilloscope Power-rail Diagnostics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hot Air Rework & Surface-Mount (SMD) Soldering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Liquid Damage Chemical Cleaning Protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Commercial Tech Retail & Repair Shop Business</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
                * Note: Enrollment is not yet open. Join the waitlist to receive priority notification when registrations begin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
