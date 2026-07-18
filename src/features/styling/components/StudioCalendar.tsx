const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface StudioCalendarProps {
  year: number;
  /** 1~12 */
  month: number;
  /** 선택된 일 (보라 원) */
  selectedDay?: number;
  /** 오늘 일 (보라 텍스트) — 해당 연/월일 때만 전달 */
  todayDay?: number;
  onSelectDay?: (day: number) => void;
  /** 좌측 '6월 ›' 라벨 클릭 (연/월 피커 열기) */
  onMonthClick?: () => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  className?: string;
}

/**
 * 날짜 선택 — 월 캘린더
 * - 상단: 'N월 ›' + 이전/다음 화살표 / 요일 행 / 날짜 그리드
 * - 선택일 = 보라 원 + 흰 텍스트, 오늘 = 보라 텍스트
 */
const StudioCalendar = ({
  year,
  month,
  selectedDay,
  todayDay,
  onSelectDay,
  onMonthClick,
  onPrevMonth,
  onNextMonth,
  className = '',
}: StudioCalendarProps) => {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className={className}>
      {/* 월 네비 — 6월은 첫 열 중앙(반 셀 7.143%), < >(64×24)는 우측 inset 6 */}
      <div className="flex items-center justify-between pl-[7.143%] pr-1.5">
        {/* 6월 라벨: Pretendard 700 / 20px / lh150% / -2% / #1F2124 + ">" #959BA7 */}
        <button type="button" onClick={onMonthClick} className="flex items-center text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          {month}월
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="#959BA7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* 이전/다음: 24×24 #1F2124 1.5, 둘 사이 16 */}
        <div className="flex items-center gap-4">
          <button type="button" onClick={onPrevMonth} aria-label="이전 달">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="#1F2124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={onNextMonth} aria-label="다음 달">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="#1F2124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 행 */}
      <div className="mt-4 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          // Figma: Pretendard 600 / 14px / lh160% / -2% / #CED1D5
          <span key={day} className="flex items-center justify-center h-[22px] text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#CED1D5]">
            {day}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 — 요일↔첫줄 12, 셀 46(=숫자16+세로간격30), 가로 33은 grid-cols-7 자동 */}
      <div className="mt-3 grid grid-cols-7">
        {cells.map((day, i) =>
          day === null ? (
            <span key={`blank-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay?.(day)}
              className="flex items-center justify-center h-[46px]"
            >
              {/* 숫자: Pretendard 600 / 16px / lh160% / -2% / #1F2124 */}
              <span
                className={[
                  'flex items-center justify-center w-7 h-7 rounded-full text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
                  day === selectedDay
                    ? 'bg-[#9D98F0] text-white'
                    : day === todayDay
                      ? 'text-[#9D98F0]'
                      : 'text-[#1F2124]',
                ].join(' ')}
              >
                {day}
              </span>
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default StudioCalendar;
