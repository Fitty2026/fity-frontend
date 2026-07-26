import { useQuery } from '@tanstack/react-query';

import {
  getMyOutfit,
  getMyOutfits,
  type MyOutfitList,
} from '../api/myOutfitApi';

export type { MyOutfitList };

export const myOutfitKeys = {
  all: ['myoutfits'] as const,
  lists: () => [...myOutfitKeys.all, 'list'] as const,
  details: () => [...myOutfitKeys.all, 'detail'] as const,
  detail: (savedOutfitId: string) => [...myOutfitKeys.details(), savedOutfitId] as const,
};

const useMyOutfits = () =>
  useQuery({
    queryKey: myOutfitKeys.lists(),
    queryFn: getMyOutfits,
  });

export default useMyOutfits;

export const useMyOutfit = (savedOutfitId: string | undefined) =>
  useQuery({
    queryKey: myOutfitKeys.detail(savedOutfitId ?? ''),
    queryFn: () => getMyOutfit(savedOutfitId as string),
    enabled: Boolean(savedOutfitId),
  });
