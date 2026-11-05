export type AssistantStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export type AssistantMood = 'friendly' | 'funny' | 'serious';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'shikha';
  text: string;
  timestamp: number;
  audio?: string;
  voice?: string;
  mood?: AssistantMood;
}
