import { useEffect, useRef, useState } from 'react';

interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
  timestamp: string;
}

interface ActivityFeedProps {
  expanded?: boolean;
}

export function ActivityFeed({ expanded = false }: ActivityFeedProps = {}) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, message: "Kernel_Init: Neural Engine V4.2 active", type: 'info', timestamp: '21:15:02' },
    { id: 2, message: "Ledger_Sync: SIH_Mainnet node synchronized", type: 'success', timestamp: '21:15:05' },
    { id: 3, message: "Monitor: Real-time scan engine operational", type: 'info', timestamp: '21:15:08' },
  ]);
  const feedRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
    };
    setLogs(prev => {
      const combined = [...prev, newLog];
      return combined.slice(-20);
    });
  };

  useEffect(() => {
    // Initial history import
    const history = JSON.parse(localStorage.getItem('phishShieldScanHistory') || '[]');
    if (history.length > 0) {
      const historyLogs: LogEntry[] = history.slice(0, 5).reverse().map((h: any) => ({
        id: h.id + Math.random(),
        message: `${h.prediction === 'phishing' ? 'THREAT_DETECTED' : 'SCAN_CLEARED'}: ${h.url.substring(0, 30)}${h.url.length > 30 ? '...' : ''}`,
        type: h.prediction === 'phishing' ? 'error' : 'success',
        timestamp: new Date(h.timestamp).toLocaleTimeString([], { hour12: false })
      }));
      setLogs(prev => [...prev, ...historyLogs].slice(-20));
    }

    // Listen for real-time events
    const handleNewScan = (e: any) => {
      const scan = e.detail;
      if (scan) {
        addLog(
          `${scan.prediction === 'phishing' ? 'CRITICAL_VULNERABILITY' : 'SECURITY_INTEGRITY'}: [Target: ${scan.url.substring(0, 25)}${scan.url.length > 25 ? '...' : ''}]`,
          scan.prediction === 'phishing' ? 'error' : 'success'
        );
      }
    };

    window.addEventListener('phishshield-new-scan', handleNewScan as EventListener);

    const interval = setInterval(() => {
      const messages = [
        "Analyzing packet signature: 0x4f...2e",
        "WHOIS correlation complete for domain_root",
        "Decrypting SSL handshake... Success",
        "Threat intel DB updated: +12 nodes",
        "AI Confidence recalibrating...",
        "Suspicious pattern detected: Lexical anomaly",
        "Blockchain consensus reached on block 0xFD...2A",
        "Neutral network weights optimized"
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      addLog(randomMsg, Math.random() > 0.9 ? 'warn' : 'info');
    }, 6000);

    return () => {
      window.removeEventListener('phishshield-new-scan', handleNewScan as EventListener);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`glass-container flex flex-col h-full bg-slate-950/50 border border-cyan-500/10 rounded-2xl overflow-hidden shadow-inner ${expanded ? 'min-h-[400px]' : ''}`}>
      <div className="px-4 py-2 bg-slate-900/80 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-[10px] font-mono font-black text-cyan-500 uppercase tracking-widest">Live_Terminal_Feed</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
      </div>
      
      <div 
        ref={feedRef}
        className="p-4 flex-grow font-mono text-[11px] space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900/50"
      >
        {logs.map(log => (
          <div key={log.id} className="flex gap-3 group animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
            <span className={`
              ${log.type === 'info' ? 'text-slate-300' : ''}
              ${log.type === 'success' ? 'text-cyan-400' : ''}
              ${log.type === 'warn' ? 'text-yellow-500' : ''}
              ${log.type === 'error' ? 'text-red-500' : ''}
              leading-relaxed
            `}>
              {log.type === 'error' ? '[ALERT] ' : ''}
              {log.type === 'warn' ? '[WARN] ' : ''}
              {log.message}
            </span>
          </div>
        ))}
        <div className="w-1 h-3 bg-cyan-500 animate-pulse inline-block" />
      </div>
    </div>
  );
}
