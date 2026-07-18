interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 섹션 헤더 — 좌: 타이틀 / 우: '전체보기 ›' 액션
 */
const SectionHeader = ({ title, actionLabel = '전체보기', onAction, className = '' }: SectionHeaderProps) => {
  return (
    <div className={['flex items-center justify-between', className].filter(Boolean).join(' ')}>
      <h2 className="text-lg font-bold text-[#1F2124]">{title}</h2>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-0.5 text-[13px] font-medium text-[#959BA7]"
        >
          {actionLabel}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#B2B8BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 2.5 8 6l-3.5 3.5" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
