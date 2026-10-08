'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { logAnalyticsEvent } from '@/lib/data/store';

interface WhatsAppButtonProps {
  message: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'subtle' | 'compact';
  fullWidth?: boolean;
  className?: string;
  customNumber?: string;
  analyticsEvent?: 'whatsapp_product_enquiry' | 'whatsapp_general_enquiry';
  analyticsMetadata?: Record<string, any>;
  iconOnly?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  label = 'Chat on WhatsApp',
  variant = 'primary',
  fullWidth = false,
  className = '',
  customNumber,
  analyticsEvent = 'whatsapp_general_enquiry',
  analyticsMetadata = {},
  iconOnly = false,
}) => {
  const href = buildWhatsAppLink(message, customNumber);

  const handleClick = () => {
    try {
      logAnalyticsEvent(analyticsEvent, {
        message_preview: message.slice(0, 80),
        ...analyticsMetadata,
      });
    } catch {
      // ignore
    }
  };

  // Base styles
  let variantClasses = 'bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-sm font-semibold';

  if (variant === 'outline') {
    variantClasses = 'border-2 border-[#25D366] text-[#128C7E] hover:bg-emerald-50 font-semibold';
  } else if (variant === 'subtle') {
    variantClasses = 'bg-emerald-50 text-[#128C7E] hover:bg-emerald-100 font-medium';
  } else if (variant === 'compact') {
    variantClasses = 'bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs py-1.5 px-3 font-semibold';
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 rounded-[2px] transition-all duration-200 cursor-pointer active:scale-95 ${
        variant !== 'compact' ? 'px-4 py-2.5 text-sm' : ''
      } ${fullWidth ? 'w-full' : ''} ${variantClasses} ${className}`}
    >
      <MessageSquare className="w-4 h-4 shrink-0 fill-current" />
      {!iconOnly && <span>{label}</span>}
    </a>
  );
};
