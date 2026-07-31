import api from '@/lib/axios';
import type { ApiResponse, SocialProvider, User, UserStats } from '@/types';

const MOCK_DELAY_MS = 500;

// ── USER-04 프로필/마이홈 정보 조회 (GET /api/v1/users/me) ──
interface MyProfileResult {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  starBalance: number;
  bodyTypeName: string | null;
  styleTags: string[];
  stats: UserStats;
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

// ── AUTH-01 이메일 회원가입 (POST /api/v1/auth/signup) ──
export interface SignupParams {
  name: string;
  loginId: string;
  email: string;
  password: string;
}

export interface SignupResult {
  userId: number;
  loginId: string;
  email: string;
  name: string;
  createdAt: string;
}

export const signup = async (params: SignupParams): Promise<SignupResult> => {
  const { data } = await api.post<ApiResponse<SignupResult>>('/api/v1/auth/signup', params);
  return data.result;
};
