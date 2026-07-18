/** 옷걸이 + 보유 개수 (헤더 우측) */
const HangerCountBadge = ({ count }: { count: number }) => (
  <span className="flex items-center gap-1 text-[13px] font-medium text-[#1F2124]">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F2124" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7.2 3.6 14.9a1.8 1.8 0 0 0 1.2 3.1h14.4a1.8 1.8 0 0 0 1.2-3.1L12 7.2Z" />
      <path d="M12 7.2v-1a2.3 2.3 0 1 1 2.3-2.3" />
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
    <header className="relative shrink-0 flex items-center justify-center h-[52px] px-5 bg-inherit border-b border-[#EEF0F2]">
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
        <span className="text-[20px] font-extrabold tracking-tight text-[#1F2124]">Fitty</span>
      ) : (
        <span className="text-base font-semibold text-[#1F2124]">{title}</span>
      )}

      {count !== undefined ? (
        <span className="absolute right-5">
          <HangerCountBadge count={count} />
        </span>
      ) : onSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="absolute right-5 flex items-center gap-0.5 text-[13px] font-medium text-[#959BA7]"
        >
          건너뛰기
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#959BA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 2.5 8 6l-3.5 3.5" />
          </svg>
        </button>
      ) : null}
    </header>
  );
};

export default StudioHeader;
