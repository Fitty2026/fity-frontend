import api from '@/lib/axios';
import type { ApiResponse, SocialProvider, StylePreference, User } from '@/types';

const MOCK_DELAY_MS = 500;

// ── PROFILE-01 프로필 조회 ──
interface MyProfileResult {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  stylePreferences: StylePreference[];
}

export const getMyProfile = async (): Promise<User> => {
  const { data } = await api.get<ApiResponse<MyProfileResult>>('/api/v1/users/me');
  const { userId, ...rest } = data.result;
  return { id: userId, ...rest };
};

// ── AUTH-02 이메일 로그인 ──
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  userId: number;
  nickname: string;
}

export const login = async (body: LoginRequest): Promise<LoginResult> => {
  const { data } = await api.post<ApiResponse<LoginResult>>('/api/v1/auth/login', body);
  return data.result;
};

// ── AUTH-03 로그아웃 ──
export const logout = async (): Promise<void> => {
  await api.post('/api/v1/auth/logout');
};

// ── 소셜 로그인: 아직 API 미제공이라 mock 유지 (추후 실제 연동) ──
export interface SocialLoginResult extends LoginResult {
  email: string;
}

export const socialLogin = async (provider: SocialProvider): Promise<SocialLoginResult> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return {
    accessToken: `mock-token-${provider}`,
    userId: 1,
    nickname: '피티',
    email: `${provider}@fitty.mock`,
  };
};

// ── AUTH-01 회원가입: 요청의 agreements 처리 방식을 백엔드와 조율 중이라 mock 유지 ──
export interface SignupParams {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const signup = async (params: SignupParams): Promise<void> => {
  void params; // mock에서는 입력값을 사용하지 않는다
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
};
