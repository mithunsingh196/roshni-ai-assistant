import React from 'react';
import { AssistantStatus } from '../types';
import { Sparkles, Radio, Volume2 } from 'lucide-react';

interface StatusIndicatorProps {
  status: AssistantStatus;
  statusText: string;
  interimTranscript?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  statusText,
  interimTranscript,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[46px] px-4 py-1 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-inner">
        {status === 'listening' ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
        ) : status === 'thinking' ? (
          <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
        ) : status === 'speaking' ? (
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        ) : (
          <Radio className="w-3.5 h-3.5 text-zinc-500" />
        )}

        <span
          className={`text-xs font-semibold tracking-wide transition-colors ${
            status === 'listening'
              ? 'text-amber-400'
              : status === 'thinking'
              ? 'text-orange-300'
              : status === 'speaking'
              ? 'text-emerald-300'
              : 'text-zinc-400'
          }`}
        >
          {statusText}
        </span>
      </div>

      {/* Live speech preview if user is speaking */}
      {status === 'listening' && interimTranscript && (
        <div className="mt-1.5 max-w-xs truncate text-[12px] text-amber-200/90 italic bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-500/20 animate-fadeIn">
          "{interimTranscript}..."
        </div>
      )}
    </div>
  );
};
