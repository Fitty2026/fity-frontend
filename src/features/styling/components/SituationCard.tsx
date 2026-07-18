interface SituationCardProps {
  image: string;
  /** 이미지 아래 라벨 (확정 화면에서 사용, 예: '출근') */
  label?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * 상황 선택 — 상황 이미지 카드 (데이트/출근/학교/여행)
 */
const SituationCard = ({ image, label, alt = '', className = '', onClick }: SituationCardProps) => {
  return (
    <button type="button" onClick={onClick} className={['flex flex-col items-center gap-5', className].filter(Boolean).join(' ')}>
      <span className="block w-full overflow-hidden rounded-2xl">
        <img src={image} alt={alt || label} className="w-full h-full object-cover aspect-[136/176]" />
      </span>
      {label && <span className="text-lg font-bold text-[#1F2124]">{label}</span>}
    </button>
  );
};

export default SituationCard;
