import { useQuery } from '@tanstack/react-query';
import { getOutfitJob } from '../api/stylingApi';
import { TERMINAL_JOB_STATUSES } from '../types';

/** 폴링 주기 — 백엔드 권장값 없어 임시 (확정되면 교체) */
const POLL_INTERVAL_MS = 2000;

/**
 * 코디 생성 작업 상태 폴링 (OUTFIT-02).
 * completed/failed/expired에 도달하면 폴링을 멈춘다.
 * jobId가 없으면(아직 접수 전) 요청하지 않는다.
 */
const useOutfitJob = (jobId: number | null) => {
  const query = useQuery({
    queryKey: ['outfitJob', jobId],
    queryFn: () => getOutfitJob(jobId as number),
    enabled: jobId !== null,
    // 진행 중 상태에서만 계속 재조회
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_JOB_STATUSES.includes(status)) return false;
      return POLL_INTERVAL_MS;
    },
    // 폴링 중에는 캐시를 즉시 갱신해야 하므로 fresh 유지 시간을 두지 않는다
    staleTime: 0,
  });

  const job = query.data;
  const status = job?.status ?? null;

  return {
    job,
    status,
    isCompleted: status === 'completed',
    isFailed: status === 'failed' || status === 'expired',
    isLoading: query.isLoading,
    error: query.error,
  };
};

export default useOutfitJob;
