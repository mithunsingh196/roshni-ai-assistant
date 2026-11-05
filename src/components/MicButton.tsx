import React from 'react';
import { Mic, MicOff, Square, Sparkles } from 'lucide-react';
import { AssistantStatus } from '../types';

interface MicButtonProps {
  status: AssistantStatus;
  onClick: () => void;
  disabled?: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({
  status,
  onClick,
  disabled = false,
}) => {
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';

  return (
    <div className="relative flex flex-col items-center justify-center py-2 select-none">
      {/* Outer pulsing ripple effects when listening */}
      {isListening && (
        <>
          <span className="absolute w-36 h-36 rounded-full bg-amber-500/20 animate-ping opacity-75 pointer-events-none" />
          <span className="absolute w-44 h-44 rounded-full bg-orange-600/15 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Glow aura */}
      <div
        className={`absolute rounded-full transition-all duration-500 pointer-events-none ${
          isListening
            ? 'w-36 h-36 bg-gradient-to-tr from-amber-500/40 via-orange-500/30 to-amber-300/40 blur-xl'
            : isSpeaking
            ? 'w-32 h-32 bg-gradient-to-tr from-emerald-500/25 via-amber-500/20 to-orange-500/25 blur-lg'
            : isThinking
            ? 'w-32 h-32 bg-orange-500/20 blur-md'
            : 'w-28 h-28 bg-amber-500/15 blur-md'
        }`}
      />

      {/* Main Big Mic Button */}
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={
          isListening
            ? 'Stop listening'
            : isSpeaking
            ? 'Stop speaking'
            : isThinking
            ? 'Thinking'
            : 'Start talking to Shikha ji'
        }
        className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 focus:outline-none shadow-2xl ${
          isListening
            ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-zinc-950 animate-saffron-pulse border-4 border-amber-200 shadow-amber-500/60'
            : isSpeaking
            ? 'bg-gradient-to-tr from-amber-600 via-zinc-900 to-amber-800 text-amber-300 border-3 border-amber-400/80 shadow-amber-900/50'
            : isThinking
            ? 'bg-zinc-900 text-amber-400 border-2 border-amber-500/40 opacity-90 cursor-wait'
            : 'bg-gradient-to-tr from-zinc-900 via-zinc-900 to-zinc-800 text-amber-400 border-2 border-amber-500/50 hover:border-amber-400 animate-saffron-glow-idle shadow-amber-500/20 hover:scale-105'
        }`}
      >
        {isListening ? (
          <div className="flex flex-col items-center">
            <Mic className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-sm text-zinc-950 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-950 mt-0.5">
              Stop
            </span>
          </div>
        ) : isThinking ? (
          <div className="flex flex-col items-center">
            <Sparkles className="w-9 h-9 sm:w-10 sm:h-10 text-amber-400 animate-spin" />
            <span className="text-[10px] font-medium tracking-wide text-amber-300/80 mt-0.5">
              Soch...
            </span>
          </div>
        ) : isSpeaking ? (
          <div className="flex flex-col items-center">
            {/* Animated sound bars */}
            <div className="flex items-center gap-1 h-8 px-1">
              <span className="w-1 bg-amber-400 rounded-full animate-[audio-wave_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 bg-amber-400 rounded-full animate-[audio-wave_0.6s_infinite_ease-in-out]" style={{ animationDelay: '0.3s' }} />
              <span className="w-1.5 bg-amber-300 rounded-full animate-[audio-wave_0.9s_infinite_ease-in-out]" style={{ animationDelay: '0.15s' }} />
              <span className="w-1 bg-amber-400 rounded-full animate-[audio-wave_0.7s_infinite_ease-in-out]" style={{ animationDelay: '0.4s' }} />
              <span className="w-1 bg-amber-400 rounded-full animate-[audio-wave_0.5s_infinite_ease-in-out]" style={{ animationDelay: '0.2s' }} />
            </div>
            <span className="text-[10px] font-semibold tracking-wide text-amber-300 mt-0.5">
              Rokein
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Mic className="w-10 h-10 sm:w-11 sm:h-11 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold tracking-wide text-amber-300/90 mt-0.5">
              Boliye
            </span>
          </div>
        )}
      </button>

      {/* Helpful Hint text under button */}
      <div className="mt-2.5 text-center">
        <p className="text-xs font-medium text-zinc-400 tracking-wide">
          {isListening
            ? 'Tap karein aur bolna band karein'
            : isSpeaking
            ? 'Shikha ji bol rahi hain (Tap to interrupt)'
            : isThinking
            ? 'Shikha ji soch rahi hain...'
            : 'Tap karke baat karein'}
        </p>
      </div>
    </div>
  );
};
