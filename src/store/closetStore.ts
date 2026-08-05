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
  store: string;
  purchasedAt: string;
}

/** OCR 응답 목업 — API 연동 시 서버 응답으로 교체 */
const mockOcrResult: OcrResult = {
  brand: '무신사 스탠다드 우먼',
  name: '패널드 데님 맥시 드레스',
  quantity: '1',
  size: 'M',
  color: { label: '딥 인디고', hex: '#052D78' },
  price: '79,900원',
  store: '무신사 스탠다드 강남점',
  purchasedAt: '2026.06.28. 13:45:55',
};

interface ClosetState {
  items: ClothingItem[];
  /** 쇼핑몰 연동 시 선택한 플랫폼 이름 (등록 플로우에서 화면 간 전달) */
  selectedPlatforms: string[];
  /** 영수증 인식 결과 — 확인 화면이 읽고 수정 화면이 덮어쓴다 */
  ocrResult: OcrResult;
  /** 업로드한 영수증 이미지 미리보기 URL (등록 플로우에서 화면 간 전달) */
  receiptImages: string[];

  // 액션 (API 연동 시 내부 구현만 서버 요청으로 교체)
  setItems: (items: ClothingItem[]) => void;
  addItem: (item: ClothingItem) => void;
  updateItem: (id: string, patch: Partial<ClothingItem>) => void;
  removeItem: (id: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  setOcrResult: (result: OcrResult) => void;
  setReceiptImages: (images: string[]) => void;
  reset: () => void;
}

/** 옷장 아이템 스토어 — mock 시드, 새로고침 시 초기화 */
const useClosetStore = create<ClosetState>((set) => ({
  items: mockClosetItems,
  selectedPlatforms: [],
  ocrResult: mockOcrResult,
  receiptImages: [],

  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, patch) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setOcrResult: (result) => set({ ocrResult: result }),
  setReceiptImages: (images) => set({ receiptImages: images }),
  reset: () => set({ items: mockClosetItems, selectedPlatforms: [], ocrResult: mockOcrResult, receiptImages: [] }),
}));

export default useClosetStore;
