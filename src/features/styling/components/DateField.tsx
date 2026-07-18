interface DateFieldProps {
  /** 예: '2026년 6월 28일' */
  label: string;
  /** 필드 본문 클릭 (연/월/일 피커 열기) */
  onClick?: () => void;
  /** 우측 보라 화살표 버튼 클릭 */
  onNext?: () => void;
  className?: string;
}

/**
 * 날짜 선택 — 상단 날짜 필드
 * - 연회색 배경 + 캘린더 아이콘 + 날짜 텍스트, 우측 보라 알약 화살표 버튼
 */
const DateField = ({ label, onClick, onNext, className = '' }: DateFieldProps) => {
  return (
    <div className={['flex items-center gap-2 rounded-[14px] bg-[#F6F7F8] p-1.5', className].filter(Boolean).join(' ')}>
      <button type="button" onClick={onClick} className="flex flex-1 items-center gap-2.5 min-w-0 pl-2.5 py-1.5 text-left">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#1F2124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="4" width="15" height="13.5" rx="2" />
          <path d="M2.5 8.5h15M6.5 2v3.5M13.5 2v3.5" />
        </svg>
        <span className="text-[15px] font-semibold text-[#1F2124] truncate">{label}</span>
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="다음"
        className="shrink-0 flex items-center justify-center w-[54px] h-9 rounded-full bg-[#A29AF0] active:bg-[#8F86E8]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3.5 10.5 8 6 12.5" />
        </svg>
      </button>
    </div>
  );
};

export default DateField;
