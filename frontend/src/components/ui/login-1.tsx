'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
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
        <label className='block mb-2 text-sm text-slate-400 font-mono uppercase tracking-widest'>
          {label}
        </label>
      }
      <div className="relative w-full">
        <input
          className="peer relative z-10 border border-cyan-500/20 h-12 w-full rounded-xl bg-slate-950/50 px-4 font-mono text-sm text-white outline-none transition-all duration-300 focus:bg-slate-950 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 placeholder:text-slate-700"
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[1px] z-20 rounded-t-xl overflow-hidden shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 0px, rgba(34,211,238,0.8) 0%, transparent 80%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[1px] z-20 rounded-b-xl overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 1px, rgba(34,211,238,0.4) 0%, transparent 80%)`,
              }}
            />
          </>
        )}
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-slate-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [step, setStep] = useState<'credentials' | 'sending' | 'otp' | 'authenticating'>('credentials');
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const leftSection = e.currentTarget.getBoundingClientRect();
    if (leftSection) {
      setMousePosition({
        x: e.clientX - leftSection.left,
        y: e.clientY - leftSection.top
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const socialIcons = [
    {
      name: 'Google',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.73-3.21 2.73c-2.13 0-3.84-1.83-3.84-4.08s1.71-4.08 3.84-4.08c.99 0 1.92.39 2.61 1.05l2.07-2.07C18.66 6.03 16.59 5 14.49 5c-3.9 0-7.05 3.15-7.05 7.05s3.15 7.05 7.05 7.05c3.6 0 6.66-2.58 6.99-6.03v-2.07z"/></svg>,
      href: '#',
      gradient: 'bg-red-500/20',
    },
    {
      name: 'Instagram',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>,
      href: '#',
      gradient: 'bg-pink-500/20',
    },
    {
      name: 'LinkedIn',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/></svg>,
      href: '#',
      bg: 'bg-blue-500/20',
    },
    {
      name: 'Facebook',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z"/></svg>,
      href: '#',
      bg: 'bg-cyan-500/20',
    }
  ];

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sending');
    
    // Simulate sending email
    setTimeout(() => {
      setStep('otp');
      setNotification('Authentication code sent: 123456');
      console.log("[SYSTEM] Dev Mode: OTP is 123456");
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setStep('authenticating');
      setTimeout(onLogin, 1500);
    } else {
      setNotification('Invalid Code. Hint: 123456');
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] bg-cyan-500/20 border border-cyan-500/50 backdrop-blur-md px-6 py-3 rounded-full text-cyan-400 font-mono text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background patterns */}
      <div className="absolute inset-0 cyber-grid-animated opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
      
      <div className='card w-full max-w-5xl flex flex-col lg:flex-row bg-slate-950/80 border border-cyan-500/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl relative z-10 h-[600px]'>
        <div
          className='w-full lg:w-1/2 px-8 lg:px-16 flex flex-col justify-center relative overflow-hidden h-full border-r border-cyan-500/5'
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`absolute pointer-events-none w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-full blur-[100px] transition-opacity duration-500 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          
          <div className="form-container relative z-10 w-full">
            <AnimatePresence mode="wait">
              {step === 'credentials' && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form className='grid gap-6' onSubmit={handleCredentialsSubmit}>
                    <div className='grid gap-2 mb-2'>
                      <h1 className='text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic'>PHISH<span className="text-cyan-500">SHIELD</span></h1>
                      <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Core_System_Auth_Required</p>
                      
                      <div className="social-container mt-6">
                        <div className="flex items-center gap-4">
                          <ul className="flex gap-3">
                            {socialIcons.map((social, index) => (
                              <li key={index} className="list-none">
                                <a
                                  href={social.href}
                                  title={social.name}
                                  className={`w-10 h-10 bg-slate-900 border border-cyan-500/20 rounded-xl flex justify-center items-center relative z-[1] overflow-hidden group transition-all hover:border-cyan-500/50`}
                                >
                                  <div
                                    className={`absolute inset-0 w-full h-full ${
                                      social.gradient || social.bg
                                    } scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100`}
                                  />
                                  <span className="text-white transition-all duration-500 ease-in-out z-[2] group-hover:rotate-[360deg]">
                                    {social.icon}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                          <span className='text-[10px] font-mono text-slate-600 uppercase tracking-widest'>Secure_Providers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className='grid gap-4 items-center'>
                      <AppInput placeholder="Operator_ID / Email" type="email" required />
                      <AppInput placeholder="Access_Key / Password" type="password" required />
                    </div>

                    <div className='flex pt-4'>
                      <button 
                        type="submit"
                        className="group/button relative w-full h-14 flex justify-center items-center overflow-hidden rounded-xl bg-cyan-600 px-8 font-black text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] shadow-lg shadow-cyan-900/20 border border-white/10"
                      >
                        <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em]">Authorize_Access</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover/button:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'sending' && (
                <motion.div
                  key="sending"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-6"
                >
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-cyan-500 rounded-full animate-spin" />
                  </div>
                  <p className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em] animate-pulse">Dispatching_Identity_Token...</p>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form className='grid gap-8' onSubmit={handleOtpSubmit}>
                    <div className='text-center space-y-2'>
                        <h2 className='text-2xl font-black text-white uppercase italic tracking-wider'>Identity Verification</h2>
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Enter_Auth_Code_Sent_To_Email</p>
                    </div>

                    <div className="flex justify-center">
                        <input
                            type="text"
                            maxLength={6}
                            required
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full max-w-[280px] bg-slate-950 border border-cyan-500/30 rounded-2xl p-6 text-4xl text-center font-mono font-black text-cyan-400 tracking-[0.4em] focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-900 shadow-inner shadow-cyan-950/50"
                            placeholder="000000"
                        />
                    </div>

                    <div className="grid gap-3">
                        <button 
                            type="submit"
                            className="group/button relative w-full h-14 flex justify-center items-center overflow-hidden rounded-xl bg-cyan-600 px-8 font-black text-white transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-900/20"
                        >
                            <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em]">Verify_Token</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover/button:opacity-100 transition-opacity" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => setStep('credentials')}
                            className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors"
                        >
                            Return_To_Gateway
                        </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'authenticating' && (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-6"
                >
                  <div className="relative w-24 h-24">
                     <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full" />
                     <div className="absolute inset-0 border-4 border-t-cyan-500 border-l-blue-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }} />
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.4em] animate-pulse font-black">Initializing_Secure_Session...</p>
                    <p className="font-mono text-[8px] text-slate-600 uppercase tracking-widest">Neural_Sync_Enabled</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className='hidden lg:block w-1/2 right h-full overflow-hidden relative group/hero'>
          <img
            src='https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt="Security Visualization"
            className="w-full h-full object-cover transition-transform duration-700 group-hover/hero:scale-110 opacity-40 grayscale group-hover/hero:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#020617]/50 to-slate-950/80 pointer-events-none" />
          
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <div className="p-1 px-3 bg-cyan-500/10 border border-cyan-500/20 rounded-md inline-block mb-3">
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Live_System_Proctor_v4.2</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tighter uppercase italic drop-shadow-2xl">
              Neural <br /> Protection <br /> <span className="text-cyan-500 italic">Interface</span>
            </h2>
            <div className="mt-6 flex items-center gap-4 ">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      C{i}
                    </div>
                 ))}
               </div>
               <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active_Nodes: 4,129</span>
            </div>
          </div>
          
          <div className="absolute top-12 right-12 text-right">
             <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1">Encrypted_Tunnel</div>
             <div className="text-[10px] font-bold font-mono text-cyan-500 tracking-tighter uppercase">0xFD...2A91</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
