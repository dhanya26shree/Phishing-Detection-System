import * as React from 'react'
import { useState } from 'react'

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  [key: string]: any;
}

const AppInput = (props: InputProps) => {
  const { label, placeholder, icon, ...rest } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="w-full min-w-[200px] relative">
      { label && 
        <label className='block mb-2 text-sm text-slate-400 font-mono'>
          {label}
        </label>
      }
      <div className="relative w-full">
        <input
          className="peer relative z-10 border-2 border-[var(--color-border)] h-12 w-full rounded-md bg-[var(--color-surface)] px-4 font-mono text-white outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] focus:border-cyan-500/50 placeholder:text-slate-600"
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const LoginPage = (props: LoginPageProps) => {
  const { onBack, onLogin } = props;
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const leftSection = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - leftSection.left,
      y: e.clientY - leftSection.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

   const socialIcons = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>,
      href: '#',
      gradient: 'bg-[var(--color-bg)]',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/></svg>,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z"/></svg>,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 selection:bg-cyan-500/30">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      <div className='relative z-10 w-full max-w-4xl flex flex-col md:flex-row shadow-2xl shadow-cyan-900/20 rounded-3xl overflow-hidden glass-container border border-cyan-500/10 min-h-[600px]'>
        <div
          className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-slate-950/80'
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
            <div
              className={`absolute pointer-events-none w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl transition-opacity duration-500 ${
                isHovering ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                left: mousePosition.x - 200,
                top: mousePosition.y - 200,
              }}
            />
            
            <div className="z-10 w-full">
              <div className='text-center mb-8'>
                <h1 className='text-4xl font-black text-white tracking-tighter mb-4 uppercase'>System_Auth</h1>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {socialIcons.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-slate-900 rounded-full flex justify-center items-center border border-white/10 hover:border-cyan-500 transition-all text-slate-400 hover:text-cyan-400 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-cyan-500/5 group-hover:scale-100 scale-0 transition-transform" />
                      {social.icon}
                    </a>
                  ))}
                </div>
                <span className='text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest'>Secure Session Authorization Required</span>
              </div>

              <form className='grid gap-6' onSubmit={(e) => e.preventDefault()}>
                <div className='grid gap-4'>
                  <AppInput label="Credential_ID" placeholder="admin@phishshield.ai" type="email" />
                  <AppInput label="Access_Key" placeholder="••••••••" type="password" />
                </div>
                
                <div className='flex justify-between items-center'>
                  <a href="#" className='text-[10px] font-mono font-bold text-slate-600 hover:text-cyan-500 transition-colors uppercase'>Key_Recovery?</a>
                </div>

                <div className='pt-2'>
                  <button 
                    type="submit"
                    onClick={onLogin}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-cyan-900/40 active:scale-[0.98] border border-white/10 group overflow-hidden relative"
                  >
                    <span className="relative z-10">Initialize_Access</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={onBack}
                    className="text-[10px] font-mono font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest"
                  >
                    {"<< Return_to_Frontline"}
                  </button>
                </div>
              </form>
            </div>
        </div>

        <div className='hidden md:block w-1/2 relative overflow-hidden'>
          <img
            src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000'
            alt="Security Infrastructure"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity hover:scale-110 transition-transform duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-12 pointer-events-none">
            <div className="space-y-4">
               <div className="h-px w-12 bg-cyan-500" />
               <p className="text-xs font-mono text-cyan-400/80 leading-relaxed uppercase tracking-tighter">
                 Encryption Status: AES-256-GCM<br />
                 Node Location: SIH_CLUSTER_B<br />
                 Latency: 24ms
               </p>
               <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">
                 Unified Threat <br />Command.
               </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
