import { create } from 'zustand';
import type { ClothingItem } from '../types';

/** 영수증 한 장에 찍힌 상품 하나 — 영수증에는 상품이 여러 개 있을 수 있다 */
export interface OcrProduct {
  brand: string;
  name: string;
  quantity: string;
  size: string;
  color: { label: string; hex: string };
  /**
   * 대표 색상 — 최대 2개까지 고를 수 있다. 첫 번째는 color와 같게 유지해서
   * 아직 단일 색만 읽는 화면(영수증 카드 등)이 그대로 동작하게 둔다.
   */
  colors?: { label: string; hex: string }[];
  price: string;
  /** 옷 사진 — 상품마다 하나. 서버 필수 필드라 없으면 등록할 수 없다 */
  photo?: string;
  /** 인식·분류로 붙은 태그 — 이미지 등록 화면의 칩으로 보여준다 */
  tags?: string[];
  /** 메모 — OCR이 읽어오거나 사용자가 적는다 */
  memo?: string;
  /**
   * 카테고리·세부 카테고리 — 등록 전 반드시 골라야 한다(수정·직접 입력 화면의 필수 항목).
   * 서버 응답에는 없는 필드라 화면에서 채워 넣는다. API에 생기면 그때 매핑한다.
   */
  category?: string;
  subCategory?: string;
}

/** 영수증 OCR로 읽어온 상품 정보 (확인·수정 화면에서 공유) */
export interface OcrResult {
  /**
   * 주문상품 — 두 개 이상이면 여기에 담는다.
   * 비어 있으면 아래 단일 상품 필드를 상품 하나로 본다(수정 화면이 아직 한 개만 다룬다).
   */
  products?: OcrProduct[];
  brand: string;
  name: string;
  quantity: string;
  size: string;
  color: { label: string; hex: string };
  /** 단일 상품일 때의 색상 목록 — products가 있으면 그쪽 값을 쓴다 */
  colors?: { label: string; hex: string }[];
  price: string;
  /** 구매처 — 지원 쇼핑몰 코드(ABLY/MUSINSA/ZIGZAG) 또는 빈 값(미지원·미인식) */
  store: string;
  purchasedAt: string;
  /**
   * 옷 사진 — 영수증 한 장당 반드시 하나 있어야 등록할 수 있다(서버 필수 필드).
   * 첨부 UI는 수정 화면이 맡고, 목록은 다 찼는지만 본다.
   */
  photo?: string;
  /** 단일 상품일 때의 태그 — products가 있으면 그쪽 값을 쓴다 */
  tags?: string[];
  /** 단일 상품일 때의 메모 — products가 있으면 그쪽 값을 쓴다 */
  memo?: string;
  /** 단일 상품일 때의 카테고리 — products가 있으면 그쪽 값을 쓴다 */
  category?: string;
  subCategory?: string;
  /** 인식 실패 — 목록에서 직접 입력 / 다시 업로드로 유도한다 */
  failed?: boolean;
  /**
   * 영수증에서 읽은 상호명 — 실패 목록에 그대로 보여준다(예: '무신사 스토어', 'ZARA 코엑스점').
   * store는 지원 쇼핑몰 코드라 화면에 그대로 쓸 수 없어 따로 둔다.
   */
  storeLabel?: string;
  /** 실패 사유 — 실패 목록에 그대로 보여준다(예: '영수증이 너무 흐려요') */
  failReason?: string;
  /** 이 장을 다시 올려 인식을 시도한 횟수 — 반복해서 실패하면 직접 입력으로 유도한다 */
  retryCount?: number;
}

/** 영수증의 주문상품 — products가 있으면 그대로, 없으면 단일 상품 필드를 한 건으로 본다 */
export const receiptProducts = (result: OcrResult): OcrProduct[] =>
  result.products?.length
    ? result.products
    : [
        {
          brand: result.brand,
          name: result.name,
          quantity: result.quantity,
          size: result.size,
          color: result.color,
          colors: result.colors,
          price: result.price,
          photo: result.photo,
          tags: result.tags,
          memo: result.memo,
          category: result.category,
          subCategory: result.subCategory,
        },
      ];

/** 인식 실패분·직접 입력의 시작값 */
export const emptyOcrResult: OcrResult = {
  brand: '',
  name: '',
  quantity: '',
  size: '',
  color: { label: '', hex: '' },
  price: '',
  store: '',
  purchasedAt: '',
};

