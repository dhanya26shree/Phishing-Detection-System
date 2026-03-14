import { useState } from 'react';
import { WarningGraphic } from '@/components/ui/warning-graphic';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
  prediction: string;
  confidence: number;
  timestamp: string;
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

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      
      <div className="flex flex-col gap-4 flex-grow">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
          {label}
        </label>
        
        <div className="relative group">
          {type === 'url' ? (
            <input
              type="text"
              aria-label={label}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all group-hover:border-white/20"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          ) : (
            <textarea
              aria-label={label}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all group-hover:border-white/20"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
        </div>

        <button
          onClick={handleScan}
          disabled={loading || !input.trim()}
          className="btn-primary mt-2 w-full shadow-lg shadow-blue-900/20 group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Deep Signals...
              </>
            ) : (
              <>
                Run Advanced Scan
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="mt-8 border-t border-white/5 pt-8 flex flex-col items-center gap-6"
          >
            {isPhishing && (
              <div className="w-full flex justify-center py-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                <WarningGraphic width={300} height={100} animationSpeed={1.2} />
              </div>
            )}
            
            <div className="text-center w-full">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border",
                isPhishing 
                  ? "bg-red-500/10 text-red-500 border-red-500/30" 
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
              )}>
                <div className={cn("w-2 h-2 rounded-full animate-pulse", isPhishing ? "bg-red-500" : "bg-emerald-500")} />
                {isPhishing ? 'Severe Threat Detected' : 'Safety Verified'}
              </div>

              <h4 className={cn(
                "text-4xl font-black uppercase tracking-tighter mb-1",
                isPhishing ? "text-red-500" : "text-emerald-500"
              )}>
                {result.prediction}
              </h4>

              <p className="text-slate-400 text-sm mb-6">
                AI Confidence Analysis: <span className="text-white font-mono">{(result.confidence * 100).toFixed(1)}%</span>
              </p>

              <div className="relative w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full relative",
                    isPhishing ? "bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-gradient-to-r from-emerald-600 to-cyan-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  )}
                />
              </div>
              
              <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Blockchain Timestamp: {new Date(result.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
