interface PhotoSlotGridProps {
  /** 슬롯별 사진 objectURL (정면→측면→후면 고정, 빈 슬롯은 '' 또는 배열 범위 밖) */
  photos: string[];
  /** 전체 슬롯 수 (기본 3) */
  max?: number;
  /** 슬롯별 라벨 (정면/측면/후면) — 넘기면 각 칸 아래에 표시 */
  labels?: string[];
  /** 빈 슬롯 탭 → 해당 index에 사진 추가 */
  onAdd: (index: number) => void;
  /** 채워진 슬롯의 x 버튼 탭 → 해당 index 삭제 */
  onRemove?: (index: number) => void;
  /** 채워진 슬롯 탭 → 해당 index 교체 (마이페이지 수정 화면용) */
  onReplace?: (index: number) => void;
}

/** 체형 사진 3칸 슬롯 그리드 — 채운 칸(썸네일+x삭제)·추가 칸(점선+)·빈 칸(점선), 칸마다 아래 라벨 */
const PhotoSlotGrid = ({
  photos,
  max = 3,
  labels,
  onAdd,
  onRemove,
  onReplace,
}: PhotoSlotGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          {photos[i] ? (
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {onReplace ? (
                <button type="button" onClick={() => onReplace(i)} className="h-full w-full">
                  <img src={photos[i]} alt={`체형 사진 ${i + 1}`} className="h-full w-full bg-white object-contain" />
                </button>
              ) : (
                <img src={photos[i]} alt={`체형 사진 ${i + 1}`} className="h-full w-full bg-white object-contain" />
              )}
              {/* 삭제 - 우상단 작은 x. 그 슬롯만 비워진다 */}
              {onRemove && (
                <button
                  type="button"
                  aria-label={`${labels?.[i] ?? `${i + 1}번째`} 사진 삭제`}
                  onClick={() => onRemove(i)}
                  className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-neutral-300 bg-white/90"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5A6169" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            // 빈 슬롯은 모두 '사진추가' 버튼 — 누른 칸에 사진이 들어간다
            <button
              type="button"
              onClick={() => onAdd(i)}
              className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-400 text-xl leading-none text-white">
                +
              </span>
              <span className="text-xs text-neutral-500">사진추가</span>
            </button>
          )}
          {/* 아직 못 채운 슬롯의 라벨은 보라색으로 강조 (Figma 비활성 페이지) */}
          {labels && (
            <span className={`text-sm ${photos[i] ? 'text-neutral-700' : 'text-violet-500'}`}>
              {labels[i]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoSlotGrid;
