/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /** OpenWeatherMap API 키. 없으면 날씨 화면을 건너뛰고 weather 필드를 생략한다 */
  readonly VITE_OPENWEATHER_API_KEY: string;
  /** 카카오 REST API 키 (소셜 로그인 인가 요청·토큰 교환) */
  readonly VITE_KAKAO_CLIENT_ID: string;
  /** 구글 OAuth 클라이언트 ID (소셜 로그인 인가 요청) */
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}