import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import type { Outfit } from '@/types';

import { setMyOutfitLike, type MyOutfitList } from '../api/myOutfitApi';
import { myOutfitKeys } from './useMyOutfits';

interface ToggleMyOutfitLikeVariables {
  savedOutfitId: string;
  isLiked: boolean;
}

const updateOutfitLike = (outfit: Outfit, savedOutfitId: string, isLiked: boolean) =>
  outfit.id === savedOutfitId ? { ...outfit, isLiked } : outfit;

const useToggleMyOutfitLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ savedOutfitId, isLiked }: ToggleMyOutfitLikeVariables) =>
      setMyOutfitLike(savedOutfitId, isLiked),
    onMutate: async ({ savedOutfitId, isLiked }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: myOutfitKeys.lists() }),
        queryClient.cancelQueries({ queryKey: myOutfitKeys.detail(savedOutfitId) }),
      ]);

      const previousLists = queryClient.getQueriesData<InfiniteData<MyOutfitList>>({
        queryKey: myOutfitKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<Outfit>(myOutfitKeys.detail(savedOutfitId));

      previousLists.forEach(([queryKey, current]) => {
        if (!current) return;
        const likedOnly = (queryKey[2] as { likedOnly?: boolean } | undefined)?.likedOnly === true;
        const includesOutfit = current.pages.some((page) =>
          page.outfits.some(({ id }) => id === savedOutfitId),
        );

        queryClient.setQueryData<InfiniteData<MyOutfitList>>(queryKey, {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            outfits:
              likedOnly && !isLiked
                ? page.outfits.filter((outfit) => outfit.id !== savedOutfitId)
                : page.outfits.map((outfit) => updateOutfitLike(outfit, savedOutfitId, isLiked)),
            total:
              likedOnly && !isLiked && includesOutfit ? Math.max(0, page.total - 1) : page.total,
          })),
        });
      });
      queryClient.setQueryData<Outfit>(myOutfitKeys.detail(savedOutfitId), (current) =>
        current ? { ...current, isLiked } : current,
      );

      return { previousLists, previousDetail };
    },
    onError: (_error, { savedOutfitId }, context) => {
      context?.previousLists.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data),
      );
      if (context?.previousDetail) {
        queryClient.setQueryData(myOutfitKeys.detail(savedOutfitId), context.previousDetail);
      }
    },
    onSettled: (_result, _error, { savedOutfitId }) => {
      void queryClient.invalidateQueries({ queryKey: myOutfitKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: myOutfitKeys.detail(savedOutfitId) });
    },
  });
};

export default useToggleMyOutfitLike;
