import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import VerifyWorkbench from './components/VerifyWorkbench';
import HistoryView from './components/HistoryView';
import TrendsView from './components/TrendsView';
import AuthModal from './components/AuthModal';
import PixelTransition from './components/PixelTransition';
import { INITIAL_HISTORY } from './data/mockData';

export default function App() {
  // Always show login/register modal on refresh as requested
  const [showAuthModal, setShowAuthModal] = useState(true);
  // Default to null representing a person who hasn't logged in (no fake email)
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('verify');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [historyItems, setHistoryItems] = useState(INITIAL_HISTORY);

  // Digital pixel transition state
  const [isPixelSwapping, setIsPixelSwapping] = useState(false);
  const [targetDark, setTargetDark] = useState(false);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setTargetDark(nextMode);
    setIsPixelSwapping(true);

    // Swap theme right at the peak of the pixel wave
    setTimeout(() => {
      setIsDarkMode(nextMode);
    }, 360);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAuthModal(true);
  };

  const handleSaveResult = (newResult) => {
    setHistoryItems((prev) => [newResult, ...prev]);
  };

  const handleSelectTrend = (topic) => {
    setActiveTab('verify');
  };

  return (
    <div className={`min-h-screen flex text-stone-900 dark:text-zinc-100 ${isDarkMode ? 'dark' : ''}`}>
      {/* Crisp Digital Pixel Transition Overlay */}
      <PixelTransition
        active={isPixelSwapping}
        toDark={targetDark}
        onComplete={() => setIsPixelSwapping(false)}
      />

      {/* Glassmorphic Login / Register Gate (Shown on refresh or when requested) */}
      {showAuthModal && (
        <AuthModal
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Workspace Area with Engineering Grid Background */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen ${
          isDarkMode ? 'bg-graph-dark' : 'bg-graph-light'
        }`}
      >
        {/* Header Bar */}
        <Header
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'verify' && (
            <VerifyWorkbench onSaveResult={handleSaveResult} />
          )}
          {activeTab === 'history' && (
            <HistoryView historyItems={historyItems} />
          )}
          {activeTab === 'trends' && (
            <TrendsView onSelectTrend={handleSelectTrend} />
          )}
        </main>

        {/* Bottom Footer */}
        <Footer />
      </div>
    </div>
  );
}
