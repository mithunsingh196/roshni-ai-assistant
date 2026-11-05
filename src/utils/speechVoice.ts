/**
 * Speech Synthesis (TTS) manager with intelligent Hindi female voice selection
 */

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  isHindi: boolean;
  isFemale: boolean;
  label: string;
}

class SpeechVoiceService {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onVoicesLoadedCallbacks: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.autoSelectBestVoice();
    this.onVoicesLoadedCallbacks.forEach((cb) => cb());
  }

  public onVoicesLoaded(cb: () => void) {
    this.onVoicesLoadedCallbacks.push(cb);
    if (this.voices.length > 0) {
      cb();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    if (!this.selectedVoice) {
      this.autoSelectBestVoice();
    }
    return this.selectedVoice;
  }

  public setSelectedVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
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

  /**
   * Intelligently selects the best Hindi female voice available in the browser.
   * Priority:
   * 1. hi-IN female (Google हिन्दी, Lekha, Veena, Kalpana, Neerja, Swara, etc.)
   * 2. hi-IN any
   * 3. en-IN Indian English female (Google en-IN, Raveena, Aditi, etc.)
   * 4. Any Indian locale voice
   * 5. Any natural female voice
   * 6. Default
   */
  private autoSelectBestVoice() {
    if (this.voices.length === 0) return;

    const lower = (str: string) => (str || '').toLowerCase();
    const femaleKeywords = ['female', 'woman', 'girl', 'lekha', 'veena', 'kalpana', 'neerja', 'swara', 'raveena', 'aditi', 'zira', 'kavya', 'shruti', 'geeta', 'meera', 'shikha'];

    const hiVoices = this.voices.filter((v) => lower(v.lang).startsWith('hi'));
    
    // 1. hi-IN female
    const hiFemale = hiVoices.find((v) => {
      const name = lower(v.name);
      return femaleKeywords.some((kw) => name.includes(kw));
    });
    if (hiFemale) {
      this.selectedVoice = hiFemale;
      return;
    }

    // 2. Any hi-IN voice (often Google हिन्दी on Android/Chrome is high quality female)
    if (hiVoices.length > 0) {
      // Prefer Google or Microsoft or Apple
      const hiGoogle = hiVoices.find((v) => lower(v.name).includes('google') || lower(v.name).includes('natural'));
      this.selectedVoice = hiGoogle || hiVoices[0];
      return;
    }

    // 3. Indian English female (hi-IN fallback that understands Hinglish accents)
    const inEnVoices = this.voices.filter((v) => lower(v.lang).includes('en-in') || lower(v.lang).includes('en_in'));
    const inEnFemale = inEnVoices.find((v) => {
      const name = lower(v.name);
      return femaleKeywords.some((kw) => name.includes(kw));
    });
    if (inEnFemale) {
      this.selectedVoice = inEnFemale;
      return;
    }

    if (inEnVoices.length > 0) {
      this.selectedVoice = inEnVoices[0];
      return;
    }

    // 4. Any female voice
    const anyFemale = this.voices.find((v) => {
      const name = lower(v.name);
      return femaleKeywords.some((kw) => name.includes(kw));
    });
    if (anyFemale) {
      this.selectedVoice = anyFemale;
      return;
    }

    // 5. Default
    const defaultVoice = this.voices.find((v) => v.default);
    this.selectedVoice = defaultVoice || this.voices[0];
  }

  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onEnd?.();
      return;
    }

    if (this.isMuted) {
      options?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    // Clean text for speech synthesis: strip emojis and punctuation that cause stutter
    const spokenText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*_#`~>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!spokenText) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const voice = this.getSelectedVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'hi-IN';
    } else {
      utterance.lang = 'hi-IN';
    }

    // Warm, respectful, natural tone
    utterance.pitch = 1.05;
    utterance.rate = 0.98;

    let hasEnded = false;

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      if (!hasEnded) {
        hasEnded = true;
        this.currentUtterance = null;
        options?.onEnd?.();
      }
    };

    utterance.onerror = (err) => {
      if (!hasEnded) {
        hasEnded = true;
        this.currentUtterance = null;
        if (err.error !== 'canceled' && err.error !== 'interrupted') {
          console.warn('SpeechSynthesis error:', err);
        }
        options?.onError?.(err) ?? options?.onEnd?.();
      }
    };

    this.currentUtterance = utterance;

    // Chrome bug workaround: speech synthesis sometimes pauses for long texts;
    // ensure resume is triggered
    window.speechSynthesis.speak(utterance);
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const speechVoiceService = new SpeechVoiceService();
