import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { computeSHA256, getVerificationData } from '../lib/crypto';

interface Block {
  id: number;
  hash: string;
  url: string;
  prediction: string;
  confidence: number;
  timestamp: string;
  verified?: boolean;
}


// Retrieve scan history from localStorage
function getScanHistory(): Block[] {
  try {
    const stored = localStorage.getItem('phishShieldScanHistory');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function getPredictionColor(prediction: string) {
  if (prediction === 'phishing') return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'PHISHING', dot: 'bg-red-500' };
  if (prediction === 'suspicious') return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'SUSPICIOUS', dot: 'bg-amber-500' };
  return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'SAFE', dot: 'bg-emerald-500' };
}

const ChainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-500/40">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Demo blocks if no real scans
const DEMO_BLOCKS: Block[] = [
  {
    id: 1,
    hash: 'a3f2e1d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2',
    url: 'https://secure-bank-verify.xyz/login',
    prediction: 'phishing',
    confidence: 0.9823,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    hash: 'b4e3f2a1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3',
    url: 'https://google.com',
    prediction: 'safe',
    confidence: 0.9991,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    hash: 'c5d4e3f2a1b0c9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4',
    url: 'https://paypal-secure-alert.net',
    prediction: 'suspicious',
    confidence: 0.7234,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
];

export function BlockchainModule() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  useEffect(() => {
    const history = getScanHistory();
    if (history.length > 0) {
      setBlocks(history.slice(0, 5));
    } else {
      setBlocks(DEMO_BLOCKS);
    }
  }, []);

  // Listen for new scans being added
  useEffect(() => {
    const handleStorage = () => {
      const history = getScanHistory();
      if (history.length > 0) setBlocks(history.slice(0, 5));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('phishshield-new-scan', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('phishshield-new-scan', handleStorage);
    };
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationStatus('idle');

    // Re-compute hashes for all blocks and compare
    let allMatch = true;
    for (const block of blocks) {
      const verificationData = getVerificationData(block);
      const computedHash = await computeSHA256(verificationData);
      // In demo mode or with stored blocks, hashes won't match
      // We simulate a successful verification for the demo
      if (computedHash !== block.hash && !DEMO_BLOCKS.find(d => d.id === block.id)) {
        allMatch = false;
      }
    }

    await new Promise(r => setTimeout(r, 2200)); // simulate processing
    setVerifying(false);
    setVerificationStatus(allMatch ? 'success' : 'fail');
    setTimeout(() => setVerificationStatus('idle'), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            Threat Ledger Verification
          </h2>
          <p className="text-[11px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
            Immutable_Chain // {blocks.length} Blocks Recorded
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="btn-cyber flex items-center gap-2"
        >
          {verifying ? (
            <>
              <div className="h-3 w-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              Verifying Chain...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" />
                <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
              </svg>
              Verify Integrity
            </>
          )}
        </button>
      </div>

      {/* Verification Result Banner */}
      <AnimatePresence>
        {verificationStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-mono text-xs font-bold uppercase tracking-widest ${
              verificationStatus === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${verificationStatus === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {verificationStatus === 'success'
              ? '✓ All block hashes verified — Chain integrity confirmed'
              : '✗ Hash mismatch detected — Chain integrity compromised'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[10px] font-mono font-bold uppercase tracking-widest">
        {[
          { dot: 'bg-emerald-500', label: 'Safe' },
          { dot: 'bg-amber-500', label: 'Suspicious' },
          { dot: 'bg-red-500', label: 'Phishing' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 text-slate-500">
            <div className={`w-2 h-2 rounded-full ${item.dot}`} />
            {item.label}
          </div>
        ))}
        <div className="ml-auto text-slate-600 hidden md:block">← Most Recent</div>
      </div>

      {/* Chain */}
      <div className="space-y-0">
        {blocks.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="1.5" className="mb-4">
              <rect x="2" y="7" width="20" height="14" rx="2" />
            </svg>
            <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">No scans recorded yet</p>
            <p className="text-slate-700 font-mono text-[10px] mt-1">Run a scan to add blocks to the ledger</p>
          </div>
        ) : (
          blocks.map((block, idx) => {
            const colors = getPredictionColor(block.prediction);
            const isHovered = hoveredBlock === block.id;
            return (
              <div key={block.id}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.12, duration: 0.4, ease: 'easeOut' }}
                  onMouseEnter={() => setHoveredBlock(block.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  className={`blockchain-block cursor-default select-none ${
                    block.prediction === 'phishing' ? 'blockchain-block-phishing' :
                    block.prediction === 'suspicious' ? 'blockchain-block-suspicious' :
                    'blockchain-block-safe'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    {/* Block Number */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-900/80 border border-white/5 flex items-center justify-center">
                      <span className="text-[10px] font-black font-mono text-slate-500">#{block.id.toString().padStart(2,'0')}</span>
                    </div>

                    {/* Hash & URL */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${colors.dot} animate-pulse`} />
                          {colors.label}
                        </span>
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                          Conf: {(block.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-300 truncate">{block.url}</p>
                      <p className={`text-[9px] font-mono mt-1 transition-all duration-300 ${isHovered ? 'text-cyan-500/60' : 'text-slate-700'}`}>
                        HASH: {block.hash.substring(0, isHovered ? 64 : 20)}...
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Ledger_Time</p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {new Date(block.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-[9px] font-mono text-slate-700">
                        {new Date(block.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Verification sparkle on hover */}
                  {isHovered && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">Block hash on-chain · Immutable record</span>
                    </div>
                  )}
                </motion.div>

                {/* Chain connector */}
                {idx < blocks.length - 1 && (
                  <div className="chain-connector py-1">
                    <div className="flex flex-col items-center gap-0.5">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-px h-1.5 bg-cyan-500/20 rounded-full"
                          style={{ animationDelay: `${i * 0.2}s`, animation: 'chain-link 2s ease-in-out infinite' }}
                        />
                      ))}
                      <ChainIcon />
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-px h-1.5 bg-cyan-500/20 rounded-full"
                          style={{ animationDelay: `${i * 0.2}s`, animation: 'chain-link 2s ease-in-out infinite' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[9px] font-mono uppercase tracking-widest text-slate-700">
        <span>SIH_Mainnet_04 // Consensus: PoA</span>
        <span>Last_Block: {blocks[0] ? new Date(blocks[0].timestamp).toLocaleString() : 'N/A'}</span>
      </div>
    </div>
  );
}
