import api from '@/lib/axios';
import type { ApiResponse, User } from '@/types';
import type { OAuthProvider } from './socialAuth';

// ── USER-04 프로필 정보 조회 (GET /api/v1/users/me) ──
interface ProfileStyle {
  id?: number;
  tagId?: number;
  name?: string;
  tagName?: string;
}

interface MyProfileResult {
  id?: number;
  userId?: number;
  username?: string;
  email: string;
  name?: string;
  nickname?: string;
  styleTags?: string[] | null;
  styleTagIds?: number[];
  styles?: ProfileStyle[];
  stylePreferences?: ProfileStyle[];
}

export const getMyProfile = async (): Promise<User> => {
  const { data } = await api.get<ApiResponse<MyProfileResult>>('/api/v1/users/me');
  const profile = data.result;
  const preferences = profile.styles ?? profile.stylePreferences ?? [];
  const styleTagIds =
    profile.styleTagIds ??
    preferences.flatMap((style) => {
      const id = style.id ?? style.tagId;
      return id == null ? [] : [id];
    });
  const preferenceNames = preferences.flatMap((style) => {
    const name = style.name ?? style.tagName;
    return name ? [name] : [];
  });
  const styleTags = preferenceNames.length > 0 ? preferenceNames : (profile.styleTags ?? []);

  return {
    id: profile.id ?? profile.userId ?? 0,
    username: profile.username ?? '',
    email: profile.email,
    name: profile.name ?? profile.nickname ?? '',
    styleTags,
    styleTagIds,
  };
};

// ── AUTH-02 이메일 로그인 ──
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * AUTH-02 명세 응답은 {accessToken, userId} (임시 백엔드는 nickname도 내려줌).
 * 나머지 사용자 정보는 이어지는 USER-04 프로필 조회로 채운다.
 */
export interface LoginResult {
  accessToken: string;
  userId: number;
  nickname?: string;
}

export const login = async (body: LoginRequest): Promise<LoginResult> => {
  const { data } = await api.post<ApiResponse<LoginResult>>('/api/v1/auth/login', body);
  return data.result;
};

// ── AUTH-03 로그아웃 ──
export const logout = async (): Promise<void> => {
  await api.post('/api/v1/auth/logout');
};

// ── USER-05 회원 탈퇴 ──
export const withdraw = async (): Promise<void> => {
  await api.delete('/api/v1/users/me');
};

// ── 소셜 로그인 (POST /api/v1/auth/social/{provider}) ──
// 소셜 서버(카카오/구글)에서 발급받은 액세스 토큰을 보내면 우리 서버 JWT를 돌려준다.
// 응답에는 accessToken만 있고 userId가 없어, 사용자 정보는 이어지는 USER-04 조회로 채운다.
export const socialLogin = async (
  provider: OAuthProvider,
  socialAccessToken: string,
): Promise<{ accessToken: string }> => {
  const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
    `/api/v1/auth/social/${provider}`,
    { accessToken: socialAccessToken },
  );
  return data.result;
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
