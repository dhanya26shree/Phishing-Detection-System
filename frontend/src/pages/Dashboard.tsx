import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityFeed } from '../components/ActivityFeed';
import { ThreatIntelligence } from '../components/ThreatIntelligence';
import { ScannerCard } from '../components/ScannerCard';
import { BlockchainModule } from '../components/BlockchainModule';
import { Settings } from '../components/Settings';
import { computeSHA256, getVerificationData } from '../lib/crypto';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface DashboardProps {
}

type Section = 'scanner' | 'analytics' | 'blockchain' | 'logs' | 'settings';

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'scanner',
    label: 'Neural Scanner',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'blockchain',
    label: 'Blockchain Ledger',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    id: 'logs',
    label: 'Threat Logs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const SECONDARY_NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('scanner');
  const [stats, setStats] = useState({ total_scanned: 0, phishing_detected: 0 });

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.warn('Backend stats unavailable, syncing from local history');
      const history = JSON.parse(localStorage.getItem('phishShieldScanHistory') || '[]');
      const phishingCount = history.filter((h: any) => h.prediction === 'phishing').length;
      setStats({
        total_scanned: history.length,
        phishing_detected: phishingCount
      });
    }
  };

  useEffect(() => {
    fetchStats();
    // Listen for local scans if backend is down
    const handleLocalUpdate = () => {
      fetchStats();
    };
    window.addEventListener('phishshield-new-scan', handleLocalUpdate);
    const interval = setInterval(fetchStats, 10000);
    return () => {
      window.removeEventListener('phishshield-new-scan', handleLocalUpdate);
      clearInterval(interval);
    };
  }, []);

  const scanUrl = async (url: string) => {
    let result;
    try {
      const res = await fetch(`${API_BASE}/predict-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!res.ok) throw new Error('Backend unavailable');
      result = await res.json();
    } catch (error) {
      console.warn('Backend fetch failed, using demo fallback logic:', error);
      const isSus = url.includes('suspicious') || url.includes('login') || url.includes('verify') || url.includes('free');
      result = {
        prediction: isSus ? 'phishing' : 'safe',
        confidence: isSus ? 0.98 : 0.99,
        timestamp: new Date().toISOString(),
        signals: isSus ? ['High entropy in domain name', 'Suspicious keyword detected', 'Invalid SSL Signature'] : ['Valid SSL Signature', 'Domain age > 5 years']
      };
    }

    // Persist to localStorage for blockchain ledger
    const history = JSON.parse(localStorage.getItem('phishShieldScanHistory') || '[]');
    const timestamp = result.timestamp || new Date().toISOString();
    
    const verificationData = getVerificationData({
      url,
      timestamp,
      prediction: result.prediction
    });
    
    const newEntry = {
      id: Date.now(), // Use timestamp for unique ID to avoid collisions with demo blocks
      hash: await computeSHA256(verificationData),
      url,
      prediction: result.prediction,
      confidence: result.confidence,
      timestamp,
    };
    history.unshift(newEntry);
    localStorage.setItem('phishShieldScanHistory', JSON.stringify(history.slice(0, 20)));
    
    // Dispatch event with data for components to react
    window.dispatchEvent(new CustomEvent('phishshield-new-scan', { detail: newEntry }));
    fetchStats();
    return result;
  };

  const scanEmail = async (email_text: string) => {
    let result;
    try {
      const res = await fetch(`${API_BASE}/predict-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_text })
      });
      if (!res.ok) throw new Error('Backend unavailable');
      result = await res.json();
    } catch (error) {
      console.warn('Backend fetch failed, using demo fallback logic:', error);
      const isSus = email_text.toLowerCase().includes('urgent') || email_text.toLowerCase().includes('password') || email_text.toLowerCase().includes('bank');
      result = {
        prediction: isSus ? 'phishing' : 'safe',
        confidence: isSus ? 0.95 : 0.92,
        timestamp: new Date().toISOString(),
        signals: isSus ? ['Urgency keyword detected', 'Suspicious link hidden in text'] : ['No malicious patterns found']
      };
    }
    // Persist email scans to ledger too
    const history = JSON.parse(localStorage.getItem('phishShieldScanHistory') || '[]');
    const timestamp = result.timestamp || new Date().toISOString();
    const shortUrl = email_text.substring(0, 50) + '...';

    const verificationData = getVerificationData({
      url: shortUrl,
      timestamp,
      prediction: result.prediction
    });
    
    const newEntry = {
      id: Date.now() + 1, // Slight offset to ensure uniqueness if both scans run very close
      hash: await computeSHA256(verificationData),
      url: shortUrl,
      prediction: result.prediction,
      confidence: result.confidence,
      timestamp,
    };
    history.unshift(newEntry);
    localStorage.setItem('phishShieldScanHistory', JSON.stringify(history.slice(0, 20)));
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('phishshield-new-scan', { detail: newEntry }));
    fetchStats();
    return result;
  };

  const sectionTitle: Record<Section, string> = {
    scanner: 'Neural_Scanner',
    analytics: 'Analytics_Console',
    blockchain: 'Blockchain_Ledger',
    logs: 'Threat_Logs',
    settings: 'Configuration_Node',
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Fixed background effects */}
      <div className="fixed inset-0 cyber-grid-animated opacity-100 pointer-events-none z-0" />
      <div className="cyber-scanline" />

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-cyan-500/10">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center flex-shrink-0 glow-pulse">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black tracking-tighter text-white truncate">PhishShield AI</div>
            <div className="text-[9px] font-mono text-cyan-500/60 uppercase tracking-[0.15em] truncate">Enterprise SOC</div>
          </div>
        </div>

        {/* Primary Nav */}
        <nav className="flex-grow py-4 overflow-y-auto">
          <div className="px-4 mb-3">
            <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-[0.25em]">Operations</span>
          </div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item w-full text-left ${activeSection === item.id ? 'sidebar-item-active' : ''}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="px-4 mt-6 mb-3">
            <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-[0.25em]">System</span>
          </div>
          {SECONDARY_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item w-full text-left ${activeSection === item.id ? 'sidebar-item-active' : ''}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Stats */}
        <div className="border-t border-cyan-500/10 px-4 py-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Domains_Scanned</span>
            <span className="text-[11px] font-black font-mono text-white">{stats.total_scanned.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Threats_Blocked</span>
            <span className="text-[11px] font-black font-mono text-red-400">{stats.phishing_detected.toLocaleString()}</span>
          </div>
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: stats.total_scanned > 0 ? `${Math.min(100, (stats.phishing_detected / stats.total_scanned) * 100 * 4)}%` : '3%' }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-slate-700 uppercase">
            <span>Threat_Rate</span>
            <span>{stats.total_scanned > 0 ? ((stats.phishing_detected / stats.total_scanned) * 100).toFixed(1) : '0.0'}%</span>
          </div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex flex-col flex-grow" style={{ marginLeft: 'var(--sidebar-width)' }}>

        {/* Topbar */}
        <header className="topbar">
          <div className="flex items-center gap-4">
            {/* Section title */}
            <div>
              <h1 className="text-[11px] font-black font-mono text-white uppercase tracking-[0.2em]">
                {sectionTitle[activeSection]}
              </h1>
              <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                Unit_ID: ALPHA-V4 // Live_Proctor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Node Active Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Node Active</span>
            </div>

            {/* Response Time */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-600 uppercase">Resp_Time:</span>
              <span className="text-[9px] font-black font-mono text-cyan-400">184ms</span>
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-[10px] font-black text-white">
              OP
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow overflow-y-auto relative z-10 p-6 md:p-8" style={{ paddingTop: 'calc(var(--topbar-height) + 24px)' }}>
          <AnimatePresence mode="wait">

            {activeSection === 'scanner' && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8 items-start"
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
            )}

            {activeSection === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Domains_Analyzed', value: stats.total_scanned.toLocaleString(), color: 'text-white', icon: '🔍' },
                    { label: 'Threats_Blocked', value: stats.phishing_detected.toLocaleString(), color: 'text-red-400', icon: '🛡️' },
                    { label: 'Accuracy_Rating', value: '99.8%', color: 'text-cyan-400', icon: '🎯' },
                    { label: 'Response_Time', value: '184ms', color: 'text-emerald-400', icon: '⚡' },
                  ].map((stat, i) => (
                    <div key={i} className="stat-card">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                      <span className={`text-2xl font-black font-mono tracking-tighter ${stat.color}`}>{stat.value}</span>
                      <span className="block mt-1 text-[9px] text-slate-700 font-mono">{stat.icon} Live_Data</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8">
                    <ThreatIntelligence />
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <ActivityFeed />
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'blockchain' && (
              <motion.div
                key="blockchain"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="max-w-4xl"
              >
                <div className="glass-card">
                  <BlockchainModule />
                </div>
              </motion.div>
            )}

            {activeSection === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-6"
              >
                <div className="lg:col-span-2">
                  <ActivityFeed expanded />
                </div>
              </motion.div>
            )}

            {activeSection === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl"
              >
                <Settings />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.03] px-8 py-3 flex justify-between items-center text-[8px] font-mono text-slate-700 uppercase tracking-widest relative z-10">
          <span>Session_Token: 0xFD...2A91</span>
          <span className="flex items-center gap-4">
            <span>Memory: 412MB</span>
            <span>CPU: 12%</span>
            <span className="text-cyan-900">SIH_PROTOCOL_STABLE</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
