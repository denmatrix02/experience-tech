import React from 'react';
import { ProductCondition, StockStatus, LeadStatus, TrainingStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'condition' | 'stock' | 'lead' | 'training' | 'default';
  value?: ProductCondition | StockStatus | LeadStatus | TrainingStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  value,
  className = '',
}) => {
  const content = children || value;

  // Compute color classes based on value/variant
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (value === 'Brand New') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (value === 'UK Used') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (value === 'Certified Pre-Owned' || value === 'Refurbished') {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (value === 'in_stock') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (value === 'low_stock') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (value === 'out_of_stock') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (value === 'New') {
    colorClasses = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (value === 'In Progress' || value === 'Contacted') {
    colorClasses = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (value === 'Converted') {
    colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (value === 'Closed' || value === 'Cancelled') {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-300';
  } else if (value === 'Currently in Development' || value === 'Coming Soon') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (value === 'Registration Open') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  }

  // Display text formatter
  let displayText: React.ReactNode = content;
  if (value === 'in_stock') displayText = '● In Stock';
  if (value === 'low_stock') displayText = '● Low Stock';
  if (value === 'out_of_stock') displayText = '● Out of Stock';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-xs font-medium border ${colorClasses} ${className}`}
    >
      {displayText}
    </span>
  );
};
