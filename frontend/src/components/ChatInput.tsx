import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-6 pb-5 pt-3 bg-[#0A0A0A] sticky bottom-0 relative z-10">
      <div className="max-w-[720px] mx-auto">
        <div className="relative flex items-end bg-[#111111] border border-[#222] rounded-2xl px-4 py-2 focus-within:border-[#F4600C] focus-within:shadow-[0_0_20px_rgba(244,96,12,0.1)] transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Describe your dream trip..."
            className="flex-1 bg-transparent text-[15px] font-light text-[#F5F0EB] placeholder-[#555] outline-none resize-none py-2 pr-12 leading-relaxed disabled:opacity-40"
            rows={1}
            style={{ minHeight: '28px', maxHeight: '160px' }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="absolute right-3 bottom-2.5 p-2 bg-[#F4600C] hover:bg-[#C44D08] disabled:bg-[#222] text-white disabled:text-[#555] rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(244,96,12,0.25)] disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0"
          >
            <SendIcon size={16} />
          </button>
        </div>
        <div className="text-center mt-2.5 text-[10px] text-[#444]">
          AI may produce inaccurate information. Always double-check hotel and restaurant prices.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
