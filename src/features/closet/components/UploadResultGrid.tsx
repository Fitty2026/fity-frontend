import ClothingThumbnail from './ClothingThumbnail';

interface UploadResultGridProps {
  images: string[];
  /** 최대 노출 개수. 초과분은 마지막 타일에 +N 오버레이 */
  maxVisible?: number;
  columns?: number;
  className?: string;
}

/**
 * 업로드 결과 균일 그리드 (Bulk Upload Success)
 * - maxVisible 초과 시 마지막 칸에 "+N" 오버레이
 */
const UploadResultGrid = ({
  images,
  maxVisible = 6,
  columns = 3,
  className = '',
}: UploadResultGridProps) => {
  const visible = images.slice(0, maxVisible);
  const remaining = images.length - maxVisible;

  return (
    <div
      className={['grid gap-2', className].filter(Boolean).join(' ')}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {visible.map((src, i) => {
        const isLast = i === visible.length - 1;
        const showOverflow = isLast && remaining > 0;
        return (
          <ClothingThumbnail
            key={i}
            src={src}
            ratio="auto"
            className="aspect-[2/3] w-full"
            overlay={
              showOverflow ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-semibold">
                  +{remaining}
                </div>
              ) : undefined
            }
          />
        );
      })}
    </div>
  );
};

export default UploadResultGrid;
