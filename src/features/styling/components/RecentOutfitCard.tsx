import type { Outfit } from '@/types';
import { useIsOutfitLiked, useToggleOutfitLike } from '../hooks/useOutfitLikes';

interface RecentOutfitCardProps {
  outfit: Outfit;
  onClick?: () => void;
  className?: string;
}

/** 하트 24×24 — 비어있을 땐 외곽선, 눌리면 채움 (#1F2124) */
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 256 256" fill="#1F2124" xmlns="http://www.w3.org/2000/svg">
    {filled ? (
      <path d="M240,98c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,224.66,16,168,16,98A62.07,62.07,0,0,1,78,36c20.65,0,38.73,8.88,50,23.89C139.27,44.88,157.35,36,178,36A62.07,62.07,0,0,1,240,98Z" />
    ) : (
      <path d="M178,36c-20.65,0-38.73,8.88-50,23.89C116.73,44.88,98.65,36,78,36A62.07,62.07,0,0,0,16,98c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,224.66,240,168,240,98A62.07,62.07,0,0,0,178,36Zm-50,174.8C109.74,200.16,32,151.69,32,98A46.06,46.06,0,0,1,78,52c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,151.69,146.26,200.16,128,210.8Z" />
    )}
  </svg>
);

/**
 * 홈 — 최근 코디 카드 (Figma: 156×247, radius8, 흰 bg)
 * - 이미지(156×211, top radius8, crop) + 하단 그라데이션 + 날짜/태그 오버레이
 * - 이미지 우상단(8·8) 하트 — 카드 열기와 겹치지 않게 클릭을 가로챈다
 * - 타이틀 바(156×36, #1F2124, bottom radius8, 중앙 흰 텍스트)
 */
const RecentOutfitCard = ({ outfit, onClick, className = '' }: RecentOutfitCardProps) => {
  const isLiked = useIsOutfitLiked(outfit.id);
  const toggleLike = useToggleOutfitLike();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onClick?.();
      }}
      className={['w-full cursor-pointer text-left rounded-lg overflow-hidden bg-white', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 이미지 영역 156×211 */}
      <div className="relative aspect-[156/211]">
        <img
          src={outfit.imageUrl}
          alt={outfit.context}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 하단 그라데이션 (#000 투명 → 검정) */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-black/70 to-transparent" />
        {/* 하트 — 이미지 우상단 8·8 */}
        <button
          type="button"
          aria-label={isLiked ? '찜 해제' : '찜하기'}
          aria-pressed={isLiked}
          onClick={(event) => {
            event.stopPropagation();
            toggleLike(outfit.id);
          }}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
        >
          <HeartIcon filled={isLiked} />
        </button>
        {/* 날짜(좌) + 태그(우) */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-2 pb-2">
          {/* 날짜: Pretendard 600 / 10px / lh165% / -2% / #F6F7F8 */}
          <span className="shrink-0 text-[10px] font-semibold leading-[1.65] tracking-[-0.02em] text-[#F6F7F8]">
            {outfit.createdAt.slice(0, 10).split('-').join('.')}
          </span>
          {/* 태그칩: bg #5A6169 / radius8 / pad 1·6 / 텍스트 600 8px / #F6F7F8 */}
          <span className="flex gap-1 overflow-hidden">
            {outfit.styleTags.map((tag) => (
              <span
                key={tag}
                className="shrink-0 whitespace-nowrap rounded-lg bg-[#5A6169] px-1.5 py-px text-[8px] font-semibold leading-[1.65] tracking-[-0.02em] text-[#F6F7F8]"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </span>
        </div>
      </div>
      {/* 타이틀 바 156×36 (#1F2124, pad 7·34, 중앙 흰 텍스트) */}
      <div className="flex h-9 items-center justify-center bg-[#1F2124] px-[34px]">
        <span className="max-w-full truncate text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-center text-white">
          {outfit.context}
        </span>
      </div>
    </div>
  );
};

export default RecentOutfitCard;
