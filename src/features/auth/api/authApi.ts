import type { SocialProvider, User } from '@/types';

interface LoginParams {
  provider: SocialProvider;
  email?: string;
  password?: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

const MOCK_DELAY_MS = 500;

/**
 * mock 로그인 - 백엔드 연동 시 이 함수 내부만 실제 API 호출로 교체한다.
 * 입력 형식 검증은 폼(zod)에서 끝나므로 실패 케이스가 없다.
 */
export const login = async ({ provider, email }: LoginParams): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const user: User = {
    id: 'mock-user-1',
    email: email ?? `${provider}@fitty.mock`,
    nickname: '피티',
    stylePreferences: [],
    starCount: 0,
    freeGenerationLeft: 3,
  };

  return { user, accessToken: `mock-token-${provider}` };
};
