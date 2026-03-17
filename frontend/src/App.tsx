import { useState, useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import LoginPage from './components/ui/login-1'
import { Dashboard } from './pages/Dashboard'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('login');

  // Handle URL sync and browser back/forward
  useEffect(() => {
    const handlePath = () => {
      const path = window.location.pathname;
      if (path === '/landing') setCurrentView('landing');
      else if (path === '/dashboard') setCurrentView('dashboard');
      else setCurrentView('login');
    };

    handlePath();
    window.addEventListener('popstate', handlePath);
    return () => window.removeEventListener('popstate', handlePath);
  }, []);

  const navigateTo = (view: 'landing' | 'login' | 'dashboard') => {
    setCurrentView(view);
    window.history.pushState({}, '', view === 'login' ? '/' : `/${view}`);
  };

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 bg-slate-950 relative overflow-hidden font-sans cursor-default">
      {/* Absolute Shared Background Engine */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="cyber-scanline" />
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
      </div>

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
              <LandingPage onLogin={() => navigateTo('login')} />
            </motion.div>
          )}

          {currentView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <LoginPage onBack={() => navigateTo('landing')} onLogin={() => navigateTo('dashboard')} />
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
              <Dashboard onLogout={() => navigateTo('landing')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App
