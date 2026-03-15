import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-4xl font-black text-red-500 mb-4 tracking-tighter uppercase">System_Crash [ERROR_500]</h1>
          <p className="text-slate-400 font-mono text-sm max-w-md">Critical runtime anomaly detected. Check kernel logs for trace details.</p>
          <button onClick={() => window.location.reload()} className="mt-8 btn-primary px-8 py-3">Attempt_Reboot</button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
