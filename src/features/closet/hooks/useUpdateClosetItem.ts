import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClosetItem, type UpdateClosetItemPatch } from '../api/closetApi';

/**
 * 아이템 정보 수정(CLOSET-05) — 카테고리·세부 카테고리·브랜드·메모·태그.
 * 성공 시 목록·상세 캐시 무효화로 최신화.
 */
const useUpdateClosetItem = (itemId?: string) => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (patch: UpdateClosetItemPatch) => updateClosetItem(itemId as string, patch),
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
