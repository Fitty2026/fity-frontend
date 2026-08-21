import { categoryLabel, getClosets, imageSrc } from '@/features/closet/api/closetApi';
import { getGenerationJob } from '@/features/codyplay/api/codyPlayApi';
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
  outfitResultId?: number;
  id?: number | string;
  title?: string;
  name?: string;
  context?: string;
  memo?: string;
  image_url?: string;
  imageUrl?: string;
  style_tags?: string[];
  styleTags?: string[];
  tags?: string[];
  items?: Array<SavedOutfitItemRaw | number>;
  outfitItems?: Array<{ slot?: string; itemId?: number }>;
  created_at?: string;
  createdAt?: string;
  deleted_at?: string;
  deletedAt?: string;
  deletion_days_remaining?: number;
  deletionDaysRemaining?: number;
}

interface SavedOutfitListRaw {
  items?: SavedOutfitRaw[];
  pagination?: {
    totalCount?: number;
    total_count?: number;
  };
  saved_outfits?: SavedOutfitRaw[];
  outfits?: SavedOutfitRaw[];
  total_count?: number;
  total?: number;
}

export interface MyOutfitList {
  outfits: Outfit[];
  total: number;
  page: number;
  size: number;
}

export interface RecentlyDeletedOutfit {
  outfit: Outfit;
  deletionDaysRemaining: number;
}

export interface RecentlyDeletedOutfitList {
  outfits: RecentlyDeletedOutfit[];
  total: number;
}

export interface UpdateMyOutfitRequest {
  title: string;
  memo: string;
  styleTags: string[];
  outfitResultId?: string;
  itemIds?: string[];
}

interface RevisionAcceptedRaw {
  jobId: number;
}

const withHashTags = (tags: string[]) =>
  tags.map((tag) => {
    const normalized = String(tag).trim();
    return normalized.startsWith('#') ? normalized : `#${normalized}`;
  });

const getClosetItemMap = async (): Promise<Map<string, ClothingItem>> => {
  try {
    const closet = await getClosets();
    return new Map(closet.items.map((item) => [item.id, item]));
  } catch {
    return new Map();
  }
};

const toClothingItem = (item: SavedOutfitItemRaw | number): ClothingItem => {
  if (typeof item === 'number') {
    return {
      id: String(item),
      imageUrl: '',
      category: categoryLabel('ETC'),
      tags: [],
      createdAt: '',
    };
  }
  const rawImageUrl = item.image_url ?? item.imageUrl ?? '';

  return {
    id: String(item.item_id ?? item.itemId ?? ''),
    name: item.name,
    imageUrl: rawImageUrl ? imageSrc(rawImageUrl) : '',
    category: item.category ? categoryLabel(item.category) : ('기타' as ClothingCategory),
    tags: item.tags ?? [],
    createdAt: item.created_at ?? item.createdAt ?? '',
  };
};

const toOutfit = (
  outfit: SavedOutfitRaw,
  closetItems: Map<string, ClothingItem> = new Map(),
): Outfit => {
  const id =
    outfit.saved_outfit_id ??
    outfit.savedOutfitId ??
    outfit.outfit_id ??
    outfit.outfitId ??
    outfit.id ??
    '';

  return {
    id: String(id),
    outfitResultId: outfit.outfitResultId == null ? undefined : String(outfit.outfitResultId),
    imageUrl:
      outfit.image_url || outfit.imageUrl
        ? imageSrc(outfit.image_url ?? outfit.imageUrl ?? '')
        : '',
    items: (outfit.items ?? []).map((item) => {
      const mapped = toClothingItem(item);
      return closetItems.get(mapped.id) ?? mapped;
    }),
    styleTags: withHashTags(outfit.tags ?? outfit.style_tags ?? outfit.styleTags ?? []),
    context: outfit.name ?? outfit.context ?? outfit.title ?? '새로운 코디',
    memo: outfit.memo ?? '',
    createdAt: outfit.created_at ?? outfit.createdAt ?? '',
    isSaved: true,
  };
};

/** SAVED-02 저장한 코디 목록 조회 */
export const getMyOutfits = async (page = 1, size = 10): Promise<MyOutfitList> => {
  const [{ data }, closetItems] = await Promise.all([
    api.get<ApiResponse<SavedOutfitListRaw>>('/api/v1/outfits/saved', {
      params: { page, size },
    }),
    getClosetItemMap(),
  ]);
  // result가 비어 오는 경우(빈 목록·null)를 대비해 옵셔널로 접근한다
  const result: SavedOutfitListRaw = data.result ?? {};
  const rawOutfits = result.items ?? result.saved_outfits ?? result.outfits ?? [];

  return {
    outfits: rawOutfits.map((outfit) => toOutfit(outfit, closetItems)),
    total:
      result.pagination?.totalCount ??
      result.pagination?.total_count ??
      result.total_count ??
      result.total ??
      rawOutfits.length,
    page,
    size,
  };
};

