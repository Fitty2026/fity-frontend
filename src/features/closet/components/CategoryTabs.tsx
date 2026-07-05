import Badge from '@/components/ui/Badge';

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  className?: string;
}

/**
 * 옷장 홈 상단 카테고리 필터 (가로 스크롤)
 * - 칩은 공통 Badge 재사용 (Badge: "카테고리 칩" 용도)
 */
const CategoryTabs = ({ categories, active, onChange, className = '' }: CategoryTabsProps) => {
  return (
    <div
      className={['flex gap-2 overflow-x-auto no-scrollbar px-1 py-1', className]
        .filter(Boolean)
        .join(' ')}
    >
      {categories.map((cat) => (
        <Badge
          key={cat}
          label={cat}
          selected={cat === active}
          onClick={() => onChange(cat)}
          className="shrink-0"
        />
      ))}
    </div>
  );
};

export default CategoryTabs;
