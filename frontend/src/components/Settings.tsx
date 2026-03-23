import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Settings() {
  const [sensitivity, setSensitivity] = useState(() => {
    const saved = localStorage.getItem('phishShield_sensitivity');
    return saved ? parseInt(saved) : 85;
  });
  const [offlineMode, setOfflineMode] = useState(() => {
    return localStorage.getItem('phishShield_offlineMode') === 'true';
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('phishShield_notifications');
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('phishShield_sensitivity', sensitivity.toString());
  }, [sensitivity]);

  useEffect(() => {
    localStorage.setItem('phishShield_offlineMode', offlineMode.toString());
  }, [offlineMode]);

  useEffect(() => {
    localStorage.setItem('phishShield_notifications', notifications.toString());
  }, [notifications]);

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          SOC_Control_Panel
        </h2>
        <p className="text-[11px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
          Configuration // Global_Parameters
        </p>
      </div>

      <div className="space-y-6">
        {/* Detection Sensitivity */}
        <div className="glass-card p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">AI_Detection_Threshold</h3>
            <span className="text-sm font-black font-mono text-cyan-400">{sensitivity}%</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase">
            Adjust the confidence required for a classification to be flagged as phishing.
          </p>
          <input 
            type="range" 
            min="50" 
            max="99" 
            value={sensitivity} 
            onChange={(e) => setSensitivity(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-700">
            <span>Aggressive (50%)</span>
            <span>Conservative (99%)</span>
          </div>
        </div>

        {/* Resilience Mode */}
        <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Offline_Resilience_Fallback</h3>
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase">
              Prioritize local heuristic models when backend latency exceeds 500ms.
            </p>
          </div>
          <button 
            onClick={() => setOfflineMode(!offlineMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${offlineMode ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-900 border border-white/5'}`}
          >
            <motion.div 
              animate={{ x: offlineMode ? 26 : 4 }}
              className={`w-4 h-4 rounded-full mt-0.5 ${offlineMode ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-700'}`}
            />
          </button>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">High_Threat_Alert_Feed</h3>
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase">
              Enable instant desktop notifications for critical phishing detections.
            </p>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-900 border border-white/5'}`}
          >
            <motion.div 
              animate={{ x: notifications ? 26 : 4 }}
              className={`w-4 h-4 rounded-full mt-0.5 ${notifications ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}
            />
          </button>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-6 border-t border-white/5">
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-700 uppercase tracking-widest">
          <span>Config_Rev: 4.12.0</span>
          <span>Last_Sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
