import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityFeed } from '../components/ActivityFeed';
import { ThreatIntelligence } from '../components/ThreatIntelligence';
import { SystemStatus } from '../components/SystemStatus';
import { ScannerCard } from '../components/ScannerCard';

const API_BASE = 'http://localhost:8000';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard(props: DashboardProps) {
  const { onLogout } = props;
  const [activeTab, setActiveTab] = useState<'scanner' | 'analytics'>('scanner');
  const [stats, setStats] = useState({ total_scanned: 0, phishing_detected: 0 });

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const scanUrl = async (url: string) => {
    const res = await fetch(`${API_BASE}/predict-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const result = await res.json();
    fetchStats();
    return result;
  };

  const scanEmail = async (email_text: string) => {
    const res = await fetch(`${API_BASE}/predict-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_text })
    });
    const result = await res.json();
    fetchStats();
    return result;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden p-6 md:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-50" />
      
      {/* Header */}
      <header className="max-w-[1600px] mx-auto mb-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-600/20 active:scale-95 transition-all">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Security_Operations_Center</h1>
            <p className="text-[10px] font-mono text-cyan-500 font-bold tracking-[0.3em]">UNIT_ID: ALPHA-V4 // LIVE_PROCTOR</p>
          </div>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="hidden md:flex items-center bg-slate-900/50 border border-white/5 rounded-xl p-1 gap-1">
          <button 
            onClick={() => setActiveTab('scanner')}
            className={`px-6 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeTab === 'scanner' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'text-slate-500 hover:text-white'}`}
          >
            Neural_Scanner
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'text-slate-500 hover:text-white'}`}
          >
            Analytics_Console
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-[10px] font-mono font-bold text-slate-400 hover:text-white hover:border-cyan-500 transition-all uppercase tracking-widest"
          >
            Logout_Session
          </button>
        </div>
      </header>

      {/* Main Content Area with Transitions */}
      <main className="max-w-[1600px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'scanner' ? (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <ScannerCard
                title="URL Deep Analysis"
                description="Evaluates TLD structure, WHOIS age, and pattern matching signatures."
                label="Analyzer_Input::URL"
                placeholder="https://secure-login-bank.xyz/verify"
                type="url"
                onScan={scanUrl}
              />
              <ScannerCard
                title="Email Lexical Shield"
                description="Scans for urgency cues, psychological triggers, and malicious formatting."
                label="Analyzer_Input::Content"
                placeholder="Paste the suspicious email text here..."
                type="email"
                onScan={scanEmail}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-12 gap-6"
            >
              {/* Left Column: Stats & Analytics */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Domains_Analyzed', value: stats.total_scanned.toLocaleString(), color: 'text-white' },
                      { label: 'Threats_Blocked', value: stats.phishing_detected.toLocaleString(), color: 'text-red-500' },
                      { label: 'Accuracy_Rating', value: '99.8%', color: 'text-cyan-400' },
                      { label: 'Response_Time', value: '184ms', color: 'text-emerald-400' },
                    ].map((stat, i) => (
                      <div 
                        key={i}
                        className="glass-card bg-slate-900/40 p-4 border border-white/[0.03] rounded-xl hover:border-cyan-500/20 transition-all"
                      >
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                        <span className={`text-xl font-black font-mono tracking-tighter ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                </div>

                {/* Central Analytics Area */}
                <ThreatIntelligence />
              </div>

              {/* Right Column: Status & Feed */}
              <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
                <ActivityFeed />
                <SystemStatus />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Footer Info */}
      <footer className="max-w-[1600px] mx-auto mt-8 pt-8 border-t border-white/[0.03] flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-widest">
         <span>Session_Token: 0xFD...2A91</span>
         <span className="flex items-center gap-4">
           <span>Memory_Usage: 412MB</span>
           <span>CPU_Load: 12%</span>
           <span className="text-cyan-900">SIH_PROTOCOL_STABLE</span>
         </span>
      </footer>
    </div>
  );
}
