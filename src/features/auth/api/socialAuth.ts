/**
 * 소셜(카카오/구글) 인가 흐름 헬퍼.
 * - 프론트가 소셜 서버에서 액세스 토큰을 직접 발급받아 우리 서버(AUTH 소셜 로그인)로 넘기는 구조.
 * - 카카오: 인가 코드(response_type=code) → kauth 토큰 엔드포인트에서 교환 (CORS 허용됨)
 * - 구글: implicit flow(response_type=token) → 콜백 URL 해시로 액세스 토큰이 바로 온다
 */
export type OAuthProvider = 'kakao' | 'google';

/** 콘솔에 등록한 승인된 리디렉션 URI와 반드시 일치해야 한다 */
const redirectUri = (provider: OAuthProvider) =>
  `${window.location.origin}/oauth/${provider}/callback`;

export const buildAuthorizeUrl = (provider: OAuthProvider): string => {
  if (provider === 'kakao') {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
      redirect_uri: redirectUri('kakao'),
      response_type: 'code',
    });
    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  }
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri('google'),
    response_type: 'token',
    scope: 'openid email profile',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/** 카카오 인가 코드 → 소셜 액세스 토큰 (사내 axios 인스턴스를 타지 않도록 fetch 사용) */
export const exchangeKakaoCode = async (code: string): Promise<string> => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
    redirect_uri: redirectUri('kakao'),
    code,
  });
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body,
  });
  const data = (await response.json().catch(() => null)) as { access_token?: string } | null;
  if (!response.ok || !data?.access_token) {
    throw new Error('카카오 인증에 실패했어요. 다시 시도해 주세요.');
  }
  return data.access_token;
};

/** 구글 implicit 콜백 해시(#access_token=...)에서 소셜 액세스 토큰 추출 */
export const parseGoogleCallbackToken = (hash: string): string | null =>
  new URLSearchParams(hash.replace(/^#/, '')).get('access_token');
