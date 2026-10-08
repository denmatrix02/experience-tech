'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  Save,
} from 'lucide-react';
import {
  getTrainingProgram,
  updateTrainingProgram,
  getTrainingRegistrations,
} from '@/lib/data/store';
import { TrainingProgram, TrainingRegistration, TrainingStatus } from '@/types';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function AdminTrainingPage() {
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [status, setStatus] = useState<TrainingStatus>('Currently in Development');
  const [expectedLaunch, setExpectedLaunch] = useState('');
  const [duration, setDuration] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [prog, regs] = await Promise.all([
        getTrainingProgram(),
        getTrainingRegistrations(),
      ]);
      setProgram(prog);
      setStatus(prog.status);
      setExpectedLaunch(prog.expected_launch);
      setDuration(prog.duration);
      setRegistrations(regs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProgramStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateTrainingProgram({
        status,
        expected_launch: expectedLaunch,
        duration,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !program) {
    return <div className="p-8 text-center text-slate-500">Loading training program status...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Education & Academy Management
          </span>
          <h1 className="text-2xl font-semibold text-[#0B192C] mt-0.5">
            Hardware Training Program
          </h1>
          <p className="text-xs text-slate-500">
            Manage course availability status and review prospective student registrations.
          </p>
        </div>
      </div>

      {/* Program Status Controls Card (Section 12 Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-semibold text-[#0B192C]">
            Live Academy Status Switcher
          </h2>
          <p className="text-xs text-slate-500">
            Controls the state badge shown across the homepage and the training page.
          </p>
        </div>

        <form onSubmit={handleSaveProgramStatus} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Current Program Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TrainingStatus)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white font-medium"
              >
                <option value="Coming Soon">Coming Soon</option>
                <option value="Currently in Development">Currently in Development</option>
                <option value="Registration Open">Registration Open (Accepting Cohort)</option>
                <option value="Registration Closed">Registration Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Expected Launch Cohort
              </label>
              <input
                type="text"
                value={expectedLaunch}
                onChange={(e) => setExpectedLaunch(e.target.value)}
                placeholder="e.g. Q3 2026"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Course Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 8 Weeks (Weekend Intensive)"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Program status updated successfully!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Updates sync immediately with the live storefront.
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0B192C] text-white text-xs font-medium hover:bg-[#1E3E62] transition-colors shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Update Program Status'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Prospective Students Waitlist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#0B192C]">
              Interest List & Registrations ({registrations.length})
            </h2>
            <p className="text-xs text-slate-500">
              Students who registered interest for Cohort 1 admissions.
            </p>
          </div>
        </div>

        {registrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Contact (Phone/Email)</th>
                  <th className="py-3 px-4">Background & Experience</th>
                  <th className="py-3 px-4">Stated Goal</th>
                  <th className="py-3 px-4 text-right">Follow Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => {
                  const whatsappUrl = buildWhatsAppLink(
                    `Hello ${reg.full_name}, this is Experience Tech following up on your interest registration for the ${program.title}.`,
                    reg.phone
                  );

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors align-top">
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[10px]">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#0B192C]">
                        {reg.full_name}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-900 font-medium">{reg.phone}</div>
                        <div className="text-slate-400 text-[11px]">{reg.email}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700">{reg.occupation}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full block w-fit mt-0.5">
                          {reg.experience_level}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-slate-600">
                        {reg.goal}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200"
                        >
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No student interest submissions recorded yet. Submissions from the Training page waitlist will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
