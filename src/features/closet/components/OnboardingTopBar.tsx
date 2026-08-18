import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 건너뛰기 도착지 — 등록을 중단한 사용자는 옷장이 아니라 홈으로 나간다.
 * 화면마다 흩어져 있으면 또 어긋나므로 여기 한 곳에서만 정한다.
 */
const SKIP_TO = '/home';

/**
 * 직전 화면의 진행률. 화면이 바뀌어도 바가 끊기지 않고 이어서 차오르게 하려고
 * 모듈 스코프에 들고 있는다 (SPA라 라우트 이동 사이에 유지됨).
 */
let lastProgress = 0;

interface OnboardingTopBarProps {
  /** 진행률 0~1. 지정 시 하단 프로그레스 바 표시 */
  progress?: number;
  /** 우측 "건너뛰기" 노출 여부. 누르면 기본으로 홈(SKIP_TO)으로 나간다 */
  showSkip?: boolean;
  /** 기본 도착지(홈) 말고 다르게 보내야 할 때만 지정 */
  onSkip?: () => void;
  /** 좌측 뒤로가기 노출 여부 */
  showBack?: boolean;
  onBack?: () => void;
}

/**
 * 옷장 온보딩 상단 바 — 가운데 "Fitty" 워드마크, 우측 건너뛰기, 하단 진행 바.
 * Figma: Fitty = Instrument Sans 700 / 23px / #1F2124.
 * 진행 바 = 375×4, 채움 #9D98F0 / 트랙 #E6E8EA.
 */
const OnboardingTopBar = ({
  progress,
  showSkip = false,
  onSkip,
  showBack = false,
  onBack,
}: OnboardingTopBarProps) => {
  const navigate = useNavigate();
  // 이전 값으로 먼저 그린 뒤 다음 프레임에 목표값으로 — CSS transition이 그 사이를 채운다
  const [width, setWidth] = useState(lastProgress);

  useEffect(() => {
    if (progress === undefined) return;
    const frame = requestAnimationFrame(() => setWidth(progress));
    lastProgress = progress;
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  return (
    <div className="w-full bg-white pt-[env(safe-area-inset-top,0px)]">
      <div className="relative flex items-center justify-center h-[53px] px-4">
        {showBack && (
          <button type="button" onClick={onBack} aria-label="뒤로" className="absolute left-6 cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path
                d="M15.75 19.5L8.25 12L15.75 4.5"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <span className="font-['Instrument_Sans'] font-bold text-[23px] leading-none text-[#1F2124]">
          Fitty
        </span>
        {showSkip && (
          <button
            type="button"
            onClick={onSkip ?? (() => navigate(SKIP_TO))}
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
            className="h-full rounded-r-[4px] bg-[#9D98F0] transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(Math.max(width, 0), 1) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default OnboardingTopBar;
