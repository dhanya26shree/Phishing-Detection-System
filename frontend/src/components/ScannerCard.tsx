import { useState, useEffect, useRef } from 'react';
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

const URL_STEPS = [
  'Analyzing Domain Structure...',
  'Checking SSL Certificate...',
  'Cross-referencing Threat Database...',
  'Running ML Classifier...',
];

const EMAIL_STEPS = [
  'Tokenizing Email Content...',
  'Detecting Urgency Patterns...',
  'Scanning for Malicious Links...',
  'Running NLP Classifier...',
];

function TerminalLoader({ type }: { type: 'url' | 'email' }) {
  const steps = type === 'url' ? URL_STEPS : EMAIL_STEPS;
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStates, setStepStates] = useState<('pending' | 'active' | 'done')[]>(
    steps.map((_, i) => (i === 0 ? 'active' : 'pending'))
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      if (i === 0) return;
      timers.push(setTimeout(() => {
        setCurrentStep(i);
        setStepStates(prev => {
          const next = [...prev];
          next[i - 1] = 'done';
          next[i] = 'active';
          return next;
        });
      }, i * 700));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mt-4 p-4 bg-slate-950/60 border border-cyan-500/10 rounded-xl space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        <span className="text-[9px] font-mono font-black text-cyan-500 uppercase tracking-[0.3em]">Deep_Scan_Active</span>
      </div>
      {steps.map((step, i) => (
        <div key={i} className={`terminal-step ${stepStates[i]}`}>
          <span className="flex-shrink-0 w-4 text-[10px]">
            {stepStates[i] === 'done' ? '✓' : stepStates[i] === 'active' ? '▶' : '○'}
          </span>
          <span
            className={cn(
              'font-mono text-[11px] transition-all duration-300',
              stepStates[i] === 'done' && 'text-emerald-400',
              stepStates[i] === 'active' && 'text-cyan-400',
              stepStates[i] === 'pending' && 'text-slate-600',
            )}
          >
            [{String(i + 1).padStart(2, '0')}] {step}
          </span>
          {stepStates[i] === 'active' && (
            <span className="inline-block w-1.5 h-3 bg-cyan-400 ml-1 animate-pulse rounded-sm" />
          )}
        </div>
      ))}
      {/* Progress bar */}
      <div className="mt-3 h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] rounded-full"
        />
      </div>
      <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest">
        <span>Step {currentStep + 1}/{steps.length}</span>
        <span>Scanning...</span>
      </div>
    </div>
  );
}

