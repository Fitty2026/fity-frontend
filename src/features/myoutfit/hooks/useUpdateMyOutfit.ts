import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateMyOutfit,
  type UpdateMyOutfitRequest,
} from '../api/myOutfitApi';
import { myOutfitKeys } from './useMyOutfits';

interface UpdateMyOutfitVariables {
  savedOutfitId: string;
  body: UpdateMyOutfitRequest;
}

const useUpdateMyOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ savedOutfitId, body }: UpdateMyOutfitVariables) =>
      updateMyOutfit(savedOutfitId, body),
    onSuccess: (updatedOutfit) => {
      queryClient.setQueryData(
        myOutfitKeys.detail(updatedOutfit.id),
        updatedOutfit,
      );
      void queryClient.invalidateQueries({ queryKey: myOutfitKeys.lists() });
    },
  });
};

export default useUpdateMyOutfit;
