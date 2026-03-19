import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const PIE_DATA = [
  { name: 'Safe', value: 65, color: '#10b981' },
  { name: 'Suspicious', value: 20, color: '#f59e0b' },
  { name: 'Phishing', value: 15, color: '#ef4444' },
];

const AREA_DATA = [
  { time: '00:00', threats: 12 },
  { time: '04:00', threats: 8 },
  { time: '08:00', threats: 45 },
  { time: '12:00', threats: 32 },
  { time: '16:00', threats: 54 },
  { time: '20:00', threats: 28 },
  { time: '23:59', threats: 15 },
];

export function ThreatIntelligence() {
  return (
    <div className="grid lg:grid-cols-2 gap-6 w-full">
      {/* Distribution Pie */}
      <div className="stat-card flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 px-2">
          <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-3 bg-cyan-500" />
            Threat_Distribution
          </h3>
          <span className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest border border-cyan-500/20 px-2 py-0.5 rounded">Live Vector</span>
        </div>
        
        <div className="h-[220px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PIE_DATA}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} className="hover:opacity-100 transition-opacity outline-none" style={{ filter: `drop-shadow(0 0 8px ${entry.color}40)` }} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(0, 242, 255, 0.2)', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner circle text placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-3xl font-black font-mono text-white">4.2K</span>
             <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Total_Vectors</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-5 mt-4 w-full px-2">
          {PIE_DATA.map((entry) => (
            <div key={entry.name} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-900/50 flex-1 border border-white/[0.03]">
              <div className="w-12 h-1 rounded-full mb-1" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }} />
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{entry.name}</span>
              <span className="text-sm font-black text-white">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Area */}
      <div className="stat-card flex flex-col">
        <div className="w-full flex justify-between items-center mb-6 px-2">
          <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-3 bg-blue-500" />
            Intensity_Metrics_24H
          </h3>
          <span className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest border border-cyan-500/20 px-2 py-0.5 rounded border-blue-500/20 text-blue-400/50">Time_Series</span>
        </div>

        <div className="h-[260px] w-full ml-[-15px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(0, 242, 255, 0.2)', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }}
                itemStyle={{ color: '#00f2ff', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="threats" 
                stroke="#00f2ff" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorThreats)" 
                activeDot={{ r: 5, fill: '#00f2ff', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 0 5px #00f2ff)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
