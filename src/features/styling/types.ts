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

/** 코디 생성 작업 상태 (OUTFIT-02, ETL 기준) */
export type OutfitJobStatus =
  | 'queued'
  | 'validating'
  | 'uploading'
  | 'processing'
  | 'qc_pending'
  | 'completed'
  | 'failed'
  | 'expired';

/** 더 이상 변하지 않는 상태 — 폴링 종료 조건 */
export const TERMINAL_JOB_STATUSES: OutfitJobStatus[] = ['completed', 'failed', 'expired'];

/** OUTFIT-01 접수 응답 */
export interface OutfitJobAccepted {
  jobId: number;
  status: OutfitJobStatus;
  createdAt: string;
}

/** OUTFIT-02 상태 조회 응답 — 결과 필드는 completed에서만 채워진다 */
export interface OutfitJob {
  jobId: number;
  status: OutfitJobStatus;
  outfitResultId?: number;
  generatedImageUrl?: string;
  createdAt: string;
  completedAt?: string;
}
