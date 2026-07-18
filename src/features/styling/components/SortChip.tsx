interface SortChipProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

/**
 * 기준 아이템 선택 — 정렬/필터 드롭다운 칩 (최신순 ⌄ / 브랜드 ⌄ / 컬러 ⌄)
 */
const SortChip = ({ label, onClick, className = '' }: SortChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'shrink-0 flex items-center gap-1 h-9 px-3.5 rounded-full bg-white border border-[#D6DADF] text-[13px] font-medium text-[#5A6169]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#959BA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 4.5 3 3 3-3" />
      </svg>
    </button>
  );
};

export default SortChip;
