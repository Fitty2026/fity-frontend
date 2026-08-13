import { useQuery } from '@tanstack/react-query';
import { imageSrc } from '../api/closetApi';
import { searchClothesImages, type ClothesImageSearchParams } from '../api/ocrApi';

/**
 * 연관 의류 이미지 조회(PROFILE-06) — 같은 옷을 이미 등록한 사용자의 사진.
 *
 * 셋 중 하나라도 비면 서버가 400(OCR400_10)이라 다 찼을 때만 부른다.
 * 서버가 완전일치로만 찾아 대개 빈 배열이다 — 화면은 0장을 정상으로 다룬다.
 * 실패해도 화면을 막지 않는다(있으면 좋은 정보라 재시도도 하지 않는다).
 */
const useClothesImages = (params: Partial<ClothesImageSearchParams>, enabled = true) => {
  const { brand = '', productName = '', colorText = '', colorHex = '' } = params;
  const ready = Boolean(brand && productName && colorText);

  const query = useQuery({
    queryKey: ['clothes-images', brand, productName, colorText],
    queryFn: () => searchClothesImages({ brand, productName, colorText, colorHex }),
    enabled: enabled && ready,
    retry: false,
    staleTime: Infinity,
  });

  // 응답은 상대경로라 렌더 직전에만 baseURL과 조합한다
  return (query.data ?? []).map(imageSrc);
};

export default useClothesImages;
