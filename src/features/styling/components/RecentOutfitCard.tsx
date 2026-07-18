import type { RecentOutfit } from '../types';

interface RecentOutfitCardProps {
  outfit: RecentOutfit;
  onClick?: () => void;
  className?: string;
}

/**
 * 홈 — 최근 코디 카드 (Figma: 156×247, radius8, 흰 bg)
 * - 이미지(156×211, top radius8, crop) + 하단 그라데이션 + 날짜/태그 오버레이
 * - 타이틀 바(156×36, #1F2124, bottom radius8, 중앙 흰 텍스트)
 */
const RecentOutfitCard = ({ outfit, onClick, className = '' }: RecentOutfitCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={['w-full text-left rounded-lg overflow-hidden bg-white', className].filter(Boolean).join(' ')}
    >
      {/* 이미지 영역 156×211 */}
      <div className="relative aspect-[156/211]">
        <img src={outfit.image} alt={outfit.title} className="absolute inset-0 w-full h-full object-cover" />
        {/* 하단 그라데이션 (#000 투명 → 검정) */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-black/70 to-transparent" />
        {/* 날짜(좌) + 태그(우) */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-2 pb-2">
          {/* 날짜: Pretendard 600 / 10px / lh165% / -2% / #F6F7F8 */}
          <span className="text-[10px] font-semibold leading-[1.65] tracking-[-0.02em] text-[#F6F7F8]">
            {outfit.date}
          </span>
          {/* 태그칩: bg #5A6169 / radius8 / pad 1·6 / 텍스트 600 8px / #F6F7F8 */}
          <span className="flex gap-1">
            {outfit.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-[#5A6169] px-1.5 py-px text-[8px] font-semibold leading-[1.65] tracking-[-0.02em] text-[#F6F7F8]"
              >
                #{tag}
              </span>
            ))}
          </span>
        </div>
      </div>
      {/* 타이틀 바 156×36 (#1F2124, pad 7·34, 중앙 흰 텍스트) */}
      <div className="flex items-center justify-center bg-[#1F2124] px-[34px] py-[7px]">
        <span className="text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-center text-white">
          {outfit.title}
        </span>
      </div>
    </button>
  );
};

export default RecentOutfitCard;
