/** 옷걸이 + 보유 개수 (헤더 우측) — Figma 옷걸이 에셋 16×16 #1F2124, 아이콘↔텍스트 gap 4 */
const HangerCountBadge = ({ count }: { count: number }) => (
  <span className="flex items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.0982 10.7L8.83321 6L10.2995 4.9C10.3617 4.85349 10.4122 4.79313 10.447 4.7237C10.4818 4.65427 10.5 4.57768 10.5001 4.5C10.5001 3.83696 10.2367 3.20107 9.76785 2.73223C9.29901 2.26339 8.66312 2 8.00008 2C7.33704 2 6.70115 2.26339 6.23231 2.73223C5.76347 3.20107 5.50008 3.83696 5.50008 4.5C5.50008 4.63261 5.55276 4.75979 5.64653 4.85355C5.7403 4.94732 5.86747 5 6.00008 5C6.13269 5 6.25987 4.94732 6.35363 4.85355C6.4474 4.75979 6.50008 4.63261 6.50008 4.5C6.50109 4.12339 6.64374 3.76094 6.89968 3.48466C7.15561 3.20837 7.50612 3.03848 7.88155 3.00872C8.25699 2.97896 8.62988 3.09152 8.92615 3.32403C9.22242 3.55655 9.42038 3.892 9.48071 4.26375L7.70883 5.59312L7.69133 5.60625L0.901955 10.7C0.734177 10.8258 0.610207 11.0012 0.54758 11.2014C0.484953 11.4015 0.48684 11.6163 0.552974 11.8153C0.619107 12.0144 0.74614 12.1876 0.916103 12.3104C1.08607 12.4333 1.29036 12.4996 1.50008 12.5H14.5001C14.71 12.5 14.9145 12.434 15.0848 12.3112C15.2551 12.1885 15.3824 12.0153 15.4488 11.8162C15.5151 11.6171 15.5172 11.4022 15.4546 11.2018C15.392 11.0015 15.268 10.8259 15.1001 10.7H15.0982ZM14.5001 11.5H1.50008L8.00008 6.625L14.5001 11.5Z" fill="#1F2124" />
    </svg>
    {count}개
  </span>
);

/** 뒤로가기 화살표 */
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1F2124" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 4 6.5 10l6 6" />
  </svg>
);

interface StudioHeaderProps {
  /** 기본 '스튜디오'. */
  title?: string;
  /** true면 타이틀을 Fitty 로고 스타일로 렌더 */
  logo?: boolean;
  onBack?: () => void;
  /** 값 있으면 우측에 옷걸이+개수 표시 */
  count?: number;
  /** 값 있으면 우측에 '건너뛰기 ›' 표시 (count보다 후순위) */
  onSkip?: () => void;
}

/**
 * 스튜디오 플로우 공통 헤더
 * - 좌: 뒤로가기(optional) / 중앙: 타이틀 or Fitty 로고 / 우: 88개 카운트 or 건너뛰기
 */
const StudioHeader = ({ title = '스튜디오', logo = false, onBack, count, onSkip }: StudioHeaderProps) => {
  return (
    <header className="relative shrink-0 flex items-center justify-center h-[53px] px-5 bg-inherit border-b border-[#B2B8BD]">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="absolute left-4 flex items-center justify-center w-9 h-9"
        >
          <BackIcon />
        </button>
      )}

      {logo ? (
        // Figma: Instrument Sans 700 / 23px / lh100% / letter-spacing 0 / #1F2124
        <span
          className="text-[23px] font-bold leading-none tracking-normal text-[#1F2124]"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          Fitty
        </span>
      ) : (
        /* Figma: Pretendard 600 / 20px / lh150% / -2% / #1F2124 */
        <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">{title}</span>
      )}

      {count !== undefined ? (
        <span className="absolute right-5">
          <HangerCountBadge count={count} />
        </span>
      ) : onSkip ? (
        /* Figma: Pretendard 500 / 14px / lh160% / -2% / #B2B8BD, 텍스트↔체브론 4, 우측 inset 26 */
        <button
          type="button"
          onClick={onSkip}
          className="absolute right-[26px] flex items-center gap-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#B2B8BD]"
        >
          건너뛰기
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3L10.5 8L5.5 13" stroke="#B2B8BD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
    </header>
  );
};

export default StudioHeader;
