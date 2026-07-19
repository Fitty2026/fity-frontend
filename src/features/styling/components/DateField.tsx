interface DateFieldProps {
  /** 예: '2026년 6월 28일' */
  label: string;
  /** 필드 본문 클릭 (연/월/일 피커 열기) */
  onClick?: () => void;
  /** 우측 보라 화살표 버튼 클릭 */
  onNext?: () => void;
  className?: string;
}

/** 캘린더 아이콘 — Figma 24×24 #1F2124 */
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.75005 2.99414V5.24414M17.25 2.99414V5.24414M2.99805 18.7441V7.49114C2.99805 6.8944 3.2351 6.32211 3.65706 5.90015C4.07901 5.47819 4.65131 5.24114 5.24805 5.24114H18.748C19.3448 5.24114 19.9171 5.47819 20.339 5.90015C20.761 6.32211 20.998 6.8944 20.998 7.49114V18.7421M20.998 18.7421C20.998 19.3389 20.761 19.9112 20.339 20.3331C19.9171 20.7551 19.3448 20.9921 18.748 20.9921H5.24805C4.65131 20.9921 4.07901 20.7551 3.65706 20.3331C3.2351 19.9112 2.99805 19.3389 2.99805 18.7421V11.2421C2.99805 10.6454 3.2351 10.0731 3.65706 9.65115C4.07901 9.22919 4.65131 8.99214 5.24805 8.99214H18.748C19.3448 8.99214 19.9171 9.22919 20.339 9.65115C20.761 10.0731 20.998 10.6454 20.998 11.2421V18.7421ZM14.248 12.7421H16.498M7.49805 14.9921H11.998M12 12.7421H12.005V12.7481H12V12.7421ZM11.999 17.2421H12.005V17.2481H11.999V17.2421ZM9.74905 17.2431H9.75405V17.2491H9.75005V17.2431H9.74905ZM7.49905 17.2431H7.50405V17.2481H7.49805V17.2431H7.49905ZM14.249 14.9961H14.254V15.0011H14.249V14.9961ZM14.249 17.2431H14.255V17.2491H14.249V17.2431ZM16.499 14.9951H16.505V15.0001H16.5L16.499 14.9951Z" stroke="#1F2124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 날짜 선택 — 상단 날짜 필드 (Figma: 327×42, radius32, bg #F6F7F8, pad-left 10, gap 10)
 * - 캘린더 아이콘 + 날짜 텍스트 / 우측 보라 알약 화살표 버튼
 */
const DateField = ({ label, onClick, onNext, className = '' }: DateFieldProps) => {
  return (
    <div className={['flex items-center gap-2.5 h-[42px] rounded-[32px] bg-[#F6F7F8] pl-2.5', className].filter(Boolean).join(' ')}>
      <button type="button" onClick={onClick} className="flex flex-1 items-center gap-2 min-w-0 text-left">
        <CalendarIcon />
        {/* Figma: Pretendard 600 / 14px / lh160% / -2% */}
        <span className="text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124] truncate">{label}</span>
      </button>
      {/* Figma: 64×42, radius21, bg #9D98F0(Color/Point/2), 흰 체브론 */}
      <button
        type="button"
        onClick={onNext}
        aria-label="다음"
        className="shrink-0 flex items-center justify-center w-16 h-[42px] rounded-[21px] bg-[#9D98F0] active:brightness-95"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3L12 9L6 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default DateField;
