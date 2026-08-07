import { create } from 'zustand';
import type { ClothingItem } from '../types';
import { mockClosetItems } from '../mocks/data/closet';

/** 영수증 한 장에 찍힌 상품 하나 — 영수증에는 상품이 여러 개 있을 수 있다 */
export interface OcrProduct {
  brand: string;
  name: string;
  quantity: string;
  size: string;
  color: { label: string; hex: string };
  price: string;
  /** 옷 사진 — 상품마다 하나. 서버 필수 필드라 없으면 등록할 수 없다 */
  photo?: string;
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
  price: string;
  /** 구매처 — 지원 쇼핑몰 코드(ABLY/MUSINSA/ZIGZAG) 또는 빈 값(미지원·미인식) */
  store: string;
  purchasedAt: string;
  /**
   * 옷 사진 — 영수증 한 장당 반드시 하나 있어야 등록할 수 있다(서버 필수 필드).
   * 첨부 UI는 수정 화면이 맡고, 목록은 다 찼는지만 본다.
   */
  photo?: string;
  /** 인식 실패 — 목록에서 직접 입력 / 다시 업로드로 유도한다 */
  failed?: boolean;
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
          price: result.price,
          photo: result.photo,
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
    purchasedAt: '2026.06.28. 13:45:55',
  },
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
  // 한 장에 상품이 두 개 — 카드 주문상품 영역이 줄로 쌓인다.
  // 단일 상품 필드는 첫 상품과 같게 둔다 (수정 화면이 아직 한 개만 다뤄서 그쪽이 읽는다)
  {
    products: [
      {
        brand: '마뗑킴',
        name: '릴렉스드 크롭 니트 가디건',
        quantity: '1',
        size: 'FREE',
        color: { label: '그린', hex: '#1F7A4D' },
        price: '89,000원',
      },
      {
        brand: '리엔',
        name: '와이드 코튼 슬랙스',
        quantity: '2',
        size: 'S',
        color: { label: '블랙', hex: '#1F2124' },
        price: '59,000원',
      },
    ],
    brand: '마뗑킴',
    name: '릴렉스드 크롭 니트 가디건',
    quantity: '1',
    size: 'FREE',
    color: { label: '그린', hex: '#1F7A4D' },
    price: '89,000원',
    store: 'ZIGZAG',
    purchasedAt: '2026.07.24. 20:15:08',
  },
];

/**
 * 스토어 초기값 — 실패 카드까지 확인할 수 있게 섞어둔다 (직접 주소로 목록에 들어올 때만 보인다).
 * 마지막 한 건은 이미 여러 번 다시 올려 실패한 상태라, 목록에 들어가면 직접 입력 유도 안내가 뜬다.
 */
const mockOcrResults: OcrResult[] = [
  ...successOcrResults,
  { ...emptyOcrResult, failed: true },
  { ...emptyOcrResult, failed: true, retryCount: 2 },
];

/**
 * 인식한 장수만큼 결과를 만든다 — 찍은/올린 장수와 개수를 맞춘다.
 * 세 장마다 한 장은 인식 실패로 둬서 목록의 실패 카드도 플로우에서 확인할 수 있다.
 * API 연동 시 이 호출을 서버 응답으로 갈아끼우면 된다.
 */
export const makeMockOcrResults = (count: number): OcrResult[] =>
  Array.from({ length: count }, (_, index) =>
    index % 3 === 2
      ? { ...emptyOcrResult, failed: true }
      : { ...successOcrResults[index % successOcrResults.length] },
  );

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
  /** 등록 플로우를 새로 시작 — 지난 회차에 쌓인 영수증·선택값을 비운다 */
  startOcrFlow: () => void;
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
  startOcrFlow: () => set({ ocrResults: [], receiptImages: [], selectedPlatforms: [] }),
  reset: () =>
    set({
      items: mockClosetItems,
      selectedPlatforms: [],
      ocrResults: mockOcrResults,
      receiptImages: [],
    }),
}));

export default useClosetStore;
