import { useMutation } from '@tanstack/react-query';
import { createOutfitJob } from '../api/stylingApi';
import type { OutfitJobInput } from '../types';

/**
 * 코디 생성 요청 (OUTFIT-01) — 접수만 하고 jobId를 돌려준다.
 * 실제 결과는 useOutfitJob으로 jobId를 폴링해서 받는다.
 * 진행 중인 job이 있으면 새 job 대신 그 job이 돌아온다 (accepted.isExistingJob).
 */
const useGenerateOutfit = () => {
  const mutation = useMutation({ mutationFn: createOutfitJob });

  return {
    generate: (body: OutfitJobInput) => mutation.mutate(body),
    generateAsync: mutation.mutateAsync,
    accepted: mutation.data ?? null,
    jobId: mutation.data?.jobId ?? null,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export default useGenerateOutfit;
