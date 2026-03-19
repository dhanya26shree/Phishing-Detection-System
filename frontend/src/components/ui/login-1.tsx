import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp' | 'authenticating'>('credentials');
  const [statusText, setStatusText] = useState('Awaiting Authorization...');
  const [nodes, setNodes] = useState<{ id: number; top: string; left: string; delay: string }[]>([]);

  // Generate random background nodes
  useEffect(() => {
    const newNodes = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }));
    setNodes(newNodes);
  }, []);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setStep('otp');
    setStatusText('2FA Token Required');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    
    setStep('authenticating');
    setStatusText('Initializing Secure Node...');
    
    setTimeout(() => {
      setStatusText('Verifying Cryptographic Identity...');
      setTimeout(() => {
        setStatusText('Encrypted Session Enabled');
        setTimeout(() => {
          onLogin();
        }, 800);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 cyber-grid-animated opacity-50" />
        
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 242, 255, 0.05)" />
              <stop offset="50%" stopColor="rgba(0, 242, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(0, 242, 255, 0.05)" />
            </linearGradient>
          </defs>
          {/* Constellation Lines */}
          <path d="M 10 10 L 150 200 L 400 50 L 800 300 L 1200 100" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />
          <path d="M 50 800 L 300 600 L 700 850 L 1000 500 L 1400 700" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />
          <path d="M 150 200 L 300 600 L 800 300 L 1000 500" fill="none" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="5,5" />
        </svg>

        {/* Floating Data Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="login-node w-1.5 h-1.5"
            style={{ 
              top: node.top, 
              left: node.left, 
              animationDelay: node.delay 
            }}
          />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] p-6">
        {/* Gateway Card */}
        <div className="glass-card bg-slate-900/80 border-cyan-500/30 p-8 shadow-[0_0_50px_rgba(0,242,255,0.05)]! hover:shadow-[0_0_80px_rgba(0,242,255,0.1)]! transition-all duration-700">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-500/30 mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors" />
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" strokeWidth="2" className="relative z-10 animate-pulse">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-white mb-2">PhishShield AI</h1>
            <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] font-bold">Secure Access Gateway</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'credentials' && (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCredentialsSubmit}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1">Agent_ID / Email</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-xl p-3.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700"
                    placeholder="operator@sih.gov.in"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1">Passphrase</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-xl p-3.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700 font-black tracking-[0.2em]"
                    placeholder="••••••••••••"
                  />
                </div>

                <button type="submit" className="btn-primary w-full mt-2 py-4 relative group overflow-hidden border border-white/10">
                  <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[11px] font-black">
                    Request Authentication
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover:translate-x-1">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleOtpSubmit}
                className="space-y-6"
              >
                <div className="text-center px-4">
                  <p className="text-xs text-slate-400">Enter the 6-digit cryptographic token sent to your registered device.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1 text-center block mb-2">2FA_Auth_Token</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-xl p-4 text-3xl text-center font-mono font-black text-cyan-400 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all tracking-[0.3em]"
                    placeholder="000000"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={otp.length !== 6}
                  className="btn-primary w-full py-4 relative group overflow-hidden border border-white/10"
                >
                  <span className="relative z-10 uppercase tracking-[0.2em] text-[11px] font-black">Verify Identity</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button 
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-full text-center text-[10px] font-mono text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors"
                >
                  Cancel / Return
                </button>
              </motion.form>
            )}

            {step === 'authenticating' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 space-y-6"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
                  <div className="absolute inset-0 border-2 border-t-cyan-500 border-r-cyan-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute inset-2 border-2 border-blue-500/20 rounded-full" />
                  <div className="absolute inset-2 border-2 border-b-blue-500 border-l-blue-500 rounded-full animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Ticker */}
          <div className="mt-8 pt-4 border-t border-cyan-500/20 flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${step === 'authenticating' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
            <div className="font-mono text-[10px] text-cyan-500 uppercase tracking-widest overflow-hidden whitespace-nowrap">
              {statusText}
              <span className="inline-block w-1.5 h-3 bg-cyan-500 ml-1 translate-y-0.5 animate-[blink-cursor_1s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
