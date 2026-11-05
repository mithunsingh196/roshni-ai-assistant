import React, { useRef } from 'react';
import {
  X,
  Volume2,
  Mic,
  Play,
  Check,
  Square,
  Sparkles,
  Gauge,
  RotateCcw,
  Camera,
  Zap,
  Ear,
  User,
} from 'lucide-react';
import { GeminiVoiceInfo, HINDI_TEST_SAMPLE } from '../utils/geminiTTS';
import { ShikhaAvatar } from './ShikhaAvatar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: GeminiVoiceInfo[];
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  onTestVoice: (voiceId: string) => void;
  testingVoiceId: string | null;
  speechSpeed: number;
  onSpeedChange: (speed: number) => void;
  powerfulMode: boolean;
  onTogglePowerfulMode: (enabled: boolean) => void;
  heyShikhaMode: boolean;
  onToggleHeyShikhaMode: (enabled: boolean) => void;
  userName: string;
  onOpenNameModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voices,
  selectedVoice,
  onSelectVoice,
  onTestVoice,
  testingVoiceId,
  speechSpeed,
  onSpeedChange,
  powerfulMode,
  onTogglePowerfulMode,
  heyShikhaMode,
  onToggleHeyShikhaMode,
  userName,
  onOpenNameModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = Math.max(0, (img.height - minDim) * 0.25);
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 256, 256);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          try {
            localStorage.setItem('shikha_custom_avatar_base64', compressedBase64);
            window.dispatchEvent(new Event('shikha-avatar-updated'));
          } catch {
            // ignore
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    try {
      localStorage.removeItem('shikha_custom_avatar_base64');
      window.dispatchEvent(new Event('shikha-avatar-updated'));
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5 text-zinc-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <ShikhaAvatar size="sm" />
            <div>
              <h3 className="font-bold text-sm text-zinc-100">Shikha ji Settings</h3>
              <p className="text-[11px] text-zinc-400">Voice, Modes & Memory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs">
          {/* User Memory Section */}
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">Aapka Naam (Memory):</p>
                <p className="font-bold text-sm text-amber-200">
                  {userName ? `${userName} ji` : 'Set nahi hai'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenNameModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 cursor-pointer"
            >
              {userName ? 'Badlein' : 'Naam Daalein'}
            </button>
          </div>

          {/* Powerful Mode & Hey Shikha Toggles Card */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <h5 className="font-bold text-zinc-200 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Special Voice Modes</span>
            </h5>

            {/* Powerful Mode Toggle */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900">
              <div>
                <p className="font-semibold text-zinc-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Powerful Mode</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Voice Gacrux with slower, deeper delivery style
                </p>
              </div>
              <button
                onClick={() => onTogglePowerfulMode(!powerfulMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  powerfulMode
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {powerfulMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Hey Shikha Wake-Word Mode Toggle */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-900">
              <div>
                <p className="font-semibold text-zinc-200 flex items-center gap-1">
                  <Ear className="w-3 h-3 text-emerald-400" />
                  <span>Hey Shikha Mode</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Continuous listening: responds when you say "Hey Shikha"
                </p>
              </div>
              <button
                onClick={() => onToggleHeyShikhaMode(!heyShikhaMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  heyShikhaMode
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {heyShikhaMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Speed Slider Card */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Speech Speed (Slow to Fast)</span>
              </label>
              <span className="font-mono text-amber-300 font-bold text-xs">
                {speechSpeed.toFixed(2).replace(/\.00$/, '')}x
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-zinc-500 font-mono">0.70x</span>
              <input
                type="range"
                min="0.70"
                max="1.30"
                step="0.05"
                value={speechSpeed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-zinc-500 font-mono">1.30x</span>
            </div>
          </div>

          {/* Profile Avatar Photo Settings */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Shikha ji Avatar Photo</span>
              </span>
              <button
                type="button"
                onClick={handleResetPhoto}
                className="text-[10px] text-zinc-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
              >
                Reset Default
              </button>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <ShikhaAvatar size="lg" />
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[11px] text-zinc-400">
                  Embedded base64 portrait, focused on face.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-medium border border-amber-500/40 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Upload New Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 14 Gemini Prebuilt Female Voices with Test Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-zinc-300 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Available Gemini Voices ({voices.length})</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                Saved in localStorage
              </span>
            </div>

            <div className="space-y-2">
              {voices.map((v) => {
                const isSelected = selectedVoice === v.id;
                const isTesting = testingVoiceId === v.id;

                return (
                  <div
                    key={v.id}
                    onClick={() => onSelectVoice(v.id)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-sm shadow-amber-500/20'
                        : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-100">{v.name}</span>
                        {v.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium">
                            Default
                          </span>
                        )}
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-amber-400 ml-auto" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                        {v.description}
                      </p>
                    </div>

                    {/* Test Button next to each voice */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTestVoice(v.id);
                      }}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold text-[11px] transition-all cursor-pointer ${
                        isTesting
                          ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-300 animate-pulse'
                          : 'bg-zinc-800 hover:bg-amber-500/20 text-amber-300 border border-zinc-700 hover:border-amber-500/40'
                      }`}
                      title={`${v.name} sample sunein`}
                    >
                      {isTesting ? (
                        <>
                          <Square className="w-2.5 h-2.5 fill-current" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Test</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Theek Hai (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
