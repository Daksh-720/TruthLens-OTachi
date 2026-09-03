import React from 'react';
import {
  Scan,
  TrendingUp,
  History,
  ShieldCheck,
  ChevronRight,
  Moon,
  Sun,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab = 'verify',
  onSelectTab = () => {},
  isOpen = true,
  onClose = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {}
}) {
  const navItems = [
    {
      id: 'verify',
      label: 'Verify',
      sub: 'RUN A CREDIBILITY CHECK',
      icon: Scan
    },
    {
      id: 'trends',
      label: 'Trends',
      sub: 'TRENDING FALSE CLAIMS',
      icon: TrendingUp
    },
    {
      id: 'history',
      label: 'History',
      sub: 'YOUR VERIFICATION HIST...',
      icon: History
    }
  ];

  return (
    <aside
      className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-72 bg-[#f6f3eb] dark:bg-[#161615] border-r border-stone-200 dark:border-zinc-800 flex flex-col justify-between p-4 shrink-0 transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
      }`}
    >
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#b91c1c] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-stone-900 dark:text-zinc-100">
                TruthLens
              </div>
              <div className="text-[10px] font-mono-code tracking-widest text-stone-500 dark:text-zinc-400 uppercase">
                MISINFORMATION DETECTION
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-[#b91c1c] text-white shadow-sm'
                    : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={20}
                    className={`shrink-0 ${
                      isActive ? 'text-white' : 'text-stone-500 dark:text-zinc-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold leading-tight">{item.label}</div>
                    <div
                      className={`text-[10px] font-mono-code uppercase tracking-wider truncate mt-0.5 ${
                        isActive
                          ? 'text-red-100'
                          : 'text-stone-500 dark:text-zinc-400'
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>

                {isActive && <ChevronRight size={16} className="shrink-0 text-white" />}
              </button>
            );
          })}
        </nav>

        {/* Model Version Spec Card */}
        <div className="p-3.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a19] shadow-2xs space-y-1">
          <div className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
            MODEL VERSION
          </div>
          <div className="text-sm font-mono-code font-bold text-stone-900 dark:text-zinc-100">
            tl-v4.2.1
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        {/* Fact-Check Partners Card */}
        <div className="p-3.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a19] shadow-2xs space-y-2">
          <div className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
            FACT-CHECK PARTNERS
          </div>
          <div className="space-y-1.5 text-xs text-stone-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Snopes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Reuters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Full Fact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 space-y-4">
        {/* Action icons row */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#1a1a19] text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#1a1a19] text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
            title="View GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>

        {/* Global Metric Counter */}
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
            SOURCES CROSS-CHECKED
          </div>
          <div className="text-2xl font-black font-mono-code text-stone-900 dark:text-zinc-100">
            14,820
          </div>
          <div className="text-[10px] font-mono-code uppercase tracking-wider text-stone-500 dark:text-zinc-400">
            ACROSS 312 ORGANISATIONS
          </div>
        </div>
      </div>
    </aside>
  );
}
