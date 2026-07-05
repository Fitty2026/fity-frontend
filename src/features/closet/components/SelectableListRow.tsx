interface SelectableListRowProps {
  label: string;
  /** 좌측 로고/아이콘 (쇼핑몰 로고 등) */
  leading?: React.ReactNode;
  selected?: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * 선택 리스트 행 (연동 쇼핑몰 선택 등)
 * - 단일/복수 선택은 부모가 결정 (Row 자체는 selected 표시만)
 * - DAT-02 처럼 복수 선택이면 부모가 여러 개 selected 허용
 */
const SelectableListRow = ({
  label,
  leading,
  selected = false,
  onToggle,
  className = '',
}: SelectableListRowProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'w-full flex items-center gap-3 p-3.5 rounded-xl border transition-colors',
        selected ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-400',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leading && (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 shrink-0 overflow-hidden text-xs font-bold">
          {leading}
        </span>
      )}
      <span className="flex-1 text-left text-sm font-medium text-black">{label}</span>

      {/* 선택 인디케이터 */}
      <span
        className={[
          'flex items-center justify-center w-5 h-5 rounded-full border shrink-0 transition-colors',
          selected ? 'bg-black border-black text-white' : 'border-neutral-300 text-transparent',
        ].join(' ')}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
    </button>
  );
};

export default SelectableListRow;
