interface FilterChipsProps {
  options: string[];
  active: string;
  onChange?: (option: string) => void;
  className?: string;
}

/**
 * 기준 아이템 선택 — 카테고리 칩 (전체/상의/하의/신발/악세사리/기타)
 * - 활성 = 다크 배경 + 흰 텍스트 / 비활성 = 흰 배경 + 테두리
 */
const FilterChips = ({ options, active, onChange, className = '' }: FilterChipsProps) => {
  return (
    <div className={['flex gap-2 overflow-x-auto no-scrollbar', className].filter(Boolean).join(' ')}>
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange?.(option)}
            className={[
              'shrink-0 h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors',
              isActive
                ? 'bg-[#1F2124] text-white'
                : 'bg-white border border-[#D6DADF] text-[#5A6169]',
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
