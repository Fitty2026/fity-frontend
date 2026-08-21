import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

/** 코디 생성 1회 비용 (2026-08-14 PM 확정) — 차감 자체는 서버가 한다 */
export const GENERATION_COST = 10;

/**
 * 잔액 응답 필드명이 명세로 확정되지 않아, 올 수 있는 형태를 모두 받아둔다.
 * (숫자 하나만 오는 경우 포함 — 확정되면 하나로 줄인다)
 */
type PuzzleBalanceRaw =
  | number
  | {
      balance?: number;
      puzzleBalance?: number;
      puzzle_balance?: number;
      count?: number;
      remaining?: number;
    };

const toBalance = (raw: PuzzleBalanceRaw | null | undefined): number => {
  if (typeof raw === 'number') return raw;
  return (
    raw?.balance ?? raw?.puzzleBalance ?? raw?.puzzle_balance ?? raw?.count ?? raw?.remaining ?? 0
  );
};

/** 퍼즐 잔량 조회 (GET /api/v1/puzzles/balance) */
export const getPuzzleBalance = async (): Promise<number> => {
  const { data } = await api.get<ApiResponse<PuzzleBalanceRaw>>('/api/v1/puzzles/balance');
  return toBalance(data.result);
};
