import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMyOutfit } from '../api/myOutfitApi';
import { myOutfitKeys } from './useMyOutfits';

const useDeleteMyOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyOutfit,
    onSuccess: (_result, savedOutfitId) => {
      void queryClient.invalidateQueries({ queryKey: myOutfitKeys.lists() });
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
