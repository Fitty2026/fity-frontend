import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage } from '../api/closetApi';
import {
  MAX_RECEIPT_ITEMS,
  imageIdFromUrl,
  registerReceiptItems,
  toReceiptCategory,
  type OcrImportType,
  type ReceiptItemPayload,
} from '../api/ocrApi';
import { getErrorMessage } from '@/lib/apiError';
import type { OcrProduct } from '@/store/closetStore';

/** 등록할 상품 한 건 — 화면이 모은 값 그대로 */
export interface RegisterTarget {
  product: OcrProduct;
  /** 서버에 남길 등록 경로 — 실물 영수증인지 구매내역 캡처인지 */
  importType: OcrImportType;
}

export interface RegisterResult {
  /** 등록에 성공한 아이템 수 */
  registered: number;
  /** 등록하지 못한 상품 이름 — 화면에서 안내에 쓴다 */
  failed: string[];
  /** 실패 사유 중 하나 — 여러 건이 같은 이유로 막히는 게 보통이라 대표 하나만 보여준다 */
  reason?: string;
}

/** 사람에게 보여줄 이름 — 이름이 비어 있으면 자리표시 */
const displayName = (product: OcrProduct) => product.name || '이름 없는 상품';

/**
 * 화면에서 고른 사진을 imageId로 바꾼다.
 *
 * 앨범·카메라로 고른 사진은 objectURL(blob:)이라 먼저 업로드(IMAGE-01)해야 한다.
 * 서버가 이미 준 경로(`/api/v1/images/{id}/content`)면 업로드 없이 id만 되읽는다.
 * 저장은 imageUrl이 아니라 imageId를 받는다(PROFILE-07, 없으면 OCR400_08).
 */
const toImageId = async (photo: string): Promise<number> => {
  const url = photo.startsWith('blob:')
    ? await uploadImage(
        new File([await fetch(photo).then((response) => response.blob())], 'closet-item.jpg', {
          type: 'image/jpeg',
        }),
        'CLOSET_ITEM',
      )
    : photo;

  const imageId = imageIdFromUrl(url);
  if (imageId === null) throw new Error('이미지를 등록하지 못했어요.');
  return imageId;
};

/** 화면 값 → 저장 요청 한 건. 필수값이 비면 서버가 400을 내므로 여기서 먼저 막는다 */
const toPayload = async (
  { product, importType }: RegisterTarget,
): Promise<ReceiptItemPayload> => {
  const colorText = product.colors?.[0]?.label || product.color.label;
  // 서버 검증(OCR400_07)과 같은 조건 — 미리 걸러 요청 한 번을 아낀다
  if (!product.name || !product.brand || !colorText) {
    throw new Error('브랜드·상품명·색상을 모두 채워주세요.');
  }
  if (!product.photo) throw new Error('옷 이미지를 등록해주세요.');

  return {
    productName: product.name,
    brand: product.brand,
    colorText,
    imageId: await toImageId(product.photo),
    category: toReceiptCategory(product.category ?? ''),
    subCategory: product.subCategory || undefined,
    size: product.size || undefined,
    importType,
    tags: product.tags?.length ? product.tags : undefined,
    memo: product.memo || undefined,
  };
};

/** n개씩 자른다 — 서버가 한 번에 MAX_RECEIPT_ITEMS개까지만 받는다(OCR400_06) */
const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );

/**
 * 옷장 아이템 등록 — 사진을 올려 imageId를 만든 뒤 PROFILE-07로 한 번에 저장한다.
 *
 * 저장은 요청 단위 트랜잭션이라 한 건이라도 막히면 그 묶음 전체가 안 들어간다.
 * 그래서 (1) 필수값·이미지 준비는 상품별로 먼저 처리해 못 갖춘 건만 빼고,
 * (2) 남은 것을 MAX_RECEIPT_ITEMS개씩 나눠 보낸다 — 앞 묶음이 실패해도 뒤는 시도한다.
 */
const useRegisterClosetItems = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (targets: RegisterTarget[]): Promise<RegisterResult> => {
      const failed: string[] = [];
      let reason: string | undefined;
      const ready: { target: RegisterTarget; payload: ReceiptItemPayload }[] = [];

      // 1) 상품별 준비 — 업로드는 서로 무관해 한 건이 막혀도 나머지는 계속 간다
      const prepared = await Promise.all(
        targets.map(async (target) => {
          try {
            return { target, payload: await toPayload(target) };
          } catch (error) {
            failed.push(displayName(target.product));
            reason ??= getErrorMessage(error);
            return null;
          }
        }),
      );
      prepared.forEach((entry) => entry && ready.push(entry));

      // 2) 묶음 저장
      let registered = 0;
      for (const group of chunk(ready, MAX_RECEIPT_ITEMS)) {
        try {
          registered += await registerReceiptItems(group.map((entry) => entry.payload));
        } catch (error) {
          group.forEach((entry) => failed.push(displayName(entry.target.product)));
          reason ??= getErrorMessage(error);
        }
      }

      return { registered, failed, reason };
    },
    onSuccess: (result) => {
      // 한 건이라도 들어갔으면 옷장 목록이 옛 값을 들고 있으면 안 된다
      if (result.registered > 0) queryClient.invalidateQueries({ queryKey: ['closets'] });
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};

export default useRegisterClosetItems;
