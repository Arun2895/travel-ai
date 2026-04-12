import React from 'react';
import { GlobeIcon, LayersIcon, CheckIcon, ShareIcon } from './Icons';

interface WelcomeStateProps {
  userName: string;
  onSuggestion: (text: string) => void;
}

const FEATURES = [
  {
    icon: <GlobeIcon size={18} className="text-[#F4600C]" />,
    title: 'Smart Destination Search',
    desc: 'Finds real-time places, temples, parks & hidden gems near any location using live map data.',
  },
  {
    icon: <LayersIcon size={18} className="text-[#F4600C]" />,
    title: 'Hotel Intelligence',
    desc: 'Fetches budget-matched hotels with accurate pricing. Just tell it your stay location & budget.',
  },
  {
    icon: <CheckIcon size={18} className="text-[#F4600C]" />,
    title: 'Local Food Discovery',
    desc: 'Discovers authentic restaurants and street food options tailored to your cuisine preferences.',
  },
  {
    icon: <ShareIcon size={18} className="text-[#F4600C]" />,
    title: 'Full Day-by-Day Itinerary',
    desc: 'Generates a structured, ready-to-use travel plan across multiple days — morning to evening.',
  },
];

const WelcomeState: React.FC<WelcomeStateProps> = ({ userName }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
      {/* Globe icon */}
      <div className="w-20 h-20 bg-[rgba(244,96,12,0.08)] border border-[rgba(244,96,12,0.35)] rounded-full flex items-center justify-center mb-7 shadow-[0_0_40px_rgba(244,96,12,0.1)]">
        <GlobeIcon size={40} className="text-[#F4600C]" />
      </div>

      <h2 className="font-['Outfit',sans-serif] text-[28px] font-bold text-[#F5F0EB] mb-2 pb-1">
        Hey, <span className="text-[#F4600C]">{userName}</span> ✦
      </h2>
      <p className="text-[#888880] text-[15px] max-w-[360px] leading-relaxed font-light mb-10">
        Your AI-powered travel planner. Describe your trip and I'll handle everything — from hotels to hidden gems.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3 max-w-[520px] w-full">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="p-4 bg-[#0F0F0F] border border-[#1E1E1E] hover:border-[rgba(244,96,12,0.3)] rounded-2xl text-left transition-all duration-200 group hover:bg-[rgba(244,96,12,0.04)] cursor-default"
          >
            <div className="w-8 h-8 bg-[rgba(244,96,12,0.08)] rounded-lg flex items-center justify-center mb-3 group-hover:bg-[rgba(244,96,12,0.15)] transition-colors">
              {f.icon}
            </div>
            <p className="text-[13px] font-bold text-[#E0E0E0] mb-1.5 font-['Outfit',sans-serif] pb-0.5">{f.title}</p>
            <p className="text-[11.5px] text-[#666] leading-relaxed group-hover:text-[#999] transition-colors">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-[12px] text-[#666] max-w-[380px] leading-relaxed">
        Tip: Mention your destination, budget, and number of days for the most accurate plan.
      </p>
    </div>
  );
};

export default WelcomeState;

