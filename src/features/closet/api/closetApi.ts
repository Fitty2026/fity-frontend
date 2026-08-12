import api from '@/lib/axios';
import type { ApiResponse, ClothingCategory, ClothingItem } from '@/types';

// ── IMAGE-01 이미지 업로드 (POST /api/v1/images/upload) ──
// multipart/form-data. 응답 imageUrl은 상대경로(예: /api/v1/images/12/content).
// 상대경로 그대로 저장/전달하고, 화면 렌더 시에만 imageSrc()로 baseURL과 조합한다.

export type ImageType = 'CLOSET_ITEM';

export interface UploadedImage {
  /**
   * 영수증 상품 저장(PROFILE-07)이 필수로 받는 값 — 문서 확인됨(2026-08-12).
   * 혹시 응답에 빠져 있으면 imageUrl 경로에서 되읽는 폴백이 받쳐준다.
   */
  imageId: number | null;
  /** 상대경로 (예: /api/v1/images/12/content) */
  imageUrl: string;
}

/** 파일 업로드 → imageUrl과, 있으면 imageId */
export const uploadImageAsset = async (
  file: File,
  imageType: ImageType = 'CLOSET_ITEM',
): Promise<UploadedImage> => {
  const form = new FormData();
  form.append('image', file);
  form.append('imageType', imageType);
  // FormData면 axios가 boundary 포함 multipart 헤더를 자동 설정하도록 기본 json 헤더 제거
  const { data } = await api.post<ApiResponse<{ imageId?: number; imageUrl: string }>>(
    '/api/v1/images/upload',
    form,
    { headers: { 'Content-Type': undefined } },
  );
  return { imageId: data.result.imageId ?? null, imageUrl: data.result.imageUrl };
};

/** 파일 업로드 → 상대경로 imageUrl 반환 */
export const uploadImage = async (file: File, imageType: ImageType = 'CLOSET_ITEM'): Promise<string> =>
  (await uploadImageAsset(file, imageType)).imageUrl;

/** 상대경로 imageUrl → 렌더용 절대 URL (baseURL 조합은 표시할 때만) */
export const imageSrc = (imageUrl: string): string =>
  imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;

// ── CLOSET-02 옷장 아이템 등록 (POST /api/v1/closets/items) ──

/** API 카테고리 enum — 저장 검증 목록(OCR400_09)과 같은 6종. 시안 드롭다운에도 가방이 없다 */
export type ApiClosetCategory = 'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'ACCESSORY' | 'ETC';

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

// ── CLOSET-05 아이템 정보·태그 수정 (PATCH /api/v1/closets/items/:itemId) ──
// 요청 필드명 tag_values, 응답 필드명 tags (다름). category도 수정 가능하나
// 현재 화면은 태그만 편집 → tag_values만 전송 (category 미확정 enum 역매핑 위험 회피).
// 메모는 CLOSET-05에 없음 → 저장 안 됨. (참고사항)

interface UpdateClosetItemRaw {
  item_id: number;
  category: string;
  tags: string[];
  updated_at: string;
}

export const updateClosetItemTags = async (itemId: string, tagValues: string[]) => {
  const { data } = await api.patch<ApiResponse<UpdateClosetItemRaw>>(
    `/api/v1/closets/items/${itemId}`,
    { tag_values: tagValues },
  );
  const r = data.result;
  return {
    id: String(r.item_id),
    category: categoryLabel(r.category),
    tags: r.tags,
    updatedAt: r.updated_at,
  };
};

// ── CLOSET-06 아이템 삭제 (DELETE /api/v1/closets/items/:itemId) ──

interface DeleteClosetItemRaw {
  item_id: number;
  deleted_at: string;
}

export const deleteClosetItem = async (itemId: string) => {
  const { data } = await api.delete<ApiResponse<DeleteClosetItemRaw>>(`/api/v1/closets/items/${itemId}`);
  return { id: String(data.result.item_id), deletedAt: data.result.deleted_at };
};
