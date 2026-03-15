

const STATUS_ITEMS = [
  { name: 'Neural_Engine', status: 'Online', color: 'text-cyan-500' },
  { name: 'Blockchain_Node', status: 'Operational', color: 'text-cyan-500' },
  { name: 'Threat_Intel_Sync', status: 'Active', color: 'text-cyan-500' },
  { name: 'API_Gateway', status: 'Secure', color: 'text-emerald-500' },
];

export function SystemStatus() {
  return (
    <div className="glass-card bg-slate-950/40 p-6 border border-cyan-500/10 rounded-2xl">
      <h3 className="text-xs font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-2 border-l-2 border-emerald-500">System_Monitoring</h3>
      <div className="space-y-4">
        {STATUS_ITEMS.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/[0.03] group hover:border-cyan-500/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-black uppercase ${item.color}`}>{item.status}</span>
              <div className={`w-1 h-1 rounded-full animate-pulse ${item.color.replace('text-', 'bg-')}`} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/[0.03]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-mono font-bold text-slate-600 uppercase">Load_Distribution</span>
          <span className="text-[9px] font-mono font-bold text-cyan-500">24%</span>
        </div>
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div className="w-[24%] h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        </div>
      </div>
    </div>
  );
}
