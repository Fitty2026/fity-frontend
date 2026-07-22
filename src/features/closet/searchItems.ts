import type { ClothingItem } from '@/types';

/** 검색어가 아이템의 카테고리/브랜드/태그 중 하나에 포함되는지 */
export const matchesQuery = (item: ClothingItem, query: string): boolean => {
  const q = query.trim();
  if (!q) return true;
  return [item.category, item.brand ?? '', ...item.tags].some((text) => text.includes(q));
};
