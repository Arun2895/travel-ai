import React from 'react';
import { ToolStep } from '../types';
import { LayersIcon, CheckIcon } from './Icons';

interface AgentPanelProps {
  steps: ToolStep[];
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <div className="w-[300px] bg-[#0A0A0A] border-l border-[rgba(255,255,255,0.07)] p-5 hidden lg:flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <LayersIcon size={16} className="text-[#F4600C]" />
        <h3 className="font-[Syne,sans-serif] text-sm font-semibold text-[#F5F0EB] tracking-wide">Agent Trace</h3>
      </div>

      <div className="relative border-l border-[rgba(255,255,255,0.07)] ml-2.5 pb-4 space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-6">
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center ${
              step.status === 'done' ? 'bg-[#F4600C] text-white' : 'bg-[#1C1C1C] border border-[rgba(244,96,12,0.35)]'
            }`}>
              {step.status === 'done' && <CheckIcon size={10} />}
              {step.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-[#F4600C] animate-pulse" />}
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#F5F0EB] mb-1">{step.name}</div>
              <div className="text-[11px] text-[#888880] leading-relaxed">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentPanel;
