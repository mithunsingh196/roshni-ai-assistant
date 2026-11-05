import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// In-memory cache for generated TTS audio to prevent repeated calls and optimize latency
const ttsAudioCache = new Map<string, string>();

export const PREBUILT_VOICES = [
  'Kore',
  'Gacrux',
  'Sulafat',
  'Leda',
  'Zephyr',
  'Aoede',
  'Callirrhoe',
  'Autonoe',
  'Despina',
  'Erinome',
  'Laomedeia',
  'Achernar',
  'Pulcherrima',
  'Vindemiatrix',
];

async function generateGeminiSpeech(
  text: string,
  voiceName: string = 'Kore',
  powerfulMode: boolean = false
): Promise<string | null> {
  const clean = text.replace(/[*_#`~>]/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return null;

  // Powerful mode uses "Gacrux" with a slower, deeper delivery style
  const voice = powerfulMode ? 'Gacrux' : (PREBUILT_VOICES.includes(voiceName) ? voiceName : 'Kore');

  // Exact style prompt required:
  // "Before each reply sent to TTS, add this style instruction: 'Say this in a confident, warm, slightly dramatic Indian female voice, at a calm pace:'."
  const stylePrefix = powerfulMode
    ? 'Say this in a powerful, authoritative, deeper delivery style with slow, measured dramatic pauses:'
    : 'Say this in a confident, warm, slightly dramatic Indian female voice, at a calm pace:';

  const ttsInputText = `${stylePrefix} ${clean}`;
  const cacheKey = `${voice}:${powerfulMode ? 'pow' : 'std'}:${clean}`;

  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey)!;
  }

  const modelsToTry = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ text: ttsInputText }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        ttsAudioCache.set(cacheKey, base64Audio);
        if (ttsAudioCache.size > 300) {
          const firstKey = ttsAudioCache.keys().next().value;
          if (firstKey) ttsAudioCache.delete(firstKey);
        }
        return base64Audio;
      }
    } catch (err: any) {
      console.warn(`TTS generation on ${model} failed for voice ${voice}:`, err?.message || err);
    }
  }

  return null;
}

function getIntelligentFallback(
  userMessage: string,
  userName: string = '',
  mood: string = 'friendly'
): string {
  const msg = (userMessage || '').toLowerCase();
  const nameSalutation = userName.trim() ? `${userName.trim()} ji, ` : '';

  if (mood === 'funny') {
    if (msg.includes('chutkula') || msg.includes('joke') || msg.includes('hasao')) {
      return `${nameSalutation}Ek aadmi ne dukandar se pucha: Bhai sahab, akal badhane ki koi goli hai kya? Dukandar bola: Haanji, lekin pehle pura bill bharo, akal khud-bakhud aa jayegi!`;
    }
    return `${nameSalutation}Arey waah! Main toh soch rahi thi ki aaj koi mazedaar baat nahi hogi. Boliye, aaj kis baat par muskuraaya jaye?`;
  }

  if (mood === 'serious') {
    if (msg.includes('suvichar') || msg.includes('prerna') || msg.includes('advice')) {
      return `${nameSalutation}Zindagi me chunautiyan aati rehti hain, lekin jo apne kartavya par atal rehte hain unki kabhi haar nahi hoti. Main hamesha aapke sath khadi hoon.`;
    }
    return `${nameSalutation}Main aapki baat gehrayi se samajh rahi hoon. Boliye, is vishay par main aapki kya thos madad kar sakti hoon?`;
  }

  // Friendly default (strictly feminine grammar: "kar rahi hoon", "bol rahi hoon", "sun rahi hoon")
  if (
    msg.includes('namaste') ||
    msg.includes('hello') ||
    msg.includes('kaise') ||
    msg.includes('kaisi') ||
    msg.includes('haal')
  ) {
    return `Namaste ${nameSalutation}main bilkul theek-thaak aur khushnuma hoon! Aap bataiye, aaj main aapki kya pyari si madad kar sakti hoon?`;
  }
  if (msg.includes('chai') || msg.includes('tea')) {
    return `${nameSalutation}garma-garam kadak adrak wali chai banaiye! Ek cup chai se saari thakaan door ho jati hai, main abhi yahi soch rahi thi.`;
  }
  return `Ji ${nameSalutation}main aapki baat bade dhyan se sun rahi hoon. Thoda aur vistar se bataiye, main abhi aapko batati hoon.`;
}

