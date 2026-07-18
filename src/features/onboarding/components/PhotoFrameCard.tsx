interface PhotoFrameCardProps {
  /** 없으면 회색 체크 카드로 표시 */
  imageSrc?: string;
  /** 완료 체크 표시 여부 */
  showCheck?: boolean;
  /** contain: 일러스트용(기본) / cover: 실사 사진용(카드를 꽉 채움) */
  fit?: 'contain' | 'cover';
  /** card: 회색 카드 배경(기본) / plain: 배경 없이 이미지만 (자체 테두리가 있는 마네킹용) */
  variant?: 'card' | 'plain';
  alt?: string;
}

/** 체형 사진 안내/완료 화면 공용 - 라운드 카드 + 하단 안심 문구 */
const PhotoFrameCard = ({
  imageSrc,
  showCheck = false,
  fit = 'contain',
  variant = 'card',
  alt = '체형 안내',
}: PhotoFrameCardProps) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className={`relative flex h-[340px] w-[220px] items-center justify-center overflow-hidden rounded-3xl ${
        variant === 'card' ? 'border border-neutral-100 bg-neutral-100' : ''
      }`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      )}
      {showCheck && (
        <span className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
            <path d="M5 12l5 5L19 7" />
          </svg>
        </span>
      )}
    </div>
    <p className="flex items-center gap-1 text-xs text-neutral-400">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      사진은 분석 후 즉시 삭제되며, 안전하게 보호돼요
    </p>
  </div>
);

export default PhotoFrameCard;
