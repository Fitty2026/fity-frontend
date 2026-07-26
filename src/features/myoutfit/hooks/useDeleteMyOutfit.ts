import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMyOutfit } from '../api/myOutfitApi';
import {
  myOutfitKeys,
  type MyOutfitList,
} from './useMyOutfits';

const useDeleteMyOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyOutfit,
    onSuccess: (_result, savedOutfitId) => {
      queryClient.setQueryData<MyOutfitList>(
        myOutfitKeys.lists(),
        (current) =>
          current
            ? {
                outfits: current.outfits.filter(
                  (outfit) => outfit.id !== savedOutfitId,
                ),
                total: Math.max(0, current.total - 1),
              }
            : current,
      );
      queryClient.removeQueries({
        queryKey: myOutfitKeys.detail(savedOutfitId),
      });
      void queryClient.invalidateQueries({
        queryKey: myOutfitKeys.recentlyDeleted(),
      });
    },
  });
};

export default useDeleteMyOutfit;
