interface SortChipProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

/**
 * 기준 아이템 선택 — 정렬/필터 드롭다운 칩 (최신순 ⌄ / 브랜드 ⌄ / 컬러 ⌄)
 * - Figma: hug×30, radius32, border 1px #E6E8EA, bg #FFF, pad 4·16
 * - 텍스트: Pretendard 600 / 14px / lh160% / -2% / #1F2124, 텍스트↔체브론 4
 */
const SortChip = ({ label, onClick, className = '' }: SortChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'shrink-0 flex items-center gap-1 h-[30px] px-4 rounded-[32px] bg-white border border-[#E6E8EA]',
        'text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 5.5L8 10.5L3 5.5" stroke="#1F2124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default SortChip;
