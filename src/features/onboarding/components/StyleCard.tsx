import selectedIcon from '@/assets/icons/selected.png';
import type { StyleTag } from '@/types';

interface StyleCardProps {
  imageSrc: string;
  label: StyleTag;
  selected: boolean;
  onToggle: () => void;
}

/** 스타일 선택 카드 - 이미지 + 선택 시 체크 오버레이. 라벨은 스크린리더 전용 */
const StyleCard = ({ imageSrc, label, selected, onToggle }: StyleCardProps) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={selected}
    aria-label={label}
    className="relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl"
  >
    <img src={imageSrc} alt="" className="w-full" />
    {selected && (
      <img src={selectedIcon} alt="" className="absolute right-2 top-2 h-7 w-7" />
    )}
  </button>
);

export default StyleCard;
