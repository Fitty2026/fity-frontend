import type { RecentOutfit } from '../types';

interface RecentOutfitCardProps {
  outfit: RecentOutfit;
  onClick?: () => void;
  className?: string;
}

/**
 * 홈 — 최근 코디 카드
 * - 사진 + 사진 하단 오버레이(날짜/해시태그) + 다크 타이틀 바
 * - Figma: 156×247
 */
const RecentOutfitCard = ({ outfit, onClick, className = '' }: RecentOutfitCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={['w-full text-left rounded-xl overflow-hidden bg-[#1F2124]', className].filter(Boolean).join(' ')}
    >
      <div className="relative aspect-[156/207]">
        <img src={outfit.image} alt={outfit.title} className="absolute inset-0 w-full h-full object-cover" />
        {/* 하단 오버레이: 날짜(좌) + 해시태그(우) */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 px-1.5 pb-1.5">
          <span className="text-[10px] font-medium text-white drop-shadow">{outfit.date}</span>
          <span className="flex gap-1">
            {outfit.tags.map((tag) => (
              <span
                key={tag}
                className="px-1 py-0.5 rounded-[4px] bg-black/60 text-[9px] font-medium text-white"
              >
                #{tag}
              </span>
            ))}
          </span>
        </div>
      </div>
      {/* 타이틀 바 */}
      <p className="flex items-center justify-center h-10 text-sm font-semibold text-white">{outfit.title}</p>
    </button>
  );
};

export default RecentOutfitCard;
