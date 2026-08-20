import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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
  useInfiniteQuery({
    queryKey: myOutfitKeys.lists(),
    queryFn: ({ pageParam }) => getMyOutfits(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const loadedCount = pages.reduce((count, page) => count + page.outfits.length, 0);
      return loadedCount < lastPage.total ? lastPage.page + 1 : undefined;
    },
    select: (data) => ({
      ...data,
      outfits: data.pages.flatMap((page) => page.outfits),
    }),
  });

export default useMyOutfits;

export const useRecentlyDeletedOutfits = (enabled = true) =>
  useQuery({
    queryKey: myOutfitKeys.recentlyDeleted(),
    queryFn: getRecentlyDeletedOutfits,
    enabled,
  });

export const useMyOutfit = (savedOutfitId: string | undefined) =>
  useQuery({
    queryKey: myOutfitKeys.detail(savedOutfitId ?? ''),
    queryFn: () => getMyOutfit(savedOutfitId as string),
    enabled: Boolean(savedOutfitId),
  });
