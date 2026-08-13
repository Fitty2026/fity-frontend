import axios from 'axios';
import { ApiError } from '@/lib/apiError';
import useAuthStore from '@/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - accessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
// - 공통 래퍼가 실패(isSuccess:false)면 ApiError로 변환
// - 로그인된 사용자의 401(토큰 만료/무효)만 세션 정리 후 로그인으로 이동
api.interceptors.response.use(
  (response) => {
    const body = response.data as { isSuccess?: boolean; code?: string; message?: string } | undefined;
    if (body && body.isSuccess === false) {
      throw new ApiError(body.code ?? 'UNKNOWN', body.message ?? '요청에 실패했습니다.');
    }
    return response;
  },
  (error) => {
    const token = localStorage.getItem('accessToken');
    const status = error.response?.status;
    const data = error.response?.data as { code?: string; message?: string } | undefined;

    // 이미 로그인된 사용자의 토큰이 만료/무효인 경우에만 세션 정리 + 리다이렉트
    // (로그인 요청 자체의 실패는 토큰이 없으므로 여기 걸리지 않고 화면에서 처리된다)
    if (status === 401 && token) {
      // 토큰뿐 아니라 persist된 user/isLoggedIn도 함께 정리해 상태 불일치를 막는다
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 서버 공통 래퍼 에러 → ApiError로 변환해 화면에서 message를 그대로 쓸 수 있게 한다
    if (data && typeof data.message === 'string') {
      return Promise.reject(new ApiError(data.code ?? 'UNKNOWN', data.message));
    }

    return Promise.reject(error);
  },
);

export default api;