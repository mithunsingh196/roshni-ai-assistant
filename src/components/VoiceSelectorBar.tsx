import React from 'react';
import { Play, Square, Sparkles, Gauge, Zap } from 'lucide-react';
import { GeminiVoiceInfo } from '../utils/geminiTTS';

interface VoiceSelectorBarProps {
  voices: GeminiVoiceInfo[];
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  onTestVoice: (voiceId: string) => void;
  isTesting: boolean;
  testingVoiceId: string | null;
  speechSpeed: number;
  onSpeedChange: (speed: number) => void;
  powerfulMode: boolean;
  onTogglePowerfulMode: (enabled: boolean) => void;
}

export const VoiceSelectorBar: React.FC<VoiceSelectorBarProps> = ({
  voices,
  selectedVoice,
  onTestVoice,
  onSelectVoice,
  isTesting,
  testingVoiceId,
  speechSpeed,
  onSpeedChange,
  powerfulMode,
  onTogglePowerfulMode,
}) => {
  const activeVoiceToTest = powerfulMode ? 'Gacrux' : selectedVoice;
  const isCurrentTesting = isTesting && testingVoiceId === activeVoiceToTest;

  return (
    <div className="px-4 py-2 bg-zinc-900/90 border-b border-zinc-800/80 backdrop-blur-sm space-y-1.5 text-xs">
      {/* Top Row: Voice Dropdown & Test Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-amber-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-zinc-300">Voice:</span>
        </div>

        {/* Exact Gemini Voices Dropdown */}
        <div className="flex-1 min-w-0">
          <select
            value={selectedVoice}
            disabled={powerfulMode}
            onChange={(e) => onSelectVoice(e.target.value)}
            aria-label="Select Gemini female voice"
            className="w-full bg-zinc-950 text-amber-200 border border-zinc-700/80 hover:border-amber-500/60 disabled:opacity-60 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500 cursor-pointer truncate transition-colors shadow-inner"
          >
            {voices.map((v) => (
              <option key={v.id} value={v.id} className="bg-zinc-950 text-zinc-100 py-1">
                {v.name} • {v.tone} {v.isDefault ? '★ (Default)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Test Button Next to Dropdown */}
        <button
          onClick={() => onTestVoice(activeVoiceToTest)}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-sm ${
            isCurrentTesting
              ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-300 animate-pulse'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-amber-500/20'
          }`}
          title="Hindi sample test karein: 'Namaste, main Shikha ji hoon. Aap kaise hain?'"
          aria-label="Test voice in Hindi"
        >
          {isCurrentTesting ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>Suno...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Test</span>
            </>
          )}
        </button>
      </div>

      {/* Second Row: Speed Slider & Powerful Mode Info */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 shrink-0 font-medium">
          <Gauge className="w-3 h-3 text-amber-400/80" />
          <span>Speed:</span>
          <span className="font-mono text-amber-300 font-semibold w-8">
            {speechSpeed.toFixed(2).replace(/\.00$/, '')}x
          </span>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-mono">Slow</span>
          <input
            type="range"
            min="0.70"
            max="1.30"
            step="0.05"
            value={speechSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
            aria-label="Voice speed slider (slow to fast)"
          />
          <span className="text-[10px] text-zinc-500 font-mono">Fast</span>
        </div>

        {powerfulMode && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>Gacrux</span>
          </span>
        )}
      </div>
    </div>
  );
};
