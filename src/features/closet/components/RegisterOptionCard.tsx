interface RegisterOptionCardProps {
  title: string;
  description?: string;
  /** 좌상단 뱃지 (예: "추천") */
  badge?: string;
  /** 우측 아이콘 */
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 옷 등록 진입 선택 카드 (자동으로 가져오기 / 직접 등록하기)
 */
const RegisterOptionCard = ({
  title,
  description,
  badge,
  icon,
  selected = false,
  onClick,
  className = '',
}: RegisterOptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        // 패딩 상16 하16 좌16 우83 (우측은 아이콘 영역) — Figma Frame 19
        // ! 필수: global.css `button { padding:0; background:none }` 리셋 이기려고
        'relative w-full text-left rounded-xl border! transition-colors bg-white! pt-4! pb-4! pl-4! pr-[83px]!',
        selected ? 'border-black!' : 'border-[#CFC4C5]! hover:border-black!',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col gap-2">
        {/* 뱃지 + 타이틀 (같은 줄) */}
        <div className="flex items-center gap-2">
          {badge && (
            <span className="shrink-0 inline-flex items-center justify-center w-[37px] h-[19px] rounded-full bg-black text-white text-[10px] font-medium leading-none tracking-[0.5px]">
              {badge}
            </span>
          )}
          <span className="text-xl font-medium leading-7 text-black">{title}</span>
        </div>
        {description && (
          <span className="text-base font-medium leading-6 text-[#4C4546] whitespace-pre-line">{description}</span>
        )}
      </div>
      {/* 아이콘: 우측 영역 세로 중앙 (오른쪽 16px) */}
      {icon && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2">{icon}</span>
      )}
    </button>
  );
};

export default RegisterOptionCard;
