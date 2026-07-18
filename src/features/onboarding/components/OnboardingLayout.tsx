import PageLayout from '@/components/layout/PageeLayout';

interface OnboardingLayoutProps {
  /** 진행 바 비율 (0~1) */
  progress: number;
  children: React.ReactNode;
}

/** 온보딩 공용 레이아웃 - Fitty 타이틀 + 보라색 진행 바 */
const OnboardingLayout = ({ progress, children }: OnboardingLayoutProps) => (
  <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
    <header className="border-b border-neutral-100 pb-3 pt-4 text-center text-lg font-bold">
      Fitty
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
