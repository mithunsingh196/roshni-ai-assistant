import React, { useState } from 'react';
import { Volume2, Copy, Check, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { ShikhaAvatar } from './ShikhaAvatar';

interface ChatBubbleProps {
  message: ChatMessage;
  onSpeak: (message: ChatMessage) => void;
  isCurrentlySpeaking?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onSpeak,
  isCurrentlySpeaking = false,
}) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex flex-col mb-3.5 transition-all duration-300 ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`flex items-start gap-2 max-w-[86%] sm:max-w-[80%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Shikha Avatar on bot messages */}
        {!isUser && (
          <div className="shrink-0 mt-0.5">
            <ShikhaAvatar size="sm" />
          </div>
        )}

        <div
          className={`relative px-4 py-3 rounded-2xl text-[14.5px] leading-relaxed select-text ${
            isUser
              ? 'bg-zinc-800 text-zinc-100 rounded-tr-xs border border-zinc-700/60 shadow-sm'
              : 'bg-gradient-to-b from-amber-950/70 to-zinc-900/90 text-amber-50 rounded-tl-xs border border-amber-500/30 shadow-md shadow-amber-950/30'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>

          <div
            className={`flex items-center gap-2 mt-1.5 text-[11px] ${
              isUser ? 'justify-end text-zinc-400' : 'justify-between text-amber-300/70'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>{formattedTime}</span>
              {!isUser && message.voice && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300/80 font-mono">
                  {message.voice}
                </span>
              )}
            </div>

            {/* Quick action buttons on Shikha's replies */}
            {!isUser && (
              <div className="flex items-center gap-1.5 ml-3">
                <button
                  onClick={() => onSpeak(message)}
                  title="Gemini voice mein sunein"
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    isCurrentlySpeaking
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                      : 'hover:bg-amber-500/20 text-amber-200/90'
                  }`}
                  aria-label="Replay audio"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Sunein</span>
                </button>

                <button
                  onClick={handleCopy}
                  title="Copy karein"
                  className="p-1 rounded hover:bg-amber-500/20 text-amber-200/70 hover:text-amber-200 transition-colors cursor-pointer"
                  aria-label="Copy message"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
