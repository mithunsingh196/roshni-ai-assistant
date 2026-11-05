/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSpeechAssistant } from './hooks/useSpeechAssistant';
import { Header } from './components/Header';
import { MoodSelector } from './components/MoodSelector';
import { VoiceSelectorBar } from './components/VoiceSelectorBar';
import { ChatBubble } from './components/ChatBubble';
import { MicButton } from './components/MicButton';
import { StatusIndicator } from './components/StatusIndicator';
import { PermissionAlert } from './components/PermissionAlert';
import { QuickPrompts } from './components/QuickPrompts';
import { SettingsModal } from './components/SettingsModal';
import { UserNameModal } from './components/UserNameModal';
import { ShikhaAvatar } from './components/ShikhaAvatar';
import {
  Keyboard,
  Send,
  Sparkles,
  VolumeX,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const {
    status,
    statusText,
    interimTranscript,
    permissionDenied,
    setPermissionDenied,
    permissionErrorMessage,
    isSpeechRecognitionSupported,
    isMuted,
    messages,
    toggleListening,
    sendTextMessage,
    clearHistory,
    stopSpeaking,
    speakMessage,
    toggleMute,
    selectedVoice,
    setSelectedVoice,
    speechSpeed,
    setSpeechSpeed,
    powerfulMode,
    setPowerfulMode,
    mood,
    setMood,
    heyShikhaMode,
    setHeyShikhaMode,
    userName,
    setUserName,
    showNameModal,
    dismissNameModal,
    ttsFallbackNotice,
    testVoice,
    testingVoiceId,
    geminiVoices,
  } = useSpeechAssistant();

  const [showSettings, setShowSettings] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  // Focus input when keyboard mode opens
  useEffect(() => {
    if (showKeyboardInput) {
      setTimeout(() => textInputRef.current?.focus(), 150);
    }
  }, [showKeyboardInput]);

  const handleSendText = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!typedMessage.trim()) return;
    sendTextMessage(typedMessage.trim());
    setTypedMessage('');
  };

  const handlePromptSelect = (prompt: string) => {
    sendTextMessage(prompt);
  };

  return (
    <div className="flex justify-center bg-zinc-950 min-h-dvh text-zinc-100 overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Mobile container - centered on desktop, seamless portrait inside Median APK wrapper */}
      <div className="w-full max-w-md min-h-dvh flex flex-col bg-zinc-950 sm:border-x sm:border-zinc-800/80 shadow-2xl relative">
        {/* Top Header */}
        <Header
          status={status}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onClearHistory={() => setShowClearConfirm(true)}
          onOpenHelp={() => setShowSettings(true)}
          userName={userName}
          onOpenNameModal={() => setShowEditNameModal(true)}
          heyShikhaMode={heyShikhaMode}
        />

        {/* Moods (Friendly, Funny, Serious) + Powerful Mode & Hey Shikha Toggles */}
        <MoodSelector
          currentMood={mood}
          onSelectMood={setMood}
          powerfulMode={powerfulMode}
          onTogglePowerfulMode={setPowerfulMode}
          heyShikhaMode={heyShikhaMode}
          onToggleHeyShikhaMode={setHeyShikhaMode}
        />

        {/* Gemini Voice Selection Bar with Dropdown, Test Button, & Speed Slider */}
        <VoiceSelectorBar
          voices={geminiVoices}
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          onTestVoice={testVoice}
          isTesting={status === 'speaking' && Boolean(testingVoiceId)}
          testingVoiceId={testingVoiceId}
          speechSpeed={speechSpeed}
          onSpeedChange={setSpeechSpeed}
          powerfulMode={powerfulMode}
          onTogglePowerfulMode={setPowerfulMode}
        />

        {/* TTS Fallback Small Notice Toast if Gemini TTS fails */}
        {ttsFallbackNotice && (
          <div className="mx-4 mt-2 p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 animate-fadeIn shadow-md">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="flex-1">{ttsFallbackNotice}</span>
          </div>
        )}

        {/* Permission Denied Alert if mic blocked */}
        {permissionDenied && (
          <PermissionAlert
            message={permissionErrorMessage}
            onDismiss={() => setPermissionDenied(false)}
            onRetry={toggleListening}
          />
        )}

        {/* If Web Speech API is not supported in the browser */}
        {!isSpeechRecognitionSupported && (
          <div className="mx-4 my-2 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
            <p className="font-semibold text-amber-300">
              Voice Recognition Browser Limit
            </p>
            <p className="mt-0.5 text-zinc-300">
              Aapka browser Web Speech API support nahi karta. Aap neeche text box se Shikha ji se baat kar sakte hain.
            </p>
          </div>
        )}

        {/* Chat History View Area */}
        <main className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onSpeak={speakMessage}
              isCurrentlySpeaking={status === 'speaking'}
            />
          ))}

          {/* Assistant typing / thinking bubble indicator with status ring */}
          {status === 'thinking' && (
            <div className="flex items-start gap-2 mb-3 animate-fadeIn">
              <ShikhaAvatar size="sm" status="thinking" className="mt-0.5" />
              <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-gradient-to-b from-amber-950/60 to-zinc-900 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="font-medium">Shikha ji soch rahi hain...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-2" />
        </main>

        {/* Quick starter suggestion chips */}
        <div className="border-t border-zinc-900/60 bg-zinc-950/40">
          <QuickPrompts
            onSelectPrompt={handlePromptSelect}
            disabled={status === 'thinking' || status === 'listening'}
          />
        </div>

        {/* Center Microphone & Control Console */}
        <section className="bg-gradient-to-t from-zinc-950 via-zinc-900/90 to-zinc-950/80 border-t border-zinc-800/80 pt-2 pb-5 px-4 flex flex-col items-center relative backdrop-blur-md">
          {/* Status Text ("Sun rahi hoon...", "Soch rahi hoon...", "Bol rahi hoon...") */}
          <StatusIndicator
            status={status}
            statusText={statusText}
            interimTranscript={interimTranscript}
          />

          {/* Big Center Microphone Button (Tap to talk, tap again to stop) */}
          <div className="my-1">
            <MicButton status={status} onClick={toggleListening} />
          </div>

          {/* Secondary Action Toolbar: Keyboard fallback & Speaking interruption */}
          <div className="w-full flex items-center justify-between px-3 mt-1">
            <button
              onClick={() => setShowKeyboardInput((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                showKeyboardInput
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800'
              }`}
              title="Type karke baat karein"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{showKeyboardInput ? 'Voice Mode' : 'Likhkar bolein'}</span>
            </button>

            {/* If Shikha is speaking, direct Stop button */}
            {status === 'speaking' && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60 transition-all animate-pulse cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Aawaz Rokein</span>
              </button>
            )}

            {/* Mute indicator pill if muted */}
            {isMuted && status !== 'speaking' && (
              <button
                onClick={toggleMute}
                className="flex items-center gap-1 text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 cursor-pointer"
              >
                <VolumeX className="w-3 h-3 text-red-400" />
                <span>Muted (Unmute)</span>
              </button>
            )}
          </div>

          {/* Collapsible Text Input for quiet environments or permission fallback */}
          {showKeyboardInput && (
            <form
              onSubmit={handleSendText}
              className="w-full mt-3 flex items-center gap-2 animate-fadeIn"
            >
              <input
                ref={textInputRef}
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Yahan type karein (Hinglish/Hindi)..."
                className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!typedMessage.trim() || status === 'thinking'}
                className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 font-bold transition-all shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

        {/* Clear History Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-xs rounded-2xl bg-zinc-900 border border-zinc-800 p-4 text-center shadow-2xl">
              <h4 className="font-bold text-sm text-zinc-100">
                Chat saaf karna chahte hain?
              </h4>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Shikha ji ke saath aapki saari baatchit clear ho jayegi.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
                >
                  Nahi, rehne dein
                </button>
                <button
                  onClick={() => {
                    clearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Haan, saaf karein
                </button>
              </div>
            </div>
          </div>
        )}

        {/* First Time User Name Modal (Memory) */}
        {showNameModal && (
          <UserNameModal
            isOpen={showNameModal}
            onSave={setUserName}
            onClose={dismissNameModal}
            isFirstTime={true}
          />
        )}

        {/* Edit User Name Modal */}
        {showEditNameModal && (
          <UserNameModal
            isOpen={showEditNameModal}
            initialName={userName}
            onSave={(name) => {
              setUserName(name);
              setShowEditNameModal(false);
            }}
            onClose={() => setShowEditNameModal(false)}
            isFirstTime={false}
          />
        )}

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          voices={geminiVoices}
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          onTestVoice={testVoice}
          testingVoiceId={testingVoiceId}
          speechSpeed={speechSpeed}
          onSpeedChange={setSpeechSpeed}
          powerfulMode={powerfulMode}
          onTogglePowerfulMode={setPowerfulMode}
          heyShikhaMode={heyShikhaMode}
          onToggleHeyShikhaMode={setHeyShikhaMode}
          userName={userName}
          onOpenNameModal={() => {
            setShowSettings(false);
            setShowEditNameModal(true);
          }}
        />
      </div>
    </div>
  );
}
