import React from 'react';
import { AssistantMood } from '../types';
import { Smile, Laugh, Brain, Zap, Ear } from 'lucide-react';

interface MoodSelectorProps {
  currentMood: AssistantMood;
  onSelectMood: (mood: AssistantMood) => void;
  powerfulMode: boolean;
  onTogglePowerfulMode: (enabled: boolean) => void;
  heyShikhaMode: boolean;
  onToggleHeyShikhaMode: (enabled: boolean) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  currentMood,
  onSelectMood,
  powerfulMode,
  onTogglePowerfulMode,
  heyShikhaMode,
  onToggleHeyShikhaMode,
}) => {
  const moods: { id: AssistantMood; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'friendly', label: 'Friendly', icon: <Smile className="w-3.5 h-3.5" />, desc: 'Warm & Sweet' },
    { id: 'funny', label: 'Funny', icon: <Laugh className="w-3.5 h-3.5" />, desc: 'Witty & Playful' },
    { id: 'serious', label: 'Serious', icon: <Brain className="w-3.5 h-3.5" />, desc: 'Deep & Wise' },
  ];

  return (
    <div className="px-4 py-2 bg-zinc-950/70 border-b border-zinc-900/90 flex flex-col gap-1.5 text-xs">
      {/* Mood Buttons Row */}
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[11px] font-semibold text-zinc-400 shrink-0">Mood:</span>
        <div className="flex-1 grid grid-cols-3 gap-1 bg-zinc-900/80 p-0.5 rounded-xl border border-zinc-800">
          {moods.map((m) => {
            const isActive = currentMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMood(m.id)}
                className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-sm shadow-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
                title={m.desc}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Toggles Row: Powerful Mode & Hey Shikha Mode */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        {/* Powerful Mode Toggle */}
        <button
          onClick={() => onTogglePowerfulMode(!powerfulMode)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
            powerfulMode
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
          }`}
          title="Voice Gacrux with deep, commanding delivery"
        >
          <Zap className={`w-3 h-3 ${powerfulMode ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'}`} />
          <span>Powerful Mode</span>
          <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${powerfulMode ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-500'}`}>
            {powerfulMode ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Hey Shikha Wake-Word Mode Toggle */}
        <button
          onClick={() => onToggleHeyShikhaMode(!heyShikhaMode)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
            heyShikhaMode
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
          }`}
          title="Background continuous listening for 'Hey Shikha'"
        >
          <Ear className={`w-3 h-3 ${heyShikhaMode ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
          <span>Hey Shikha</span>
          <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${heyShikhaMode ? 'bg-emerald-400 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-500'}`}>
            {heyShikhaMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </div>
  );
};