/** SAVED-06 최근 삭제한 코디 목록 조회 */
export const getRecentlyDeletedOutfits = async (): Promise<RecentlyDeletedOutfitList> => {
  const [{ data }, closetItems] = await Promise.all([
    api.get<ApiResponse<SavedOutfitListRaw>>('/api/v1/outfits/saved/deleted'),
    getClosetItemMap(),
  ]);
  // result가 비어 오는 경우(빈 목록·null)를 대비해 옵셔널로 접근한다
  const result: SavedOutfitListRaw = data.result ?? {};
  const rawOutfits = result.items ?? result.saved_outfits ?? result.outfits ?? [];

  return {
    outfits: rawOutfits.map((rawOutfit) => {
      const deletedAt = rawOutfit.deleted_at ?? rawOutfit.deletedAt;
      const elapsedDays = deletedAt
        ? Math.floor((Date.now() - new Date(deletedAt).getTime()) / 86_400_000)
        : 0;

      return {
        outfit: toOutfit(rawOutfit, closetItems),
        deletionDaysRemaining:
          rawOutfit.deletion_days_remaining ??
          rawOutfit.deletionDaysRemaining ??
          Math.max(0, 30 - elapsedDays),
      };
    }),
    total:
      result.pagination?.totalCount ??
      result.pagination?.total_count ??
      result.total_count ??
      result.total ??
      rawOutfits.length,
  };
};

/** SAVED-03 저장한 코디 상세 조회 */
export const getMyOutfit = async (savedOutfitId: string): Promise<Outfit> => {
  const [{ data }, closetItems] = await Promise.all([
    api.get<ApiResponse<SavedOutfitRaw>>(`/api/v1/outfits/saved/${savedOutfitId}`),
    getClosetItemMap(),
  ]);

  return toOutfit(data.result, closetItems);
};

/** SAVED-04 저장한 코디 정보 수정 */
export const updateMyOutfit = async (
  savedOutfitId: string,
  body: UpdateMyOutfitRequest,
): Promise<Outfit> => {
  const { data } = await api.patch<ApiResponse<SavedOutfitRaw>>(
    `/api/v1/outfits/saved/${savedOutfitId}`,
    {
      name: body.title,
      memo: body.memo,
      tags: withHashTags(body.styleTags),
      ...(body.outfitResultId ? { outfitResultId: Number(body.outfitResultId) } : {}),
    },
  );

  const closetItems = await getClosetItemMap();
  const updatedOutfit = toOutfit(data.result, closetItems);

  return {
    ...updatedOutfit,
    id: updatedOutfit.id || savedOutfitId,
  };
};

export const regenerateMyOutfitWithReplacement = async ({
  original,
  newItem,
}: {
  original: Outfit;
  newItem: ClothingItem;
}): Promise<Outfit> => {
  const replaceItem = original.items.find((item) => item.category === newItem.category);
  if (!replaceItem) {
    throw new Error('같은 카테고리의 교체할 아이템을 찾을 수 없어요.');
  }
  if (!original.outfitResultId) {
    throw new Error('원본 코디 결과 ID를 찾을 수 없어요.');
  }

  const { data } = await api.post<ApiResponse<RevisionAcceptedRaw>>(
    `/api/v1/outfits/${original.outfitResultId}/revisions`,
    {
      replaceItemId: Number(replaceItem.id),
      newItemId: Number(newItem.id),
    },
    { headers: { 'Idempotency-Key': crypto.randomUUID() } },
  );

  for (;;) {
    const job = await getGenerationJob(String(data.result.jobId));
    if (job.status === 'COMPLETED') {
      if (!job.result) throw new Error('재생성된 코디 결과가 없습니다.');
      return {
        ...original,
        imageUrl: job.result.imageUrl,
        items: job.result.items,
        outfitResultId: job.result.id,
      };
    }
    if (job.status === 'FAILED' || job.status === 'EXPIRED') {
      throw new Error(job.failure?.message ?? '코디 재생성에 실패했습니다.');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

/** SAVED-05 저장한 코디 삭제 */
export const deleteMyOutfit = async (savedOutfitId: string): Promise<void> => {
  await api.delete(`/api/v1/outfits/saved/${savedOutfitId}`);
};

/** SAVED-07 최근 삭제 코디 복구 */
export const restoreRecentlyDeletedOutfit = async (savedOutfitId: string): Promise<void> => {
  await api.post(`/api/v1/outfits/saved/${savedOutfitId}/restore`);
};

/** SAVED-08 최근 삭제 코디 영구 삭제 */
export const permanentlyDeleteOutfit = async (savedOutfitId: string): Promise<void> => {
  await api.delete(`/api/v1/outfits/saved/${savedOutfitId}/permanent`);
};
