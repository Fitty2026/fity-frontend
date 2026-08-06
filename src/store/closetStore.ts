import { create } from 'zustand';
import type { ClothingItem } from '../types';
import { mockClosetItems } from '../mocks/data/closet';

/** 영수증 OCR로 읽어온 상품 정보 (확인·수정 화면에서 공유) */
export interface OcrResult {
  brand: string;
  name: string;
  quantity: string;
  size: string;
  color: { label: string; hex: string };
  price: string;
  /** 구매처 — 지원 쇼핑몰 코드(ABLY/MUSINSA/ZIGZAG) 또는 빈 값(미지원·미인식) */
  store: string;
  /** 영수증에 찍힌 매장명 원문 — 지점까지 포함('무신사 스탠다드 강남점'). 성공 화면에만 쓴다 */
  storeText?: string;
  purchasedAt: string;
  /** 인식 실패 — 목록에서 직접 입력 / 다시 업로드로 유도한다 */
  failed?: boolean;
}

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

/** 인식에 성공한 영수증 목업 — 장수만큼 돌려 쓴다. API 연동 시 서버 응답으로 교체 */
const successOcrResults: OcrResult[] = [
  {
    brand: '무신사 스탠다드 우먼',
    name: '패널드 데님 맥시 드레스',
    quantity: '1',
    size: 'M',
    color: { label: '네이비', hex: '#052D78' },
    price: '79,900원',
    store: 'MUSINSA',
    storeText: '무신사 스탠다드 강남점',
    purchasedAt: '2026.06.28. 13:45:55',
  },
  // 원문 없이 온 경우 — 성공 화면 매장명이 코드 이름('에이블리')으로 폴백된다
  {
    brand: '온앤온',
    name: '오버사이즈 울 블렌드 코트',
    quantity: '1',
    size: 'L',
    color: { label: '베이지', hex: '#E3DACD' },
    price: '139,000원',
    store: 'ABLY',
    purchasedAt: '2026.07.11. 17:02:31',
  },
];

/** 스토어 초기값 — 실패 카드까지 확인할 수 있게 한 건 섞어둔다 (직접 주소로 목록에 들어올 때만 보인다) */
const mockOcrResults: OcrResult[] = [...successOcrResults, { ...emptyOcrResult, failed: true }];

/**
 * 인식한 장수만큼 결과를 만든다 — 찍은/올린 장수와 개수를 맞춘다.
 * 전부 성공으로 채운다. 실패는 별도 화면(`receipt-failed`)이 맡는다.
 * API 연동 시 이 호출을 서버 응답으로 갈아끼우면 된다.
 */
export const makeMockOcrResults = (count: number): OcrResult[] =>
  Array.from({ length: count }, (_, index) => ({
    ...successOcrResults[index % successOcrResults.length],
  }));

interface ClosetState {
  items: ClothingItem[];
  /** 쇼핑몰 연동 시 선택한 플랫폼 이름 (등록 플로우에서 화면 간 전달) */
  selectedPlatforms: string[];
  /** 영수증 인식 결과 — 장별로 한 칸. 확인 화면이 읽고 수정 화면이 해당 칸만 덮어쓴다 */
  ocrResults: OcrResult[];
  /** 업로드한 영수증 이미지 미리보기 URL (등록 플로우에서 화면 간 전달) */
  receiptImages: string[];

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
  setReceiptImages: (images: string[]) => void;
  reset: () => void;
}

/** 옷장 아이템 스토어 — mock 시드, 새로고침 시 초기화 */
const useClosetStore = create<ClosetState>((set) => ({
  items: mockClosetItems,
  selectedPlatforms: [],
  ocrResults: mockOcrResults,
  receiptImages: [],

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
  setReceiptImages: (images) => set({ receiptImages: images }),
  reset: () =>
    set({
      items: mockClosetItems,
      selectedPlatforms: [],
      ocrResults: mockOcrResults,
      receiptImages: [],
    }),
}));

export default useClosetStore;
