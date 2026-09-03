import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function VerdictBadge({ verdict = 'GENUINE', size = 'md' }) {
  const norm = (verdict || '').toUpperCase();

  let borderStyle = '';
  let textStyle = '';
  let bgStyle = '';
  let Icon = CheckCircle2;
  let label = norm;

  if (norm.includes('GENUINE')) {
    borderStyle = 'border-emerald-600/70 dark:border-emerald-500/70';
    textStyle = 'text-emerald-700 dark:text-emerald-400';
    bgStyle = 'bg-emerald-500/10';
    Icon = CheckCircle2;
    label = 'GENUINE';
  } else if (norm.includes('MANIPULAT')) {
    borderStyle = 'border-purple-600/70 dark:border-purple-400/70';
    textStyle = 'text-purple-700 dark:text-purple-300';
    bgStyle = 'bg-purple-500/10';
    Icon = ShieldAlert;
    label = 'POTENTIALLY MANIPULATED';
  } else if (norm.includes('MISLEAD')) {
    borderStyle = 'border-amber-600/70 dark:border-amber-400/70';
    textStyle = 'text-amber-700 dark:text-amber-400';
    bgStyle = 'bg-amber-500/10';
    Icon = AlertTriangle;
    label = 'MISLEADING';
  } else {
    borderStyle = 'border-rose-600/70 dark:border-rose-500/70';
    textStyle = 'text-rose-700 dark:text-rose-400';
    bgStyle = 'bg-rose-500/10';
    Icon = XCircle;
    label = 'FAKE';
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <span
      className={`inline-flex items-center rounded border font-mono-code font-bold tracking-wider transition-all ${borderStyle} ${textStyle} ${bgStyle} ${
        isSmall
          ? 'px-2 py-0.5 text-[10px] gap-1'
          : isLarge
          ? 'px-4 py-1.5 text-sm gap-2'
          : 'px-2.5 py-1 text-xs gap-1.5'
      }`}
    >
      <Icon size={isSmall ? 11 : isLarge ? 16 : 13} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