interface ClosetState {
  items: ClothingItem[];
  /** 쇼핑몰 연동 시 선택한 플랫폼 이름 (등록 플로우에서 화면 간 전달) */
  selectedPlatforms: string[];
  /** 영수증 인식 결과 — 장별로 한 칸. 확인 화면이 읽고 수정 화면이 해당 칸만 덮어쓴다 */
  ocrResults: OcrResult[];
  /** 업로드한 영수증 이미지 미리보기 URL (등록 플로우에서 화면 간 전달) */
  receiptImages: string[];
  /**
   * 인식 요청에 실어 보낼 실제 파일 — 미리보기 URL로는 서버에 못 보낸다.
   * receiptImages와 순서가 같아야 체크 화면에서 뺀 장이 정확히 제외된다.
   */
  receiptFiles: File[];
  /**
   * 영수증을 가져온 방식 — 인식 실패분을 '다시 시도'할 때 같은 길로 돌려보내려고 기억한다.
   * 카메라로 찍어 온 사람에게 앨범을 열어주면 흐름이 끊긴다.
   */
  receiptMethod: 'camera' | 'album' | '';
  /**
   * 어느 갈래로 등록을 시작했는지 — 실물 영수증인지 구매내역(스마트 영수증)인지.
   * 인식 실패분을 다시 시도할 때 안내가 다른 화면으로 돌려보내야 해서 기억한다.
   */
  registerEntry: 'receipt' | 'purchase' | '';

  // 액션 (API 연동 시 내부 구현만 서버 요청으로 교체)
  setItems: (items: ClothingItem[]) => void;
  addItem: (item: ClothingItem) => void;
  updateItem: (id: string, patch: Partial<ClothingItem>) => void;
  removeItem: (id: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  setOcrResults: (results: OcrResult[]) => void;
  /** 확인·수정 화면이 자기 장(index)만 갱신 */
  updateOcrResult: (index: number, result: OcrResult) => void;
  /** 직접 입력으로 새 장을 추가 (붙는 위치 = 호출 전 ocrResults.length) */
  addOcrResult: (result: OcrResult) => void;
  /** 미리보기 URL과 파일을 함께 갱신 (순서를 맞춰 보관한다) */
  setReceipts: (images: string[], files: File[]) => void;
  setReceiptMethod: (method: 'camera' | 'album') => void;
  setRegisterEntry: (entry: 'receipt' | 'purchase') => void;
  /** 등록 플로우를 새로 시작 — 지난 회차에 쌓인 영수증·선택값을 비운다 */
  startOcrFlow: () => void;
  reset: () => void;
}

/**
 * 옷장 등록 플로우 스토어 — 새로고침 시 초기화.
 *
 * `items`는 서버(CLOSET-03)가 소스라 여기서는 비워 둔다.
 * 예전엔 목업을 시드로 깔아 화면이 늘 차 있었는데, 조회가 실패해도 옷이 있는 것처럼
 * 보여서 문제를 가렸다. 이제 비어 있으면 비어 있는 대로 보인다.
 */
const useClosetStore = create<ClosetState>((set) => ({
  items: [],
  selectedPlatforms: [],
  ocrResults: [],
  receiptImages: [],
  receiptFiles: [],
  receiptMethod: '',
  registerEntry: '',

  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, patch) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setOcrResults: (results) => set({ ocrResults: results }),
  updateOcrResult: (index, result) =>
    set((state) => ({
      ocrResults: state.ocrResults.map((item, i) => (i === index ? result : item)),
    })),
  addOcrResult: (result) => set((state) => ({ ocrResults: [...state.ocrResults, result] })),
  setReceipts: (images, files) => set({ receiptImages: images, receiptFiles: files }),
  setReceiptMethod: (method) => set({ receiptMethod: method }),
  setRegisterEntry: (entry) => set({ registerEntry: entry }),
  startOcrFlow: () =>
    set({
      ocrResults: [],
      receiptImages: [],
      receiptFiles: [],
      selectedPlatforms: [],
      receiptMethod: '',
      registerEntry: '',
    }),
  reset: () =>
    set({
      items: [],
      selectedPlatforms: [],
      ocrResults: [],
      receiptImages: [],
      receiptFiles: [],
      receiptMethod: '',
      registerEntry: '',
    }),
}));

export default useClosetStore;
