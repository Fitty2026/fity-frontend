interface FilterChipsProps {
  options: string[];
  active: string;
  onChange?: (option: string) => void;
  className?: string;
}

/**
 * 기준 아이템 선택 — 카테고리 칩 (전체/상의/하의/신발/악세사리/기타)
 * - Figma: 칩 hug×30, radius32, border 1px, pad 4·12, 칩 간 gap 8
 * - 활성: bg·border #1F2124 / 텍스트 #F6F7F8, 비활성: bg #F6F7F8 / border #E6E8EA / 텍스트 #1F2124
 * - 텍스트: Pretendard 500 / 14px / lh160% / -2%
 */
const FilterChips = ({ options, active, onChange, className = '' }: FilterChipsProps) => {
  return (
    <div className={['flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden', className].filter(Boolean).join(' ')} style={{ scrollbarWidth: 'none' }}>
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange?.(option)}
            className={[
              'shrink-0 h-[30px] px-3 rounded-[32px] border text-[14px] font-medium leading-[1.6] tracking-[-0.02em] transition-colors',
              isActive
                ? 'bg-[#1F2124] border-[#1F2124] text-[#F6F7F8]'
                : 'bg-[#F6F7F8] border-[#E6E8EA] text-[#1F2124]',
            ].join(' ')}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
