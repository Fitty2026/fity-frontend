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

/**
 * 체형 유형 분석 결과.
 * bodyBalance/boneStructure/muscleMass는 PROFILE-02(분석)는 enum(BALANCED 등),
 * PROFILE-04(조회)는 한글(균형형 등)로 내려와 값이 섞임 → 표시 시 매퍼가 흡수.
 */
export interface BodyTypeResult {
  bodyType: string; // 예: SLIM_STRAIGHT
  bodyTypeName: string; // 예: 슬림 스트레이트
  description: string;
  celebrities: string[];
  upperBodyRatio: number;
  lowerBodyRatio: number;
  bodyBalance: string;
  boneStructure: string;
  muscleMass: string;
}

/** PROFILE-02 분석 응답 */
export interface BodyAnalyzeResult {
  analysisId: number;
  measurements: BodyMeasurements;
  bodyTypeResult: BodyTypeResult;
}

/** PROFILE-04 조회 응답 */
export interface BodyProfile {
  bodyProfileId: number;
  userSelectedBodyType: ServerBodyType;
  bodyImage: string;
  measurements: BodyMeasurements;
  bodyTypeResult: BodyTypeResult;
  updatedAt: string;
}

// ── PROFILE-01 온보딩 체형 타입 저장 (POST /api/v1/body-profiles/type) ──
export const saveBodyType = async (bodyType: ServerBodyType): Promise<void> => {
  await api.post('/api/v1/body-profiles/type', { bodyType });
};

// ── PROFILE-02 체형 사진 AI 분석 (POST /api/v1/body-profiles/analyze, multipart) ──
export const analyzeBody = async (
  frontImage: Blob,
  sideImage: Blob,
  backImage: Blob,
): Promise<BodyAnalyzeResult> => {
  const form = new FormData();
  form.append('frontImage', frontImage, 'front.jpg');
  form.append('sideImage', sideImage, 'side.jpg');
  form.append('backImage', backImage, 'back.jpg');
  // FormData면 axios가 boundary 포함 multipart 헤더를 자동 설정하도록 기본 json 헤더 제거
  const { data } = await api.post<ApiResponse<BodyAnalyzeResult>>(
    '/api/v1/body-profiles/analyze',
    form,
    { headers: { 'Content-Type': undefined } },
  );
  return data.result;
};

// ── PROFILE-03 체형 분석 결과 저장 (POST /api/v1/body-profiles) ──
export interface SaveBodyProfileRequest {
  analysisId: number;
  measurements: BodyMeasurements;
  /** bodyTypeResult.bodyType (예: SLIM_STRAIGHT) */
  bodyType: string;
}

export const saveBodyProfile = async (
  req: SaveBodyProfileRequest,
): Promise<{ bodyProfileId: number }> => {
  const { data } = await api.post<ApiResponse<{ bodyProfileId: number }>>(
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
