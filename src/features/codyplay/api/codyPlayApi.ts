import { categoryLabel, getClosets, imageSrc } from '@/features/closet/api/closetApi';
import api from '@/lib/axios';
import type { ApiResponse, ClothingItem, Outfit, StylingRequest } from '@/types';

interface OutfitItemRaw {
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

interface OutfitRaw {
  saved_outfit_id?: number;
  savedOutfitId?: number;
  outfit_id?: number;
  outfitId?: number;
  outfitResultId?: number;
  id?: number;
  image_url?: string;
  imageUrl?: string;
  title?: string;
  name?: string;
  context?: string;
  memo?: string;
  style_tags?: string[];
  styleTags?: string[];
  tags?: string[];
  items?: Array<OutfitItemRaw | number>;
  created_at?: string;
  createdAt?: string;
}

interface GenerationJobRaw {
  job_id?: number;
  jobId?: number;
  status: string;
  progress?: number;
  outfitResultId?: number;
  generatedImageUrl?: string;
  generatedImage?: {
    outfitResultId?: number;
    imageUrl?: string;
    outfitItems?: Array<{ slot?: string; itemId?: number }>;
    recommendedClosetItemIds?: number[];
  };
  failure?: { code: string; message: string };
  result?: OutfitRaw;
}

export interface GenerationJob {
  jobId: string;
  status: 'QUEUED' | 'PROCESSING' | 'QC_PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  progress: number;
  failure?: { code: string; message: string };
  result?: Outfit;
}

const toItem = (item: OutfitItemRaw | number): ClothingItem => {
  if (typeof item === 'number') {
    return {
      id: String(item),
      imageUrl: '',
      category: categoryLabel('ETC'),
      tags: [],
      createdAt: '',
    };
  }

  return {
    id: String(item.item_id ?? item.itemId ?? ''),
    name: item.name,
    imageUrl:
      item.image_url || item.imageUrl ? imageSrc(item.image_url ?? item.imageUrl ?? '') : '',
    category: categoryLabel(item.category ?? 'ETC'),
    tags: item.tags ?? [],
    createdAt: item.created_at ?? item.createdAt ?? '',
  };
};

const toOutfit = (outfit: OutfitRaw): Outfit => ({
  id: String(
    outfit.saved_outfit_id ??
      outfit.savedOutfitId ??
      outfit.outfit_id ??
      outfit.outfitId ??
      outfit.outfitResultId ??
      outfit.id ??
      '',
  ),
  imageUrl:
    outfit.image_url || outfit.imageUrl ? imageSrc(outfit.image_url ?? outfit.imageUrl ?? '') : '',
  items: (outfit.items ?? []).map(toItem),
  styleTags: outfit.tags ?? outfit.style_tags ?? outfit.styleTags ?? [],
  context: outfit.name ?? outfit.context ?? outfit.title ?? '새로운 코디',
  memo: outfit.memo ?? '',
  createdAt: outfit.created_at ?? outfit.createdAt ?? '',
  isSaved: false,
});

const toGenerationJob = (job: GenerationJobRaw): GenerationJob => {
  const generated = job.generatedImage;
  const outfitResultId = job.outfitResultId ?? generated?.outfitResultId;
  const itemIds =
    generated?.recommendedClosetItemIds ??
    generated?.outfitItems?.flatMap(({ itemId }) => (itemId ? [itemId] : [])) ??
    [];
  const generatedOutfit = outfitResultId
    ? toOutfit({
        id: outfitResultId,
        imageUrl: job.generatedImageUrl ?? generated?.imageUrl,
        items: itemIds,
      })
    : undefined;

  return {
    jobId: String(job.job_id ?? job.jobId ?? ''),
    status: job.status.toUpperCase() as GenerationJob['status'],
    progress: job.progress ?? 0,
    failure: job.failure,
    result: job.result ? toOutfit(job.result) : generatedOutfit,
  };
};

const withHashTags = (tags: string[]) =>
  tags.map((tag) => {
    const normalized = tag.trim();
    return normalized.startsWith('#') ? normalized : `#${normalized}`;
  });

const hydrateOutfitItems = async (outfit: Outfit): Promise<Outfit> => {
  if (outfit.items.length === 0) return outfit;
  const closet = await getClosets().catch(() => null);
  if (!closet) return outfit;
  const closetItems = new Map(closet.items.map((item) => [item.id, item]));
  return {
    ...outfit,
    items: outfit.items.map((item) => closetItems.get(item.id) ?? item),
  };
};

/** 코디 생성 작업 요청 */
export const createGenerationJob = async (request: StylingRequest): Promise<GenerationJob> => {
  const { data } = await api.post<ApiResponse<GenerationJobRaw>>(
    '/api/v1/outfits/generation-jobs',
    {
      closetItemIds: request.baseItemId ? [Number(request.baseItemId)] : [],
      selectedDate: request.date,
    },
    { headers: { 'Idempotency-Key': crypto.randomUUID() } },
  );

  return toGenerationJob(data.result);
};

/** 코디 생성 작업 상태 조회 */
export const getGenerationJob = async (jobId: string): Promise<GenerationJob> => {
  const { data } = await api.get<ApiResponse<GenerationJobRaw>>(
    `/api/v1/outfits/generation-jobs/${jobId}`,
  );

  const job = toGenerationJob(data.result);
  return job.result ? { ...job, result: await hydrateOutfitItems(job.result) } : job;
};

/** 생성된 코디 저장 */
export const saveGeneratedOutfit = async ({
  outfit,
  name,
}: {
  outfit: Outfit;
  name: string;
}): Promise<Outfit> => {
  const { data } = await api.post<ApiResponse<OutfitRaw>>('/api/v1/outfits/saved', {
    outfitResultId: Number(outfit.id),
    name: name.trim() || '새로운 코디',
    tags: withHashTags(outfit.styleTags),
    memo: outfit.memo ?? '',
  });
  const saved = toOutfit(data.result);
  const hydratedSaved = await hydrateOutfitItems(saved);

  return {
    ...hydratedSaved,
    id: hydratedSaved.id || outfit.id,
    imageUrl: hydratedSaved.imageUrl || outfit.imageUrl,
    items: hydratedSaved.items.length > 0 ? hydratedSaved.items : outfit.items,
    styleTags: withHashTags(
      hydratedSaved.styleTags.length > 0 ? hydratedSaved.styleTags : outfit.styleTags,
    ),
    context:
      data.result.name ?? data.result.context ?? data.result.title ?? name ?? hydratedSaved.context,
    memo: data.result.memo ?? outfit.memo ?? hydratedSaved.memo,
    createdAt: hydratedSaved.createdAt || outfit.createdAt,
    isSaved: true,
  };
};

/** OUTFIT-04 리터치 결과 저장 및 재생성 */
interface RevisionAcceptedRaw {
  jobId: number;
}

const waitForGenerationJob = async (jobId: string): Promise<GenerationJob> => {
  for (;;) {
    const job = await getGenerationJob(jobId);
    if (job.status === 'COMPLETED') return job;
    if (job.status === 'FAILED' || job.status === 'EXPIRED') {
      throw new Error(job.failure?.message ?? '코디 재생성에 실패했습니다.');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

export const saveRetouchedOutfit = async ({
  original,
  updated,
}: {
  original: Outfit;
  updated: Outfit;
}): Promise<Outfit> => {
  const replacements = original.items.flatMap((item, index) => {
    const nextItem = updated.items[index];
    return nextItem && nextItem.id !== item.id
      ? [{ replaceItemId: item.id, newItemId: nextItem.id }]
      : [];
  });

  if (replacements.length === 0) return updated;

  let regenerated = original;
  for (const replacement of replacements) {
    const { data } = await api.post<ApiResponse<RevisionAcceptedRaw>>(
      `/api/v1/outfits/${regenerated.id}/revisions`,
      {
        replaceItemId: Number(replacement.replaceItemId),
        newItemId: Number(replacement.newItemId),
      },
      { headers: { 'Idempotency-Key': crypto.randomUUID() } },
    );
    const completedJob = await waitForGenerationJob(String(data.result.jobId));
    if (!completedJob.result) throw new Error('재생성된 코디 결과가 없습니다.');
    regenerated = completedJob.result;
  }

  return {
    ...updated,
    ...regenerated,
    id: regenerated.id || updated.id,
    imageUrl: regenerated.imageUrl || updated.imageUrl,
    items: regenerated.items.map((item) => updated.items.find(({ id }) => id === item.id) ?? item),
    styleTags: regenerated.styleTags.length > 0 ? regenerated.styleTags : updated.styleTags,
    context: regenerated.context ?? updated.context,
    memo: regenerated.memo ?? updated.memo,
    createdAt: regenerated.createdAt || updated.createdAt,
  };
};
