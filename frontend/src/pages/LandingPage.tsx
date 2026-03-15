import { ScannerCard } from '../components/ScannerCard'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API_BASE = 'http://localhost:8000'

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage(props: LandingPageProps) {
  const { onLogin } = props;
  const [stats, setStats] = useState({ total_scanned: 0, phishing_detected: 0 })

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error('Failed to fetch stats', e)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const scanUrl = async (url: string) => {
    const res = await fetch(`${API_BASE}/predict-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    const result = await res.json()
    fetchStats()
    return result
  }

  const scanEmail = async (email_text: string) => {
    const res = await fetch(`${API_BASE}/predict-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_text })
    })
    const result = await res.json()
    fetchStats()
    return result
  }

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 bg-slate-950 relative overflow-hidden">
      {/* Cyber Background Engine */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="cyber-scanline" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent blur-[1px]" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent blur-[1px]" />
      </div>

      {/* Navigation */}
      <nav className="nav-blur relative z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-600/20 group-hover:shadow-cyan-600/40 transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tighter leading-none">PHISH SHIELD</span>
              <span className="text-[10px] font-mono text-cyan-500 font-bold tracking-[0.3em]">AI_PROTO_V4</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={onLogin} className="text-[10px] font-black text-slate-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">Analyzer_Root</button>
            <button onClick={onLogin} className="text-[10px] font-black text-slate-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">Neural_Metrics</button>
            <button onClick={onLogin} className="text-[10px] font-black text-slate-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">Ledger_Explorer</button>
            <button onClick={onLogin} className="btn-primary py-2 px-6">System.init()</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 hero-gradient overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Decentralized Node Active
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 text-glow uppercase"
          >
            AI-Powered <br />
            Phishing Detection <br />
            <span className="text-cyan-500">Platform.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium"
          >
            A real enterprise-grade security product analyzing domain structures, lexical patterns, 
            and malicious signals in real time using advanced machine learning models.
          </motion.p>

          <div className="flex justify-center gap-6 mb-16">
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-cyan-900/40 active:scale-95 border border-white/10"
            >
              Start URL Scan
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-white font-mono tracking-tighter">{stats.total_scanned.toLocaleString()}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Data_Validated</div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="text-4xl font-black text-red-500 font-mono tracking-tighter group-hover:scale-110 transition-transform">{stats.phishing_detected.toLocaleString()}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Threats_Neutralized</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-cyan-500 font-mono tracking-tighter">0.2s</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Sync_Latency</div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] opacity-10 blur-[120px] bg-cyan-600 rounded-full pointer-events-none -z-10" />
      </section>

      {/* Main Scanner Section */}
      <section id="scanner" className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ScannerCard
              title="URL Deep Analysis"
              description="Evaluates TLD structure, WHOIS age, and pattern matching signatures."
              label="Analyzer_Input::URL"
              placeholder="https://secure-login-bank.xyz/verify"
              type="url"
              onScan={scanUrl}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ScannerCard
              title="Email Lexical Shield"
              description="Scans for urgency cues, psychological triggers, and malicious formatting."
              label="Analyzer_Input::Content"
              placeholder="Paste the suspicious email text here..."
              type="email"
              onScan={scanEmail}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900/40 py-32 border-y border-cyan-500/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Encryption & Intelligence</h2>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Core_Engine Status: [OPTIMAL]</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/20">
                <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Native AI Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Zero-dependency NLP classifiers running on edge nodes, performing sub-millisecond lexical analysis.
              </p>
            </div>

            <div className="glass-card">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Blockchain Ledger</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Immutable hash logs for every verified threat, creating a decentralized global reputation registry.
              </p>
            </div>

            <div className="glass-card">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Threat Intel</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Real-time WHOIS correlation and pattern matching that goes beyond simple text analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-cyan-500/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <span className="font-black text-white text-lg tracking-tighter">PHISH SHIELD AI</span>
          </div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest font-mono">
            Immutable Node_V4.0 // SIH2026
          </p>
        </div>
        
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">Blockchain_Network</span>
            <div className="flex items-center gap-2 text-cyan-500 text-xs font-bold font-mono">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              Mainnet_Connected
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">Engine_Core</span>
            <span className="text-white text-xs font-bold font-mono">NativeAI_v2.4p</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
