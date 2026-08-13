import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createGenerationJob,
  getGenerationJob,
} from '@/features/codyplay/api/codyPlayApi';
import useStylingStore from '@/store/stylingStore';
import type { Outfit } from '@/types';

const useGeneratedOutfit = (initialJobId?: string, initialOutfit?: Outfit) => {
  const hasRequestedRef = useRef(false);
  const selectedDate = useStylingStore((state) => state.selectedDate);
  const selectedContext = useStylingStore((state) => state.selectedContext);
  const selectedMood = useStylingStore((state) => state.selectedMood);
  const selectedBaseItem = useStylingStore((state) => state.selectedBaseItem);
  const generatedOutfit = useStylingStore((state) => state.generatedOutfit);
  const setGeneratedOutfit = useStylingStore((state) => state.setGeneratedOutfit);
  const createJobMutation = useMutation({ mutationFn: createGenerationJob });
  const jobId = initialJobId ?? createJobMutation.data?.jobId;
  const createdOutfit = createJobMutation.data?.result;
  const jobQuery = useQuery({
    queryKey: ['outfit-generation-job', jobId],
    queryFn: () => getGenerationJob(jobId as string),
    enabled: Boolean(jobId) && !initialOutfit && !generatedOutfit && !createdOutfit,
    refetchInterval: (query) =>
      query.state.data?.status === 'COMPLETED' || query.state.data?.status === 'FAILED'
        ? false
        : 1000,
  });

  useEffect(() => {
    if (initialJobId || initialOutfit || generatedOutfit || hasRequestedRef.current) return;
    hasRequestedRef.current = true;
    createJobMutation.mutate({
      date: selectedDate ?? undefined,
      context: selectedContext ?? undefined,
      mood: selectedMood ?? undefined,
      baseItemId: selectedBaseItem?.id,
    });
  }, [
    createJobMutation,
    generatedOutfit,
    initialOutfit,
    initialJobId,
    selectedBaseItem?.id,
    selectedContext,
    selectedDate,
    selectedMood,
  ]);

  const completedOutfit = initialOutfit ?? createdOutfit ?? jobQuery.data?.result;
  const completedStatus = createJobMutation.data?.status ?? jobQuery.data?.status;
  useEffect(() => {
    if (initialOutfit) {
      setGeneratedOutfit(initialOutfit);
    } else if (completedStatus === 'COMPLETED' && completedOutfit) {
      setGeneratedOutfit(completedOutfit);
    }
  }, [completedOutfit, completedStatus, initialOutfit, setGeneratedOutfit]);

  return {
    outfit: initialOutfit ?? generatedOutfit ?? completedOutfit,
    isPending:
      !initialOutfit &&
      !generatedOutfit &&
      (createJobMutation.isPending ||
        (!createdOutfit && Boolean(jobId) && jobQuery.isPending)),
    error:
      (initialOutfit ? null : createJobMutation.error) ??
      jobQuery.error ??
      (completedStatus === 'FAILED' ? new Error('코디 생성에 실패했습니다.') : null),
    retry: () => {
      hasRequestedRef.current = false;
      createJobMutation.reset();
      void jobQuery.refetch();
    },
  };
};

export default useGeneratedOutfit;
