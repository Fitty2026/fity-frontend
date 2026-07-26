import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClosetItemTags } from '../api/closetApi';

/**
 * 아이템 태그 수정(CLOSET-05). 성공 시 목록·상세 캐시 무효화로 최신화.
 */
const useUpdateClosetItem = (itemId?: string) => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (tagValues: string[]) => updateClosetItemTags(itemId as string, tagValues),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['closets'] });
      qc.invalidateQueries({ queryKey: ['closets', 'item', itemId] });
    },
  });
  return {
    save: mutation.mutate,
    saveAsync: mutation.mutateAsync,
    isSaving: mutation.isPending,
    error: mutation.error,
  };
};

export default useUpdateClosetItem;
