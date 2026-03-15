import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';

const PIE_DATA = [
  { name: 'Safe', value: 65, color: '#06b6d4' },
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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Distribution Pie */}
      <div className="glass-card bg-slate-950/40 p-6 flex flex-col border border-cyan-500/10 rounded-2xl">
        <h3 className="text-xs font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-8 px-2 border-l-2 border-cyan-500">Threat_Distribution</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PIE_DATA}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {PIE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {PIE_DATA.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Area */}
      <div className="glass-card bg-slate-950/40 p-6 flex flex-col border border-cyan-500/10 rounded-2xl">
        <h3 className="text-xs font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-8 px-2 border-l-2 border-blue-500">Intensity_Metrics_24H</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
              />
              <Area type="monotone" dataKey="threats" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
