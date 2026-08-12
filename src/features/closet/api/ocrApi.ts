import api from '@/lib/axios';
import { ApiError } from '@/lib/apiError';
import type { ApiResponse } from '@/types';
import type { OcrProduct, OcrResult } from '@/store/closetStore';
import { emptyOcrResult } from '@/store/closetStore';
import { toShoppingMallCode } from '../shoppingMalls';
import { categoryLabel } from './closetApi';
import { matchColorOption } from '../colors';

/**
 * 영수증 OCR 인식 (POST /api/v1/body-profiles/receipt-ocr)
 *
 * ※ 옷장이 아니라 body-profiles 아래다. 리소스 계층과 안 맞지만 서버가 거기 열어뒀다
 *   (2026-08-07 BE 회신). 추측했던 /api/v1/closets/ocr은 404였다.
 */
export const OCR_RECOGNIZE_PATH = '/api/v1/body-profiles/receipt-ocr';

/** 인식은 이미지 여러 장을 훑어서 공통 10초로는 모자란다 */
const OCR_TIMEOUT_MS = 30_000;

/** 서버가 읽어낸 상품 한 건 (PROFILE-05 응답) */
export interface ExtractedItem {
  productName?: string;
  brand?: string;
  /** API enum (TOP/BOTTOM/…) */
  category?: string;
  subCategory?: string | null;
  /** 문서에는 없으나 실제 응답에 온다 */
  size?: string;
  /** 원문 색상명 — '딥 인디고'처럼 제각각이라 팔레트로 맞춘다 */
  colorText?: string;
  colorHex?: string | null;
  /** "2024-08-01" — 날짜만 온다(시각 없음) */
  purchaseDate?: string;
  /** "MUSINSA" 같은 코드 또는 지점명이 섞인 원문 */
  purchasePlace?: string;
  importType?: string;
  /** 서버에 이미 있는 이미지면 그 id. 없으면 사용자가 직접 올린다 */
  imageId?: number | null;
  tags?: string[];
  memo?: string | null;
}

interface RecognizeReceiptsRaw {
  platform?: string;
  extractedItems?: ExtractedItem[];
}

/** 실물 영수증인지, 쇼핑몰 구매내역 캡처인지 */
export type OcrImportType = 'RECEIPT' | 'PURCHASE_LOG';

export interface RecognizeReceiptsRequest {
  importType: OcrImportType;
  /** 파싱 힌트 — 쇼핑몰 코드(MUSINSA|ZIGZAG|ABLY). 실물 영수증이면 생략 가능 */
  platform?: string;
  files: File[];
}

/**
 * 한 건을 화면이 쓰는 상품 모양으로.
 * ※ 수량·가격은 응답에 없다(PROFILE-05). 화면에서도 비워 둔다.
 */
const toProduct = (item: ExtractedItem): OcrProduct => ({
  brand: item.brand ?? '',
  name: item.productName ?? '',
  quantity: '',
  size: item.size ?? '',
  // 원문('딥 인디고')을 팔레트 12색으로 맞춘다. 못 맞추면 빈 값 → 사용자가 고른다
  color: matchColorOption(item.colorText, item.colorHex),
  price: '',
  // 서버가 이미 가진 이미지면 그 경로를 그대로 쓴다
  photo: typeof item.imageId === 'number' ? `/api/v1/images/${item.imageId}/content` : undefined,
  tags: item.tags,
  memo: item.memo ?? undefined,
  category: item.category ? categoryLabel(item.category) : undefined,
  subCategory: item.subCategory ?? undefined,
});

/**
 * 서버 응답(상품 배열)을 화면이 쓰는 영수증 배열로 바꾼다.
 *
 * **이미지 한 장 = 상품 한 건**이다. 서버가 올린 파일을 순서대로 돌면서
 * 장마다 정확히 한 건을 push하므로 `extractedItems[i]`는 `files[i]`다
 * (fity-backend `receipt.service.js` processOcr 루프).
 * 그래서 (구매처, 구매일)로 묶던 옛 휴리스틱을 버리고 인덱스로 1:1 매핑한다 —
 * 그쪽은 서버가 purchaseDate를 '오늘', purchasePlace를 platform으로 전부 같게 채워서
 * 영수증 N장을 상품 N개짜리 한 장으로 합쳐버렸다.
 *
 * 한계 — 한 영수증에 상품이 여러 개여도 서버가 한 건만 읽는다(파싱 미구현).
 */
export const mapExtractedItems = (items: ExtractedItem[]): OcrResult[] =>
  items.map((item) => {
    const product = toProduct(item);
    return {
      ...emptyOcrResult,
      // 단일 상품 필드는 첫 상품과 같게 둔다 (아직 한 개만 읽는 화면이 있다)
      ...product,
      products: [product],
      // 응답 purchasePlace가 우선. 지점명이 섞여 와도 코드로 모은다
      store: toShoppingMallCode(item.purchasePlace ?? ''),
      storeLabel: item.purchasePlace ?? '',
      purchasedAt: item.purchaseDate ?? '',
    };
  });

