import WheelPicker from './WheelPicker';

interface WheelDatePickerProps {
  year: number;
  month: number;
  day: number;
  onChange: (year: number, month: number, day: number) => void;
  className?: string;
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

/**
 * 휠 데이트 피커 (연/월/일 3열) — 날짜 필드 아래 드롭다운
 * - 가운데 흰 하이라이트 밴드 + 위아래 흐린 값
 */
const WheelDatePicker = ({ year, month, day, onChange, className = '' }: WheelDatePickerProps) => {
  // 연 범위 상한 2026 — 그 다음 슬롯은 '-' (디자이너 스펙)
  const years = range(2020, 2026);
  const months = range(1, 12);
  const days = range(1, daysInMonth(year, month));

  const change = (y: number, m: number, d: number) => {
    // 월/연 변경 시 일이 말일을 넘으면 클램프
    const clampedDay = Math.min(d, daysInMonth(y, m));
    onChange(y, m, clampedDay);
  };

  return (
    <div
      // 주의: 'relative' 금지 — 페이지가 className으로 absolute를 넘기는데 relative가 cascade에서 이겨
      // 문서 흐름에 남아 캘린더를 밀어냄 (선택 밴드의 absolute 기준은 이 루트가 positioned면 충분)
      className={['w-[123px] rounded-lg bg-[#F6F7F8] shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] py-2.5', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 가운데 선택 밴드 — Figma: 123×30, radius8, bg #E6E8EA */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[30px] rounded-lg bg-[#E6E8EA]" />
      {/* 연 열은 '2026년'이 한 줄에 들어가게 넓게 (52/34/37) */}
      <div className="relative flex">
        <WheelPicker className="w-[52px]" values={years} value={year} suffix="년" onChange={(y) => change(y, month, day)} />
        <WheelPicker className="w-[34px]" values={months} value={month} suffix="월" onChange={(m) => change(year, m, day)} />
        <WheelPicker className="w-[37px]" values={days} value={day} suffix="일" onChange={(d) => change(year, month, d)} />
      </div>
    </div>
  );
};

export default WheelDatePicker;
