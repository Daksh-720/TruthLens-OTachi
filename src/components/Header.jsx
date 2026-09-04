import React, { useState } from 'react';
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';

export default function Header({
  activeTab = 'verify',
  isSidebarOpen = true,
  onToggleSidebar = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {},
  currentUser = null,
  onLogout = () => {},
  onOpenAuth = () => {}
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getTitles = () => {
    switch (activeTab) {
      case 'verify':
        return {
          title: 'Verify a claim',
          sub: 'PASTE TEXT, A SOCIAL POST, OR UPLOAD MEDIA TO CHECK CREDIBILITY'
        };
      case 'history':
        return {
          title: 'My history',
          sub: 'YOUR VERIFICATION HISTORY - FILTER, RE-RUN, EXPORT'
        };
      case 'trends':
        return {
          title: 'Trending false claims',
          sub: 'REAL-TIME VIRAL MISINFORMATION DETECTED ACROSS ONLINE PLATFORMS'
        };
      default:
        return { title: 'TruthLens', sub: 'AI MISINFORMATION DETECTION' };
    }
  };

  const { title, sub } = getTitles();

  return (
    <header className="h-16 px-6 border-b border-stone-200 dark:border-zinc-800/80 bg-white/70 dark:bg-[#151514]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left Title & Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-stone-300 dark:border-zinc-700 transition-colors"
          title="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-base font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            {title}
          </h1>
          <p className="text-[11px] font-mono-code text-stone-500 dark:text-zinc-400 tracking-wider">
            {sub}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-zinc-800/90 border border-stone-300 dark:border-zinc-700 text-xs font-mono-code font-bold text-stone-700 dark:text-zinc-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-stone-300 dark:border-zinc-700 transition-colors shadow-2xs"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
        </button>

        {/* User / Profile Section */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-[#991b1b] hover:bg-[#b91c1c] text-white flex items-center justify-center font-bold text-xs shadow-sm select-none transition-transform active:scale-95"
              title={`Logged in as ${currentUser.name}`}
            >
              {currentUser.initials || 'U'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#1a1a19] border border-stone-200 dark:border-zinc-700 shadow-xl p-2 z-50 text-xs animate-fadeIn">
                <div className="px-3 py-2 border-b border-stone-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-stone-900 dark:text-zinc-100 truncate">
                      {currentUser.name}
                    </p>
                    {currentUser.provider && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase tracking-wider bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400">
                        {currentUser.provider}
                      </span>
                    )}
                  </div>
                  {currentUser.email ? (
                    <p className="text-[11px] text-stone-500 dark:text-zinc-400 font-mono-code truncate mt-0.5">
                      {currentUser.email}
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono-code uppercase mt-0.5 font-semibold">
                      Authenticated Analyst
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold transition-colors"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Person who hasn't logged in */
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 text-stone-700 dark:text-zinc-300 hover:border-[#b91c1c] dark:hover:border-red-500 hover:bg-stone-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs group"
            title="Not logged in — Click to Sign In / Register"
          >
            <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-zinc-700 text-stone-600 dark:text-zinc-300 flex items-center justify-center group-hover:bg-[#b91c1c] group-hover:text-white transition-colors">
              <User size={14} />
            </div>
            <span className="hidden sm:inline text-xs font-semibold">
              Not logged in
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
