/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_KAKAO_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  /** OpenWeatherMap API 키. 없으면 날씨 화면을 건너뛰고 weather 필드를 생략한다 */
  readonly VITE_OPENWEATHER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}