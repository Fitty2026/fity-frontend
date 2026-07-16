interface ClothingThumbnailProps {
  imageUrl: string;
  onClick?: () => void;
  className?: string;
}

/**
 * 옷 아이템 썸네일 (정사각 카드).
 * 사용처: 옷장 홈 아이템 그리드, 아이템 목록 전체보기.
 */
const ClothingThumbnail = ({ imageUrl, onClick, className = '' }: ClothingThumbnailProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img src={imageUrl} alt="옷 아이템" className="w-full h-full object-cover" />
    </button>
  );
};

export default ClothingThumbnail;
