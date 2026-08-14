import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Outfit } from '../../../types/index';

interface ItemCardProps {
  outfit: Outfit;
  deletionDaysRemaining?: number;
  isRecentlyDeleted?: boolean;
}

const MyOutfitCard = ({
  outfit,
  deletionDaysRemaining,
  isRecentlyDeleted = false,
}: ItemCardProps) => {
  const navigate = useNavigate();
  const tagScrollRef = useRef<HTMLSpanElement>(null);
  const tagDragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [isTagScrolled, setIsTagScrolled] = useState(false);

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
      className={'w-full cursor-pointer text-left rounded-lg overflow-hidden bg-white'}
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
