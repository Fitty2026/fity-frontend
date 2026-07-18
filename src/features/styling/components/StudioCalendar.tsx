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
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between px-1">
        <button type="button" onClick={onMonthClick} className="flex items-center gap-1 text-lg font-bold text-[#1F2124]">
          {month}월
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="#959BA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 2.5 8 6l-3.5 3.5" />
          </svg>
        </button>
        <div className="flex items-center gap-5">
          <button type="button" onClick={onPrevMonth} aria-label="이전 달" className="p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5A6169" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3.5 5.5 8l4.5 4.5" />
            </svg>
          </button>
          <button type="button" onClick={onNextMonth} aria-label="다음 달" className="p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5A6169" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3.5 10.5 8 6 12.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 행 */}
      <div className="mt-4 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <span key={day} className="flex items-center justify-center h-8 text-[13px] font-medium text-[#B2B8BD]">
            {day}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-2">
        {cells.map((day, i) =>
          day === null ? (
            <span key={`blank-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay?.(day)}
              className="flex items-center justify-center h-9"
            >
              <span
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-full text-[15px] font-medium',
                  day === selectedDay
                    ? 'bg-[#A29AF0] text-white'
                    : day === todayDay
                      ? 'text-[#A29AF0]'
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
