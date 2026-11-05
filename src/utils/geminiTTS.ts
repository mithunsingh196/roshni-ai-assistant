/**
 * Gemini Text-to-Speech client service
 * Prebuilt voices ordered exactly as requested:
 * Kore, Gacrux, Sulafat, Leda, Zephyr, Aoede, Callirrhoe, Autonoe,
 * Despina, Erinome, Laomedeia, Achernar, Pulcherrima, Vindemiatrix.
 *
 * Default voice: Kore
 * Powerful mode: voice Gacrux with slower, deeper delivery style
 */

import { speechVoiceService } from './speechVoice';

export interface GeminiVoiceInfo {
  id: string;
  name: string;
  gender: 'female';
  tone: string;
  description: string;
  isDefault?: boolean;
}

export const EXACT_GEMINI_VOICES: GeminiVoiceInfo[] = [
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'female',
    tone: 'Calm & Warm',
    description: 'Gentle, soothing, warm and comforting tone (Default)',
    isDefault: true,
  },
  {
    id: 'Gacrux',
    name: 'Gacrux',
    gender: 'female',
    tone: 'Deep & Authoritative',
    description: 'Powerful, deep, commanding delivery style (Powerful Mode)',
  },
  {
    id: 'Sulafat',
    name: 'Sulafat',
    gender: 'female',
    tone: 'Tranquil & Warm',
    description: 'Serene, tranquil, warm and relaxed tone',
  },
  {
    id: 'Leda',
    name: 'Leda',
    gender: 'female',
    tone: 'Polite & Natural',
    description: 'Courteous, gentle, soft and polished voice',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'female',
    tone: 'Warm & Clear',
    description: 'Bright, crisp, friendly and conversational tone',
  },
  {
    id: 'Aoede',
    name: 'Aoede',
    gender: 'female',
    tone: 'Melodic & Expressive',
    description: 'Expressive, melodious and storytelling tone',
  },
  {
    id: 'Callirrhoe',
    name: 'Callirrhoe',
    gender: 'female',
    tone: 'Sweet & Cheerful',
    description: 'Lively, friendly, cheerful and sweet Indian vibe',
  },
  {
    id: 'Autonoe',
    name: 'Autonoe',
    gender: 'female',
    tone: 'Gentle & Poised',
    description: 'Poised, graceful and articulate tone',
  },
  {
    id: 'Despina',
    name: 'Despina',
    gender: 'female',
    tone: 'Smooth & Crisp',
    description: 'Crisp, contemporary and pleasant tone',
  },
  {
    id: 'Erinome',
    name: 'Erinome',
    gender: 'female',
    tone: 'Quiet & Elegant',
    description: 'Soft, elegant, composed and graceful',
  },
  {
    id: 'Laomedeia',
    name: 'Laomedeia',
    gender: 'female',
    tone: 'Warm & Vibrant',
    description: 'Vibrant, engaging and friendly speech tone',
  },
  {
    id: 'Achernar',
    name: 'Achernar',
    gender: 'female',
    tone: 'Clear & Confident',
    description: 'Confident, articulate and well-balanced tone',
  },
  {
    id: 'Pulcherrima',
    name: 'Pulcherrima',
    gender: 'female',
    tone: 'Bright & Radiant',
    description: 'Bright, cheerful, radiant and positive voice',
  },
  {
    id: 'Vindemiatrix',
    name: 'Vindemiatrix',
    gender: 'female',
    tone: 'Mature & Dignified',
    description: 'Dignified, respectful, cultured and mature voice',
  },
];

export const HINDI_TEST_SAMPLE = 'Namaste, main Shikha ji hoon. Aap kaise hain?';

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const cleanBase64 = base64.replace(/^data:audio\/\w+;base64,/, '');
  const binaryString = window.atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

class GeminiTTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private isMuted: boolean = false;
  private selectedVoiceId: string = 'Kore';
  private speechSpeed: number = 0.95; // Default natural speech speed
  private powerfulMode: boolean = false;
  private testAudioCache = new Map<string, string>();
  private onFallbackCallback: ((reason: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedVoice = localStorage.getItem('shikha_gemini_voice');
        if (savedVoice && EXACT_GEMINI_VOICES.some((v) => v.id === savedVoice)) {
          this.selectedVoiceId = savedVoice;
        } else {
          this.selectedVoiceId = 'Kore';
        }
      } catch {
        this.selectedVoiceId = 'Kore';
      }

      try {
        const savedSpeed = localStorage.getItem('shikha_speech_speed');
        if (savedSpeed) {
          const parsed = parseFloat(savedSpeed);
          if (!isNaN(parsed) && parsed >= 0.6 && parsed <= 1.6) {
            this.speechSpeed = parsed;
          }
        }
      } catch {
        this.speechSpeed = 0.95;
      }

      try {
        const savedPowerful = localStorage.getItem('shikha_powerful_mode');
        this.powerfulMode = savedPowerful === 'true';
      } catch {
        this.powerfulMode = false;
      }
    }
  }

  public setOnFallback(cb: (reason: string) => void) {
    this.onFallbackCallback = cb;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public getSelectedVoiceId(): string {
    return this.powerfulMode ? 'Gacrux' : this.selectedVoiceId;
  }

  public setSelectedVoiceId(voiceId: string) {
    if (EXACT_GEMINI_VOICES.some((v) => v.id === voiceId)) {
      this.selectedVoiceId = voiceId;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('shikha_gemini_voice', voiceId);
        } catch {
          // ignore
        }
      }
    }
  }

  public getPowerfulMode(): boolean {
    return this.powerfulMode;
  }

  public setPowerfulMode(enabled: boolean) {
    this.powerfulMode = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shikha_powerful_mode', enabled ? 'true' : 'false');
      } catch {
        // ignore
      }
    }
  }

  public getSpeechSpeed(): number {
    return this.speechSpeed;
  }

  public setSpeechSpeed(speed: number) {
    this.speechSpeed = Math.min(Math.max(speed, 0.6), 1.6);
    if (this.currentAudio) {
      try {
        this.currentAudio.playbackRate = this.effectivePlaybackRate();
      } catch {
        // ignore
      }
    }
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.playbackRate.value = this.effectivePlaybackRate();
      } catch {
        // ignore
      }
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shikha_speech_speed', this.speechSpeed.toString());
      } catch {
        // ignore
      }
    }
  }

  private effectivePlaybackRate(): number {
    // When Powerful Mode is active, speech is delivered slightly slower and deeper
    if (this.powerfulMode) {
      return Math.min(this.speechSpeed * 0.92, 1.0);
    }
    return this.speechSpeed;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.currentSourceNode = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    speechVoiceService.stop();
  }

  public isPlaying(): boolean {
    return Boolean(this.currentSourceNode || (this.currentAudio && !this.currentAudio.paused));
  }

  /**
   * Plays a pre-generated base64 WAV string with speed and optional powerful acoustic resonance
   */
  public async playAudio(
    base64Wav: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    if (this.isMuted) {
      callbacks?.onEnd?.();
      return;
    }

    this.stop();

    const rate = this.effectivePlaybackRate();
    const ctx = this.getAudioContext();

    if (ctx) {
      try {
        const arrayBuffer = base64ToArrayBuffer(base64Wav);
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = rate;

        // When Powerful mode is ON, enhance deep warmth & resonance
        if (this.powerfulMode) {
          source.detune.value = -90; // Subtle deeper pitch
          const bassFilter = ctx.createBiquadFilter();
          bassFilter.type = 'lowshelf';
          bassFilter.frequency.value = 240;
          bassFilter.gain.value = 3.5;

          source.connect(bassFilter);
          bassFilter.connect(ctx.destination);
        } else {
          source.connect(ctx.destination);
        }

        let hasEnded = false;
        source.onended = () => {
          if (!hasEnded) {
            hasEnded = true;
            this.currentSourceNode = null;
            callbacks?.onEnd?.();
          }
        };

        this.currentSourceNode = source;
        callbacks?.onStart?.();
        source.start(0);
        return;
      } catch (e) {
        console.warn('Web Audio playback decode error, falling back to HTMLAudio:', e);
      }
    }

    // Fallback using HTML5 Audio element
    try {
      const audioUrl = base64Wav.startsWith('data:')
        ? base64Wav
        : `data:audio/wav;base64,${base64Wav}`;

      const audio = new Audio(audioUrl);
      audio.playbackRate = rate;
      this.currentAudio = audio;

      audio.onplay = () => callbacks?.onStart?.();
      audio.onended = () => {
        this.currentAudio = null;
        callbacks?.onEnd?.();
      };
      audio.onerror = (e) => {
        this.currentAudio = null;
        callbacks?.onError?.(e) ?? callbacks?.onEnd?.();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          callbacks?.onError?.(err) ?? callbacks?.onEnd?.();
        });
      }
    } catch (err) {
      callbacks?.onError?.(err) ?? callbacks?.onEnd?.();
    }
  }

  /**
   * Generates and plays audio for any text using Gemini TTS with browser fallback
   */
  public async speakText(
    text: string,
    voiceId?: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    if (this.isMuted) {
      callbacks?.onEnd?.();
      return;
    }

    this.stop();

    const voice = this.powerfulMode ? 'Gacrux' : (voiceId || this.selectedVoiceId || 'Kore');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice,
          powerfulMode: this.powerfulMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`TTS server error ${res.status}`);
      }

      const data = await res.json();
      if (data.audio) {
        await this.playAudio(data.audio, callbacks);
        return;
      }
      throw new Error('No audio returned');
    } catch (err) {
      console.warn('Gemini TTS failed, falling back to browser hi-IN voice:', err);
      this.onFallbackCallback?.('Gemini TTS unavailable, using browser Hindi voice.');
      speechVoiceService.speak(text, callbacks);
    }
  }

  /**
   * Tests a voice with the exact Hindi sample: "Namaste, main Shikha ji hoon. Aap kaise hain?"
   */
  public async testVoiceSample(
    voiceId: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    const hindiSample = HINDI_TEST_SAMPLE;
    const cacheKey = `${voiceId}:${this.powerfulMode ? 'pow' : 'std'}`;

    if (this.testAudioCache.has(cacheKey)) {
      await this.playAudio(this.testAudioCache.get(cacheKey)!, callbacks);
      return;
    }

    callbacks?.onStart?.();

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: hindiSample,
          voice: voiceId,
          powerfulMode: this.powerfulMode,
        }),
      });

      const data = await res.json();
      if (data.audio) {
        this.testAudioCache.set(cacheKey, data.audio);
        await this.playAudio(data.audio, callbacks);
      } else {
        throw new Error('No audio in response');
      }
    } catch (err) {
      console.warn('Voice test failed, using browser voice fallback:', err);
      this.onFallbackCallback?.('Gemini sample unavailable, using browser voice.');
      speechVoiceService.speak(hindiSample, callbacks);
    }
  }
}

export const geminiTTSService = new GeminiTTSService();
