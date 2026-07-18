interface ConsentItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  /** (필수) 표기 */
  required?: boolean;
  /** 상세보기 화살표 노출 */
  showChevron?: boolean;
  /** "약관 전체 동의" 강조 행 여부 */
  emphasized?: boolean;
  onChevronClick?: () => void;
}

const CheckIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8B7BF7' : '#C7C7C7'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 6" />
  </svg>
);

/**
 * 약관 동의 행 — 체크 + 라벨(+필수 표기) + 상세 화살표.
 * 사용처: 구매내역 권한 동의 화면.
 */
const ConsentItem = ({
  label,
  checked,
  onToggle,
  required = false,
  showChevron = false,
  emphasized = false,
  onChevronClick,
}: ConsentItemProps) => {
  return (
    <div className={['flex items-center gap-3 py-3', emphasized ? 'font-semibold' : ''].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-center shrink-0 cursor-pointer"
        aria-pressed={checked}
      >
        <CheckIcon active={checked} />
      </button>
      <span className="flex-1 text-sm text-neutral-800">
        {required && <span className="text-neutral-500">(필수) </span>}
        {label}
      </span>
      {showChevron && (
        <button
          type="button"
          onClick={onChevronClick}
          className="shrink-0 text-neutral-400 cursor-pointer"
          aria-label="상세보기"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ConsentItem;
