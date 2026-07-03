interface BadgeProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

// 옷 태그, 스타일 태그, 카테고리 칩 등에 공통으로 사용
const Badge = ({ label, selected = false, onClick, className = '' }: BadgeProps) => {
  const isClickable = !!onClick;

  return (
    <span
      onClick={onClick}
      className={[
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150',
        selected
          ? 'bg-black text-white border-black'
          : 'bg-white text-neutral-700 border-neutral-300',
        isClickable ? 'cursor-pointer hover:border-black' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  );
};

export default Badge;