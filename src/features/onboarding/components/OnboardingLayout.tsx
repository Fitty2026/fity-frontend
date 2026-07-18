import PageLayout from '@/components/layout/PageeLayout';

interface OnboardingLayoutProps {
  /** 진행 바 비율 (0~1) */
  progress: number;
  /** 지정 시 우상단에 "건너뛰기 >" 버튼 표시 */
  onSkip?: () => void;
  children: React.ReactNode;
}

/** 온보딩 공용 레이아웃 - Fitty 타이틀 + 보라색 진행 바 */
const OnboardingLayout = ({ progress, onSkip, children }: OnboardingLayoutProps) => (
  <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
    <header className="relative border-b border-neutral-100 pb-3 pt-4 text-center text-lg font-bold">
      Fitty
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-normal text-neutral-400"
        >
          건너뛰기 &gt;
        </button>
      )}
    </header>
    <div className="h-1 w-full bg-neutral-100">
      <div
        className="h-full rounded-r-full bg-violet-400 transition-all duration-500 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
    <div className="flex flex-1 flex-col">{children}</div>
  </PageLayout>
);

export default OnboardingLayout;
