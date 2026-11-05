import React from 'react';

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

const SAMPLE_PROMPTS = [
  { label: 'Namaste ji! 🙏', text: 'Namaste Shikha ji! Aap kaisi hain?' },
  { label: 'Chai Recipe ☕', text: 'Ek badhiya kadak adrak wali chai ki recipe bataiye.' },
  { label: 'Chutkula Suniye 😄', text: 'Shikha ji, ek majedaar Desi chutkula sunaiye na!' },
  { label: 'Aaj ka Suvichar ✨', text: 'Aaj ka ek sundar prerak suvichar bataiye.' },
  { label: 'Mausam ka Haal ⛅', text: 'Aaj ka mausam aur din kaisa rahega?' },
  { label: 'Aap Kya Kar Sakti Hain? 💡', text: 'Shikha ji, aap meri kya kya madad kar sakti hain?' },
];

export const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  return (
    <div className="w-full px-3 py-1.5 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 w-max pb-1">
        <span className="text-[11px] font-medium text-amber-400/80 uppercase tracking-wider pl-1">
          Suggestions:
        </span>
        {SAMPLE_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectPrompt(p.text)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-900/90 hover:bg-amber-950/60 active:scale-95 text-zinc-300 hover:text-amber-200 border border-zinc-800 hover:border-amber-500/40 transition-all shrink-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
