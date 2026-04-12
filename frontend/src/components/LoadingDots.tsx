import React from 'react';

export const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-6 py-4">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="flex bg-[#131313] border border-[rgba(255,255,255,0.07)] px-4 py-3 rounded-[16px_16px_16px_4px] items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[#F4600C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-[#F4600C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-[#F4600C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingDots;
