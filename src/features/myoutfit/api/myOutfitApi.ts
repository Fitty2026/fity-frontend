import { categoryLabel, imageSrc } from '@/features/closet/api/closetApi';
import api from '@/lib/axios';
import type { ApiResponse, ClothingCategory, ClothingItem, Outfit } from '@/types';

interface SavedOutfitItemRaw {
  item_id?: number;
  itemId?: number;
  name?: string;
  image_url?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  created_at?: string;
  createdAt?: string;
}

interface SavedOutfitRaw {
  saved_outfit_id?: number;
  savedOutfitId?: number;
  outfit_id?: number;
  outfitId?: number;
  id?: number | string;
  title?: string;
  context?: string;
  memo?: string;
  image_url?: string;
  imageUrl?: string;
  style_tags?: string[];
  styleTags?: string[];
  items?: SavedOutfitItemRaw[];
  created_at?: string;
  createdAt?: string;
}

interface SavedOutfitListRaw {
  saved_outfits?: SavedOutfitRaw[];
  outfits?: SavedOutfitRaw[];
  total_count?: number;
  total?: number;
}

export interface MyOutfitList {
  outfits: Outfit[];
  total: number;
}

export interface UpdateMyOutfitRequest {
  title: string;
  memo: string;
  styleTags: string[];
  itemIds: string[];
}

const toClothingItem = (item: SavedOutfitItemRaw): ClothingItem => {
  const rawImageUrl = item.image_url ?? item.imageUrl ?? '';

  return {
    id: String(item.item_id ?? item.itemId ?? ''),
    name: item.name,
    imageUrl: rawImageUrl ? imageSrc(rawImageUrl) : '',
    category: item.category
      ? categoryLabel(item.category)
      : ('기타' as ClothingCategory),
    tags: item.tags ?? [],
    createdAt: item.created_at ?? item.createdAt ?? '',
  };
};

const toOutfit = (outfit: SavedOutfitRaw): Outfit => {
  const id =
    outfit.saved_outfit_id ??
    outfit.savedOutfitId ??
    outfit.outfit_id ??
    outfit.outfitId ??
    outfit.id ??
    '';

  return {
    id: String(id),
    imageUrl: imageSrc(outfit.image_url ?? outfit.imageUrl ?? ''),
    items: (outfit.items ?? []).map(toClothingItem),
    styleTags: outfit.style_tags ?? outfit.styleTags ?? [],
    context: outfit.context ?? outfit.title ?? '저장한 코디',
    memo: outfit.memo ?? '',
    createdAt: outfit.created_at ?? outfit.createdAt ?? '',
    isSaved: true,
  };
};

/** SAVED-02 저장한 코디 목록 조회 */
export const getMyOutfits = async (): Promise<MyOutfitList> => {
  const { data } = await api.get<ApiResponse<SavedOutfitListRaw>>('/api/v1/outfits/saved');
  const rawOutfits = data.result.saved_outfits ?? data.result.outfits ?? [];

  return {
    outfits: rawOutfits.map(toOutfit),
    total: data.result.total_count ?? data.result.total ?? rawOutfits.length,
  };
};

/** SAVED-03 저장한 코디 상세 조회 */
export const getMyOutfit = async (savedOutfitId: string): Promise<Outfit> => {
  const { data } = await api.get<ApiResponse<SavedOutfitRaw>>(
    `/api/v1/outfits/saved/${savedOutfitId}`,
  );

  return toOutfit(data.result);
};

/** SAVED-04 저장한 코디 정보 수정 */
export const updateMyOutfit = async (
  savedOutfitId: string,
  body: UpdateMyOutfitRequest,
): Promise<Outfit> => {
  const { data } = await api.patch<ApiResponse<SavedOutfitRaw>>(
    `/api/v1/outfits/saved/${savedOutfitId}`,
    {
      title: body.title,
      memo: body.memo,
      style_tags: body.styleTags,
      item_ids: body.itemIds.map(Number),
    },
  );

  return toOutfit(data.result);
};

/** SAVED-05 저장한 코디 삭제 */
export const deleteMyOutfit = async (savedOutfitId: string): Promise<void> => {
  await api.delete(`/api/v1/outfits/${savedOutfitId}`);
};
