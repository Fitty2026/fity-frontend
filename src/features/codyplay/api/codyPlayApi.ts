import { categoryLabel, imageSrc } from '@/features/closet/api/closetApi';
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
  id?: number;
  image_url?: string;
  imageUrl?: string;
  title?: string;
  context?: string;
  memo?: string;
  style_tags?: string[];
  styleTags?: string[];
  items?: OutfitItemRaw[];
  created_at?: string;
  createdAt?: string;
}

interface GenerationJobRaw {
  job_id?: number;
  jobId?: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result?: OutfitRaw;
}

export interface GenerationJob {
  jobId: string;
  status: GenerationJobRaw['status'];
  result?: Outfit;
}

const toItem = (item: OutfitItemRaw): ClothingItem => ({
  id: String(item.item_id ?? item.itemId ?? ''),
  name: item.name,
  imageUrl: imageSrc(item.image_url ?? item.imageUrl ?? ''),
  category: categoryLabel(item.category ?? 'ETC'),
  tags: item.tags ?? [],
  createdAt: item.created_at ?? item.createdAt ?? '',
});

const toOutfit = (outfit: OutfitRaw): Outfit => ({
  id: String(
    outfit.saved_outfit_id ??
      outfit.savedOutfitId ??
      outfit.outfit_id ??
      outfit.outfitId ??
      outfit.id ??
      '',
  ),
  imageUrl: imageSrc(outfit.image_url ?? outfit.imageUrl ?? ''),
  items: (outfit.items ?? []).map(toItem),
  styleTags: outfit.style_tags ?? outfit.styleTags ?? [],
  context: outfit.context ?? outfit.title ?? '생성된 코디',
  memo: outfit.memo ?? '',
  createdAt: outfit.created_at ?? outfit.createdAt ?? '',
  isSaved: false,
});

const toGenerationJob = (job: GenerationJobRaw): GenerationJob => ({
  jobId: String(job.job_id ?? job.jobId ?? ''),
  status: job.status,
  result: job.result ? toOutfit(job.result) : undefined,
});

/** 코디 생성 작업 요청 */
export const createGenerationJob = async (request: StylingRequest): Promise<GenerationJob> => {
  const { data } = await api.post<ApiResponse<GenerationJobRaw>>(
    '/api/v1/outfits/generation-jobs',
    {
      context: request.context,
      date: request.date,
      mood: request.mood,
      base_item_id: request.baseItemId ? Number(request.baseItemId) : undefined,
    },
  );

  return toGenerationJob(data.result);
};

/** 코디 생성 작업 상태 조회 */
export const getGenerationJob = async (jobId: string): Promise<GenerationJob> => {
  const { data } = await api.get<ApiResponse<GenerationJobRaw>>(
    `/api/v1/outfits/generation-jobs/${jobId}`,
  );

  return toGenerationJob(data.result);
};

/** 생성된 코디 저장 */
export const saveGeneratedOutfit = async (outfit: Outfit): Promise<Outfit> => {
  const { data } = await api.post<ApiResponse<OutfitRaw>>('/api/v1/outfits/save', {
    outfit_id: Number(outfit.id),
  });

  return { ...toOutfit(data.result), isSaved: true };
};
