import { useState, useEffect, useRef, useCallback } from 'react';
import { AssistantStatus, AssistantMood, ChatMessage } from '../types';
import {
  geminiTTSService,
  EXACT_GEMINI_VOICES,
  GeminiVoiceInfo,
} from '../utils/geminiTTS';
import { soundEffects } from '../utils/soundEffects';

export function useSpeechAssistant() {
  // User Name (Memory)
  const [userName, setUserNameState] = useState<string>(() => {
    try {
      return localStorage.getItem('shikha_user_name') || '';
    } catch {
      return '';
    }
  });

  const [showNameModal, setShowNameModal] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shikha_user_name');
      const hasAsked = localStorage.getItem('shikha_has_asked_name');
      return !saved && !hasAsked;
    } catch {
      return false;
    }
  });

  // Moods: 'friendly' | 'funny' | 'serious'
  const [mood, setMoodState] = useState<AssistantMood>(() => {
    try {
      const saved = localStorage.getItem('shikha_user_mood') as AssistantMood;
      if (saved && ['friendly', 'funny', 'serious'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'friendly';
  });

  // Hey Shikha background wake-word mode (default OFF)
  const [heyShikhaMode, setHeyShikhaModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('shikha_hey_shikha_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Voice Settings
  const [selectedVoice, setSelectedVoiceState] = useState<string>(() => {
    return geminiTTSService.getSelectedVoiceId() || 'Kore';
  });

  const [powerfulMode, setPowerfulModeState] = useState<boolean>(() => {
    return geminiTTSService.getPowerfulMode();
  });

  const [speechSpeed, setSpeechSpeedState] = useState<number>(() => {
    return geminiTTSService.getSpeechSpeed();
  });

  const [ttsFallbackNotice, setTtsFallbackNotice] = useState<string | null>(null);

  // Initial welcome message with name memory
  const getInitialWelcome = (name: string): ChatMessage => ({
    id: 'welcome-1',
    sender: 'shikha',
    text: name.trim()
      ? `Namaste ${name.trim()} ji! Main hoon Shikha ji. Boliye, aaj main aapki kya madad kar sakti hoon?`
      : 'Namaste ji! Main hoon Shikha ji. Boliye, aaj main aapki kya madad kar sakti hoon?',
    timestamp: Date.now(),
    voice: 'Kore',
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('shikha_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const currentName = typeof window !== 'undefined' ? localStorage.getItem('shikha_user_name') || '' : '';
    return [getInitialWelcome(currentName)];
  });

  const [status, setStatus] = useState<AssistantStatus>('idle');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [permissionErrorMessage, setPermissionErrorMessage] = useState<string>('');
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppingRef = useRef<boolean>(false);
  const accumulatedTranscriptRef = useRef<string>('');
  const statusRef = useRef<AssistantStatus>('idle');
  statusRef.current = status;
  const heyShikhaModeRef = useRef<boolean>(heyShikhaMode);
  heyShikhaModeRef.current = heyShikhaMode;

  // Listen for TTS fallback notice
  useEffect(() => {
    geminiTTSService.setOnFallback((reason) => {
      setTtsFallbackNotice(reason);
      setTimeout(() => setTtsFallbackNotice(null), 5000);
    });
  }, []);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('shikha_chat_history', JSON.stringify(messages));
    } catch {
      // ignore storage quota
    }
  }, [messages]);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechRecognitionSupported(false);
    }
  }, []);

  // Save Name
  const setUserName = useCallback((name: string) => {
    const trimmed = name.trim();
    setUserNameState(trimmed);
    setShowNameModal(false);
    try {
      localStorage.setItem('shikha_user_name', trimmed);
      localStorage.setItem('shikha_has_asked_name', 'true');
    } catch {
      // ignore
    }
  }, []);

  const dismissNameModal = useCallback(() => {
    setShowNameModal(false);
    try {
      localStorage.setItem('shikha_has_asked_name', 'true');
    } catch {
      // ignore
    }
  }, []);

  // Save Mood
  const setMood = useCallback((newMood: AssistantMood) => {
    setMoodState(newMood);
    soundEffects.triggerHaptic(15);
    try {
      localStorage.setItem('shikha_user_mood', newMood);
    } catch {
      // ignore
    }
  }, []);

  // Save Powerful Mode
  const setPowerfulMode = useCallback((enabled: boolean) => {
    geminiTTSService.setPowerfulMode(enabled);
    setPowerfulModeState(enabled);
    soundEffects.triggerHaptic(25);
  }, []);

  // Save Voice
  const setSelectedVoice = useCallback((voiceId: string) => {
    geminiTTSService.setSelectedVoiceId(voiceId);
    setSelectedVoiceState(voiceId);
  }, []);

  // Save Speed
  const setSpeechSpeed = useCallback((speed: number) => {
    geminiTTSService.setSpeechSpeed(speed);
    setSpeechSpeedState(speed);
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      geminiTTSService.setMuted(next);
      soundEffects.setMuted(next);
      return next;
    });
  }, []);

  // Stop active speaking
  const stopSpeaking = useCallback(() => {
    geminiTTSService.stop();
    setTestingVoiceId(null);
    if (statusRef.current === 'speaking') {
      setStatus('idle');
    }
  }, []);

  // Send query to Gemini
  const sendToGemini = useCallback(async (userText: string) => {
    const cleanText = userText.trim();
    if (!cleanText) {
      setStatus('idle');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender: 'user',
      text: cleanText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus('thinking');
    soundEffects.triggerHaptic(20);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const activeVoice = powerfulMode ? 'Gacrux' : (geminiTTSService.getSelectedVoiceId() || 'Kore');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: historyPayload,
          voice: activeVoice,
          userName,
          mood,
          powerfulMode,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        (userName
          ? `Ji ${userName} ji! Main samajh rahi hoon. Aur bataiye, kya sewa karoon?`
          : 'Ji bilkul! Mujhe aapki baat samajh aa gayi. Aur bataiye, kya sewa karoon?');

      const assistantMsg: ChatMessage = {
        id: `shikha-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sender: 'shikha',
        text: replyText,
        timestamp: Date.now(),
        audio: data.audio,
        voice: data.voice || activeVoice,
        mood,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      soundEffects.playReplyPing();
      soundEffects.triggerHaptic(30);

      // Speak reply out loud using Gemini TTS
      setStatus('speaking');

      const handleSpeechEnd = () => {
        setStatus('idle');
        // If Hey Shikha mode is on, resume background listening
        if (heyShikhaModeRef.current) {
          setTimeout(() => startListening(), 400);
        }
      };

      if (data.audio) {
        await geminiTTSService.playAudio(data.audio, {
          onStart: () => setStatus('speaking'),
          onEnd: handleSpeechEnd,
          onError: handleSpeechEnd,
        });
      } else {
        await geminiTTSService.speakText(replyText, activeVoice, {
          onStart: () => setStatus('speaking'),
          onEnd: handleSpeechEnd,
          onError: handleSpeechEnd,
        });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `shikha-err-${Date.now()}`,
        sender: 'shikha',
        text: 'Arey thoda network ka masla ho gaya lagta hai ji! Ek baar phir se boliye na please.',
        timestamp: Date.now(),
        mood,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setStatus('idle');
    }
  }, [messages, userName, mood, powerfulMode]);

  // Re-read a specific message
  const speakMessage = useCallback((message: ChatMessage) => {
    soundEffects.triggerHaptic(20);
    setStatus('speaking');

    if (message.audio) {
      geminiTTSService.playAudio(message.audio, {
        onStart: () => setStatus('speaking'),
        onEnd: () => setStatus('idle'),
        onError: () => setStatus('idle'),
      });
    } else {
      const activeVoice = powerfulMode ? 'Gacrux' : (message.voice || geminiTTSService.getSelectedVoiceId() || 'Kore');
      geminiTTSService.speakText(message.text, activeVoice, {
        onStart: () => setStatus('speaking'),
        onEnd: () => setStatus('idle'),
        onError: () => setStatus('idle'),
      });
    }
  }, [powerfulMode]);

  // Test voice sample in Hindi
  const testVoice = useCallback((voiceId: string) => {
    soundEffects.triggerHaptic(20);
    stopSpeaking();
    setTestingVoiceId(voiceId);
    setStatus('speaking');

    geminiTTSService.testVoiceSample(voiceId, {
      onStart: () => {
        setStatus('speaking');
        setTestingVoiceId(voiceId);
      },
      onEnd: () => {
        setStatus('idle');
        setTestingVoiceId(null);
      },
      onError: () => {
        setStatus('idle');
        setTestingVoiceId(null);
      },
    });
  }, [stopSpeaking]);

  // Stop listening logic
  const stopListening = useCallback(() => {
    isManuallyStoppingRef.current = true;
    soundEffects.playMicStop();
    soundEffects.triggerHaptic(25);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
    }

    const transcriptToSubmit = accumulatedTranscriptRef.current.trim();
    setInterimTranscript('');

    if (transcriptToSubmit) {
      accumulatedTranscriptRef.current = '';
      sendToGemini(transcriptToSubmit);
    } else {
      setStatus('idle');
    }
  }, [sendToGemini]);

  // Start listening logic
  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechRecognitionSupported(false);
      return;
    }

    stopSpeaking();

    setPermissionDenied(false);
    setPermissionErrorMessage('');
    accumulatedTranscriptRef.current = '';
    setInterimTranscript('');
    isManuallyStoppingRef.current = false;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = 'hi-IN';
      recognition.interimResults = true;
      recognition.continuous = heyShikhaModeRef.current;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setStatus('listening');
        soundEffects.playMicStart();
        soundEffects.triggerHaptic(30);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const currentLive = final || interim;

        // In "Hey Shikha mode": only respond if wake phrase is present
        if (heyShikhaModeRef.current) {
          const lower = currentLive.toLowerCase();
          const wakeRegex = /(hey shikha|hey shikha ji|shikha ji|shikha|हे शिखा|शिखा जी)/i;

          if (wakeRegex.test(lower)) {
            // Wake word detected!
            soundEffects.playReplyPing();
            const extracted = currentLive.replace(wakeRegex, '').trim();
            setInterimTranscript('');
            accumulatedTranscriptRef.current = '';
            try {
              recognition.stop();
            } catch {}

            if (extracted.length > 2) {
              sendToGemini(extracted);
            } else {
              // User just said "Hey Shikha"
              sendToGemini('Haanji Shikha ji!');
            }
            return;
          }

          setInterimTranscript(currentLive);
          return;
        }

        // Standard tap-to-talk mode
        if (final) {
          accumulatedTranscriptRef.current = (
            accumulatedTranscriptRef.current + ' ' + final
          ).trim();
        }

        setInterimTranscript(interim || accumulatedTranscriptRef.current);
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionDenied(true);
          setPermissionErrorMessage(
            'Microphone ki anumati (permission) deny ho gayi hai. Kripya browser ya app settings me jaakar microphone allow karein.'
          );
          setStatus('idle');
        } else if (event.error === 'no-speech') {
          if (statusRef.current === 'listening' && !heyShikhaModeRef.current) {
            setStatus('idle');
          }
        } else {
          if (statusRef.current === 'listening' && !accumulatedTranscriptRef.current && !heyShikhaModeRef.current) {
            setStatus('idle');
          }
        }
      };

      recognition.onend = () => {
        const textToProcess = accumulatedTranscriptRef.current.trim();
        setInterimTranscript('');

        if (heyShikhaModeRef.current && statusRef.current !== 'thinking' && statusRef.current !== 'speaking') {
          // Restart listening automatically in Hey Shikha mode
          setTimeout(() => {
            if (heyShikhaModeRef.current && statusRef.current === 'idle') {
              startListening();
            }
          }, 300);
          return;
        }

        if (textToProcess) {
          accumulatedTranscriptRef.current = '';
          sendToGemini(textToProcess);
        } else if (statusRef.current === 'listening') {
          setStatus('idle');
        }
      };

      recognition.start();
    } catch (e: any) {
      console.error('Error starting recognition:', e);
      if (e?.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setPermissionErrorMessage('Microphone ki permission nahi mili.');
      }
      setStatus('idle');
    }
  }, [sendToGemini, stopSpeaking]);

  // Toggle "Hey Shikha mode"
  const setHeyShikhaMode = useCallback((enabled: boolean) => {
    setHeyShikhaModeState(enabled);
    heyShikhaModeRef.current = enabled;
    soundEffects.triggerHaptic(20);
    try {
      localStorage.setItem('shikha_hey_shikha_mode', enabled ? 'true' : 'false');
    } catch {
      // ignore
    }

    if (enabled) {
      startListening();
    } else {
      if (statusRef.current === 'listening') {
        stopListening();
      }
    }
  }, [startListening, stopListening]);

  const toggleListening = useCallback(() => {
    if (status === 'listening') {
      stopListening();
    } else if (status === 'speaking') {
      stopSpeaking();
      startListening();
    } else if (status === 'thinking') {
      return;
    } else {
      startListening();
    }
  }, [status, startListening, stopListening, stopSpeaking]);

  const sendTextMessage = useCallback((text: string) => {
    stopSpeaking();
    sendToGemini(text);
  }, [sendToGemini, stopSpeaking]);

  const clearHistory = useCallback(() => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'shikha',
        text: userName
          ? `Maine chat saaf kar diya hai ${userName} ji! Boliye, ab kya baat karein?`
          : 'Maine puraana chat saaf kar diya hai ji! Boliye, ab kya baat karein?',
        timestamp: Date.now(),
        voice: powerfulMode ? 'Gacrux' : (geminiTTSService.getSelectedVoiceId() || 'Kore'),
        mood,
      },
    ]);
    soundEffects.triggerHaptic(20);
  }, [stopSpeaking, userName, powerfulMode, mood]);

  const getStatusText = (): string => {
    switch (status) {
      case 'listening':
        return 'Sun rahi hoon...';
      case 'thinking':
        return 'Soch rahi hoon...';
      case 'speaking':
        return 'Bol rahi hoon...';
      case 'idle':
      default:
        return 'Boliye, main sun rahi hoon...';
    }
  };

  return {
    status,
    statusText: getStatusText(),
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
    geminiVoices: EXACT_GEMINI_VOICES,
  };
}
