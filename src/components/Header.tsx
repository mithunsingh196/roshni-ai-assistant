import React from 'react';
import { Volume2, VolumeX, Trash2, HelpCircle, Sparkles, User, Ear } from 'lucide-react';
import { AssistantStatus } from '../types';
import { ShikhaAvatar } from './ShikhaAvatar';

interface HeaderProps {
  status: AssistantStatus;
  isMuted: boolean;
  onToggleMute: () => void;
  onClearHistory: () => void;
  onOpenHelp: () => void;
  userName?: string;
  onOpenNameModal?: () => void;
  heyShikhaMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  isMuted,
  onToggleMute,
  onClearHistory,
  onOpenHelp,
  userName = '',
  onOpenNameModal,
  heyShikhaMode = false,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="flex items-center gap-3">
        {/* Shikha ji round profile picture at the top with glowing status ring */}
        <div className="relative cursor-pointer" onClick={onOpenHelp} title="View Settings">
          <ShikhaAvatar size="md" status={status} />
          {/* Active status pip */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950 transition-colors z-10 ${
              status === 'listening'
                ? 'bg-amber-400 animate-ping'
                : status === 'speaking'
                ? 'bg-emerald-400 animate-pulse'
                : status === 'thinking'
                ? 'bg-orange-400 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-base tracking-wide text-zinc-100 flex items-center gap-1">
              <span>Shikha ji</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                शिखा जी
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
            {userName ? (
              <button
                onClick={onOpenNameModal}
                className="text-amber-300/90 hover:text-amber-200 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                title="Change name"
              >
                <User className="w-2.5 h-2.5" />
                <span>Namaste {userName} ji!</span>
              </button>
            ) : (
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 inline" />
                <span>Voice Assistant</span>
              </span>
            )}

            {heyShikhaMode && (
              <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse">
                <Ear className="w-2.5 h-2.5" />
                <span>Hey Shikha ON</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Aawaz chalu karein (Unmute)' : 'Aawaz band karein (Mute)'}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isMuted
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Toggle mute"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onClearHistory}
          title="Chat saaf karein"
          className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
          aria-label="Clear chat history"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHelp}
          title="Voice Tuning & Settings"
          className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          aria-label="Open settings"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
