type ThumbnailRatio = 'square' | 'portrait' | 'auto';

interface ClothingThumbnailProps {
  src?: string;
  alt?: string;
  /** square = 1:1, portrait = 3:4, auto = 원본 비율(메이슨리용) */
  ratio?: ThumbnailRatio;
  onClick?: () => void;
  /** 우상단 오버레이 등 커스텀 요소 */
  overlay?: React.ReactNode;
  className?: string;
}

const ratioClass: Record<ThumbnailRatio, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  auto: '',
};

/** 옷 이미지 타일 (비율 지정 가능) */
const ClothingThumbnail = ({
  src,
  alt = '',
  ratio = 'square',
  onClick,
  overlay,
  className = '',
}: ClothingThumbnailProps) => {
  return (
    <div
      onClick={onClick}
      className={[
        'relative overflow-hidden rounded-xl bg-neutral-100',
        ratioClass[ratio],
        onClick ? 'cursor-pointer active:opacity-80 transition-opacity' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={[
            'w-full h-full object-cover',
            ratio === 'auto' ? 'block' : 'absolute inset-0',
          ].join(' ')}
        />
      ) : (
        <div className="w-full h-full min-h-20 flex items-center justify-center text-neutral-300">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}
      {overlay}
    </div>
  );
};

export default ClothingThumbnail;