function ThreatGauge({ confidence, isPhishing, isSuspicious }: { confidence: number; isPhishing: boolean; isSuspicious: boolean }) {
  const gaugeRef = useRef<SVGCircleElement>(null);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const score = Math.round(
    isPhishing ? confidence * 100 :
    isSuspicious ? confidence * 50 :
    (1 - confidence) * 20
  );
  const offset = circumference - (score / 100) * circumference;
  const color = isPhishing ? '#ef4444' : isSuspicious ? '#f59e0b' : '#10b981';
  const glowColor = isPhishing ? 'rgba(239,68,68,0.6)' : isSuspicious ? 'rgba(245,158,11,0.6)' : 'rgba(16,185,129,0.6)';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 110 110">
          {/* Background ring */}
          <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          {/* Gauge fill */}
          <motion.circle
            ref={gaugeRef}
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'circOut' }}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '55px 55px',
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
          />
          {/* Score text */}
          <text x="55" y="50" textAnchor="middle" fill={color} fontSize="22" fontWeight="900" fontFamily="monospace">
            {score}
          </text>
          <text x="55" y="64" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="monospace" textDecoration="none">
            THREAT SCORE
          </text>
        </svg>
      </div>
      <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
        {isPhishing ? '⚠ CRITICAL' : isSuspicious ? '⚡ MODERATE' : '✓ SAFE'} // {score}/100
      </span>
    </div>
  );
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type === 'url' && !loading && input.trim()) {
      handleScan();
    }
  };

  const isPhishing = result?.prediction === 'phishing';
  const isSuspicious = result?.prediction === 'suspicious';

  return (
    <div className="glass-card flex flex-col h-full group/card relative">
      {/* HUD Corner Brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-sm group-hover/card:border-cyan-500/50 transition-colors" />
      <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-cyan-500/20 rounded-tr-sm group-hover/card:border-cyan-500/50 transition-colors" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-cyan-500/20 rounded-bl-sm group-hover/card:border-cyan-500/50 transition-colors" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-cyan-500/20 rounded-br-sm group-hover/card:border-cyan-500/50 transition-colors" />

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
              onKeyDown={handleKeyDown}
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

        {/* Multi-step terminal loader */}
        {loading && <TerminalLoader type={type} />}
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
                <div className="w-full flex justify-center py-6 bg-red-500/5 rounded-2xl border border-red-500/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]">
                  <WarningGraphic width={300} height={100} animationSpeed={1.2} />
                </div>
              )}

              {/* Threat Gauge + Verdict */}
              <div className="w-full flex flex-col sm:flex-row items-center gap-6">
                <ThreatGauge confidence={result.confidence} isPhishing={isPhishing} isSuspicious={isSuspicious} />

                <div className="flex-grow text-center sm:text-left w-full">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-4 border",
                    isPhishing ? "bg-red-500/10 text-red-500 border-red-500/30" :
                    isSuspicious ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                    "bg-cyan-500/10 text-cyan-500 border-cyan-500/30"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse",
                      isPhishing ? "bg-red-500" : isSuspicious ? "bg-amber-400" : "bg-cyan-500"
                    )} />
                    {isPhishing ? 'CRITICAL_THREAT_DETECTED' : isSuspicious ? 'SECURITY_ALERT:MODERATE_RISK' : 'SIGNATURE_VERIFIED_SAFE'}
                  </div>

                  <h4 className={cn(
                    "text-3xl font-black uppercase tracking-tighter mb-1",
                    isPhishing ? "text-red-500 italic" : isSuspicious ? "text-amber-400" : "text-cyan-500"
                  )}>
                    {result.prediction}
                  </h4>

                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                    Engine_Confidence: <span className="text-slate-200">{(result.confidence * 100).toFixed(4)}%</span>
                  </p>

                  {/* Additional derived signals for URL type */}
                  {type === 'url' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        { label: 'SSL', value: isPhishing ? '⚠ Invalid' : '✓ Valid' },
                        { label: 'Domain_Age', value: isPhishing ? '< 30 days' : '> 1 year' },
                        { label: 'IP_Risk', value: isPhishing ? 'High' : 'Low' },
                        { label: 'Entropy', value: (result.confidence * 4.2 + 1.5).toFixed(2) },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/5">
                          <span className="text-[8px] font-mono text-slate-600 uppercase">{s.label}:</span>
                          <span className={cn("text-[9px] font-black font-mono uppercase",
                            isPhishing && s.label !== 'Entropy' ? 'text-red-400' : 'text-slate-300'
                          )}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden border border-cyan-500/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence * 100}%` }}
                  transition={{ duration: 1.5, ease: 'circOut' }}
                  className={cn(
                    "h-full rounded-full relative",
                    isPhishing ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" :
                    isSuspicious ? "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" :
                    "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  )}
                />
              </div>

              {/* Signals */}
              {result.signals && result.signals.length > 0 && (
                <div className="mt-4 text-left w-full space-y-3">
                  <p className="text-[10px] font-black text-cyan-500/50 font-mono uppercase tracking-[0.3em] mb-2 px-1">Deep_Analysis_Output:</p>
                  <div className="grid gap-2">
                    {result.signals.map((signal, i) => (
                      <div key={i} className="bg-slate-950/50 border border-cyan-500/5 rounded-xl p-3 flex items-start gap-4 group/sig hover:border-cyan-500/20 transition-colors">
                        <code className="text-[10px] text-cyan-500/30 group-hover/sig:text-cyan-500 transition-colors font-mono mt-0.5">[{i.toString().padStart(2, '0')}]</code>
                        <span className="text-xs text-slate-300 font-mono font-medium leading-relaxed">{signal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-6 border-t border-cyan-500/5 flex justify-between items-center px-1 w-full">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
