import api from '@/lib/axios';
import type { ApiResponse, ClothingCategory, ClothingItem } from '@/types';
import { matchColorOption } from '../colors';

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
export const imageSrc = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

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

// ── CLOSET-03 옷장 목록 조회 (GET /api/v1/closets/items) ──
// 경로·응답은 2026-08-12 BE 회신 기준 — 문서의 /api/v1/closets는 404고,
// result가 { category_count, closet_items[] }가 아니라 아이템 배열 그대로다.
// 전체를 한 번에 받아 클라이언트에서 필터·검색·정렬한다 (페이지네이션 없음).

/** API 카테고리(영문 enum) → FE 한글 라벨. 목록 밖 값은 '기타'로 접는다 */
const CATEGORY_LABEL: Record<string, ClothingCategory> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  SHOES: '신발',
  ACCESSORY: '액세서리',
  ETC: '기타',
};
export const categoryLabel = (c: string): ClothingCategory => CATEGORY_LABEL[c] ?? '기타';

interface ClosetItemRaw {
  // ※ 필드 표기가 snake(item_id 등)와 camel(colorText 등)로 섞여 온다 — 서버 응답 그대로다
  item_id: number;
  /** 문서 예시엔 없지만 실응답에 온다(2026-08-13 실측). 아직 쓰는 화면은 없다 */
  imageId?: number;
  name?: string;
  size?: string;
  category: string;
  import_type?: string;
  brand?: string | null;
  colorText?: string | null;
  subCategory?: string | null;
  memo?: string | null;
  tags?: string[];
  image_url: string;
  created_at: string;
  updated_at?: string;
}

/** 응답 한 건 → 화면이 쓰는 아이템. 목록과 상세가 같은 모양이라 같이 쓴다 */
const toClothingItem = (it: ClosetItemRaw): ClothingItem => {
  // 색상 원문("Black", "딥 인디고")을 팔레트 hex로 맞춘다 — 화면 칩은 hex만 안다
  const color = matchColorOption(it.colorText ?? undefined);
  return {
    id: String(it.item_id),
    name: it.name || undefined,
    imageUrl: imageSrc(it.image_url), // 절대(S3)는 그대로, 상대(/api/..)는 baseURL 조합 → 렌더용 URL
    category: categoryLabel(it.category),
    tags: it.tags ?? [],
    brand: it.brand || undefined,
    subCategory: it.subCategory || undefined,
    memo: it.memo || undefined,
    colors: color.hex ? [color.hex] : undefined,
    createdAt: it.created_at,
  };
};

export interface ClosetList {
  /**
   * 카테고리별 개수(영문 enum 키). 0개 카테고리는 키 자체가 없고
   * 문서에 있던 total 키도 실응답엔 없다(2026-08-13 실측) — 쓰는 쪽이 폴백을 챙긴다.
   */
  categoryCount?: Record<string, number>;
  items: ClothingItem[];
}

interface ClosetListRaw {
  category_count?: Record<string, number>;
  closet_items?: ClosetItemRaw[];
}

export const getClosets = async (): Promise<ClosetList> => {
  const { data } = await api.get<ApiResponse<ClosetListRaw>>('/api/v1/closets/items');
  return {
    categoryCount: data.result?.category_count,
    items: (data.result?.closet_items ?? []).map(toClothingItem),
  };
};

// ── CLOSET-04 옷장 아이템 상세 조회 (GET /api/v1/closets/items/:itemId) ──
// 응답이 목록의 한 건과 같은 모양이다 (2026-08-12 BE 회신 기준).

export const getClosetItem = async (itemId: string): Promise<ClothingItem> => {
  const { data } = await api.get<ApiResponse<ClosetItemRaw>>(`/api/v1/closets/items/${itemId}`);
  return toClothingItem(data.result);
};

// ── CLOSET-05 아이템 정보 수정 (PATCH /api/v1/closets/items/:itemId) ──
// 태그는 tag_values(요청)/tags(응답)로 이름이 다르다. brand·colorText·subCategory·memo는
// 2026-08-13 BE 확장 완료(카일) — 노션 명세가 아직 옛 버전이라 필드명은 조회 응답과
// 같다고 보고 보낸다(camel, 조회에서 확정된 표기). 빈 문자열·null을 보내면 서버가
// null로 비운다 — 값을 유지하려면 필드를 아예 빼야 한다.

/** FE 한글 라벨 → API 카테고리 enum. 모르는 라벨이면 undefined(전송 생략) */
const toApiCategory = (label: string): ApiClosetCategory | undefined =>
  Object.entries(CATEGORY_LABEL).find(([, value]) => value === label)?.[0] as
    | ApiClosetCategory
    | undefined;

/** 수정할 값 — 화면이 편집하는 항목만. 안 바꾸는 필드는 undefined로 두면 전송에서 빠진다 */
export interface UpdateClosetItemPatch {
  /** FE 한글 라벨 (예: '아우터') */
  category?: string;
  tagValues?: string[];
  brand?: string;
  subCategory?: string;
  memo?: string;
}

interface UpdateClosetItemRaw {
  item_id: number;
  category: string;
  tags: string[];
  updated_at: string;
}

export const updateClosetItem = async (itemId: string, patch: UpdateClosetItemPatch) => {
  const { data } = await api.patch<ApiResponse<UpdateClosetItemRaw>>(
    `/api/v1/closets/items/${itemId}`,
    {
      // 라벨을 못 알아보면 category를 아예 안 보낸다 — 엉뚱한 값으로 분류를 덮지 않게
      category: patch.category ? toApiCategory(patch.category) : undefined,
      tag_values: patch.tagValues,
      brand: patch.brand,
      subCategory: patch.subCategory,
      memo: patch.memo,
    },
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
