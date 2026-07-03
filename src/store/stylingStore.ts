import { create } from 'zustand';
import type { StylingContext, ClothingItem, Outfit } from '../types';

interface StylingState {
  // 코디 생성 입력값
  selectedDate: string | null;      // YYYY-MM-DD
  selectedContext: StylingContext | null;
  selectedMood: string | null;
  selectedBaseItem: ClothingItem | null;

  // 생성 결과
  generatedOutfit: Outfit | null;
  isGenerating: boolean;
  generationError: string | null;

  // 액션
  setDate: (date: string) => void;
  setContext: (context: StylingContext) => void;
  setMood: (mood: string) => void;
  setBaseItem: (item: ClothingItem) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGeneratedOutfit: (outfit: Outfit) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
}

const useStylingStore = create<StylingState>((set) => ({
  selectedDate: null,
  selectedContext: null,
  selectedMood: null,
  selectedBaseItem: null,
  generatedOutfit: null,
  isGenerating: false,
  generationError: null,

  setDate: (date) => set({ selectedDate: date }),
  setContext: (context) => set({ selectedContext: context }),
  setMood: (mood) => set({ selectedMood: mood }),
  setBaseItem: (item) => set({ selectedBaseItem: item }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setGeneratedOutfit: (outfit) => set({ generatedOutfit: outfit, isGenerating: false }),
  setGenerationError: (error) => set({ generationError: error, isGenerating: false }),

  reset: () =>
    set({
      selectedDate: null,
      selectedContext: null,
      selectedMood: null,
      selectedBaseItem: null,
      generatedOutfit: null,
      isGenerating: false,
      generationError: null,
    }),
}));

export default useStylingStore;