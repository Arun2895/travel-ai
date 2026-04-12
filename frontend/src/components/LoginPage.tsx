import React, { useState } from 'react';
import { GlobeIcon } from './Icons';

interface LoginPageProps {
  onLogin: (userName: string, email: string) => void;
  onGuest: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuest }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    setError('');
    onLogin(userName.trim(), email.trim());
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center z-50">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[20%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(244,96,12,0.12)_0%,transparent_65%)]" />
        <div className="absolute -bottom-[20%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(244,96,12,0.07)_0%,transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative w-[420px] bg-[#131313] border border-[rgba(244,96,12,0.35)] rounded-3xl px-11 py-12 shadow-[0_0_80px_rgba(244,96,12,0.08)]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-[#F4600C] rounded-[10px] flex items-center justify-center">
            <GlobeIcon size={18} className="text-white" />
          </div>
          <span className="font-[Syne,sans-serif] text-xl font-bold tracking-tight text-[#F5F0EB]">
            Travel<span className="text-[#F4600C]">Guide</span>
          </span>
        </div>

        <h1 className="font-[Syne,sans-serif] text-3xl font-bold leading-tight text-[#F5F0EB] mb-2">
          Welcome back.
        </h1>
        <p className="text-[#888880] text-sm mb-9 font-light">
          Your AI travel companion awaits.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-4 relative group">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder=" "
              className="peer w-full bg-[#1C1C1C] border border-[rgba(255,255,255,0.07)] rounded-[12px] px-5 pt-[22px] pb-[10px] text-[#F5F0EB] text-[15px] font-medium outline-none focus:border-[rgba(244,96,12,0.6)] focus:shadow-[0_0_20px_rgba(244,96,12,0.15)] focus:bg-[#242424] transition-all duration-300"
            />
            <label className="absolute left-5 top-[16px] text-sm text-[#888880] font-light transition-all duration-300 peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-sm peer-focus:top-[6px] peer-focus:text-[10px] peer-focus:text-[#F4600C] peer-focus:font-semibold peer-focus:tracking-widest uppercase peer-[:not(:placeholder-shown)]:top-[6px] peer-[:not(:placeholder-shown)]:-translate-y-0.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#F4600C] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-widest pointer-events-none">
              Your Name
            </label>
          </div>

          {/* Email */}
          <div className="mb-6 relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full bg-[#1C1C1C] border border-[rgba(255,255,255,0.07)] rounded-[12px] px-5 pt-[22px] pb-[10px] text-[#F5F0EB] text-[15px] font-medium outline-none focus:border-[rgba(244,96,12,0.6)] focus:shadow-[0_0_20px_rgba(244,96,12,0.15)] focus:bg-[#242424] transition-all duration-300"
            />
            <label className="absolute left-5 top-[16px] text-sm text-[#888880] font-light transition-all duration-300 peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-sm peer-focus:top-[6px] peer-focus:text-[10px] peer-focus:text-[#F4600C] peer-focus:font-semibold peer-focus:tracking-widest uppercase peer-[:not(:placeholder-shown)]:top-[6px] peer-[:not(:placeholder-shown)]:-translate-y-0.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#F4600C] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-widest pointer-events-none">
              Mail ID
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-[10px] px-4 py-3 text-[13px] text-red-400 animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full relative overflow-hidden group py-[16px] bg-[#F4600C] text-white font-[Syne,sans-serif] text-[16px] font-bold rounded-[12px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,96,12,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <span className="relative z-10 tracking-wide">Enter the Gateway</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent translate-x-[-150%] skew-x-[-20deg] group-hover:animate-[shine_1s_ease-out_forwards]" />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 text-[#555550] text-xs">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
          or
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
        </div>

        <button
          onClick={onGuest}
          className="w-full py-[14px] bg-transparent border border-[rgba(244,96,12,0.5)] hover:bg-[#F4600C]/10 text-[#F4600C] hover:text-white font-[Syne,sans-serif] text-[15px] font-semibold rounded-[12px] transition-all duration-300 active:scale-[0.98]"
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
