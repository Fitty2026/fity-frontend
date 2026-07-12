/** 뒤로가기 아이콘 — Figma 에셋 (16×16) */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/** 별 아이콘 — 보유 스타 카운트 (※ px/컬러 캡쳐로 확정 필요) */
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 0.5L8.854 5.146L13.5 5.5L9.75 8.5L11 13L7 10.5L3 13L4.25 8.5L0.5 5.5L5.146 5.146L7 0.5Z" fill="black" />
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
        <div className="absolute right-4 flex items-center gap-1">
          <StarIcon />
          <span className="text-sm font-medium leading-5 text-black">{starCount}</span>
        </div>
      )}
    </header>
  );
};

export default StudioHeader;
