import { Metadata } from 'next';
import {
  GraduationCap,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { getTrainingProgram, getFAQs } from '@/lib/data/store';
import { TrainingInterestForm } from '@/components/training/TrainingInterestForm';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Hardware Engineering & Laptop Diagnostics Training | ExperienceTech',
  description:
    'Professional masterclass in component-level laptop repair, schematics tracing, and computer hardware diagnostics in Aba, Abia State. Currently in development - join the waitlist.',
};

export default async function TrainingPage() {
  const [training, faqs] = await Promise.all([
    getTrainingProgram(),
    getFAQs(),
  ]);

  const trainingFaqs = faqs.filter((f) => f.category === 'Training' || f.category === 'General');

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Status Callout Banner */}
        <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{training.status}</span>
              </span>
              <span className="text-xs text-slate-400">
                Expected Launch: {training.expected_launch}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              {training.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-normal">
              {training.overview}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs sm:text-sm text-slate-300 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Duration: {training.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Format: {training.delivery_format}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Certificate: Practical Verified</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <span>Join Interest List & Get Early Access</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>

        {/* Who This Program Is For */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#0B192C]">
              Who Is This Program Designed For?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {training.target_audience.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum Outline */}
        <div id="curriculum" className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
              Course Curriculum & Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Developed directly from real daily bench repairs at our 37B St. Michael Road, Aba lab.
            </p>
          </div>

          <div className="space-y-4">
            {training.modules.map((mod, idx) => (
              <div
                key={mod.id || idx}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-[#0B192C]">
                    {mod.title}
                  </h3>
                  {mod.duration && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full w-fit">
                      {mod.duration}
                    </span>
                  )}
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {mod.topics.map((topic, tidx) => (
                    <li key={tidx} className="flex items-start gap-2">
                      <span className="text-blue-500 font-medium">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#0B192C]">
              Lead Technical Instructors
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {training.instructor_bio}
          </p>
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
            <strong>Hands-on Guarantee:</strong> Every enrolled participant will have their own dedicated microscope, digital multimeter, adjustable DC power bench, and test motherboards during Aba workshoporatory practical sessions.
          </div>
        </div>

        {/* Embedded Registration Waitlist Form */}
        <TrainingInterestForm program={training} />

        {/* FAQs */}
        {trainingFaqs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {trainingFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-1.5"
                >
                  <h4 className="text-sm font-semibold text-[#0B192C] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6 font-normal">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
