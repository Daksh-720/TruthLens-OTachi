import React from 'react';
import { TrendingUp, ArrowUpRight, Flame, ShieldAlert } from 'lucide-react';
import VerdictBadge from './VerdictBadge';
import { INITIAL_TRENDS } from '../data/mockData';

export default function TrendsView({ onSelectTrend = () => {} }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="p-5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#1a1a19] shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-[#b91c1c] dark:text-red-400 font-mono-code font-bold text-xs uppercase tracking-wider">
          <Flame size={16} />
          <span>VIRAL DISINFORMATION SURVEILLANCE</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
          Trending High-Velocity False Claims
        </h2>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Claims experiencing rapid acceleration across social networks and messaging platforms flagged by automated crawler sentinels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_TRENDS.map((trend) => (
          <div
            key={trend.id}
            className="p-5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#1a1a19] hover:border-stone-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between shadow-2xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                  {trend.category}
                </span>
                <span className="text-xs font-mono-code text-stone-400">{trend.time}</span>
              </div>

              <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100 leading-snug">
                {trend.topic}
              </h3>

              <div className="flex items-center justify-between gap-2 pt-1">
                <VerdictBadge verdict={trend.verdict} size="sm" />
                <span className="text-xs font-mono-code font-bold text-rose-600 dark:text-rose-400">
                  {trend.velocity}
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-200 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="font-mono-code text-stone-500 dark:text-zinc-400">
                {trend.flagCount.toLocaleString()} detections
              </span>

              <button
                onClick={() => onSelectTrend(trend.topic)}
                className="flex items-center gap-1 font-mono-code font-bold text-[#b91c1c] dark:text-red-400 hover:underline"
              >
                <span>Check Claim</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
