import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

// ── IMAGE-01 이미지 업로드 (POST /api/v1/images/upload) ──
// multipart/form-data. 응답 imageUrl은 상대경로(예: /api/v1/images/12/content).
// 상대경로 그대로 저장/전달하고, 화면 렌더 시에만 imageSrc()로 baseURL과 조합한다.

export type ImageType = 'CLOSET_ITEM';

/** 파일 업로드 → 상대경로 imageUrl 반환 */
export const uploadImage = async (file: File, imageType: ImageType = 'CLOSET_ITEM'): Promise<string> => {
  const form = new FormData();
  form.append('image', file);
  form.append('imageType', imageType);
  // FormData면 axios가 boundary 포함 multipart 헤더를 자동 설정하도록 기본 json 헤더 제거
  const { data } = await api.post<ApiResponse<{ imageUrl: string }>>('/api/v1/images/upload', form, {
    headers: { 'Content-Type': undefined },
  });
  return data.result.imageUrl;
};

/** 상대경로 imageUrl → 렌더용 절대 URL (baseURL 조합은 표시할 때만) */
export const imageSrc = (imageUrl: string): string =>
  imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;

// ── CLOSET-02 옷장 아이템 등록 (POST /api/v1/closets/items) ──

/** API 카테고리 enum (예: TOP). 전체 enum 확정 시 보강 */
export type ApiClosetCategory = 'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'BAG' | 'ACCESSORY' | 'ETC';

/** 등록 경로 — 서버가 그대로 저장 (카메라/앨범/쇼핑몰/영수증) */
export type ImportType = '카메라' | '앨범' | '쇼핑몰' | '영수증';

export interface RegisterClosetItemRequest {
  image_url: string;
  category: ApiClosetCategory;
  import_type: ImportType;
}

interface RegisterClosetItemRaw {
  item_id: number;
  image_url: string;
  category: string;
  import_type: string;
  created_at: string;
}

export interface RegisteredClosetItem {
  itemId: number;
  imageUrl: string;
  category: string;
  importType: string;
  createdAt: string;
}

export const registerClosetItem = async (
  body: RegisterClosetItemRequest,
): Promise<RegisteredClosetItem> => {
  const { data } = await api.post<ApiResponse<RegisterClosetItemRaw>>('/api/v1/closets/items', body);
  const r = data.result;
  return {
    itemId: r.item_id,
    imageUrl: r.image_url,
    category: r.category,
    importType: r.import_type,
    createdAt: r.created_at,
  };
};
