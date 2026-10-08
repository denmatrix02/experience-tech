'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { TrainingProgram, TrainingRegistration } from '@/types';
import { registerTrainingInterest } from '@/lib/data/store';
import { buildWhatsAppLink, WhatsAppTemplates } from '@/lib/whatsapp';

interface TrainingInterestFormProps {
  program: TrainingProgram;
}

export const TrainingInterestForm: React.FC<TrainingInterestFormProps> = ({ program }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<TrainingRegistration['experience_level']>('Beginner');
  const [goal, setGoal] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReg, setSubmittedReg] = useState<TrainingRegistration | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const reg = await registerTrainingInterest({
        program_id: program.id,
        full_name: fullName,
        email,
        phone,
        occupation,
        experience_level: experienceLevel,
        goal,
      });
      setSubmittedReg(reg);
    } catch (err) {
      console.error('Error submitting training registration:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="register" className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-10 shadow-sm scroll-mt-24">
      {!submittedReg ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                Waitlist & Early Access
              </span>
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-[2px] border border-amber-200">
                No Payment Required to Join
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
              Register Your Interest for Cohort 1
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              Be the first to receive the finalized syllabus, lecture timetable, laboratory schedule in Aba, and early-bird discount vouchers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chukwuma Eze"
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
                placeholder="e.g. 0812 345 6789"
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
                placeholder="chukwuma@gmail.com"
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Current Occupation / Background *
              </label>
              <input
                type="text"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. IT Support / CS Student / Entrepreneur"
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Current Hardware Experience Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-2.5 px-3 rounded-[2px] text-xs font-medium border transition-all text-center ${
                    experienceLevel === lvl
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              What do you hope to achieve with this training? *
            </label>
            <textarea
              required
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. I want to start my own computer repair shop in Aba, Abia State; or I want to diagnose motherboard issues with confidence without outsourcing."
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-[3px] focus:ring-2 focus:ring-blue-600 bg-slate-50 leading-relaxed font-normal"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-[2px] bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register My Interest for Priority Enrollment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 space-y-5 max-w-lg mx-auto animate-in fade-in">
          <div className="w-16 h-16 rounded-[2px] bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[#0B192C]">
              You're on the Priority Waitlist!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thank you, <strong>{submittedReg.full_name}</strong>. We have saved your interest in our <strong>{program.title}</strong>. As soon as practical lab dates in Aba are announced, you will receive first notification.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={buildWhatsAppLink(
                WhatsAppTemplates.trainingRegisteredContinuation(
                  submittedReg.full_name,
                  program.title
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[2px] bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium text-sm shadow transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Connect on WhatsApp for Course Updates</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
