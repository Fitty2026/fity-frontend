import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  permanentlyDeleteOutfit,
  restoreRecentlyDeletedOutfit,
  type RecentlyDeletedOutfitList,
} from '../api/myOutfitApi';
import { myOutfitKeys } from './useMyOutfits';

const removeFromRecentlyDeleted = (
  current: RecentlyDeletedOutfitList | undefined,
  savedOutfitId: string,
) =>
  current
    ? {
        outfits: current.outfits.filter(({ outfit }) => outfit.id !== savedOutfitId),
        total: Math.max(0, current.total - 1),
      }
    : current;

const useRecentlyDeletedOutfitActions = () => {
  const queryClient = useQueryClient();

  const restoreMutation = useMutation({
    mutationFn: restoreRecentlyDeletedOutfit,
    onSuccess: (_result, savedOutfitId) => {
      queryClient.setQueryData<RecentlyDeletedOutfitList>(
        myOutfitKeys.recentlyDeleted(),
        (current) => removeFromRecentlyDeleted(current, savedOutfitId),
      );
      void queryClient.invalidateQueries({ queryKey: myOutfitKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: myOutfitKeys.detail(savedOutfitId) });
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: permanentlyDeleteOutfit,
    onSuccess: (_result, savedOutfitId) => {
      queryClient.setQueryData<RecentlyDeletedOutfitList>(
        myOutfitKeys.recentlyDeleted(),
        (current) => removeFromRecentlyDeleted(current, savedOutfitId),
      );
      queryClient.removeQueries({ queryKey: myOutfitKeys.detail(savedOutfitId) });
    },
  });

  return { restoreMutation, permanentDeleteMutation };
};

export default useRecentlyDeletedOutfitActions;
