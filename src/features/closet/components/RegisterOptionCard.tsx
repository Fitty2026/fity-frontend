import Badge from '@/components/ui/Badge';

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
        'w-full text-left flex items-start justify-between gap-3 p-4 rounded-2xl border transition-colors',
        selected ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-400',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col gap-1">
        {badge && <Badge label={badge} selected className="w-fit" />}
        <span className="text-base font-semibold text-black">{title}</span>
        {description && (
          <span className="text-xs text-neutral-500 whitespace-pre-line">{description}</span>
        )}
      </div>
      {icon && <span className="shrink-0 text-neutral-700">{icon}</span>}
    </button>
  );
};

export default RegisterOptionCard;
