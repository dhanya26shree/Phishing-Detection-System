import { useState } from 'react';
import { WarningGraphic } from '@/components/ui/warning-graphic';
import { cn } from '@/lib/utils';

interface ScanResult {
  prediction: string;
  confidence: number;
  timestamp: string;
}

interface ScannerCardProps {
  title: string;
  label: string;
  placeholder: string;
  type: 'url' | 'email';
  onScan: (input: string) => Promise<ScanResult>;
}

export function ScannerCard({ title, label, placeholder, type, onScan }: ScannerCardProps) {
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
    <div className="glass-card flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        {type === 'url' ? (
          <input
            type="text"
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        ) : (
          <textarea
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}
      </div>
      <button
        onClick={handleScan}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
      >
        {loading ? 'Analyzing...' : `Scan ${type.toUpperCase()}`}
      </button>

      {result && (
        <div className="mt-4 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {isPhishing && (
            <div className="w-full flex justify-center">
              <WarningGraphic width={300} height={100} animationSpeed={1.2} />
            </div>
          )}
          
          <div className="text-center">
            <h3 className={cn(
              "text-2xl font-black uppercase tracking-widest",
              isPhishing ? "text-red-500" : "text-emerald-500"
            )}>
              {result.prediction}
            </h3>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold",
              isPhishing ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50"
            )}>
              {isPhishing ? '⚠️ THREAT DETECTED' : '✅ VERIFIED SAFE'}
            </span>
            <p className="mt-2 text-slate-400">
              Confidence Score: <span className="text-white font-bold">{(result.confidence * 100).toFixed(1)}%</span>
            </p>
            <div className="mt-2 w-full bg-slate-800 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-1000",
                  isPhishing ? "bg-red-500" : "bg-emerald-500"
                )}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
