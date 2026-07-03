import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // 실패 시 1회 재시도
      staleTime: 1000 * 60 * 5,   // 5분간 fresh 유지
      gcTime: 1000 * 60 * 10,     // 10분간 캐시 유지
      refetchOnWindowFocus: false, // 창 포커스 시 자동 재요청 끔
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;