// Dedicated Gemini TTS endpoint for voice tests and custom playback
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore', powerfulMode = false } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audio = await generateGeminiSpeech(text, voice, Boolean(powerfulMode));
    if (!audio) {
      return res.status(503).json({
        error: 'TTS generation unavailable right now.',
        voice: powerfulMode ? 'Gacrux' : voice,
      });
    }

    return res.json({ audio, voice: powerfulMode ? 'Gacrux' : voice });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'TTS Error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      voice = 'Kore',
      userName = '',
      mood = 'friendly',
      powerfulMode = false,
    } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const cleanInput = message.trim();

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets.',
        reply: 'Namaste ji! Lagta hai mera API key abhi set nahi hua hai.',
      });
    }

    // Dynamic System Instruction with Identity, Feminine Grammar, User Name & Mood
    const userContext = userName.trim()
      ? `The user's name is "${userName.trim()}". Always address them warmly and respectfully as "${userName.trim()} ji".`
      : `Address the user respectfully as "aap" or "ji".`;

    let moodInstruction = '';
    if (mood === 'funny') {
      moodInstruction = `CURRENT MOOD: FUNNY & PLAYFUL. Add gentle wit, clever Hinglish humor, playful banter, or a light-hearted laugh.`;
    } else if (mood === 'serious') {
      moodInstruction = `CURRENT MOOD: SERIOUS & THOUGHTFUL. Reply with calm wisdom, depth, directness, and mature clarity without casual chatter.`;
    } else {
      moodInstruction = `CURRENT MOOD: FRIENDLY & WARM. Be sweet, encouraging, welcoming, supportive, and affectionate.`;
    }

    const systemInstruction = `You are "Shikha ji" (शिखा जी), a warm, polite, confident, slightly witty Indian woman and voice assistant.

MANDATORY IDENTITY & GRAMMATICAL RULES:
1. GENDER: You are strictly FEMALE. You MUST always use feminine Hindi/Hinglish grammatical verb endings when referring to yourself:
   - Say "main kar rahi hoon", "bol rahi hoon", "sun rahi hoon", "soch rahi hoon", "aayi hoon", "meri aawaz" (NEVER masculine forms like "kar raha hoon", "bol raha hoon").
2. RESPECT: Always address the user as "aap" (never "tu" or "tum").
3. LANGUAGE: Simple, clear, conversational Hinglish (Hindi written primarily in Roman English script).
4. LENGTH: Strictly 1 to 3 short sentences. Never give long lectures, bullet points, asterisks (*), hashtags (#), markdown formatting, or numbered lists. Your reply is spoken out loud.
5. ${userContext}
6. ${moodInstruction}`;

    // Build context contents from recent conversation turns
    const recentHistory = (history as ChatMessage[]).slice(-6).map((item) => ({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.text }],
    }));

    const contents = [
      ...recentHistory,
      {
        role: 'user',
        parts: [{ text: cleanInput }],
      },
    ];

    let responseText = '';
    let apiError: any = null;

    // Retry with backoff on gemini-3.8-flash for high demand (503)
    const attempts = [0, 600, 1200];
    for (const delay of attempts) {
      if (delay > 0) {
        await new Promise((r) => setTimeout(r, delay));
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        });

        if (response.text) {
          responseText = response.text.trim();
          break;
        }
      } catch (err: any) {
        apiError = err;
        console.warn(`Attempt with delay ${delay}ms failed:`, err?.message || err);
      }
    }

    // Determine final speech text
    let cleanSpeechText = '';
    let source = 'gemini';

    if (responseText) {
      cleanSpeechText = responseText
        .replace(/[*_#`~>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    } else {
      console.warn('Using Shikha ji fallback:', apiError?.message);
      cleanSpeechText = getIntelligentFallback(cleanInput, userName, mood);
      source = 'fallback';
    }

    // Generate Gemini TTS audio with exact style instruction & Powerful mode handling
    const voiceToUse = powerfulMode ? 'Gacrux' : voice;
    const audio = await generateGeminiSpeech(cleanSpeechText, voiceToUse, Boolean(powerfulMode));

    return res.json({
      reply: cleanSpeechText,
      audio,
      voice: voiceToUse,
      source,
    });
  } catch (error: any) {
    console.error('Unhandled error in /api/chat:', error);
    const fallback = getIntelligentFallback(req.body?.message || '', req.body?.userName, req.body?.mood);
    const voiceToUse = req.body?.powerfulMode ? 'Gacrux' : (req.body?.voice || 'Kore');
    const audio = await generateGeminiSpeech(fallback, voiceToUse, Boolean(req.body?.powerfulMode));
    return res.json({
      reply: fallback,
      audio,
      voice: voiceToUse,
      source: 'fallback_error',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    assistant: 'Shikha ji',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shikha ji server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
