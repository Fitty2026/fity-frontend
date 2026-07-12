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
      className={['flex gap-2 overflow-x-auto no-scrollbar', className]
        .filter(Boolean)
        .join(' ')}
    >
      {categories.map((cat) => (
        <Badge
          key={cat}
          label={cat}
          selected={cat === active}
          onClick={() => onChange(cat)}
          // Figma: padding 8/20 (Badge 기본 12/4 override). 비선택 = bg #E8E8E8 / border 없음 / text #1A1C1C
          className={[
            'shrink-0 px-5! py-2!',
            cat === active ? '' : 'bg-[#E8E8E8]! border-transparent! text-[#1A1C1C]!',
          ].join(' ')}
        />
      ))}
    </div>
  );
};

export default CategoryTabs;
