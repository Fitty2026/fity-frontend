import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useToggleMyOutfitLike from '@/features/myoutfit/hooks/useToggleMyOutfitLike';
import type { Outfit } from '../../../types/index';
import '../styles/myOutfitLike.css';

interface ItemCardProps {
  outfit: Outfit;
  deletionDaysRemaining?: number;
  isRecentlyDeleted?: boolean;
  animateUnlikeRemoval?: boolean;
}

const MyOutfitCard = ({
  outfit,
  deletionDaysRemaining,
  isRecentlyDeleted = false,
  animateUnlikeRemoval = false,
}: ItemCardProps) => {
  const navigate = useNavigate();
  const tagScrollRef = useRef<HTMLSpanElement>(null);
  const tagDragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [isTagScrolled, setIsTagScrolled] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState<'like' | 'unlike' | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const likeMutation = useToggleMyOutfitLike();
  const isLiked = outfit.isLiked ?? false;

  const openDetail = () =>
    navigate(`/myoutfit/${outfit.id}${isRecentlyDeleted ? '?source=deleted' : ''}`, {
      state: isRecentlyDeleted ? { recentlyDeletedOutfit: outfit } : undefined,
    });

  const handleTagPointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse' || !tagScrollRef.current) return;

    tagDragRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: tagScrollRef.current.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTagPointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!tagDragRef.current.isDragging || !tagScrollRef.current) return;

    tagScrollRef.current.scrollLeft =
      tagDragRef.current.scrollLeft - (event.clientX - tagDragRef.current.startX);
  };

  const handleTagPointerUp = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!tagDragRef.current.isDragging) return;

    tagDragRef.current.isDragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          openDetail();
        }
      }}
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget || !isRemoving) return;
        likeMutation.mutate({ savedOutfitId: outfit.id, isLiked: false });
      }}
      className={`w-full cursor-pointer overflow-hidden rounded-lg bg-white text-left ${
        isRemoving ? 'my-outfit-card--removing pointer-events-none' : ''
      }`}
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
        {!isRecentlyDeleted && (
          <button
            type="button"
            aria-label={isLiked ? '좋아요 취소' : '좋아요'}
            aria-pressed={isLiked}
            disabled={likeMutation.isPending || isRemoving}
            onClick={(event) => {
              event.stopPropagation();
              setLikeAnimation(isLiked ? 'unlike' : 'like');

              if (
                animateUnlikeRemoval &&
                isLiked &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ) {
                setIsRemoving(true);
                return;
              }

              likeMutation.mutate({ savedOutfitId: outfit.id, isLiked: !isLiked });
            }}
            onKeyDown={(event) => event.stopPropagation()}
            className="my-outfit-like-button absolute right-[11px] top-[11.75px] z-10 h-[18px] w-5 cursor-pointer disabled:cursor-default"
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
        )}
        {deletionDaysRemaining !== undefined ? (
          <span className="absolute inset-x-0 bottom-[7px] text-center text-[14px] font-[600] leading-[165%] tracking-[-2%] text-[#CC4427]">
            {deletionDaysRemaining}일
          </span>
        ) : (
          /* 날짜(좌) + 태그(우) */
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-[18px] px-2 pb-2">
            {/* 날짜: Pretendard 600 / 10px / lh165% / -2% / #F6F7F8 */}
            <span className="shrink-0 text-[10px] font-semibold leading-[1.65] tracking-[-0.02em] text-[#F6F7F8]">
              {outfit.createdAt.slice(0, 10).split('-').join('.')}
            </span>
            {/* 태그칩: bg #5A6169 / radius8 / pad 1·6 / 텍스트 600 8px / #F6F7F8 */}
            <span
              ref={tagScrollRef}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={handleTagPointerDown}
              onPointerMove={handleTagPointerMove}
              onPointerUp={handleTagPointerUp}
              onPointerCancel={handleTagPointerUp}
              onScroll={(event) => setIsTagScrolled(event.currentTarget.scrollLeft > 1)}
              className={`${isTagScrolled ? '[mask-image:linear-gradient(to_right,transparent_0,black_16px)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_16px)]' : ''} flex w-0 flex-1 select-none gap-1 overflow-x-auto overscroll-x-contain touch-pan-x cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            >
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
        )}
      </div>
      {/* 타이틀 바 156×36 (#1F2124, pad 7·34, 중앙 흰 텍스트) */}
      <div className="flex h-[36px] items-center justify-center bg-[#1F2124] px-[34px] text-center">
        <span className="max-w-full truncate text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-white">
          {outfit.context}
        </span>
      </div>
    </div>
  );
};

export default MyOutfitCard;
