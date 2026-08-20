import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getPuzzleBalance } from '../api/puzzleApi';

export const puzzleKeys = {
  all: ['puzzle'] as const,
  balance: () => [...puzzleKeys.all, 'balance'] as const,
};

/**
 * 퍼즐(재화) 잔량 — 화면 표시는 항상 서버 응답값을 쓴다.
 * 로딩 중에는 undefined라 배지를 숨기고, 생성 후에는 refresh로 다시 받아온다.
 */
const usePuzzleBalance = () => {
  const { data } = useQuery({
    queryKey: puzzleKeys.balance(),
    queryFn: getPuzzleBalance,
    staleTime: 30_000,
  });

  return data;
};

export default usePuzzleBalance;

/** 코디 생성처럼 서버에서 잔량이 바뀐 뒤 재조회용 */
export const useRefreshPuzzleBalance = () => {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: puzzleKeys.balance() });
};
