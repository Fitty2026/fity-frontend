import api from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { OutfitJob, OutfitJobAccepted } from '../types';

// ── OUTFIT-01 코디 생성 요청 ──
export interface GenerateOutfitRequest {
  bodyProfileId: number;
  closetItemIds: number[];
  styleTagIds: number[];
}

/** 코디 생성 작업을 접수한다. 결과는 jobId로 OUTFIT-02에서 조회. */
export const createOutfitJob = async (body: GenerateOutfitRequest): Promise<OutfitJobAccepted> => {
  const { data } = await api.post<ApiResponse<OutfitJobAccepted>>(
    '/api/v1/outfits/generation-jobs',
    body,
  );
  return data.result;
};

// ── OUTFIT-02 코디 생성 작업 상태 조회 ──
export const getOutfitJob = async (jobId: number): Promise<OutfitJob> => {
  const { data } = await api.get<ApiResponse<OutfitJob>>(
    `/api/v1/outfits/generation-jobs/${jobId}`,
  );
  return data.result;
};
