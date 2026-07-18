// 디지털 옷장 온보딩 공통 타입

/** 옷 카테고리 */
export type ClothingCategory = 'top' | 'bottom' | 'shoes' | 'etc';

/** 옷장 아이템 */
export interface ClothingItem {
  id: string;
  imageUrl: string;
  name?: string;
  category: ClothingCategory;
  brand?: string;
  tags?: string[];
}

/** 옷 등록 방식 */
export type RegisterMethod = 'album' | 'camera' | 'platform' | 'receipt';

/** 연동 쇼핑몰 플랫폼 */
export interface ShoppingPlatform {
  id: string;
  name: string;
  logoUrl?: string;
}

/** 로딩 화면 흐름 (구매내역 불러오기 / 사진 분석) */
export type ClosetLoadingVariant = 'import' | 'analyze';

/** 로딩 상태 (진행중 / 완료) */
export type LoadingState = 'loading' | 'done';
