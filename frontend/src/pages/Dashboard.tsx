
import { motion } from 'framer-motion';
import { ActivityFeed } from '../components/ActivityFeed';
import { ThreatIntelligence } from '../components/ThreatIntelligence';
import { SystemStatus } from '../components/SystemStatus';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard(props: DashboardProps) {
  const { onLogout } = props;
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden p-6 md:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-50" />
      
      {/* Header */}
      <header className="max-w-[1600px] mx-auto mb-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={onLogout} className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-600/20 active:scale-95 transition-all">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Security_Operations_Center</h1>
            <p className="text-[10px] font-mono text-cyan-500 font-bold tracking-[0.3em]">UNIT_ID: ALPHA-V4 // LIVE_PROCTOR</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Operator_Status</span>
            <span className="text-xs font-mono font-black text-emerald-500 uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Authenticated
            </span>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-[10px] font-mono font-bold text-slate-400 hover:text-white hover:border-cyan-500 transition-all uppercase tracking-widest"
          >
            Logout_Session
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Stats & Analytics */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           {/* Top Stats Cards */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Domains_Analyzed', value: '42,891', color: 'text-white' },
                { label: 'Threats_Blocked', value: '1,204', color: 'text-red-500' },
                { label: 'Accuracy_Rating', value: '99.8%', color: 'text-cyan-400' },
                { label: 'Response_Time', value: '184ms', color: 'text-emerald-400' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card bg-slate-900/40 p-4 border border-white/[0.03] rounded-xl hover:border-cyan-500/20 transition-all"
                >
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                  <span className={`text-xl font-black font-mono tracking-tighter ${stat.color}`}>{stat.value}</span>
                </motion.div>
              ))}
           </div>

           {/* Central Analytics Area */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
           >
             <ThreatIntelligence />
           </motion.div>
        </div>

        {/* Right Column: Status & Feed */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex-grow min-h-[400px]"
           >
             <ActivityFeed />
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
           >
             <SystemStatus />
           </motion.div>
        </div>

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
