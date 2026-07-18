import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BodyAnalysisResult } from '../features/onboarding/api/bodyAnalysisApi';
import type { StyleTag } from '../types';

export type BodyType = 'straight' | 'wave' | 'natural';

interface OnboardingState {
  selectedStyles: StyleTag[];
  bodyType: BodyType | null;
  /** 촬영/업로드한 체형 사진 objectURL - 세션 한정이라 persist 제외 */
  bodyPhotoUrls: string[];
  analysisResult: BodyAnalysisResult | null;
  isOnboardingComplete: boolean;
  marketingAgreed: boolean;

  toggleStyle: (style: StyleTag) => void;
  setBodyType: (type: BodyType) => void;
  setBodyPhotoUrls: (urls: string[]) => void;
  setAnalysisResult: (result: BodyAnalysisResult) => void;
  setMarketingAgreed: (agreed: boolean) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      selectedStyles: [],
      bodyType: null,
      bodyPhotoUrls: [],
      analysisResult: null,
      isOnboardingComplete: false,
      marketingAgreed: false,

      // 스타일 태그 토글 (다중 선택)
      toggleStyle: (style) =>
        set((state) => ({
          selectedStyles: state.selectedStyles.includes(style)
            ? state.selectedStyles.filter((s) => s !== style)
            : [...state.selectedStyles, style],
        })),

      setBodyType: (type) => set({ bodyType: type }),

      setBodyPhotoUrls: (urls) => set({ bodyPhotoUrls: urls }),

      setAnalysisResult: (result) => set({ analysisResult: result }),

      setMarketingAgreed: (agreed) => set({ marketingAgreed: agreed }),

      completeOnboarding: () => set({ isOnboardingComplete: true }),

      reset: () =>
        set({
          selectedStyles: [],
          bodyType: null,
          bodyPhotoUrls: [],
          analysisResult: null,
          isOnboardingComplete: false,
          marketingAgreed: false,
        }),
    }),
    {
      name: 'fitty-onboarding', // localStorage key
      partialize: (state) => ({
        // objectURL/분석 결과는 세션 한정이므로 제외
        selectedStyles: state.selectedStyles,
        bodyType: state.bodyType,
        isOnboardingComplete: state.isOnboardingComplete,
        marketingAgreed: state.marketingAgreed,
      }),
    },
  ),
);

export default useOnboardingStore;
