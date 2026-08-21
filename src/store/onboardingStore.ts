import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BodyAnalyzeResult } from '../features/onboarding/api/bodyProfileApi';
import type { StyleTag } from '../types';

interface OnboardingState {
  selectedStyles: StyleTag[];
  /** 촬영/업로드한 체형 사진 objectURL - 세션 한정이라 persist 제외 */
  bodyPhotoUrls: string[];
  analysisResult: BodyAnalyzeResult | null;
  isOnboardingComplete: boolean;
  marketingAgreed: boolean;
  /** 옷장 준비 완료 화면(/closet/register/complete)을 이미 봤는지 — 최초 1회만 보여준다 */
  closetCompleteSeen: boolean;
  /** 옷 등록 권한 안내(/closet/register/permission)를 이미 봤는지 — 최초 1회만 거친다 */
  closetPermissionSeen: boolean;

  toggleStyle: (style: StyleTag) => void;
  setBodyPhotoUrls: (urls: string[]) => void;
  setAnalysisResult: (result: BodyAnalyzeResult) => void;
  
  /** 체형 사진 한 장 추가 (최대 3장) */
  addBodyPhotoUrl: (url: string) => void;
  /** 특정 슬롯(index)의 체형 사진 교체 */
  replaceBodyPhotoUrl: (index: number, url: string) => void;
  
  setMarketingAgreed: (agreed: boolean) => void;
  completeOnboarding: () => void;
  markClosetCompleteSeen: () => void;
  markClosetPermissionSeen: () => void;
  reset: () => void;
}

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      selectedStyles: [],
      bodyPhotoUrls: [],
      analysisResult: null,
      isOnboardingComplete: false,
      marketingAgreed: false,
      closetCompleteSeen: false,
      closetPermissionSeen: false,

      // 스타일 태그 토글 (다중 선택)
      toggleStyle: (style) =>
        set((state) => ({
          selectedStyles: state.selectedStyles.includes(style)
            ? state.selectedStyles.filter((s) => s !== style)
            : [...state.selectedStyles, style],
        })),

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

      markClosetCompleteSeen: () => set({ closetCompleteSeen: true }),

      markClosetPermissionSeen: () => set({ closetPermissionSeen: true }),

      reset: () =>
        set({
          selectedStyles: [],
          bodyPhotoUrls: [],
          analysisResult: null,
          isOnboardingComplete: false,
          marketingAgreed: false,
          closetCompleteSeen: false,
          closetPermissionSeen: false,
        }),
    }),
    {
      name: 'fitty-onboarding', // localStorage key
      partialize: (state) => ({
        // objectURL/분석 결과는 세션 한정이므로 제외
        selectedStyles: state.selectedStyles,
        isOnboardingComplete: state.isOnboardingComplete,
        marketingAgreed: state.marketingAgreed,
        closetCompleteSeen: state.closetCompleteSeen,
        closetPermissionSeen: state.closetPermissionSeen,
      }),
    },
  ),
);

export default useOnboardingStore;
