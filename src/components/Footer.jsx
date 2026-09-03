import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-3 px-6 border-t border-stone-200 dark:border-zinc-800/80 bg-white/60 dark:bg-[#151514]/80 text-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-2 text-stone-600 dark:text-zinc-400">
        <ShieldCheck size={16} className="text-[#b91c1c] dark:text-red-400 shrink-0" />
        <span>
          TruthLens - AI-powered misinformation detection. Verdicts are provisional and should not replace human judgement.
        </span>
      </div>

      <div className="font-mono-code text-[11px] text-stone-500 dark:text-zinc-400 flex items-center gap-3">
        <span>MODEL: TL-V4.2.1</span>
        <span>•</span>
        <span>312 SOURCES</span>
        <span>•</span>
        <span>3 FACT-CHECK DBS</span>
      </div>
    </footer>
  );
}
