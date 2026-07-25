import api from '@/lib/axios';
import type { ApiResponse, ClothingCategory, ClothingItem } from '@/types';

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

// ── CLOSET-03 옷장 목록 조회 (GET /api/v1/closets) ──
// 미확정(백엔드 확인 대기, 참고사항 기재): 카테고리 쿼리 파라미터 / 페이지네이션 / category enum 전체.
// → 현재는 전체를 한 번에 받아 클라이언트에서 필터·검색·정렬. 쿼리/페이지네이션은 답 오면 반영.

/** API 카테고리(영문 enum) → FE 한글 라벨. TODO(BE3): enum 전체 확정 시 보강(액세서리 등) */
const CATEGORY_LABEL: Record<string, ClothingCategory> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  SHOES: '신발',
  BAG: '가방',
  ACCESSORY: '액세서리',
  ETC: '기타',
};
export const categoryLabel = (c: string): ClothingCategory => CATEGORY_LABEL[c] ?? '기타';

interface ClosetListRaw {
  category_count: Record<string, number>;
  closet_items: {
    item_id: number;
    image_url: string;
    category: string;
    tags: string[];
    created_at: string;
  }[];
}

export interface ClosetList {
  /** 원본 category_count (영문 enum 키 + total). 0개 카테고리 포함 여부는 백엔드 확인 대기 */
  categoryCount: Record<string, number>;
  items: ClothingItem[];
}

export const getClosets = async (): Promise<ClosetList> => {
  const { data } = await api.get<ApiResponse<ClosetListRaw>>('/api/v1/closets');
  const r = data.result;
  return {
    categoryCount: r.category_count,
    items: r.closet_items.map((it) => ({
      id: String(it.item_id),
      imageUrl: imageSrc(it.image_url), // 절대(S3)는 그대로, 상대(/api/..)는 baseURL 조합 → 렌더용 URL
      category: categoryLabel(it.category),
      tags: it.tags,
      createdAt: it.created_at,
    })),
  };
};

// ── CLOSET-04 옷장 아이템 상세 조회 (GET /api/v1/closets/items/:itemId) ──
// 제공: image_url/category/import_type/tags/created_at.
// 미제공(화면엔 있음): 세부카테고리·색상·브랜드·메모·세부이미지 → 백엔드 확인 대기(참고사항). 현재 '-'/빈값 폴백.

interface ClosetItemDetailRaw {
  item_id: number;
  image_url: string;
  category: string;
  import_type: string;
  tags: string[];
  created_at: string;
}

export const getClosetItem = async (itemId: string): Promise<ClothingItem> => {
  const { data } = await api.get<ApiResponse<ClosetItemDetailRaw>>(`/api/v1/closets/items/${itemId}`);
  const r = data.result;
  return {
    id: String(r.item_id),
    imageUrl: imageSrc(r.image_url),
    category: categoryLabel(r.category),
    tags: r.tags,
    createdAt: r.created_at,
  };
};
