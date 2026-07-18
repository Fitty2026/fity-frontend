interface OptionCardProps {
  title: string;
  /** 2줄 설명 — '\n' 포함 가능 */
  description: string;
  /** 좌측 아이콘 (24~28px 권장) */
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * 코디 방식 선택 카드 (직접 코디하기 / 상황별 코디 추천받기)
 * - 타이틀 위, 아래에 아이콘 + 설명 행, 우측 세로중앙 화살표
 */
const OptionCard = ({ title, description, icon, onClick, className = '' }: OptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative w-full text-left rounded-[20px] bg-white p-5 pr-12',
        'shadow-[0_2px_12px_rgba(31,33,36,0.06)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-base font-bold text-[#1F2124]">{title}</p>
      <div className="mt-2.5 flex items-center gap-3.5">
        <span className="shrink-0 text-[#5A6169]">{icon}</span>
        <p className="text-sm font-medium leading-5 text-[#959BA7] whitespace-pre-line">{description}</p>
      </div>
      {/* 우측 화살표 — 카드 세로 중앙 */}
      <svg
        className="absolute right-5 top-1/2 -translate-y-1/2"
        width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C4C9CF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M6 3.5 10.5 8 6 12.5" />
      </svg>
    </button>
  );
};

export default OptionCard;
