interface OnboardingTopBarProps {
  /** 진행률 0~1. 지정 시 하단 프로그레스 바 표시 */
  progress?: number;
  /** 우측 "건너뛰기" 노출 여부 */
  showSkip?: boolean;
  onSkip?: () => void;
}

/**
 * 옷장 온보딩 상단 바 — 가운데 "Fitty" 워드마크, 우측 건너뛰기, 하단 진행 바.
 * Figma: Fitty = Instrument Sans 700 / 23px / #1F2124.
 * 진행 바 = 375×4, 채움 #9D98F0 / 트랙 #E6E8EA.
 */
const OnboardingTopBar = ({ progress, showSkip = false, onSkip }: OnboardingTopBarProps) => {
  return (
    <div className="w-full bg-white pt-[env(safe-area-inset-top,0px)]">
      <div className="relative flex items-center justify-center h-[53px] px-4">
        <span className="font-['Instrument_Sans'] font-bold text-[23px] leading-none text-[#1F2124]">
          Fitty
        </span>
        {showSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="absolute right-5 flex items-center gap-1 text-[14px] text-[#B2B8BD] cursor-pointer"
          >
            건너뛰기
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.600098 0.599609L5.6001 5.59961L0.600098 10.5996" stroke="#B2B8BD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {progress !== undefined && (
        <div className="h-1 w-full bg-[#E6E8EA]">
          <div
            className="h-full bg-[#9D98F0] transition-[width] duration-300"
            style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default OnboardingTopBar;
