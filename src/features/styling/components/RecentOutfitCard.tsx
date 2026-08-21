import { useState } from 'react';

import useToggleMyOutfitLike from '@/features/myoutfit/hooks/useToggleMyOutfitLike';
import '@/features/myoutfit/styles/myOutfitLike.css';
import type { Outfit } from '@/types';

interface RecentOutfitCardProps {
  outfit: Outfit;
  onClick?: () => void;
  className?: string;
}

/** 하트 24×24 — 비어있을 땐 외곽선, 눌리면 채움 (#1F2124) */
/**
 * 홈 — 최근 코디 카드 (Figma: 156×247, radius8, 흰 bg)
 * - 이미지(156×211, top radius8, crop) + 하단 그라데이션 + 날짜/태그 오버레이
 * - 이미지 우상단(8·8) 하트 — 카드 열기와 겹치지 않게 클릭을 가로챈다
 * - 타이틀 바(156×36, #1F2124, bottom radius8, 중앙 흰 텍스트)
 */
const RecentOutfitCard = ({ outfit, onClick, className = '' }: RecentOutfitCardProps) => {
  const [likeAnimation, setLikeAnimation] = useState<'like' | 'unlike' | null>(null);
  const likeMutation = useToggleMyOutfitLike();
  const isLiked = outfit.isLiked ?? false;

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
          disabled={likeMutation.isPending}
          onClick={(event) => {
            event.stopPropagation();
            setLikeAnimation(isLiked ? 'unlike' : 'like');
            likeMutation.mutate({ savedOutfitId: outfit.id, isLiked: !isLiked });
          }}
          onKeyDown={(event) => event.stopPropagation()}
          className="my-outfit-like-button absolute right-2 top-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center disabled:cursor-default"
        >
          <span
            className={
              likeAnimation ? `my-outfit-heart my-outfit-heart--${likeAnimation}` : undefined
            }
            onAnimationEnd={() => setLikeAnimation(null)}
          >
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                className={!isLiked ? 'my-outfit-heart-path--unliked' : undefined}
                d="M18.75 5.25C18.75 2.765 16.651 0.75 14.062 0.75C12.127 0.75 10.465 1.876 9.75 3.483C9.035 1.876 7.373 0.75 5.437 0.75C2.85 0.75 0.75 2.765 0.75 5.25C0.75 12.47 9.75 17.25 9.75 17.25C9.75 17.25 18.75 12.47 18.75 5.25Z"
                fill={isLiked ? '#1F2124' : 'none'}
                stroke="#1F2124"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
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
