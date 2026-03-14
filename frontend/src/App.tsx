import { ScannerCard } from './components/ScannerCard'
import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:8000'

function App() {
  const [stats, setStats] = useState({ total_scanned: 0, phishing_detected: 0 })

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error('Failed to fetch stats', e)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const scanUrl = async (url: string) => {
    const res = await fetch(`${API_BASE}/predict-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    const result = await res.json()
    fetchStats()
    return result
  }

  const scanEmail = async (email_text: string) => {
    const res = await fetch(`${API_BASE}/predict-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_text })
    })
    const result = await res.json()
    fetchStats()
    return result
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-blue-500">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span className="text-2xl font-black tracking-tighter">PHISH SHIELD AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            Real-Time Phishing Detection
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Secure your digital life with advanced AI-powered threat analysis and blockchain verification.
          </p>

          <div className="flex justify-center gap-8 pt-6">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{stats.total_scanned}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-red-500">{stats.phishing_detected}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phishing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-500">Connected</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Blockchain</div>
            </div>
          </div>
        </header>

        <main className="grid md:grid-cols-2 gap-8">
          <ScannerCard
            title="Analyze URL"
            label="URL Address"
            placeholder="https://paypal-secure-verify.xyz/login"
            type="url"
            onScan={scanUrl}
          />
          <ScannerCard
            title="Analyze Email Content"
            label="Email Body"
            placeholder="Paste the suspicious email content here..."
            type="email"
            onScan={scanEmail}
          />
        </main>

        <footer className="text-center text-slate-500 text-sm pt-12 border-t border-slate-800/50">
          <p>© 2026 Phish Shield AI - Smart India Hackathon Implementation</p>
        </footer>
      </div>
    </div>
  )
}

export default App
