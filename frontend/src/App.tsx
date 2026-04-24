import { useState, useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('dashboard');

  // Handle URL sync and browser back/forward
  useEffect(() => {
    const handlePath = () => {
      const path = window.location.pathname;
      if (path === '/landing') setCurrentView('landing');
      else setCurrentView('dashboard');
    };

    handlePath();
    window.addEventListener('popstate', handlePath);
    return () => window.removeEventListener('popstate', handlePath);
  }, []);

  const navigateTo = (view: 'landing' | 'dashboard') => {
    setCurrentView(view);
    window.history.pushState({}, '', view === 'dashboard' ? '/' : `/${view}`);
  };

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 bg-slate-950 relative overflow-hidden font-sans cursor-default">
      {/* Global Transition Container */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <LandingPage onEnterDashboard={() => navigateTo('dashboard')} />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App
