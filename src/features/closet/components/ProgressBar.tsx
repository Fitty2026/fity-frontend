interface ProgressBarProps {
  /** 0 ~ 100 */
  percent: number;
  /** 좌측 라벨 (예: "진행", "선택") */
  label?: string;
  showPercent?: boolean;
  className?: string;
}

/** 얇은 진행바 + 퍼센트 표시 */
const ProgressBar = ({
  percent,
  label,
  showPercent = true,
  className = '',
}: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-2 text-xs text-neutral-500">
          <span>{label}</span>
          {showPercent && <span className="font-semibold text-black">{clamped}%</span>}
        </div>
      )}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
