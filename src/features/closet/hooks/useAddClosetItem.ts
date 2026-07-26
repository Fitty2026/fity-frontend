import { useMutation } from '@tanstack/react-query';
import { registerClosetItem, uploadImage, type ApiClosetCategory, type ImportType } from '../api/closetApi';

interface AddClosetItemParams {
  file: File;
  category: ApiClosetCategory;
  importType: ImportType;
}

/**
 * 옷 등록 2단계 플로우: IMAGE-01 업로드 → CLOSET-02 등록.
 * 파일을 먼저 올려 imageUrl(상대경로)을 받고, 그 값으로 아이템을 등록한다.
 * 성공/에러 후 화면 이동은 호출부에서 처리.
 */
const useAddClosetItem = () => {
  const mutation = useMutation({
    mutationFn: async ({ file, category, importType }: AddClosetItemParams) => {
      const imageUrl = await uploadImage(file, 'CLOSET_ITEM');
      return registerClosetItem({ image_url: imageUrl, category, import_type: importType });
    },
  });
  return {
    addItem: mutation.mutate,
    addItemAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};

export default useAddClosetItem;