/** 영수증 이미지를 보내 상품을 읽어온다 */
export const recognizeReceipts = async ({
  importType,
  platform,
  files,
}: RecognizeReceiptsRequest): Promise<OcrResult[]> => {
  const form = new FormData();
  form.append('importType', importType);
  // 실물 영수증은 쇼핑몰을 안 고르고 오므로 값이 있을 때만 싣는다
  if (platform) form.append('platform', platform);
  // 문서에는 images로 적혀 있으나 서버가 실제로 받는 키는 receiptImages다.
  // (images/images[]/image/files/file 전부 OCR400_03 = 파일 못 찾음, receiptImages만 OCR을 시도)
  files.forEach((file) => form.append('receiptImages', file, file.name || 'receipt.jpg'));

  const { data } = await api.post<ApiResponse<RecognizeReceiptsRaw>>(OCR_RECOGNIZE_PATH, form, {
    // FormData면 axios가 boundary 포함 multipart 헤더를 자동 설정하도록 기본 json 헤더 제거
    headers: { 'Content-Type': undefined },
    timeout: OCR_TIMEOUT_MS,
  });

  const raw = data.result ?? {};
  return mapExtractedItems(raw.extractedItems ?? []);
};

// ── PROFILE-07 의류 일괄 저장 (POST /api/v1/body-profiles/receipt-items) ──

export const RECEIPT_ITEMS_PATH = '/api/v1/body-profiles/receipt-items';

/** 한 번에 보낼 수 있는 상품 수 — 넘기면 OCR400_06 */
export const MAX_RECEIPT_ITEMS = 5;

/**
 * 저장이 받는 카테고리 enum — 옷장 조회(CLOSET-03)와 달리 **BAG이 없다**.
 * 목록 밖 값을 보내면 OCR400_09라, 가방은 ETC로 접어 보낸다.
 * (BE에 BAG 추가 요청함. 추가되면 이 매핑을 지운다)
 */
const RECEIPT_CATEGORY: Record<string, string> = {
  상의: 'TOP',
  하의: 'BOTTOM',
  아우터: 'OUTER',
  신발: 'SHOES',
  액세서리: 'ACCESSORY',
  기타: 'ETC',
  가방: 'ETC',
};

export const toReceiptCategory = (label: string): string => RECEIPT_CATEGORY[label] ?? 'ETC';

/**
 * 이미지 경로에서 imageId를 뽑는다.
 *
 * 저장은 imageUrl이 아니라 **imageId(정수)**를 받는데(OCR400_08),
 * 업로드(IMAGE-01)도 연관 이미지 조회(PROFILE-06)도 `/api/v1/images/{id}/content`
 * 형태의 경로만 돌려준다. 그래서 경로에서 되읽는다.
 */
export const imageIdFromUrl = (url: string): number | null => {
  const match = /\/images\/(\d+)\/content/.exec(url);
  return match ? Number(match[1]) : null;
};

/** 저장 요청 한 건 — 서버 saveBatchItems가 그대로 컬럼에 넣는다 */
export interface ReceiptItemPayload {
  /** 필수 — 없으면 OCR400_07 */
  productName: string;
  brand: string;
  colorText: string;
  /** 필수 — 없으면 OCR400_08 */
  imageId: number;
  /** RECEIPT_CATEGORY의 값. 목록 밖이면 OCR400_09 */
  category: string;
  subCategory?: string;
  size?: string;
  importType?: string;
  tags?: string[];
  memo?: string;
}

/** 저장 → 등록된 건수 */
export const registerReceiptItems = async (items: ReceiptItemPayload[]): Promise<number> => {
  const { data } = await api.post<ApiResponse<{ registeredCount?: number }>>(RECEIPT_ITEMS_PATH, {
    items,
  });
  return data.result?.registeredCount ?? items.length;
};

/** 에러 코드별 안내. 모르는 코드면 서버 문구를 그대로 쓴다 */
const OCR_ERROR_MESSAGE: Record<string, string> = {
  // 인식 (PROFILE-05)
  OCR400_01: '영수증 이미지를 찾지 못했어요. 다시 올려주세요.',
  OCR400_02: '지원하지 않는 이미지 형식이에요. 다른 사진으로 시도해주세요.',
  OCR400_03: `영수증은 한 번에 ${MAX_RECEIPT_ITEMS}장까지 올릴 수 있어요.`,
  OCR400_04: '지원하지 않는 쇼핑몰이에요.',
  OCR500_01: '영수증 글자를 읽지 못했어요. 더 밝은 곳에서 다시 찍어주세요.',
  // 저장 (PROFILE-07)
  OCR400_05: '등록할 상품이 없어요.',
  OCR400_06: `상품은 한 번에 ${MAX_RECEIPT_ITEMS}개까지 등록할 수 있어요.`,
  OCR400_07: '브랜드·상품명·색상을 모두 채워주세요.',
  OCR400_08: '모든 상품에 옷 이미지를 등록해주세요.',
  OCR400_09: '카테고리를 다시 골라주세요.',
  OCR500_02: '상품을 등록하지 못했어요. 잠시 후 다시 시도해주세요.',
};

export const ocrErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) return OCR_ERROR_MESSAGE[error.code] ?? error.message;
  return '인식에 실패했어요. 잠시 후 다시 시도해주세요.';
};
