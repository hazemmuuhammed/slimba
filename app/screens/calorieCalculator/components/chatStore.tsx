import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatStoreState {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatStoreState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage', // unique name
      getStorage: () => AsyncStorage, // Use AsyncStorage for storage
    }
  )
);

export default useChatStore;
