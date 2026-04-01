'use client';

import { FACTORS } from '@/lib/factors';
import type { FactorId } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FactorBadgeProps {
  factorId: FactorId;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const FACTOR_EMOJIS: Record<FactorId, string> = {
  1: '🚀',
  2: '💖',
  3: '🌈',
  4: '🌿',
};

export default function FactorBadge({
  factorId,
  className,
  size = 'md',
  showDescription = false,
}: FactorBadgeProps) {
  const factor = FACTORS[factorId];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${factor.color}22`,
        color: factor.color,
        border: `1px solid ${factor.color}44`,
      }}
    >
      <span>{FACTOR_EMOJIS[factorId]}</span>
      <span>{factor.name}</span>
      {showDescription && (
        <span className="opacity-70 text-xs">— {factor.description}</span>
      )}
    </span>
  );
}
