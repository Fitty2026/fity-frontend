import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 코디 생성 1회 비용 (2026-08-14 PM 확정) */
export const GENERATION_COST = 10;

/** 회원가입 시 지급량 (2026-08-14 PM 확정) — 지급 자체는 서버 몫이 될 예정 */
const INITIAL_BALANCE = 100;

interface PuzzleState {
  balance: number;

  /** 서버 잔액 조회 응답으로 동기화 (API 연동 시 사용) */
  setBalance: (balance: number) => void;
  /** 코디 생성 접수 성공 시 차감. 잔액 미달이면 차감하지 않고 false */
  spend: (amount: number) => boolean;
}

/**
 * 퍼즐(재화) 잔액 — MVP 범위는 잔량 표시 + 생성 시 차감뿐 (충전·거래내역 제외).
 * ※ 잔액 관리 API가 아직 없어 임시로 브라우저(persist)에 둔다.
 *   서버 API가 생기면 persist를 걷어내고 setBalance로 응답만 반영한다.
 */
const usePuzzleStore = create<PuzzleState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,

      setBalance: (balance) => set({ balance }),

      spend: (amount) => {
        if (get().balance < amount) return false;
        set({ balance: get().balance - amount });
        return true;
      },
    }),
    { name: 'fitty-puzzle' },
  ),
);

export default usePuzzleStore;
