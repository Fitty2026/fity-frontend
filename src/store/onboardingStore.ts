import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BodyAnalyzeResult } from '../features/onboarding/api/bodyProfileApi';
import type { StyleTag } from '../types';

export type BodyType = 'straight' | 'wave' | 'natural';

interface OnboardingState {
  selectedStyles: StyleTag[];
  bodyType: BodyType | null;
  /** 촬영/업로드한 체형 사진 objectURL - 세션 한정이라 persist 제외 */
  bodyPhotoUrls: string[];
  analysisResult: BodyAnalyzeResult | null;
  isOnboardingComplete: boolean;
  marketingAgreed: boolean;

  toggleStyle: (style: StyleTag) => void;
  setBodyType: (type: BodyType) => void;
  setBodyPhotoUrls: (urls: string[]) => void;
  setAnalysisResult: (result: BodyAnalyzeResult) => void;
  
  /** 체형 사진 한 장 추가 (최대 3장) */
  addBodyPhotoUrl: (url: string) => void;
  /** 특정 슬롯(index)의 체형 사진 교체 */
  replaceBodyPhotoUrl: (index: number, url: string) => void;
  
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

      addBodyPhotoUrl: (url) =>
        set((state) => ({ bodyPhotoUrls: [...state.bodyPhotoUrls, url].slice(0, 3) })),

      replaceBodyPhotoUrl: (index, url) =>
        set((state) => ({
          bodyPhotoUrls: state.bodyPhotoUrls.map((u, i) => (i === index ? url : u)),
        })),

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
