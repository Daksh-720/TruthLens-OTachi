import React, { useState } from 'react';
import { Search, Download, ChevronDown, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import VerdictBadge from './VerdictBadge';

export default function HistoryView({
  historyItems = [],
  onClearHistory = () => {},
  onGoToVerify = () => {}
}) {
  const [selectedVerdict, setSelectedVerdict] = useState('ALL VERDICTS');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = historyItems.filter((item) => {
    const normVerdict = (item.verdict || '').toUpperCase();
    const matchesFilter =
      selectedVerdict === 'ALL VERDICTS' ||
      normVerdict.includes(selectedVerdict.replace('ALL ', '').trim());
    const matchesSearch =
      (item.claim || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Claim Excerpt', 'Verdict', 'Score', 'Confidence', 'Checked', 'Model'];
    const rows = filteredItems.map((item) => [
      `"${(item.claim || '').replace(/"/g, '""')}"`,
      item.verdict,
      item.score,
      `${item.confidence}%`,
      item.checked,
      item.model
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `truthlens-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Empty State when no history exists */}
      {historyItems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-stone-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-[#1a1a19] shadow-2xs space-y-4 my-6">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-400 flex items-center justify-center mx-auto">
            <ShieldCheck size={24} className="text-[#b91c1c] dark:text-red-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100 font-mono-code uppercase tracking-wider">
              No Default History Parameters
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your forensic history is clean. Analyze claims, statements, or viral images in the Verify Workbench to log evidence-backed fact-checks here.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onGoToVerify}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#b91c1c] hover:bg-red-700 text-white text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              <span>Go to Verify Workbench</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Verdict Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                  VERDICT
                </span>
                <div className="relative">
                  <select
                    value={selectedVerdict}
                    onChange={(e) => setSelectedVerdict(e.target.value)}
                    className="appearance-none px-3 py-2 pr-8 rounded-md bg-white dark:bg-[#1a1a19] border border-stone-300 dark:border-zinc-700 text-xs font-mono-code font-bold uppercase text-stone-800 dark:text-zinc-200 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="ALL VERDICTS">ALL VERDICTS</option>
                    <option value="GENUINE">GENUINE</option>
                    <option value="MISLEADING">MISLEADING</option>
                    <option value="FAKE">FAKE</option>
                    <option value="POTENTIALLY MANIPULATED">POTENTIALLY MANIPULATED</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-3 text-stone-500 pointer-events-none"
                  />
                </div>
              </div>

              {/* Search Input */}
              <div className="relative min-w-[260px]">
                <Search
                  size={15}
                  className="absolute left-3 top-2.5 text-stone-400 dark:text-zinc-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search verified claims..."
                  className="w-full pl-9 pr-4 py-1.5 rounded-md bg-white dark:bg-[#1a1a19] border border-stone-300 dark:border-zinc-700 text-xs text-stone-800 dark:text-zinc-200 placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#b91c1c] shadow-2xs"
                />
              </div>
            </div>

            {/* Actions: Clear History + Export CSV */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#1a1a19] border border-rose-200 dark:border-rose-900/60 text-xs font-mono-code font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-2xs transition-colors cursor-pointer"
                title="Clear all stored verification history"
              >
                <Trash2 size={13} />
                <span>CLEAR</span>
              </button>

              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white dark:bg-[#1a1a19] border border-stone-300 dark:border-zinc-700 text-xs font-mono-code font-bold uppercase tracking-wider text-stone-800 dark:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-800 shadow-2xs transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>EXPORT CSV</span>
              </button>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white dark:bg-[#1a1a19] border border-stone-300 dark:border-zinc-700 rounded-lg shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-zinc-800 bg-stone-50/60 dark:bg-[#151514] font-mono-code font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4 min-w-[320px]">CLAIM EXCERPT</th>
                    <th className="py-3 px-4 min-w-[170px]">VERDICT</th>
                    <th className="py-3 px-4 min-w-[110px]">SCORE</th>
                    <th className="py-3 px-4 min-w-[100px]">CONFIDENCE</th>
                    <th className="py-3 px-4 min-w-[120px]">CHECKED</th>
                    <th className="py-3 px-4 min-w-[90px]">MODEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/80 dark:divide-zinc-800/80">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400 dark:text-zinc-500">
                        No verification records found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-stone-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        {/* Claim Excerpt */}
                        <td className="py-3.5 px-4 font-medium text-stone-800 dark:text-zinc-200 line-clamp-2">
                          {item.claim}
                        </td>

                        {/* Verdict Badge */}
                        <td className="py-3.5 px-4">
                          <VerdictBadge verdict={item.verdict} size="sm" />
                        </td>

                        {/* Score with Mini Bar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 font-mono-code font-bold text-stone-900 dark:text-zinc-100">
                            <span>{item.score}</span>
                            <div className="w-12 h-1.5 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.score >= 70
                                    ? 'bg-emerald-600'
                                    : item.score >= 40
                                    ? 'bg-amber-600'
                                    : 'bg-rose-600'
                                }`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Confidence */}
                        <td className="py-3.5 px-4 font-mono-code text-stone-600 dark:text-zinc-400">
                          {item.confidence}%
                        </td>

                        {/* Checked */}
                        <td className="py-3.5 px-4 font-mono-code text-stone-500 dark:text-zinc-400 whitespace-nowrap">
                          {item.checked}
                        </td>

                        {/* Model */}
                        <td className="py-3.5 px-4 font-mono-code text-stone-500 dark:text-zinc-400">
                          {item.model}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
