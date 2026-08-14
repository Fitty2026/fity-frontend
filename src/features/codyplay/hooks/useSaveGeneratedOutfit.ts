import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveGeneratedOutfit } from '../api/codyPlayApi';
import { myOutfitKeys } from '@/features/myoutfit/hooks/useMyOutfits';

const useSaveGeneratedOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveGeneratedOutfit,
    onSuccess: (savedOutfit) => {
      queryClient.setQueryData(myOutfitKeys.detail(savedOutfit.id), savedOutfit);
      void queryClient.invalidateQueries({ queryKey: myOutfitKeys.lists() });
    },
  });
};

export default useSaveGeneratedOutfit;
