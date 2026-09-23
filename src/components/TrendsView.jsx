import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, Flame, ShieldAlert, RefreshCw, Radio, ExternalLink, Sparkles } from 'lucide-react';
import VerdictBadge from './VerdictBadge';
import { fetchLiveTrends } from '../services/trendsScraperService';

export default function TrendsView({ onSelectTrend = () => {} }) {
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sourceInfo, setSourceInfo] = useState('Live Sentinel Feed');
  const [lastUpdated, setLastUpdated] = useState('');

  const loadTrends = async (force = false) => {
    if (force) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await fetchLiveTrends(force);
      if (result && result.items) {
        setTrends(result.items);
        setSourceInfo(result.source || 'Live Sentinel Feed');
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to scrape live trends:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Automatically scrape latest information when user opens trends
  useEffect(() => {
    loadTrends(false);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Sentinel Status Banner */}
      <div className="p-5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#1a1a19] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#b91c1c] dark:text-red-400 font-mono-code font-bold text-xs uppercase tracking-wider">
            <Flame size={16} className="animate-pulse" />
            <span>REAL-TIME DISINFORMATION &amp; TRENDS SENTINEL</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Status indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono-code text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>LIVE SCRAPED</span>
            </div>

            {/* Refresh Scrape Button */}
            <button
              onClick={() => loadTrends(true)}
              disabled={isLoading || isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-stone-300 dark:border-zinc-600 text-xs font-mono-code font-bold text-stone-700 dark:text-zinc-200 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Scrape and fetch fresh live trends"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'SCRAPING...' : 'RE-SCRAPE'}</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
            Top 4 Real-Time Trending Information &amp; Claims
          </h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Dynamically scraped from live global wires and crawled feeds upon site load. Inspect and verify any viral headline directly through the forensic engine.
          </p>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-2 pt-2 border-t border-stone-200/80 dark:border-zinc-800/80 text-[11px] font-mono-code text-stone-400 dark:text-zinc-500">
            <Radio size={12} className="text-[#b91c1c] dark:text-red-400" />
            <span>Feed Source: {sourceInfo}</span>
            <span>•</span>
            <span>Last Synced: {lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={`skeleton-${n}`}
              className="p-5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a19] shadow-2xs space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-stone-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-16 bg-stone-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-stone-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-4/5 bg-stone-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-24 bg-stone-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-20 bg-stone-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex justify-between">
                <div className="h-3 w-24 bg-stone-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-20 bg-stone-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Scraped Live Trends Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="p-5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#1a1a19] hover:border-stone-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between shadow-2xs group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                      {trend.category}
                    </span>
                    {trend.source && (
                      <span className="text-[10px] font-mono-code text-stone-500 dark:text-zinc-400 px-1.5 py-0.5 rounded bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 truncate max-w-[130px]">
                        {trend.source}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono-code text-stone-400 whitespace-nowrap">{trend.time}</span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100 leading-snug line-clamp-3">
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

                <div className="flex items-center gap-3">
                  {trend.url && trend.url !== '#' && (
                    <a
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300"
                      title="Read original news report"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}

                  <button
                    onClick={() => onSelectTrend(trend.topic)}
                    className="flex items-center gap-1 font-mono-code font-bold text-[#b91c1c] dark:text-red-400 hover:underline cursor-pointer"
                  >
                    <span>Check Claim</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
