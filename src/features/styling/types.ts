/** 코디 생성(스튜디오) 플로우 공통 타입 */

/** 홈 — 최근 코디 카드 */
export interface RecentOutfit {
  id: number;
  image: string;
  /** 예: '2026.06.27' */
  date: string;
  /** 예: ['러블리', '데이트'] — '#' 제외 */
  tags: string[];
  title: string;
}

/** 상황 선택 옵션 (데이트, 출근, 학교, 여행 …) */
export interface SituationOption {
  id: string;
  label: string;
  image: string;
}

/** 기준 아이템 선택 — 옷 썸네일 */
export interface StylingItemThumb {
  id: number;
  image: string;
  category: string;
}

/** 코디 생성 작업 상태 (MVP 6종) */
export type OutfitJobStatus =
  | 'queued'
  | 'processing'
  | 'qc_pending'
  | 'completed'
  | 'failed'
  | 'expired';

/** 더 이상 변하지 않는 상태 — 폴링 종료 조건 */
export const TERMINAL_JOB_STATUSES: OutfitJobStatus[] = ['completed', 'failed', 'expired'];

/** 상황 (OUTFIT-01 situation) */
export type OutfitSituation = 'DATE' | 'WORK' | 'SCHOOL' | 'TRAVEL';

/** 날씨 상태 (OUTFIT-01 weather.condition) — 2026-08-13 BE 확정 6종 */
export type WeatherCondition = 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'WINDY' | 'UNKNOWN';

/** 화면 날씨 종류 → API condition */
export const WEATHER_CONDITION: Record<string, WeatherCondition> = {
  sun: 'SUNNY',
  cloud: 'CLOUDY',
  rain: 'RAINY',
  snow: 'SNOWY',
  wind: 'WINDY',
};

/** 화면 상황 옵션 id → API situation */
export const SITUATION_VALUE: Record<string, OutfitSituation> = {
  date: 'DATE',
  work: 'WORK',
  school: 'SCHOOL',
  travel: 'TRAVEL',
};

/** condition만 필수, 기온은 선택 (2026-08-13 BE 확정) */
export interface OutfitWeather {
  temperature?: number;
  condition: WeatherCondition;
}

/** OUTFIT-01 요청 입력값 — 체형 프로필은 서버가 JWT로 조회한다 */
export interface OutfitJobInput {
  closetItemIds: number[];
  styleTagIds?: number[];
  situation?: OutfitSituation;
  /** YYYY-MM-DD */
  selectedDate?: string;
  weather?: OutfitWeather;
}

/** OUTFIT-01 접수 응답 — 진행 중 job이 있으면 새로 만들지 않고 그 job을 돌려준다 */
export interface OutfitJobAccepted {
  jobId: number;
  status: OutfitJobStatus;
  progress: number;
  isExistingJob: boolean;
  /** 기존 job일 때 그 job의 요청 입력값 */
  input?: OutfitJobInput;
  expiresAt?: string;
}

/**
 * 실패·만료 사유 — failed/expired에서 온다.
 * 만료(JOB_TIMEOUT)는 HTTP 오류가 아니라 정상 200 응답의 status: expired로 온다.
 */
export interface OutfitJobFailure {
  /** 예: JOB_TIMEOUT */
  code: string;
  message: string;
}

/** OUTFIT-02 상태 조회 응답 — 결과 필드는 completed에서만 채워진다 */
export interface OutfitJob {
  jobId: number;
  status: OutfitJobStatus;
  /** 0~100. FE에서 따로 계산하지 않는다 */
  progress: number;
  outfitResultId?: number;
  generatedImageUrl?: string;
  failure?: OutfitJobFailure;
  createdAt?: string;
  completedAt?: string;
  expiresAt?: string;
}
