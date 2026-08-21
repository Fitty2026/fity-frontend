import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 코디 카드 하트(찜) — 로컬 전용.
 * 백엔드에 좋아요/찜 엔드포인트가 아직 없어서(SAVED-01~08에 없음) 기기에만 저장한다.
 * API가 열리면 이 스토어를 뮤테이션으로 갈아끼우면 된다.
 */
interface OutfitLikeState {
  likedIds: string[];
  toggle: (outfitId: string) => void;
}

const useOutfitLikeStore = create<OutfitLikeState>()(
  persist(
    (set) => ({
      likedIds: [],
      toggle: (outfitId) =>
        set((state) => ({
          likedIds: state.likedIds.includes(outfitId)
            ? state.likedIds.filter((id) => id !== outfitId)
            : [...state.likedIds, outfitId],
        })),
    }),
    { name: 'fitty-outfit-likes' },
  ),
);

export const useIsOutfitLiked = (outfitId: string) =>
  useOutfitLikeStore((state) => state.likedIds.includes(outfitId));

export const useToggleOutfitLike = () => useOutfitLikeStore((state) => state.toggle);

export default useOutfitLikeStore;
