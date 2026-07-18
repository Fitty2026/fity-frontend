/** 뒤로가기 아이콘 — Figma 에셋 (16×16) */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/** 별 아이콘 — 보유 스타 카운트 (16×15, STY-01과 동일) */
const StarIcon = () => (
  <svg width="16" height="15" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.00003 1L11.472 5.93691L17 6.73344L13 10.5741L13.944 16L9.00003 13.4369L4.05603 16L5.00003 10.5741L1.00003 6.73344L6.52803 5.93691L9.00003 1Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface StudioHeaderProps {
  /** 가운데 타이틀 (기본 '스튜디오') */
  title?: string;
  onBack?: () => void;
  /** 우측 보유 스타 카운트 */
  starCount?: number;
  className?: string;
}

/**
 * 스튜디오(코디 생성) 공통 헤더 — 방식 선택/날짜/무드/아이템 화면 공용
 * - 좌: 뒤로가기 / 중앙: 타이틀 / 우: ☆ 스타 카운트
 * ※ 정확한 px(높이·별 아이콘·카운트 폰트/컬러)는 Figma 속성 패널 캡쳐로 확정 예정
 */
const StudioHeader = ({ title = '스튜디오', onBack, starCount, className = '' }: StudioHeaderProps) => {
  return (
    <header
      className={['relative flex items-center justify-center h-16 px-4 bg-white', className]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 flex items-center justify-center w-10 h-10 -ml-2 bg-transparent!"
        aria-label="뒤로가기"
      >
        <BackIcon />
      </button>

      <h1 className="text-base font-medium leading-5 text-black">{title}</h1>

      {typeof starCount === 'number' && (
        <div className="absolute right-[22px] flex items-center gap-1">
          <StarIcon />
          {/* Figma: Pretendard 500 / 14 / lh20 / #5E5E5E */}
          <span className="text-[14px] font-medium leading-5 text-[#5E5E5E]">{starCount}</span>
        </div>
      )}
    </header>
  );
};

export default StudioHeader;
