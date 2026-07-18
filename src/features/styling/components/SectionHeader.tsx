interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 섹션 헤더 — 좌: 타이틀 / 우: '전체보기 ›' 액션
 * - 타이틀: Pretendard 600 / 20px / lh150% / -2% / #1F2124
 * - 액션: Pretendard 500 / 14px / lh160% / -2% / #959BA7, 텍스트↔아이콘 gap 4
 */
const SectionHeader = ({ title, actionLabel = '전체보기', onAction, className = '' }: SectionHeaderProps) => {
  return (
    <div className={['flex items-center justify-between', className].filter(Boolean).join(' ')}>
      <h2 className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">{title}</h2>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]"
        >
          {actionLabel}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3L10.5 8L5.5 13" stroke="#959BA7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
