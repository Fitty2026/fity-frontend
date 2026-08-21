import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

/** 온보딩 체형 3택 서버 enum */
export type ServerBodyType = 'STRAIGHT' | 'WAVE' | 'NATURAL';

/** 체형 측정치 (cm) */
export interface BodyMeasurements {
  shoulderWidth: number;
  chestCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
  upperBodyLength: number;
  lowerBodyLength: number;
  legLength: number;
}

/** 체형 밸런스 enum */
export type BodyBalance = 'UPPER_BODY_DEVELOPED' | 'BALANCED' | 'LOWER_BODY_DEVELOPED';
/** 어깨너비 enum */
export type ShoulderWidth = 'NARROW' | 'AVERAGE' | 'WIDE';
/** 체격 enum */
export type FrameSize = 'SMALL' | 'MEDIUM' | 'LARGE';

/** 체형 유형 분석 결과 (PROFILE-02·04 공통, 체형 특징은 영어 enum) */
export interface BodyTypeResult {
  bodyType: string; // 예: SLIM_STRAIGHT
  bodyTypeName: string; // 예: 슬림 스트레이트
  description: string;
  celebrities: string[];
  upperBodyRatio: number;
  lowerBodyRatio: number;
  bodyBalance: BodyBalance;
  shoulderWidth: ShoulderWidth;
  frameSize: FrameSize;
}

/** PROFILE-02 분석 응답 */
export interface BodyAnalyzeResult {
  analysisId: number;
  measurements: BodyMeasurements;
  bodyTypeResult: BodyTypeResult;
}

/** PROFILE-04 조회 응답 (bodyImage는 명세에서 제거됨 — 체형별 이미지는 프론트 에셋 사용) */
export interface BodyProfile {
  bodyProfileId: number;
  measurements: BodyMeasurements;
  bodyTypeResult: BodyTypeResult;
  updatedAt: string;
}

// PROFILE-01(체형 타입 저장)은 3택 선택 플로우 제거로 미사용 — AI 분석 결과 유형을 그대로 쓴다

// ── PROFILE-02 체형 사진 AI 분석 (POST /api/v1/body-profiles/analyze, multipart) ──
// 명세(2026-08-19): images 배열 3장, 정면/측면/후면 순서 무관
export const analyzeBody = async (
  frontImage: Blob,
  sideImage: Blob,
  backImage: Blob,
): Promise<BodyAnalyzeResult> => {
  const form = new FormData();
  form.append('images', frontImage, 'front.jpg');
  form.append('images', sideImage, 'side.jpg');
  form.append('images', backImage, 'back.jpg');
  // FormData면 axios가 boundary 포함 multipart 헤더를 자동 설정하도록 기본 json 헤더 제거
  // AI 분석은 10초를 넘길 수 있어 이 요청만 타임아웃을 넉넉히 잡는다
  const { data } = await api.post<ApiResponse<BodyAnalyzeResult>>(
    '/api/v1/body-profiles/analyze',
    form,
    { headers: { 'Content-Type': undefined }, timeout: 60000 },
  );
  return data.result;
};

// ── PROFILE-03 체형 분석 결과 저장 (POST /api/v1/body-profiles) ──
// 명세(2026-08-19): bodyType 문자열 대신 bodyTypeResult 전체 객체를 보낸다.
// 중복 저장은 409가 아니라 200 허용(재분석 후 재등록 가능) — 별도 분기 불필요.
export interface SaveBodyProfileRequest {
  analysisId: number;
  measurements: BodyMeasurements;
  bodyTypeResult: BodyTypeResult;
}

export const saveBodyProfile = async (
  req: SaveBodyProfileRequest,
): Promise<{ bodyProfileId: number; updatedAt: string }> => {
  const { data } = await api.post<ApiResponse<{ bodyProfileId: number; updatedAt: string }>>(
    '/api/v1/body-profiles',
    req,
  );
  return data.result;
};

// ── PROFILE-04 체형 프로필 조회 (GET /api/v1/body-profiles/me) ──
export const getBodyProfile = async (): Promise<BodyProfile> => {
  const { data } = await api.get<ApiResponse<BodyProfile>>('/api/v1/body-profiles/me');
  return data.result;
};
