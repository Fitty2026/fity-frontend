interface OptionCardProps {
  title: string;
  /** 2줄 설명 — '\n' 포함 가능 */
  description: string;
  /** 좌측 아이콘 (32×32) */
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * 코디 방식 선택 카드 (직접 코디하기 / 상황별 코디 추천받기)
 * - Figma: 326×126 / radius16 / pad 24·14·24·24 / gap40 / bg #FFF 20% + 배경블러 / shadow 0 8 16 #000 8%
 * - [아이콘 좌] [타이틀 위·설명 아래] [화살표 우]
 * ※ 타이틀/설명 타이포는 Figma 스펙으로 확정 예정
 */
const OptionCard = ({ title, description, icon, onClick, className = '' }: OptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative flex items-center gap-10 w-full text-left rounded-2xl py-6 pl-6 pr-3.5',
        'bg-white/20 backdrop-blur-md shadow-[0_8px_16px_0_rgba(0,0,0,0.08)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      <div className="flex-1 min-w-0">
        {/* 타이틀: Pretendard 700 / 16px / lh160% / -2% / #1F2124 */}
        <p className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">{title}</p>
        {/* 설명: Pretendard 500 / 14px / lh160% / -2% / #959BA7, 타이틀↔설명 8 */}
        <p className="mt-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7] whitespace-pre-line">{description}</p>
      </div>
      {/* 우측 화살표 — 카드 세로 중앙, 우패딩 14 */}
      <svg
        className="absolute right-3.5 top-1/2 -translate-y-1/2"
        width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="#B2B8BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default OptionCard;
