interface PhotoSlotGridProps {
  /** 채워진 사진 objectURL 목록 (앞에서부터 채움) */
  photos: string[];
  /** 전체 슬롯 수 (기본 3) */
  max?: number;
  /** 빈 '사진추가' 슬롯 탭 */
  onAdd: () => void;
  /** 채워진 슬롯 탭 → 해당 index 교체 */
  onReplace: (index: number) => void;
}

const CheckBadge = () => (
  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
      <path d="M5 13l4 4L19 7" />
    </svg>
  </span>
);

/** 체형 사진 3칸 슬롯 그리드 — 채운 칸(썸네일+체크)·추가 칸(점선+)·빈 칸(점선) */
const PhotoSlotGrid = ({ photos, max = 3, onAdd, onReplace }: PhotoSlotGridProps) => (
  <div className="grid grid-cols-3 gap-3">
    {Array.from({ length: max }).map((_, i) => {
      if (i < photos.length) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onReplace(i)}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-neutral-200"
          >
            <img src={photos[i]} alt={`체형 사진 ${i + 1}`} className="h-full w-full object-cover" />
            <CheckBadge />
          </button>
        );
      }
      if (i === photos.length) {
        return (
          <button
            key={i}
            type="button"
            onClick={onAdd}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-400 text-xl leading-none text-white">
              +
            </span>
            <span className="text-xs text-neutral-500">사진추가</span>
          </button>
        );
      }
      return (
        <div key={i} className="aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-200" />
      );
    })}
  </div>
);

export default PhotoSlotGrid;
