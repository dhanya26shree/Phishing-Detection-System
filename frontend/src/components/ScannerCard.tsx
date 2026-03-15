import { useState } from 'react';
import { WarningGraphic } from '@/components/ui/warning-graphic';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
  prediction: string;
  confidence: number;
  timestamp: string;
  signals?: string[];
}

interface ScannerCardProps {
  title: string;
  description: string;
  label: string;
  placeholder: string;
  type: 'url' | 'email';
  onScan: (input: string) => Promise<ScanResult>;
}

export function ScannerCard({ title, description, label, placeholder, type, onScan }: ScannerCardProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await onScan(input);
      setResult(res);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPhishing = result?.prediction === 'phishing';
  const isSuspicious = result?.prediction === 'suspicious';

  return (
    <div className="glass-card flex flex-col h-full group/card relative">
      {/* HUD Corner Brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-sm group-hover/card:border-cyan-500/50 transition-colors" />
      <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-cyan-500/20 rounded-tr-sm group-hover/card:border-cyan-500/50 transition-colors" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-bottom-2 border-cyan-500/20 rounded-bl-sm group-hover/card:border-cyan-500/50 transition-colors" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-bottom-2 border-cyan-500/20 rounded-br-sm group-hover/card:border-cyan-500/50 transition-colors" />

      <div className="mb-6 relative">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">{title}</h3>
        <p className="text-sm text-slate-400 font-medium">{description}</p>
      </div>
      
      <div className="flex flex-col gap-4 flex-grow relative">
        <label className="text-[10px] font-mono font-bold text-cyan-500/50 uppercase tracking-[0.2em] leading-none">
          {label}
        </label>
        
        <div className="relative group">
          {type === 'url' ? (
            <input
              type="text"
              aria-label={label}
              className="w-full bg-slate-950/50 border border-cyan-500/10 rounded-xl p-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all group-hover:bg-slate-950/80 font-mono text-sm"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          ) : (
            <textarea
              aria-label={label}
              className="w-full bg-slate-950/50 border border-cyan-500/10 rounded-xl p-4 text-white placeholder:text-slate-700 h-40 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all group-hover:bg-slate-950/80 font-mono text-sm"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
          {/* Decorative Input Focus Pulse */}
          <div className="absolute -inset-1 bg-cyan-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
        </div>

        <button
          onClick={handleScan}
          disabled={loading || !input.trim()}
          className="btn-primary mt-2 w-full shadow-lg shadow-cyan-900/20 group overflow-hidden relative border border-white/10"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] font-black">
            {loading ? (
              <>
                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing_Request...
              </>
            ) : (
              <>
                Initialize Deep_Scan
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {loading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest">
              <span>Analyzing_Neural_Patterns...</span>
              <span>Scanning...</span>
            </div>
            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/3 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-8 border-t border-cyan-500/10 pt-8 flex flex-col items-center gap-6">
              {isPhishing && (
                <div className="w-full flex justify-center py-6 bg-red-500/5 rounded-2xl border border-red-500/10 shadow-[inner_0_0_20px_rgba(239,68,68,0.1)]">
                  <WarningGraphic width={300} height={100} animationSpeed={1.2} />
                </div>
              )}
              
              <div className="text-center w-full">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-4 border",
                  isPhishing ? "bg-red-500/10 text-red-500 border-red-500/30" :
                  isSuspicious ? "bg-warning/10 text-warning border-warning/30" :
                  "bg-cyan-500/10 text-cyan-500 border-cyan-500/30"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                    isPhishing ? "bg-red-500" : isSuspicious ? "bg-warning" : "bg-cyan-500"
                  )} />
                  {isPhishing ? 'CRITICAL_THREAT_DETECTED' : isSuspicious ? 'SECURITY_ALERT:MODERATE_RISK' : 'SIGNATURE_VERIFIED_SAFE'}
                </div>

                <h4 className={cn(
                  "text-4xl font-black uppercase tracking-tighter mb-1",
                  isPhishing ? "text-red-500 italic" : isSuspicious ? "text-warning" : "text-cyan-500"
                )}>
                  {result.prediction}
                </h4>

                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-6">
                  Engine_Confidence: <span className="text-slate-200">{(result.confidence * 100).toFixed(4)}%</span>
                </p>

                <div className="relative w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden border border-cyan-500/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn(
                      "h-full rounded-full relative",
                      isPhishing ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" :
                      isSuspicious ? "bg-warning shadow-[0_0_10px_rgba(251,194,33,0.8)]" :
                      "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    )}
                  />
                </div>
                
                {result.signals && result.signals.length > 0 && (
                  <div className="mt-8 text-left w-full space-y-3">
                    <p className="text-[10px] font-black text-cyan-500/50 font-mono uppercase tracking-[0.3em] mb-2 px-1">Deep_Analysis_Output:</p>
                    <div className="grid gap-2">
                      {result.signals.map((signal, i) => (
                        <div key={i} className="bg-slate-950/50 border border-cyan-500/5 rounded-xl p-3 flex items-start gap-4 group/sig hover:border-cyan-500/20 transition-colors">
                          <code className="text-[10px] text-cyan-500/30 group-hover/sig:text-cyan-500 transitions-colors font-mono mt-0.5">[{i.toString().padStart(2, '0')}]</code>
                          <span className="text-xs text-slate-300 font-mono font-medium leading-relaxed">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-cyan-500/5 flex justify-between items-center px-1">
                   <div className="flex flex-col items-start">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest font-mono">Node_Origin</span>
                     <span className="text-[10px] font-mono text-slate-400">SIH_Mainnet_04</span>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest font-mono">Ledger_Time</span>
                     <span className="text-[10px] font-mono text-slate-200">{new Date(result.timestamp).toLocaleTimeString()}</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
