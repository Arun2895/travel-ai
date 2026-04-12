import React from 'react';
import { Message } from '../types';
import { GlobeIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

/** Parse markdown into React nodes: bold, bullets, headers, tables, hr, line breaks */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="border-[#1E1E1E] my-4" />);
      i++;
      continue;
    }

    // Markdown table detection
    if (line.includes('|') && i + 1 < lines.length && /^\|[\s\-:|]+\|/.test(lines[i + 1].trim())) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(renderTable(tableLines, elements.length));
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-[14px] font-bold text-[#F4600C] mt-4 mb-2 font-['Outfit',sans-serif] pb-0.5">{inlineFormat(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-[15px] font-bold text-[#F4600C] mt-4 mb-2 font-['Outfit',sans-serif] pb-0.5">{inlineFormat(line.slice(3))}</h2>);
      i++;
      continue;
    }

    // Bullet points (-, *, •)
    if (/^[\s]*[-*•]/.test(line)) {
      const indent = line.search(/\S/);
      const content = line.replace(/^[\s]*[-*•]\s*/, '');
      elements.push(
        <div key={i} className={`flex gap-2 ${indent > 2 ? 'ml-4' : ''} mb-1.5`}>
          <span className="text-[13px] text-[#C0C0B8] leading-relaxed">{inlineFormat(content)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // Italic disclaimer line
    if (line.startsWith('_') && line.endsWith('_')) {
      elements.push(<p key={i} className="text-[11px] text-[#555] italic mt-3">{line.slice(1, -1)}</p>);
      i++;
      continue;
    }

    // Regular paragraph or styled section names
    if (line.includes(' — ')) {
      const [name, ...rest] = line.split(' — ');
      elements.push(
        <p key={i} className="text-[13px] text-[#C0C0B8] leading-relaxed mb-1.5">
          <span className="text-[#F4600C] font-bold">{inlineFormat(name)}</span> 
          <span className="text-[#888880]"> — </span>
          {inlineFormat(rest.join(' — '))}
        </p>
      );
    } else if (/^[🏨🗺️🍽️📅💡]/.test(line.trim())) {
      // Color section titles starting with specific emojis orange
      elements.push(<p key={i} className="text-[15px] font-bold text-[#F4600C] mt-4 mb-2 font-['Outfit',sans-serif] pb-0.5">{inlineFormat(line)}</p>);
    } else {
      elements.push(<p key={i} className="text-[13px] text-[#C0C0B8] leading-relaxed mb-1.5">{inlineFormat(line)}</p>);
    }
    i++;
  }

  return <>{elements}</>;
}

/** Render a markdown table */
function renderTable(lines: string[], keyBase: number): React.ReactNode {
  const parseRow = (row: string) =>
    row.split('|').map(c => c.trim()).filter(Boolean);

  const headers = parseRow(lines[0]);
  // skip separator line (index 1)
  const bodyRows = lines.slice(2).map(parseRow);

  return (
    <div key={`table-${keyBase}`} className="overflow-x-auto my-3 rounded-xl border border-[#1E1E1E]">
      <table className="w-full text-[12px] border-collapse">
        <thead>
          <tr className="bg-[#161616]">
            {headers.map((h, j) => (
              <th key={j} className="px-3 py-2.5 text-left text-[#F4600C] font-semibold border-b border-[#1E1E1E] whitespace-nowrap">
                {inlineFormat(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri} className="hover:bg-[#111] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-[#C0C0B8] border-b border-[#141414] whitespace-nowrap">
                  {inlineFormat(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Inline formatting: **bold**, emojis are kept as-is */
function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[#F5F0EB]">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const timeStr = message.timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (message.role === 'user') {
    return (
      <div className="flex flex-col items-end px-6 py-3">
        <div className="max-w-[72%] bg-[#F4600C] text-white px-5 py-3.5 rounded-[18px_18px_4px_18px] text-[14px] leading-relaxed font-light shadow-[0_2px_12px_rgba(244,96,12,0.2)]">
          {message.content}
        </div>
        <p className="text-[10px] text-[#444] mt-1.5 px-1">{timeStr}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start px-6 py-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-[26px] h-[26px] rounded-full bg-[rgba(244,96,12,0.08)] border border-[rgba(244,96,12,0.35)] flex items-center justify-center flex-shrink-0">
          <GlobeIcon size={13} className="text-[#F4600C]" />
        </div>
        <span className="text-xs text-[#F4600C] font-semibold tracking-[0.03em]">TravelGuide</span>
      </div>
      <div className="max-w-[85%] bg-[#0F0F0F] border border-[#1A1A1A] text-[#F5F0EB] px-5 py-4 rounded-[18px_18px_18px_4px] leading-relaxed shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        {renderMarkdown(message.content)}
      </div>
      <p className="text-[10px] text-[#444] mt-1.5 px-1">{timeStr}</p>
    </div>
  );
};

export default MessageBubble;
