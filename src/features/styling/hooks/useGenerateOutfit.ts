import { useMutation } from '@tanstack/react-query';
import { createOutfitJob } from '../api/stylingApi';
import type { GenerateOutfitRequest } from '../api/stylingApi';

/**
 * 코디 생성 요청 (OUTFIT-01) — 접수만 하고 jobId를 돌려준다.
 * 실제 결과는 useOutfitJob으로 jobId를 폴링해서 받는다.
 */
const useGenerateOutfit = () => {
  const mutation = useMutation({ mutationFn: createOutfitJob });

  return {
    generate: (body: GenerateOutfitRequest) => mutation.mutate(body),
    generateAsync: mutation.mutateAsync,
    jobId: mutation.data?.jobId ?? null,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export default useGenerateOutfit;
