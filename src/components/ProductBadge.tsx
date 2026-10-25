import React from 'react';

export const BADGE_OPTIONS = [
  'New Arrival',
  'Best Sale',
  'Best Value',
  'Sale in 24 hours'
] as const;

export type BadgeType = typeof BADGE_OPTIONS[number] | string;

export function getBadgeColors(badge: string) {
  const norm = (badge || '').trim().toLowerCase();
  
  if (norm === 'new arrival' || norm.includes('new')) {
    return {
      storefront: 'bg-emerald-600 text-white shadow-xs',
      admin: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
      pill: 'bg-emerald-600 text-white border-emerald-600',
      dot: 'bg-emerald-400',
      icon: '✨'
    };
  }
  if (norm === 'best sale' || norm.includes('best sale') || norm.includes('bestseller')) {
    return {
      storefront: 'bg-rose-600 text-white shadow-xs',
      admin: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
      pill: 'bg-rose-600 text-white border-rose-600',
      dot: 'bg-rose-400',
      icon: '🔥'
    };
  }
  if (norm === 'best value' || norm.includes('best value') || norm.includes('value')) {
    return {
      storefront: 'bg-indigo-600 text-white shadow-xs',
      admin: 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold',
      pill: 'bg-indigo-600 text-white border-indigo-600',
      dot: 'bg-indigo-400',
      icon: '💎'
    };
  }
  if (norm === 'sale in 24 hours' || norm.includes('24 hour') || norm.includes('24h') || norm.includes('24 hours')) {
    return {
      storefront: 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-sm ring-1 ring-white/30',
      admin: 'bg-red-50 text-red-800 border-red-300 font-extrabold',
      pill: 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-red-600',
      dot: 'bg-yellow-300 animate-ping',
      icon: '⚡'
    };
  }

  // Fallback for custom badges
  return {
    storefront: 'bg-amber-600 text-white shadow-xs',
    admin: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    pill: 'bg-amber-600 text-white border-amber-600',
    dot: 'bg-amber-300',
    icon: '🏷️'
  };
}

export default function ProductBadge({ 
  badge, 
  size = 'sm',
  showIcon = true,
  className = ''
}: { 
  badge?: string; 
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}) {
  if (!badge) return null;
  const colors = getBadgeColors(badge);

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 tracking-wider font-bold',
    sm: 'text-[10px] sm:text-[11px] px-2 py-0.5 tracking-wider font-extrabold',
    md: 'text-xs px-2.5 py-1 tracking-wider font-extrabold'
  }[size];

  return (
    <span 
      className={`inline-flex items-center gap-1 uppercase rounded leading-none ${colors.storefront} ${sizeClasses} ${className}`}
    >
      {showIcon && <span className="text-[1.1em] leading-none">{colors.icon}</span>}
      <span>{badge}</span>
    </span>
  );
}
