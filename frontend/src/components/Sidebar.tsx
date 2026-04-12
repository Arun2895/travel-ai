import React, { useState, useEffect } from 'react';
import { GlobeIcon, PlusIcon, SettingsIcon, CheckIcon, LayersIcon } from './Icons';

interface SidebarProps {
  onNewChat: () => void;
  onLogout: () => void;
  userName: string;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onLogout, userName, userEmail }) => {
  const [time, setTime] = useState('--:--');
  const [showSettings, setShowSettings] = useState(false);
  const [timezone, setTimezone] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch timezone based on IP
    fetch('http://ip-api.com/json')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTimezone(data.timezone);
        }
      })
      .catch(err => console.error('Timezone fetch failed:', err));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: timezone 
      };
      setTime(new Date().toLocaleTimeString('en-US', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, [timezone]);

  return (
    <div className="w-[280px] bg-[#0A0A0A] border-r border-[#1a1a1a] flex flex-col h-full shrink-0 relative overflow-hidden group">
      {/* Background abstract shape */}
      <div className="absolute top-0 left-[-50%] w-[200%] h-[500px] bg-[radial-gradient(ellipse_at_top_left,rgba(244,96,12,0.06),transparent_50%)] pointer-events-none group-hover:bg-[radial-gradient(ellipse_at_top_left,rgba(244,96,12,0.1),transparent_50%)] transition-colors duration-1000" />
      
      <div className="p-6 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 cursor-pointer">
          <div className="w-9 h-9 bg-[#F4600C] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(244,96,12,0.4)]">
            <GlobeIcon size={18} className="text-white" />
          </div>
          <div className="flex items-center font-['Outfit',sans-serif] text-[22px] font-bold tracking-tight pb-1">
            <span className="text-[#F5F0EB]">Travel</span>
            <span className="text-[#F4600C]">Guide</span>
          </div>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full relative overflow-hidden group/btn flex items-center justify-between px-4 py-3.5 bg-gradient-to-br from-[#1A1A1A] to-[#131313] hover:from-[#242424] hover:to-[#1C1C1C] border border-[#2A2A2A] hover:border-[#F4600C] rounded-2xl text-[#F5F0EB] text-[15px] font-semibold transition-all duration-300 hover:shadow-[0_4px_20px_rgba(244,96,12,0.15)] hover:-translate-y-0.5"
        >
          <span className="relative z-10">Start New Journey</span>
          <div className="relative z-10 w-7 h-7 bg-[rgba(244,96,12,0.1)] rounded-full flex items-center justify-center group-hover/btn:bg-[#F4600C] transition-colors duration-300">
            <PlusIcon size={14} className="text-[#F4600C] group-hover/btn:text-white transition-colors duration-300" />
          </div>
        </button>
      </div>

      {/* Interactive Hub Widgets */}
      <div className="flex-1 px-6 py-2 flex flex-col gap-6 relative z-10 overflow-y-auto custom-scrollbar">
        
        {/* Widget 1: System Status */}
        <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-[#1A1A1A] hover:border-[#333] transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[rgba(244,96,12,0.03)] rounded-full" />
          <h4 className="text-[11px] font-bold text-[#888880] uppercase tracking-[0.1em] mb-4 flex items-center gap-2 font-['DM_Sans',sans-serif] pb-0.5">
            <LayersIcon size={12} className="text-[#F4600C]" /> Node Orbit
          </h4>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-[10px] text-[#555] mb-1">Local Time</div>
              <div className="text-sm text-[#E0E0E0] font-mono">{time}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#555] mb-1">Status</div>
              <div className="text-xs text-[#4BB543] font-medium flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4BB543] animate-pulse" /> Online
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Data Sources */}
        <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-[#1A1A1A] hover:border-[#333] transition-colors">
          <h4 className="text-[11px] font-bold text-[#888880] uppercase tracking-[0.1em] mb-4 font-['DM_Sans',sans-serif] pb-0.5">Live Interfaces</h4>
          <div className="space-y-3">
            {[
              { name: 'Places API', val: 'Connected' },
              { name: 'Hotels Graph', val: 'Synchronized' },
              { name: 'Food Network', val: 'Active' }
            ].map((ext, i) => (
              <div key={i} className="flex items-center justify-between group/ext cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-[#555550]' : 'bg-[#F4600C]'} group-hover/ext:scale-150 transition-transform`} />
                  <span className="text-[12px] text-[#A0A0A0] group-hover/ext:text-white transition-colors">{ext.name}</span>
                </div>
                <CheckIcon size={12} className="text-[#333] group-hover/ext:text-[#F4600C] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 relative z-10 w-full">
        {showSettings && (
          <div className="absolute bottom-[80px] left-6 right-6 bg-[#1A1A1A] border border-[#333] shadow-2xl rounded-2xl p-4 z-50">
            <div className="text-[14px] font-bold text-white mb-1">{userName}</div>
            <div className="text-[12px] text-[#888] break-all mb-4">{userEmail || 'guest@travelguide.com'}</div>
            <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
              <button
                onClick={() => { setShowSettings(false); onLogout(); }}
                className="text-[12px] font-semibold text-[#F4600C] hover:text-white transition-colors uppercase tracking-wider"
              >
                Log out
              </button>
              <button onClick={() => setShowSettings(false)} className="text-[11px] uppercase tracking-wider text-[#555] hover:text-white transition-colors">Close</button>
            </div>
          </div>
        )}
        <button onClick={() => setShowSettings(!showSettings)} className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-[#131313] border border-transparent hover:border-[#222] transition-all group/profile relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F4600C] to-[#FF9800] p-[2px]">
            <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#F5F0EB] text-[13px] font-bold">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <div className="text-[14px] text-[#F5F0EB] font-bold tracking-wide group-hover/profile:text-[#F4600C] transition-colors truncate">{userName}</div>
            <div className="text-[11px] text-[#888880] uppercase tracking-wider mt-0.5 truncate">Explorer</div>
          </div>
          <SettingsIcon size={16} className={`text-[#555] group-hover/profile:text-[#F5F0EB] transition-all duration-500 shrink-0 ${showSettings ? 'rotate-90 text-[#F5F0EB]' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
