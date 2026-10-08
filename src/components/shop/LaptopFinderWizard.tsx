'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Code2,
  Palette,
  Calculator,
  GraduationCap,
  Gamepad2,
  Briefcase,
} from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WhatsAppTemplates } from '@/lib/whatsapp';

interface LaptopFinderWizardProps {
  products: Product[];
}

export const LaptopFinderWizard: React.FC<LaptopFinderWizardProps> = ({ products }) => {
  const [useCase, setUseCase] = useState<string>('coding');
  const [budget, setBudget] = useState<string>('mid');
  const [portability, setPortability] = useState<string>('portable');

  const useCases = [
    {
      id: 'coding',
      title: 'Software Development & Coding',
      desc: 'Docker, VS Code, Android Studio, Web dev, compiling',
      icon: Code2,
      minRam: 16,
    },
    {
      id: 'design',
      title: 'Graphic Design & Video Editing',
      desc: 'Photoshop, Premiere Pro, After Effects, Figma',
      icon: Palette,
      minRam: 16,
    },
    {
      id: 'business',
      title: 'Business Accounting & Office',
      desc: 'Excel modeling, QuickBooks, Zoom meetings, documents',
      icon: Calculator,
      minRam: 8,
    },
    {
      id: 'student',
      title: 'University Student & Research',
      desc: 'Long battery life, assignments, presentations, browsing',
      icon: GraduationCap,
      minRam: 8,
    },
    {
      id: 'gaming',
      title: 'Heavy Gaming & 3D Rendering',
      desc: 'Dedicated NVIDIA/AMD graphics, high frame rates',
      icon: Gamepad2,
      minRam: 16,
    },
  ];

  const budgetOptions = [
    { id: 'entry', label: 'Under ₦500,000', max: 500000, min: 0 },
    { id: 'mid', label: '₦500,000 – ₦850,000', min: 450000, max: 850000 },
    { id: 'upper', label: '₦850,000 – ₦1,600,000', min: 800000, max: 1600000 },
    { id: 'premium', label: 'Above ₦1,600,000', min: 1500000, max: 10000000 },
  ];

  const portabilityOptions = [
    { id: 'portable', label: 'Ultra-portable 14" (Lightweight, travel-friendly)' },
    { id: 'standard', label: 'Standard 15.6" (Large screen + numeric keypad)' },
    { id: 'any', label: 'No preference (Performance is top priority)' },
  ];

  // Match algorithm based on real catalogue items
  const matchedLaptops = useMemo(() => {
    const laptops = products.filter(
      (p) => p.category_id === 'cat-laptops' || p.category_name === 'Laptops'
    );

    const selectedBudget = budgetOptions.find((b) => b.id === budget);

    return laptops.filter((lap) => {
      // Budget check
      if (selectedBudget) {
        if (lap.price < selectedBudget.min || lap.price > selectedBudget.max) {
          // allow a small margin
          if (Math.abs(lap.price - selectedBudget.min) > 100000 && Math.abs(lap.price - selectedBudget.max) > 100000) {
            return false;
          }
        }
      }

      // Gaming check
      if (useCase === 'gaming') {
        return (
          lap.specifications?.gpu?.toLowerCase().includes('rtx') ||
          lap.specifications?.gpu?.toLowerCase().includes('nvidia') ||
          lap.name.toLowerCase().includes('gaming') ||
          lap.name.toLowerCase().includes('zephyrus')
        );
      }

      // Design check
      if (useCase === 'design') {
        return (
          lap.name.toLowerCase().includes('macbook') ||
          lap.name.toLowerCase().includes('zephyrus') ||
          lap.name.toLowerCase().includes('elitebook')
        );
      }

      return true;
    });
  }, [products, useCase, budget, portability]);

  const selectedUseCaseObj = useCases.find((u) => u.id === useCase);
  const selectedBudgetObj = budgetOptions.find((b) => b.id === budget);
  const selectedPortabilityObj = portabilityOptions.find((p) => p.id === portability);

  const finderWhatsAppMessage = WhatsAppTemplates.laptopFinderAdvice(
    selectedUseCaseObj?.title || 'general computing',
    selectedBudgetObj?.label || 'flexible budget',
    selectedPortabilityObj?.label || 'portable'
  );

  return (
    <div className="space-y-10">
      {/* Wizard Step 1: Use Case */}
      <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-[2px] bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-[#0B192C]">
            What will you primarily use this laptop for?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            const isSelected = useCase === uc.id;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setUseCase(uc.id)}
                className={`p-4 rounded-[3px] border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-[2px] flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B192C]">{uc.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-snug font-normal">{uc.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Step 2: Budget in Naira */}
      <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-[2px] bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
            2
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-[#0B192C]">
            What is your preferred budget range?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {budgetOptions.map((b) => {
            const isSelected = budget === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id)}
                className={`p-4 rounded-[2px] border text-center font-medium text-xs sm:text-sm transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Step 3: Screen Size & Portability */}
      <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-[2px] bg-blue-600 text-white font-medium text-xs flex items-center justify-center">
            3
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-[#0B192C]">
            Do you prefer compact portability or a large screen?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {portabilityOptions.map((p) => {
            const isSelected = portability === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPortability(p.id)}
                className={`p-3.5 rounded-[2px] border text-center text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matched Recommendations Result Section */}
      <div className="bg-slate-100 rounded-[6px] p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-blue-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Results</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0B192C] mt-1">
              {matchedLaptops.length > 0
                ? `We Found ${matchedLaptops.length} Matching ${matchedLaptops.length === 1 ? 'System' : 'Systems'}`
                : 'Need Custom Advice for this Specification'}
            </h3>
          </div>

          <WhatsAppButton
            message={finderWhatsAppMessage}
            label="Chat with Tech Specialist"
            variant="primary"
          />
        </div>

        {matchedLaptops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedLaptops.map((laptop) => (
              <ProductCard key={laptop.id} product={laptop} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[3px] border border-slate-200 text-center max-w-lg mx-auto space-y-3">
            <HelpCircle className="w-10 h-10 text-blue-600 mx-auto" />
            <h4 className="text-base font-semibold text-[#0B192C]">
              Let Our Engineers Source It Directly
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We frequently receive fresh corporate shipments in Aba matching this exact budget and performance tier. Send your requirement directly to our team:
            </p>
            <div className="pt-2">
              <WhatsAppButton
                message={finderWhatsAppMessage}
                label="Send Requirement on WhatsApp"
                variant="primary"
                fullWidth
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
