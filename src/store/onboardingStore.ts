import { create } from 'zustand';
import type { StyleTag } from '../types';

interface OnboardingState {
  selectedStyles: StyleTag[];
  bodyImageFile: File | null;
  bodyImageUrl: string | null;
  avatarImageUrl: string | null;
  isOnboardingComplete: boolean;

  toggleStyle: (style: StyleTag) => void;
  setBodyImage: (file: File, url: string) => void;
  setAvatarImage: (url: string) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const useOnboardingStore = create<OnboardingState>((set) => ({
  selectedStyles: [],
  bodyImageFile: null,
  bodyImageUrl: null,
  avatarImageUrl: null,
  isOnboardingComplete: false,

  // 스타일 태그 토글 (다중 선택)
  toggleStyle: (style) =>
    set((state) => ({
      selectedStyles: state.selectedStyles.includes(style)
        ? state.selectedStyles.filter((s) => s !== style)
        : [...state.selectedStyles, style],
    })),

  setBodyImage: (file, url) =>
    set({ bodyImageFile: file, bodyImageUrl: url }),

  setAvatarImage: (url) =>
    set({ avatarImageUrl: url }),

  completeOnboarding: () =>
    set({ isOnboardingComplete: true }),

  reset: () =>
    set({
      selectedStyles: [],
      bodyImageFile: null,
      bodyImageUrl: null,
      avatarImageUrl: null,
      isOnboardingComplete: false,
    }),
}));

export default useOnboardingStore;