import Badge from '@/components/ui/Badge';
import ClothingThumbnail from './ClothingThumbnail';

interface TaggedItemRowProps {
  imageSrc?: string;
  tags: string[];
  /** 태그 클릭/편집 진입 */
  onEdit?: () => void;
  className?: string;
}

/**
 * 태그 확인·수정 행 (Batch Tag Edit)
 * - 썸네일 + 태그 칩(Badge) 그룹
 */
const TaggedItemRow = ({ imageSrc, tags, onEdit, className = '' }: TaggedItemRowProps) => {
  return (
    <div
      className={['flex items-center gap-3 py-3 border-b border-neutral-100', className]
        .filter(Boolean)
        .join(' ')}
    >
      <ClothingThumbnail src={imageSrc} ratio="square" className="w-16 shrink-0" />

      <div className="flex-1 flex flex-wrap gap-1.5" onClick={onEdit}>
        {tags.map((tag, i) => (
          <Badge key={i} label={tag} />
        ))}
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-neutral-400 hover:text-black"
          aria-label="태그 수정"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TaggedItemRow;
