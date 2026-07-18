import type { ClothingItem } from '../types';
import ClothingThumbnail from './ClothingThumbnail';

interface ItemGridProps {
  items: ClothingItem[];
  columns?: 2 | 3 | 4;
  onItemClick?: (item: ClothingItem) => void;
}

const COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

/**
 * 옷 아이템 그리드.
 * 사용처: 내 옷장 홈, 아이템 목록 전체보기.
 */
const ItemGrid = ({ items, columns = 3, onItemClick }: ItemGridProps) => {
  return (
    <div className={['grid gap-2', COLS[columns]].join(' ')}>
      {items.map((item) => (
        <ClothingThumbnail
          key={item.id}
          imageUrl={item.imageUrl}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        />
      ))}
    </div>
  );
};

export default ItemGrid;
