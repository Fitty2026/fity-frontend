interface OnboardingTopBarProps {
  /** 진행률 0~1. 지정 시 하단 프로그레스 바 표시 */
  progress?: number;
  /** 우측 "건너뛰기" 노출 여부 */
  showSkip?: boolean;
  onSkip?: () => void;
}

/**
 * 옷장 온보딩 상단 바 — 가운데 "Fitty" 로고, 우측 건너뛰기, 하단 진행 바.
 * 쇼핑몰 선택 / 권한 동의 등 온보딩 스텝 화면 공통.
 */
const OnboardingTopBar = ({ progress, showSkip = false, onSkip }: OnboardingTopBarProps) => {
  return (
    <div className="w-full bg-white">
      <div className="relative flex items-center justify-center h-14 px-4">
        <span className="text-lg font-bold text-black">Fitty</span>
        {showSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="absolute right-4 flex items-center gap-0.5 text-sm text-neutral-400 cursor-pointer"
          >
            건너뛰기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
      {progress !== undefined && (
        <div className="h-1 w-full bg-neutral-100">
          <div
            className="h-full bg-violet-400 transition-[width] duration-300"
            style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default OnboardingTopBar;
