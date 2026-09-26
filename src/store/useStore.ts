import { create } from 'zustand';

interface AppState {
  // Chat state
  messages: { role: string; text: string }[];
  chatHistory: any[];
  isTyping: boolean;
  addMessage: (msg: { role: string; text: string }) => void;
  setChatHistory: (history: any[]) => void;
  setIsTyping: (typing: boolean) => void;

  // Settings state
  aiPersonality: string; // 'friendly' | 'expert'
  setAiPersonality: (val: string) => void;
  
  temperatureUnit: string;
  setTemperatureUnit: (val: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Global Chat State
  messages: [{ role: "assistant", text: "Hello! I'm your climate assistant. How can I help you plan your day around the weather?" }],
  chatHistory: [],
  isTyping: false,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setChatHistory: (history) => set({ chatHistory: history }),
  setIsTyping: (typing) => set({ isTyping: typing }),

  // Global Settings State
  aiPersonality: "friendly",
  setAiPersonality: (val) => set({ aiPersonality: val }),

  temperatureUnit: "celsius",
  setTemperatureUnit: (val) => set({ temperatureUnit: val })
}));
