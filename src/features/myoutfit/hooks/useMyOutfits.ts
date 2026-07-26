import { useQuery } from '@tanstack/react-query';

import {
  getMyOutfit,
  getMyOutfits,
  getRecentlyDeletedOutfits,
  type MyOutfitList,
} from '../api/myOutfitApi';

export type { MyOutfitList };

export const myOutfitKeys = {
  all: ['myoutfits'] as const,
  lists: () => [...myOutfitKeys.all, 'list'] as const,
  recentlyDeleted: () => [...myOutfitKeys.all, 'recently-deleted'] as const,
  details: () => [...myOutfitKeys.all, 'detail'] as const,
  detail: (savedOutfitId: string) => [...myOutfitKeys.details(), savedOutfitId] as const,
};

const useMyOutfits = () =>
  useQuery({
    queryKey: myOutfitKeys.lists(),
    queryFn: getMyOutfits,
  });

export default useMyOutfits;

export const useRecentlyDeletedOutfits = () =>
  useQuery({
    queryKey: myOutfitKeys.recentlyDeleted(),
    queryFn: getRecentlyDeletedOutfits,
  });

export const useMyOutfit = (savedOutfitId: string | undefined) =>
  useQuery({
    queryKey: myOutfitKeys.detail(savedOutfitId ?? ''),
    queryFn: () => getMyOutfit(savedOutfitId as string),
    enabled: Boolean(savedOutfitId),
  });
