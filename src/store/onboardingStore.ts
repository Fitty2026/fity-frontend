import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StyleTag } from '../types';

interface OnboardingState {
  selectedStyles: StyleTag[];
  bodyImageFile: File | null;
  bodyImageUrl: string | null;
  avatarImageUrl: string | null;
  isOnboardingComplete: boolean;
  marketingAgreed: boolean;

  toggleStyle: (style: StyleTag) => void;
  setBodyImage: (file: File, url: string) => void;
  setAvatarImage: (url: string) => void;
  setMarketingAgreed: (agreed: boolean) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      selectedStyles: [],
      bodyImageFile: null,
      bodyImageUrl: null,
      avatarImageUrl: null,
      isOnboardingComplete: false,
      marketingAgreed: false,

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

      setMarketingAgreed: (agreed) =>
        set({ marketingAgreed: agreed }),

      completeOnboarding: () =>
        set({ isOnboardingComplete: true }),

      reset: () =>
        set({
          selectedStyles: [],
          bodyImageFile: null,
          bodyImageUrl: null,
          avatarImageUrl: null,
          isOnboardingComplete: false,
          marketingAgreed: false,
        }),
    }),
    {
      name: 'fitty-onboarding', // localStorage key
      partialize: (state) => ({
        // File/objectURL은 저장 불가·불필요하므로 제외
        selectedStyles: state.selectedStyles,
        isOnboardingComplete: state.isOnboardingComplete,
        marketingAgreed: state.marketingAgreed,
      }),
    },
  ),
);

export default useOnboardingStore;
