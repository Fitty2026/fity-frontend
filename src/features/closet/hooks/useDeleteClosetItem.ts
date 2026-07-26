import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClosetItem } from '../api/closetApi';

/**
 * 아이템 삭제(CLOSET-06). 성공 시 목록 캐시 무효화로 최신화.
 */
const useDeleteClosetItem = () => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (itemId: string) => deleteClosetItem(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['closets'] }),
  });
  return {
    remove: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};

export default useDeleteClosetItem;
