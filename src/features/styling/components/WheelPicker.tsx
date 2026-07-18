import { useEffect, useRef } from 'react';

const ROW_HEIGHT = 24;

interface WheelPickerProps {
  /** 표시할 값 목록 (오름차순) */
  values: number[];
  /** 현재 선택 값 */
  value: number;
  /** 선택 값 뒤에 붙는 접미사 (년/월/일) */
  suffix?: string;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * 단일 휠(세로 스크롤 + 스냅) — 가운데 행이 선택 값
 * - 3행 노출(위·가운데·아래), 스크롤 멈추면 가장 가까운 행으로 스냅 후 onChange
 */
const WheelPicker = ({ values, value, suffix = '', onChange, className = '' }: WheelPickerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserScroll = useRef(false);

  // 선택 값이 바뀌면(외부 요인 포함) 해당 위치로 스크롤 — 사용자 스크롤 중이 아닐 때만
  useEffect(() => {
    const el = ref.current;
    if (!el || isUserScroll.current) return;
    const idx = values.indexOf(value);
    if (idx >= 0) el.scrollTop = idx * ROW_HEIGHT;
  }, [value, values]);

  const handleScroll = () => {
    isUserScroll.current = true;
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.max(0, Math.min(values.length - 1, Math.round(el.scrollTop / ROW_HEIGHT)));
      el.scrollTo({ top: idx * ROW_HEIGHT, behavior: 'smooth' });
      isUserScroll.current = false;
      if (values[idx] !== value) onChange(values[idx]);
    }, 120);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className={['h-[72px] overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden', className].filter(Boolean).join(' ')}
      style={{ scrollbarWidth: 'none' }}
    >
      {/* 첫/마지막 값이 가운데로 오도록 위·아래 한 행씩 확보 — 범위 밖은 '-' 표시 (디자이너 스펙) */}
      <div>
        <div className="h-6 snap-center flex items-center justify-center text-[14px] font-medium text-[#B2B8BD]">-</div>
        {values.map((v) => {
          const active = v === value;
          return (
            <div
              key={v}
              className={[
                'h-6 snap-center flex items-center justify-center whitespace-nowrap text-[14px] tracking-[-0.02em]',
                active ? 'font-semibold text-[#1F2124]' : 'font-medium text-[#B2B8BD]',
              ].join(' ')}
            >
              {active ? `${v}${suffix}` : v}
            </div>
          );
        })}
        <div className="h-6 snap-center flex items-center justify-center text-[14px] font-medium text-[#B2B8BD]">-</div>
      </div>
    </div>
  );
};

export default WheelPicker;
