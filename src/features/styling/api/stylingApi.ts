import api from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { OutfitJob, OutfitJobAccepted, OutfitJobInput } from '../types';

// ── OUTFIT-01 코디 생성 요청 ──
// 체형 프로필은 보내지 않는다 (서버가 JWT로 조회).
// situation·selectedDate·weather는 선택값이라 없으면 필드를 빼서 보낸다.

/** 값이 없는 선택 필드는 제거 */
const compact = (body: OutfitJobInput): OutfitJobInput => ({
  closetItemIds: body.closetItemIds,
  ...(body.styleTagIds?.length ? { styleTagIds: body.styleTagIds } : {}),
  ...(body.situation ? { situation: body.situation } : {}),
  ...(body.selectedDate ? { selectedDate: body.selectedDate } : {}),
  ...(body.weather ? { weather: body.weather } : {}),
});

/**
 * 코디 생성 작업을 접수한다. 결과는 jobId로 OUTFIT-02에서 조회.
 * 진행 중인 job이 있으면 새로 만들지 않고 그 job이 돌아온다 (isExistingJob).
 */
export const createOutfitJob = async (body: OutfitJobInput): Promise<OutfitJobAccepted> => {
  const { data } = await api.post<ApiResponse<OutfitJobAccepted>>(
    '/api/v1/outfits/generation-jobs',
    compact(body),
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

// ── 진행 중인 내 job 조회 ──
// 화면 이탈·새로고침으로 jobId를 잃었을 때 사용. 진행 중인 job이 없으면 result가 null.
export const getActiveOutfitJob = async (): Promise<OutfitJobAccepted | null> => {
  const { data } = await api.get<ApiResponse<OutfitJobAccepted | null>>(
    '/api/v1/outfits/generation-jobs/active',
  );
  return data.result;
};
