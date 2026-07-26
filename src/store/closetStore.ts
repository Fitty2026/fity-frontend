import { create } from 'zustand';
import type { ClothingItem } from '../types';
import { mockClosetItems } from '../mocks/data/closet';

interface ClosetState {
  items: ClothingItem[];
  /** 쇼핑몰 연동 시 선택한 플랫폼 이름 (등록 플로우에서 화면 간 전달) */
  selectedPlatforms: string[];

  // 액션 (API 연동 시 내부 구현만 서버 요청으로 교체)
  setItems: (items: ClothingItem[]) => void;
  addItem: (item: ClothingItem) => void;
  updateItem: (id: string, patch: Partial<ClothingItem>) => void;
  removeItem: (id: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  reset: () => void;
}

/** 옷장 아이템 스토어 — mock 시드, 새로고침 시 초기화 */
const useClosetStore = create<ClosetState>((set) => ({
  items: mockClosetItems,
  selectedPlatforms: [],

  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, patch) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  reset: () => set({ items: mockClosetItems, selectedPlatforms: [] }),
}));

export default useClosetStore;
